import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individual users and casual research',
    features: [
      'Access to 50+ major metros',
      'Basic affordability metrics',
      'Historical data (2 years)',
      'Monthly data updates',
      'Community support'
    ],
    limitations: [
      'Limited to 10 searches per day',
      'No export functionality',
      'Basic charts only'
    ],
    cta: 'Get Started Free',
    href: '/dashboard',
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For professionals who need comprehensive market data',
    features: [
      'Access to all 200+ markets',
      'Advanced analytics & predictions',
      'Full historical data (10+ years)',
      'Weekly data updates',
      'Export to CSV/Excel',
      'Custom watchlists',
      'API access (1,000 calls/month)',
      'Email support'
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    href: '/contact',
    popular: true
  },
  {
    name: 'Organization',
    price: '$199',
    period: 'per month',
    description: 'For teams and enterprises requiring advanced features',
    features: [
      'Everything in Pro',
      'Unlimited API access',
      'White-label dashboard',
      'Custom integrations',
      'Advanced user management',
      'Dedicated account manager',
      'Priority phone support',
      'Custom data requests'
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false
  }
];

const faqs = [
  {
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.'
  },
  {
    question: 'Do you offer annual billing discounts?',
    answer: 'Yes, we offer a 20% discount for annual billing on Pro and Organization plans. Contact our sales team for enterprise volume discounts.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, ACH bank transfers, and can accommodate wire transfers for enterprise customers.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes, we offer a 14-day free trial for both Pro and Organization plans. No credit card required to start your trial.'
  },
  {
    question: 'How does API usage work?',
    answer: 'API calls are counted monthly and reset on your billing date. Pro plans include 1,000 calls per month, with additional calls available at $0.01 each.'
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll retain access until the end of your current billing period.'
  }
];

const addOns = [
  {
    name: 'Additional API Calls',
    price: '$0.01',
    unit: 'per call',
    description: 'Extra API calls beyond your plan limit'
  },
  {
    name: 'Custom Data Integration',
    price: '$500',
    unit: 'one-time',
    description: 'Integration with your proprietary data sources'
  },
  {
    name: 'Premium Support',
    price: '$99',
    unit: 'per month',
    description: 'Priority phone and chat support'
  }
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const getPrice = (basePrice, period) => {
    if (basePrice === '$0') return '$0';
    
    const numPrice = parseInt(basePrice.replace('$', ''));
    if (period === 'annual') {
      return `$${Math.floor(numPrice * 0.8)}`;
    }
    return basePrice;
  };

  return (
    <Layout 
      title="Pricing - Affordly" 
      description="Affordable pricing plans for housing market data. Free tier available, Pro plans starting at $29/month."
      canonical="https://affordly.com/pricing"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Choose the plan that fits your needs. Start free, upgrade when you're ready.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-gray-800/50 p-1 rounded-lg">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={plan.name}
                className={`pricing-card ${plan.popular ? 'featured' : ''}`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {getPrice(plan.price, billingPeriod)}
                    </span>
                    {plan.price !== '$0' && (
                      <span className="text-gray-400 ml-1">
                        /{billingPeriod === 'annual' ? 'month (billed annually)' : plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-400">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`w-full text-center block py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Add-ons & Services</h2>
            <p className="text-xl text-gray-400">
              Extend your plan with additional features and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <div 
                key={addon.name}
                className="card text-center"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.6s ease-out forwards'
                }}
              >
                <h3 className="font-semibold text-white mb-2">{addon.name}</h3>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {addon.price}
                  <span className="text-sm text-gray-400 ml-1">
                    {addon.unit}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Feature Comparison</h2>
            <p className="text-xl text-gray-400">
              Detailed breakdown of what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900/50 rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-6 text-white font-semibold">Feature</th>
                  <th className="text-center p-6 text-white font-semibold">Free</th>
                  <th className="text-center p-6 text-white font-semibold bg-green-500/10">Pro</th>
                  <th className="text-center p-6 text-white font-semibold">Organization</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-800">
                  <td className="p-6 text-gray-300">Number of Markets</td>
                  <td className="p-6 text-center text-gray-300">50+</td>
                  <td className="p-6 text-center text-green-400 bg-green-500/5">200+</td>
                  <td className="p-6 text-center text-green-400">200+</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 text-gray-300">Historical Data</td>
                  <td className="p-6 text-center text-gray-300">2 years</td>
                  <td className="p-6 text-center text-green-400 bg-green-500/5">10+ years</td>
                  <td className="p-6 text-center text-green-400">10+ years</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 text-gray-300">API Access</td>
                  <td className="p-6 text-center text-red-400">✗</td>
                  <td className="p-6 text-center text-green-400 bg-green-500/5">1K calls/month</td>
                  <td className="p-6 text-center text-green-400">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-6 text-gray-300">Data Export</td>
                  <td className="p-6 text-center text-red-400">✗</td>
                  <td className="p-6 text-center text-green-400 bg-green-500/5">✓</td>
                  <td className="p-6 text-center text-green-400">✓</td>
                </tr>
                <tr>
                  <td className="p-6 text-gray-300">Support</td>
                  <td className="p-6 text-center text-gray-300">Community</td>
                  <td className="p-6 text-center text-green-400 bg-green-500/5">Email</td>
                  <td className="p-6 text-center text-green-400">Phone & Email</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about our pricing
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who rely on Affordly for housing market insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Free Today
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-medium px-8 py-4 rounded-lg transition-all duration-200">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}