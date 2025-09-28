import Layout from '../components/Layout';

const timeline = [
  {
    year: '2019',
    title: 'Founded',
    description: 'Affordly was founded with a mission to make housing data accessible to everyone.'
  },
  {
    year: '2020',
    title: 'First Dashboard',
    description: 'Launched our flagship Housing Affordability Dashboard with data from 50 major metros.'
  },
  {
    year: '2021',
    title: 'Series A',
    description: 'Raised $10M Series A to expand coverage and build predictive analytics capabilities.'
  },
  {
    year: '2022',
    title: 'API Launch',
    description: 'Released public API, enabling developers and enterprises to integrate our data.'
  },
  {
    year: '2023',
    title: 'National Coverage',
    description: 'Achieved complete coverage of all US metropolitan areas with 200+ markets.'
  },
  {
    year: '2024',
    title: 'AI Integration',
    description: 'Introduced machine learning models for market predictions and affordability forecasting.'
  }
];

const leadership = [
  {
    name: 'Charan Sama',
    role: 'Senior Machine Learning',
    image: 'CS'
  },
  {
    name: 'Rayan Rehman',
    role: 'Senior Cybersecurity',
    image: 'RR'
  },
  {
    name: 'Dhruv Shah',
    role: 'Senior Computer Science',
    image: 'DS'
  },
  {
    name: 'Eshaan Salvi',
    role: 'Senior Machine Learning',
    image: 'ES'
  }
];

const values = [
  {
    title: 'Transparency',
    description: 'We believe housing data should be open, accurate, and accessible to all.',
    icon: '🔍'
  },
  {
    title: 'Innovation',
    description: 'We continuously push the boundaries of what\'s possible with housing analytics.',
    icon: '🚀'
  },
  {
    title: 'Impact',
    description: 'Our work helps people make better housing decisions and build wealth.',
    icon: '💡'
  },
  {
    title: 'Integrity',
    description: 'We maintain the highest standards of data quality and ethical practices.',
    icon: '⚖️'
  }
];

export default function About() {
  return (
    <Layout 
      title="About - Affordly" 
      description="Learn about Affordly's mission to make housing data accessible and our journey since 2019"
      canonical="https://affordly.com/about"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Making Housing Data <span className="gradient-text">Accessible</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Since 2019, we've been on a mission to democratize housing market data and help millions 
            make informed decisions about homeownership.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Housing is the largest expense for most Americans, yet the data to understand housing 
                affordability has been scattered, expensive, or simply unavailable. We're changing that.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Affordly transforms complex housing market data into clear, actionable insights. Whether 
                you're a first-time homebuyer, real estate professional, or policy maker, our platform 
                provides the transparency needed to navigate today's housing market.
              </p>
              <div className="flex items-center space-x-8">
                <div>
                  <div className="text-3xl font-bold text-green-400">50K+</div>
                  <div className="text-gray-400">Monthly Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">200+</div>
                  <div className="text-gray-400">Markets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">99.9%</div>
                  <div className="text-gray-400">Uptime</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-1">
                <div className="bg-gray-900 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Our Impact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Searches performed</span>
                      <span className="text-green-400 font-semibold">2.1M+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Markets analyzed</span>
                      <span className="text-blue-400 font-semibold">10M+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API calls served</span>
                      <span className="text-purple-400 font-semibold">500M+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-400">Key milestones in making housing data accessible</p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-blue-500" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{item.year}</span>
                  </div>
                  <div className="ml-8">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-400">Experienced professionals from top technology and finance companies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((person, index) => (
              <div 
                key={person.name}
                className="card text-center"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.6s ease-out forwards'
                }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{person.image}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{person.name}</h3>
                <p className="text-green-400 font-medium mb-3">{person.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="text-center"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">In the Press</h2>
            <p className="text-xl text-gray-400">Recognition from leading media outlets</p>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-lg text-gray-300 mb-6 italic">
                "Affordly is democratizing access to housing market data, providing insights that were 
                previously available only to industry insiders."
              </p>
              <p className="text-green-400 font-semibold">— TechCrunch</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">Wall Street Journal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">Forbes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">Bloomberg</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">Reuters</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}