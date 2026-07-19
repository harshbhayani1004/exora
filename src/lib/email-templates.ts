const passwordResetEmailTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - EXORA</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #E8DCC4 0%, #d4c4a1 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 2px solid #1a1a1a;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0;
            letter-spacing: 2px;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #4a4a4a;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .button {
            display: inline-block;
            background-color: #1a1a1a;
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.3s ease;
            letter-spacing: 1px;
        }
        .button:hover {
            background-color: #333333;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .warning-text {
            color: #856404;
            font-size: 14px;
            margin: 0;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        .footer-text {
            color: #666666;
            font-size: 14px;
            margin: 0;
        }
        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 30px 0;
        }
        .highlight {
            background-color: #E8DCC4;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">EXORA</h1>
        </div>

        <div class="content">
            <h2 class="title">Reset Your Password</h2>

            <p class="message">
                We received a request to reset your password for your EXORA account.
                Don't worry, it happens to the best of us! Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">Reset My Password</a>
            </div>

            <div class="warning">
                <p class="warning-text">
                    <strong>Security Notice:</strong> This password reset link will expire in 1 hour for your security.
                    If you didn't request this reset, please ignore this email.
                </p>
            </div>

            <div class="divider"></div>

            <p class="message">
                If the button above doesn't work, you can copy and paste this link into your browser:
            </p>

            <p style="word-break: break-all; background-color: #f8f8f8; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #666;">
                ${resetLink}
            </p>

            <p class="message">
                Once you reset your password, you'll be able to continue shopping and managing your orders at EXORA.
            </p>
        </div>

        <div class="footer">
            <p class="footer-text">
                <strong>EXORA Store</strong><br>
                C-41, Sumeru City Mall, Surat<br>
                +91 78618 86462
            </p>
            <div class="divider"></div>
            <p class="footer-text">
                This email was sent to you because you requested a password reset.<br>
                If you have any questions, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>
`;

export default passwordResetEmailTemplate;
