import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Layout = ({ children, title = 'Affordly', description = 'Housing Affordability Dashboard - Track income requirements to buy homes across America', canonical }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  
  const isActive = (path) => router.pathname === path;
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Forecasting', href: '/forecasting' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.pexels.com" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Inter font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-950">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-gray-950/90 backdrop-blur-lg border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold gradient-text">Affordly</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link ${isActive(item.href) ? 'text-white bg-gray-800/50' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/dashboard" className="btn-primary ml-4">
                  Open Dashboard
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white p-2"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-800/50">
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block nav-link ${isActive(item.href) ? 'text-white bg-gray-800/50' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/dashboard" className="btn-primary w-full text-center block mt-4">
                    Open Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900/50 border-t border-gray-800/50 mt-16">
          <div className="max-w-7xl mx-auto container-padding py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="md:col-span-1">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">Affordly</span>
                </Link>
                <p className="text-gray-400 text-sm mb-4">
                  Making housing data accessible and actionable for everyone.
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
                  <li><Link href="/methodology" className="text-gray-400 hover:text-white transition-colors text-sm">Methodology</Link></li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="mailto:support@affordly.com" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800/50 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Affordly. All rights reserved. Founded 2019.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;