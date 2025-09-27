import Layout from '../components/Layout';

const pressReleases = [
  {
    date: '2024-01-15',
    title: 'Affordly Raises $25M Series B to Expand Housing Market Analytics Platform',
    summary: 'Series B funding led by Andreessen Horowitz will accelerate product development and market expansion.',
    link: '#'
  },
  {
    date: '2023-09-22',
    title: 'Affordly Partners with National Association of Realtors for Market Data Initiative',
    summary: 'Strategic partnership will provide NAR members with enhanced affordability insights and tools.',
    link: '#'
  },
  {
    date: '2023-06-10',
    title: 'Affordly Launches AI-Powered Housing Market Predictions',
    summary: 'New machine learning models provide 12-month affordability forecasts for 200+ metro areas.',
    link: '#'
  }
];

const mediaKit = [
  {
    type: 'Company Logo',
    description: 'High-resolution Affordly logos in various formats',
    formats: ['PNG', 'SVG', 'PDF'],
    size: '2.1 MB'
  },
  {
    type: 'Brand Guidelines',
    description: 'Complete brand guidelines including colors, typography, and usage rules',
    formats: ['PDF'],
    size: '5.8 MB'
  },
  {
    type: 'Executive Headshots',
    description: 'Professional headshots of leadership team',
    formats: ['JPG', 'PNG'],
    size: '8.4 MB'
  },
  {
    type: 'Product Screenshots',
    description: 'High-quality screenshots of dashboard and key features',
    formats: ['PNG', 'JPG'],
    size: '12.3 MB'
  }
];

const awards = [
  {
    year: '2024',
    award: 'Best Real Estate Data Platform',
    organization: 'PropTech Awards',
    description: 'Recognized for innovation in housing market analytics'
  },
  {
    year: '2023',
    award: 'Top 50 Fintech Companies to Watch',
    organization: 'Forbes',
    description: 'Featured in Forbes annual fintech innovation list'
  },
  {
    year: '2023',
    award: 'Excellence in Data Visualization',
    organization: 'Data Viz Society',
    description: 'Honored for intuitive and impactful data presentation'
  }
];

const keyMetrics = [
  { label: 'Active Users', value: '50,000+', change: '+127% YoY' },
  { label: 'Markets Covered', value: '200+', change: '+25 in 2023' },
  { label: 'API Calls Monthly', value: '10M+', change: '+89% YoY' },
  { label: 'Enterprise Customers', value: '150+', change: '+45% YoY' }
];

export default function Press() {
  return (
    <Layout 
      title="Press - Affordly" 
      description="Press releases, media kit, brand guidelines, and company information for journalists and media professionals."
      canonical="https://affordly.com/press"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Press & <span className="gradient-text">Media</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Resources for journalists, analysts, and media professionals covering Affordly 
            and the housing market analytics space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:press@affordly.com" className="btn-primary">
              Contact Press Team
            </a>
            <a href="#media-kit" className="btn-secondary">
              Download Media Kit
            </a>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Company Metrics</h2>
            <p className="text-xl text-gray-400">Key performance indicators and growth metrics</p>
          </div>
          
          <div className="stats-grid">
            {keyMetrics.map((metric, index) => (
              <div 
                key={metric.label}
                className="card text-center"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="text-3xl font-bold text-green-400 mb-2">{metric.value}</div>
                <div className="text-gray-300 font-medium mb-1">{metric.label}</div>
                <div className="text-sm text-gray-500">{metric.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Latest News & Press Releases</h2>
            <p className="text-xl text-gray-400">Recent announcements and company news</p>
          </div>

          <div className="space-y-8">
            {pressReleases.map((release, index) => (
              <div 
                key={release.title}
                className="card hover:border-gray-600/50 transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(release.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 hover:text-green-400 transition-colors">
                      <a href={release.link}>{release.title}</a>
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{release.summary}</p>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <a 
                      href={release.link}
                      className="btn-secondary text-sm"
                    >
                      Read Full Release
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-400">Industry recognition and accolades</p>
          </div>

          <div className="space-y-6">
            {awards.map((award, index) => (
              <div 
                key={award.award}
                className="card"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{award.award}</h3>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{award.year}</span>
                    </div>
                    <div className="text-green-400 font-medium mb-2">{award.organization}</div>
                    <p className="text-gray-400">{award.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section id="media-kit" className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Media Kit</h2>
            <p className="text-xl text-gray-400">
              Brand assets, logos, and media resources for journalists and partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaKit.map((item, index) => (
              <div 
                key={item.type}
                className="card hover:border-gray-600/50 transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.type}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Formats: {item.formats.join(', ')}</span>
                      <span>•</span>
                      <span>Size: {item.size}</span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary w-full text-sm">
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Need additional assets or have specific requirements?
            </p>
            <a 
              href="mailto:press@affordly.com" 
              className="btn-primary"
            >
              Contact Press Team
            </a>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Company Information</h2>
            <p className="text-xl text-gray-400">Key facts and figures about Affordly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Company Overview</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Founded:</span>
                  <span>2019</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Headquarters:</span>
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Employees:</span>
                  <span>35+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Funding:</span>
                  <span>$35M Total Raised</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Funding:</span>
                  <span>Series B (2024)</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Leadership</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-400">CEO & Co-Founder</div>
                </div>
                <div>
                  <div className="font-medium text-white">Michael Rodriguez</div>
                  <div className="text-sm text-gray-400">CTO & Co-Founder</div>
                </div>
                <div>
                  <div className="font-medium text-white">Emily Johnson</div>
                  <div className="text-sm text-gray-400">VP of Data Science</div>
                </div>
                <div>
                  <div className="font-medium text-white">David Park</div>
                  <div className="text-sm text-gray-400">VP of Product</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Mission Statement</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Affordly democratizes access to housing market data, providing transparent, actionable insights 
                that empower individuals, professionals, and policymakers to make informed decisions about 
                homeownership and housing affordability across America.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Media Inquiries
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, 
            our communications team is here to help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-2">Press Inquiries</h3>
              <p className="text-green-100">press@affordly.com</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-2">Response Time</h3>
              <p className="text-green-100">Within 4 hours</p>
            </div>
          </div>

          <a 
            href="mailto:press@affordly.com" 
            className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Press Team
          </a>
        </div>
      </section>
    </Layout>
  );
}