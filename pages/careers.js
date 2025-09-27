import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const benefits = [
  {
    icon: '💰',
    title: 'Competitive Salary',
    description: 'Top-tier compensation packages with equity options'
  },
  {
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance'
  },
  {
    icon: '🏖️',
    title: 'Unlimited PTO',
    description: 'Take the time you need to recharge and stay productive'
  },
  {
    icon: '💻',
    title: 'Remote First',
    description: 'Work from anywhere with flexible hours'
  },
  {
    icon: '📚',
    title: 'Learning Budget',
    description: '$2,000 annually for courses, conferences, and books'
  },
  {
    icon: '🚀',
    title: 'Growth Opportunities',
    description: 'Clear career paths and internal mobility'
  }
];

const departments = [
  { name: 'Engineering', count: 3, color: 'text-blue-400' },
  { name: 'Data & Analytics', count: 2, color: 'text-green-400' },
  { name: 'Product', count: 1, color: 'text-purple-400' },
  { name: 'Marketing', count: 1, color: 'text-yellow-400' },
  { name: 'Sales', count: 2, color: 'text-red-400' }
];

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch('/data/jobs.json');
        const data = await response.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department.toLowerCase().includes(selectedDepartment.toLowerCase()));

  if (isLoading) {
    return (
      <Layout title="Careers - Affordly" description="Join our team building the future of housing data">
        <div className="min-h-screen bg-gray-950 pt-8">
          <div className="max-w-6xl mx-auto container-padding">
            <div className="loading-shimmer h-12 w-64 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="loading-shimmer h-48 rounded-lg" />
                ))}
              </div>
              <div className="space-y-6">
                <div className="loading-shimmer h-64 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Careers - Affordly" 
      description="Join our team building the future of housing data. We're hiring across engineering, data science, and product teams."
      canonical="https://affordly.com/careers"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Build the <span className="gradient-text">Future</span> of Housing Data
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join a team of passionate professionals who are democratizing access to housing market data 
            and helping millions make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#openings" className="btn-primary">
              View Open Positions
            </a>
            <a href="mailto:careers@affordly.com" className="btn-secondary">
              Contact Recruiting
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="stats-grid text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">35+</div>
              <div className="text-gray-400">Team Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
              <div className="text-gray-400">Departments</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-400">Remote-Friendly</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">4.9</div>
              <div className="text-gray-400">Glassdoor Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Work at Affordly?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We offer comprehensive benefits and a culture that values growth, innovation, and work-life balance.
            </p>
          </div>

          <div className="feature-grid">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className="card text-center"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="section-padding bg-gray-900">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-xl text-gray-400">
              Join us in building the next generation of housing market analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Filter by Department</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedDepartment('all')}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedDepartment === 'all'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    All Departments ({jobs.length})
                  </button>
                  {departments.map((dept) => (
                    <button
                      key={dept.name}
                      onClick={() => setSelectedDepartment(dept.name.toLowerCase())}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                        selectedDepartment === dept.name.toLowerCase()
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <span>{dept.name}</span>
                      <span className={dept.color}>({dept.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="lg:col-span-3">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No positions found</div>
                  <div className="text-gray-500 text-sm">
                    Try selecting a different department or check back soon
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredJobs.map((job, index) => (
                    <div 
                      key={job.id}
                      className="card hover:border-gray-600/50 transition-all duration-300"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        opacity: 0,
                        animation: 'slideUp 0.4s ease-out forwards'
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                              {job.type}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-1a2 2 0 011-1h4a2 2 0 011 1v1m-6 0h6" />
                              </svg>
                              {job.department}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Posted {new Date(job.posted).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-gray-300 leading-relaxed mb-4">
                            {job.description}
                          </p>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Key Requirements:</h4>
                            <ul className="space-y-1">
                              {job.requirements.slice(0, 3).map((req, reqIndex) => (
                                <li key={reqIndex} className="text-sm text-gray-400 flex items-start">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="lg:ml-6 mt-4 lg:mt-0">
                          <a 
                            href={`mailto:careers@affordly.com?subject=Application for ${job.title}`}
                            className="btn-primary w-full lg:w-auto text-center"
                          >
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Culture</h2>
            <p className="text-xl text-gray-400">
              Built on transparency, collaboration, and continuous learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">📊 Data-Driven</h3>
              <p className="text-gray-400 leading-relaxed">
                We make decisions based on data and evidence. Every team member has access to company 
                metrics and is empowered to use data to drive improvements.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">🤝 Collaborative</h3>
              <p className="text-gray-400 leading-relaxed">
                We believe the best solutions come from diverse perspectives working together. 
                Cross-functional collaboration is at the heart of how we work.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Mission-Focused</h3>
              <p className="text-gray-400 leading-relaxed">
                We're united by our mission to democratize housing data. Every role directly 
                contributes to making homeownership more accessible and transparent.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">🌱 Growth-Oriented</h3>
              <p className="text-gray-400 leading-relaxed">
                We invest in our people's growth through mentorship, learning stipends, and 
                clear career advancement paths. Your success is our success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people who share our passion for making housing data accessible. 
            Send us your resume and let's talk about future opportunities.
          </p>
          <a 
            href="mailto:careers@affordly.com?subject=Future Opportunities"
            className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </Layout>
  );
}