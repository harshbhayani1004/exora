# Handmade Flowers E-commerce Store

A modern e-commerce store built with Next.js, TypeScript, and Tailwind CSS, with Supabase as the backend.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: Cloudflare R2
- **Icons**: Lucide React

## Features

- 🛍️ Product catalog with Supabase backend
- 🛒 Shopping cart with persistent state
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🖼️ Image storage with Cloudflare R2
- 💾 PostgreSQL database
- 🔄 Real-time data capabilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- WordPress site with REST API enabled

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env.local` file:

```env
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## Project Structure

```
my-store/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   └── products/          # Products pages
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CartButton.tsx
│   │   └── ProductCard.tsx
│   ├── lib/              # Utilities and API clients
│   │   ├── wordpress.ts  # WordPress REST API client
│   │   └── store.ts      # Zustand cart store
│   └── types/            # TypeScript type definitions
│       └── index.ts
├── next.config.ts        # Next.js configuration
└── .env.local           # Environment variables
```

## WordPress Integration

The store fetches data from WordPress REST API. Configure your WordPress site:

1. Install WooCommerce plugin (optional, for products)
2. Enable REST API (enabled by default)
3. Configure CORS if needed
4. Update `WORDPRESS_API_URL` in `.env.local`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Image Optimization

The app is configured to handle images from:

- WordPress CDN (animeu087-lvnph.wordpress.com)
- Cloudinary (res.cloudinary.com)
- AWS S3 (\*.amazonaws.com)

Add more domains in `next.config.ts` as needed.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the project:

```bash
npm run build
```

Then deploy the `.next` folder to your hosting platform.

## Future Enhancements

- [ ] Product filtering and search with Algolia
- [ ] User authentication
- [ ] Checkout and payment integration
- [ ] Order management
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Email notifications

## License

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
