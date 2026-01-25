# Accountability Bet - Landing Page

Lightweight Astro landing page for the Accountability Bet app.

## Tech Stack

- **Astro** - Ultra-fast static site builder
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type-safe development

## Getting Started

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `localhost:4321` by default.

## Project Structure

```
/
├── public/          # Static assets (favicon, images)
├── src/
│   ├── pages/       # Page components (.astro files)
│   │   └── index.astro   # Landing page
│   └── styles/      # Global styles
│       └── global.css    # Tailwind imports
└── package.json
```

## Features

- Clean, conversion-focused landing page
- Mobile-responsive design
- Optimized for performance
- SEO-friendly meta tags
- Smooth anchor navigation

## Deployment

The site can be deployed to any static hosting platform:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Just run `npm run build` and deploy the `dist/` folder.

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
