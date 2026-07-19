# Exora

A modern e-commerce storefront for handmade flowers, built with Next.js and TypeScript.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Backend / Auth**: Supabase
- **Image Storage**: Cloudflare R2
- **Data Fetching**: SWR
- **Icons**: Lucide React
- **Animation**: Framer Motion

## Features

- Product catalog with collections and detail pages
- Shopping cart with persistent state
- User authentication (sign up, login, password reset)
- Responsive, modern UI
- Optimized image delivery via Cloudflare R2
- Blog, about, and contact pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with your Supabase and Cloudflare R2 credentials.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
exora/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── blog/
│   ├── cart/
│   ├── collection/
│   ├── contact/
│   ├── reset-password/
│   └── page.tsx           # Homepage
├── src/
│   ├── components/        # React components (Header, Footer, ProductCard, etc.)
│   ├── lib/                # API clients and utilities (Supabase, storage, auth, cart store)
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── next.config.ts          # Next.js configuration
```

## Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

## Deployment

The project is set up for deployment on Vercel or Netlify. Build the app with:

```bash
npm run build
```

Then deploy the output according to your hosting platform's instructions.

## License

MIT
