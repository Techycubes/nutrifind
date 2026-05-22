# NutriFind

NutriFind is a mobile-first web app to find foods and recipes based on personal nutrition goals, and to analyze products with a Yuka-style score.

## What it does
- Goal-based food and recipe search
- Product search (OpenFoodFacts) with Yuka-style scoring
- Product analysis card with positives, warnings, additives and nutrition table
- My Plate: local daily tracker stored in localStorage

## Run locally
1. Copy environment variables into `.env.local` (see `.env.local.example`).
2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

Open http://localhost:3000

## API keys
- Spoonacular: https://spoonacular.com/food-api
- USDA FoodData Central: https://fdc.nal.usda.gov/api-key-signup.html
- Kroger: https://developer.kroger.com

Set the following env vars in `.env.local`:

```
SPOONACULAR_API_KEY=
USDA_API_KEY=
KROGER_CLIENT_ID=
KROGER_CLIENT_SECRET=
```

## Notes
- Spoonacular free tier is limited (~150 requests/day) — avoid heavy usage during development.
- OpenFoodFacts does not require an API key.
- This repo contains scaffolding for the app; components and routes are intentionally minimal and can be extended.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
