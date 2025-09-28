import Layout from '../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: "Farooq Khan",
    role: "Real Estate Agent",
    content: "Affordly has become my go-to resource for helping clients understand market conditions. The data is clear, accurate, and always up-to-date.",
    avatar: "FK"
  },
  {
    name: "Neal Shah",
    role: "Financial Advisor",
    content: "The affordability insights help me guide my clients' investment decisions. The dashboard makes complex housing data accessible and actionable.",
    avatar: "NS"
  },
  {
    name: "Lebron James",
    role: "First-Time Homebuyer & Local Basketball Player",
    content: "I found my affordable market using Affordly's data. The platform showed me exactly where my income could support homeownership.",
    avatar: "LJ"
  }
];

const features = [
  {
    title: "Real-Time Affordability Data",
    description: "Track income requirements across 200+ metro areas with live updates and historical trends.",
    icon: "📊"
  },
  {
    title: "Interactive Heatmaps",
    description: "Visualize housing affordability across the entire US with our color-coded state and city maps.",
    icon: "🗺️"
  },
  {
    title: "Comparative Analytics",
    description: "Compare up to 6 markets simultaneously and identify the best opportunities for your budget.",
    icon: "📈"
  },
  {
    title: "Market Predictions",
    description: "Get insights into future affordability trends based on economic indicators and market data.",
    icon: "🔮"
  },
  {
    title: "Custom Watchlists",
    description: "Monitor your target markets and receive alerts when affordability conditions change.",
    icon: "⭐"
  },
  {
    title: "API & Integrations",
    description: "Connect our data to your applications with our robust API and pre-built integrations.",
    icon: "🔌"
  }
];

const faqs = [
  {
    question: "How do you calculate required income?",
    answer: "We use the 28% rule: housing costs shouldn't exceed 28% of gross monthly income. We factor in median home prices, current mortgage rates, property taxes, and insurance to determine the minimum income needed."
  },
  {
    question: "How often is the data updated?",
    answer: "Our data is updated weekly for most markets and daily for major metropolitan areas. We source information from MLS data, government statistics, and verified real estate transactions."
  },
  {
    question: "Can I access historical data?",
    answer: "Yes! Our platform includes 10+ years of historical affordability data, allowing you to track long-term trends and market cycles."
  },
  {
    question: "How can I see future housing price trends?",
    answer: "Our forecasting tool provides predicted median home prices for the next 3 years across different metro areas. You can compare multiple regions and see which markets are expected to become more or less affordable over time."
  },
  {
    question: "Do you offer enterprise solutions?",
    answer: "Yes, we provide custom enterprise solutions including white-label dashboards, API access, and dedicated support for real estate companies, financial institutions, and government agencies."
  }
];

export default function Home() {

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const fullPhrase = "Find What a Neighborhood Means to You ";
  const splitIndex = "Find What a Neighborhood ".length;
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let i = 0;
    setTypedText("");
    setTypingDone(false);
    const typeInterval = setInterval(() => {
      setTypedText((prev) => {
        if (i < fullPhrase.length) {
          i++;
          return fullPhrase.slice(0, i);
        } else {
          clearInterval(typeInterval);
          setTypingDone(true);
          return prev;
        }
      });
    }, 100); // faster typing
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <Layout 
      title="Affordly - Housing Affordability Dashboard" 
      description="Track income requirements to buy homes across America. Interactive dashboard with real-time data, trends, and market insights."
      canonical="https://affordly.com"
    >
      {/* Hero Section */}

      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Floating Trendline Graphics */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-20 left-10 w-32 h-16 text-green-400/20" viewBox="0 0 128 64" fill="none">
            <path d="M0 48 L32 32 L64 16 L96 8 L128 4" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="128" cy="4" r="3" fill="currentColor" />
          </svg>
          <svg className="absolute top-40 right-20 w-40 h-20 text-blue-400/20" viewBox="0 0 160 80" fill="none">
            <path d="M0 60 L40 45 L80 30 L120 15 L160 8" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="160" cy="8" r="3" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-32 left-1/4 w-36 h-18 text-purple-400/20" viewBox="0 0 144 72" fill="none">
            <path d="M0 56 L36 42 L72 28 L108 14 L144 6" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="144" cy="6" r="3" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto container-padding relative">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {typedText.length <= splitIndex ? (
                  <span>{typedText}<span className="border-r-2 border-white animate-pulse">&nbsp;</span></span>
                ) : (
                  <>
                    <span>{typedText.slice(0, splitIndex)}</span>
                    <br />
                    <span
                      className="bg-clip-text text-transparent font-bold"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #22c55e, #3b82f6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {typedText.slice(splitIndex)}
                    </span>
{!typingDone && <span className="border-r-2 border-white animate-pulse">&nbsp;</span>}
                  </                    }
>
                )}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Track affordability across America's housing markets. Each city is an opportunity, each price tells a story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 hover:scale-105">
                  Open Dashboard
                </Link>
              </div>
              
              {/* Interactive Trendline Visualization */}
              <div className="mt-16 relative">
                <div className="max-w-4xl mx-auto">
                  <div className="relative bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0 150 Q100 120 200 100 T400 80" 
                          stroke="url(#trendGradient)" 
                          strokeWidth="3" 
                          fill="none"
                          className="animate-pulse"
                        />
                        <path 
                          d="M0 180 Q100 160 200 140 T400 120" 
                          stroke="url(#trendGradient)" 
                          strokeWidth="2" 
                          fill="none" 
                          opacity="0.6"
                          className="animate-pulse"
                          style={{ animationDelay: '0.5s' }}
                        />
                      </svg>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div className="group">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Real-Time Trends</h3>
                        <p className="text-gray-400 text-sm">Live market data updated weekly</p>
                      </div>
                      
                      <div className="group">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Market Analysis</h3>
                        <p className="text-gray-400 text-sm">Deep insights across 200+ metros</p>
                      </div>
                      
                      <div className="group">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Affordability Focus</h3>
                        <p className="text-gray-400 text-sm">Income-based calculations you can trust</p>
                      </div>
                    </div>
                    
                    {/* Animated Dots */}
                    <div className="absolute top-4 right-4 flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="stats-grid text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-400">Metro Areas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">10M+</div>
              <div className="text-gray-400">Data Points</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-400">Counties Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Understand Housing Markets
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From real-time data to predictive analytics, Affordly provides the tools professionals rely on.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card text-center group"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.6s ease-out forwards'
                }}
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce-soft">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Industry Professionals
            </h2>
            <p className="text-xl text-gray-400">
              See what our users have to say about Affordly
            </p>
          </div>

          <div className="relative">
            <div className="card text-center max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </span>
                </div>
                <blockquote className="text-lg text-gray-300 mb-4 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-400 leading-relaxed">
                    {faq.question === "How can I see future housing price trends?" ? (
                      <div>
                        {faq.answer}
                        <div className="mt-4">
                          <Link href="/forecasting" className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors">
                            Explore Price Forecasts
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      faq.answer
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Make Informed Housing Decisions?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who rely on Affordly for housing market insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Exploring Data
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
