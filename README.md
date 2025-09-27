# Affordly - Housing Affordability Dashboard

A production-ready Next.js application providing comprehensive housing affordability data and analytics across America.

## Overview

Affordly transforms complex housing market data into clear, actionable insights. Our platform tracks income requirements to buy homes across 200+ metro areas, helping users make informed decisions about homeownership.

## Features

### Core Functionality
- **Interactive Dashboard**: Real-time housing affordability metrics with ticker-style display
- **Comparative Analytics**: Multi-city comparison charts and trend analysis
- **Geographic Visualization**: Interactive US heatmap showing state-level affordability
- **Market Intelligence**: Macro economic indicators and market predictions
- **Personal Tools**: Watchlists, saved searches, and custom alerts

### Technical Features
- **Performance Optimized**: Code splitting, lazy loading, and optimized assets
- **SEO Ready**: Complete meta tags, OpenGraph, sitemap, and robots.txt
- **Responsive Design**: Mobile-first design with breakpoints for all devices
- **Dark Theme**: Professional financial dashboard aesthetic
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic HTML

## Tech Stack

- **Framework**: Next.js 13.5.1 (Pages Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: react-simple-maps with d3-scale
- **Build**: Next.js static export for optimal performance

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/affordly.git
cd affordly

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Build static files
npm run build

# Preview production build
npm run start
```

## Project Structure

```
affordly/
├── pages/                 # Next.js pages (Router)
│   ├── index.js          # Landing page
│   ├── dashboard.js      # Main dashboard
│   ├── about.js          # Company information
│   ├── methodology.js    # Data methodology
│   ├── pricing.js        # Pricing plans
│   ├── blog/            # Blog pages
│   ├── careers.js       # Job listings
│   ├── press.js         # Press resources
│   ├── contact.js       # Contact form
│   └── api/health.js    # Health check endpoint
├── components/          # React components
│   ├── Layout.js        # Main layout wrapper
│   ├── TickerCard.js    # City affordability cards
│   ├── LineChart.js     # Time series charts
│   ├── Leaderboard.js   # City rankings
│   ├── Heatmap.js       # US geographic heatmap
│   └── ...              # Additional UI components
├── public/data/         # Mock data files
│   ├── housing.json     # City affordability data
│   ├── stateAffordability.json
│   ├── macro.json       # Economic indicators
│   └── blog.json        # Blog content
├── styles/              # CSS files
│   └── globals.css      # Global styles and Tailwind
└── README.md           # Project documentation
```

## Data Sources

Our calculations follow industry-standard practices:

- **Required Income**: Based on 28% debt-to-income ratio
- **Median Prices**: From MLS data and FHFA indices  
- **Mortgage Rates**: Freddie Mac Primary Mortgage Market Survey
- **Income Data**: Bureau of Labor Statistics

## Key Components

### Dashboard (`pages/dashboard.js`)
- Interactive ticker cards for major metros
- Multi-city comparison charts with time range controls
- Real-time heatmap visualization
- Macro economic indicators
- Personalized watchlists with localStorage persistence

### Charts (`components/LineChart.js`)
- Chart.js integration with custom styling
- Responsive design with proper legends
- Time range filtering (1Y, 5Y, 10Y)
- Custom tooltips and hover interactions

### Heatmap (`components/Heatmap.js`)
- Client-side only rendering (SSR disabled)
- Interactive state-level affordability visualization
- Custom color scales and tooltips
- Click handlers for detailed state analysis

## Deployment

The application is configured for static export:

```bash
npm run build
```

Generated files in `/out` can be deployed to any static hosting service (Netlify, Vercel, S3, etc.).

## Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Dynamic Imports**: Heatmap component lazy-loaded
- **Image Optimization**: Next.js Image component with optimization
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Proper cache headers for static assets

## Browser Support

- Chrome/Edge 88+
- Firefox 85+  
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Website**: [https://affordly.com](https://affordly.com)
- **Email**: hello@affordly.com
- **Support**: support@affordly.com

---

Built with ❤️ by the Affordly team. Making housing data accessible to everyone.