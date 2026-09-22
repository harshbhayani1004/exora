import passwordResetEmailTemplate from "../email-templates";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Dispatch email.
 * If RESEND_API_KEY is configured, sends via Resend REST API;
 * otherwise logs clearly to server console (development mode).
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "EXORA Studio <hello@exora.in>";

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          html,
        }),
      });
      return response.ok;
    } catch (err) {
      console.error("Failed to send email via Resend:", err);
      return false;
    }
  }

  // Development Fallback: Log to console
  console.log("------------------------------------------");
  console.log(`📨 [DEV EMAIL DISPATCH]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Preview: ${html.substring(0, 160)}...`);
  console.log("------------------------------------------");
  return true;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
  const html = passwordResetEmailTemplate(resetUrl);
  return sendEmail({
    to: email,
    subject: "Reset Your Password - EXORA",
    html,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  total: number,
  itemsCount: number,
): Promise<boolean> {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const html = `
    <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h1 style="letter-spacing: 2px;">EXORA</h1>
      <h2>Thank You for Your Order!</h2>
      <p>We are delighted to craft your handmade flowers. Your order <strong>#${orderNumber}</strong> has been received.</p>
      <p><strong>Total Items:</strong> ${itemsCount}</p>
      <p><strong>Order Total:</strong> ${currency}${total.toFixed(2)}</p>
      <p>Our studio team will carefully pack each bloom for its journey.</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #666;">EXORA Studio · C-41, Sumeru City Mall, Surat · +91 78618 86462</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmed: #${orderNumber} - EXORA`,
    html,
  });
}
