import Layout from '../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Real Estate Agent",
    content: "Affordly has become my go-to resource for helping clients understand market conditions. The data is clear, accurate, and always up-to-date.",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Financial Advisor",
    content: "The affordability insights help me guide my clients' investment decisions. The dashboard makes complex housing data accessible and actionable.",
    avatar: "MR"
  },
  {
    name: "Emily Johnson",
    role: "First-Time Homebuyer",
    content: "I found my affordable market using Affordly's data. The platform showed me exactly where my income could support homeownership.",
    avatar: "EJ"
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
    question: "Is there a mobile app?",
    answer: "Currently, we offer a fully responsive web platform optimized for mobile devices. A dedicated mobile app is in development for 2024."
  },
  {
    question: "Do you offer enterprise solutions?",
    answer: "Yes, we provide custom enterprise solutions including white-label dashboards, API access, and dedicated support for real estate companies, financial institutions, and government agencies."
  }
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout 
      title="Affordly - Housing Affordability Dashboard" 
      description="Track income requirements to buy homes across America. Interactive dashboard with real-time data, trends, and market insights."
      canonical="https://affordly.com"
    >
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ backgroundSize: '20px 20px' }} />
        
        <div className="max-w-7xl mx-auto container-padding relative">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Housing Affordability
                <br />
                <span className="gradient-text">Made Simple</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Track income requirements to buy homes across America. Each city is a "ticker," each price tells a story.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 hover:scale-105">
                  Open Dashboard
                </Link>
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
              <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
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
                    {faq.answer}
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