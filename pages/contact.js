import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    plan: 'pro',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        plan: 'pro',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout 
      title="Contact - Affordly" 
      description="Get in touch with Affordly. Request a demo, ask questions, or learn about enterprise solutions."
      canonical="https://affordly.com/contact"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to unlock housing market insights? We're here to help you get started.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Request a Demo</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Thank you!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input w-full"
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input w-full"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input w-full"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-300 mb-2">
                      Interested Plan
                    </label>
                    <select
                      id="plan"
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      className="form-input w-full"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro ($29/month)</option>
                      <option value="organization">Organization ($199/month)</option>
                      <option value="custom">Custom Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="form-input w-full resize-none"
                      placeholder="Tell us about your use case and any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* General Info */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">Email</div>
                      <div className="text-gray-400">hello@affordly.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">Phone</div>
                      <div className="text-gray-400">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">Office</div>
                      <div className="text-gray-400">San Francisco, CA</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Times */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">Response Times</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">General Inquiries</span>
                    <span className="text-green-400 font-semibold">< 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Demo Requests</span>
                    <span className="text-blue-400 font-semibold">Same day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Enterprise Sales</span>
                    <span className="text-purple-400 font-semibold">< 4 hours</span>
                  </div>
                </div>
              </div>

              {/* Sales Team */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">Sales Team</h3>
                <p className="text-gray-400 mb-4">
                  Need enterprise features or have questions about our Organization plan? 
                  Our sales team is here to help.
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-white">Enterprise Sales</div>
                    <div className="text-gray-400">sales@affordly.com</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Partnerships</div>
                    <div className="text-gray-400">partnerships@affordly.com</div>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
                <p className="text-gray-400 mb-4">
                  Existing customers can reach our support team for technical assistance.
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-white">Technical Support</div>
                    <div className="text-gray-400">support@affordly.com</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">API Support</div>
                    <div className="text-gray-400">api@affordly.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
            <p className="text-xl text-gray-400">
              Quick answers to frequently asked questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">How quickly can I get started?</h3>
                <p className="text-gray-400">You can access our free tier immediately. Pro trials can be set up within minutes of your request.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Do you offer custom integrations?</h3>
                <p className="text-gray-400">Yes, our Organization plan includes custom integrations and white-label options.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">What data formats do you support?</h3>
                <p className="text-gray-400">We provide data via REST API, CSV exports, and can accommodate custom formats for enterprise customers.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Is there a minimum commitment?</h3>
                <p className="text-gray-400">No minimum commitment required. You can cancel or change plans at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}