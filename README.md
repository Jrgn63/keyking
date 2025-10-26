# Keyboard Shop - Next.js E-commerce Website

A fully functional e-commerce website for selling mechanical keyboards, built with Next.js, Firebase Firestore, and Stripe payments.

## Features

- **Product Management**: Store products in Firebase Firestore with admin interface capabilities
- **Frontend**: Responsive product listing, detail pages, shopping cart, and checkout
- **Cart & Checkout**: Add/remove items, update quantities, Stripe payment integration
- **Search & Filter**: Search products and filter by category
- **Stock Management**: Display stock availability for each product
- **User Authentication**: Firebase Auth for admin panel (optional)
- **Responsive Design**: Tailwind CSS for modern, mobile-friendly UI

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **Icons**: Lucide React

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (optional, for admin panel)
5. Get your Firebase config from Project Settings

### 2. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Get your API keys from the Developers section
4. Set up webhooks for payment confirmations (endpoint: `/api/webhook`)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Next.js Configuration
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Seed Sample Products

```bash
node scripts/seed-products.js
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── products/          # Product pages
│   ├── success/           # Order success page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── context/               # React context providers
├── lib/                   # Utility libraries
├── scripts/               # Setup scripts
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## API Routes

- `GET /api/products` - Fetch all products
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhook` - Handle Stripe webhooks

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Admin Panel (Optional)

To add admin functionality for managing products:

1. Implement Firebase Auth
2. Create admin routes for CRUD operations
3. Add authentication middleware
4. Create admin dashboard components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own e-commerce needs.
