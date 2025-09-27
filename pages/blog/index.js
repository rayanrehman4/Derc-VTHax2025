import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/data/blog.json');
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Blog - Affordly" description="Latest insights on housing affordability and market trends">
        <div className="min-h-screen bg-gray-950 pt-8">
          <div className="max-w-4xl mx-auto container-padding">
            <div className="loading-shimmer h-12 w-64 rounded mb-8" />
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="loading-shimmer h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Blog - Affordly" 
      description="Latest insights on housing affordability, market trends, and real estate analysis"
      canonical="https://affordly.com/blog"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Housing Market <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Data-driven analysis and insights on housing affordability, market trends, and economic indicators.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No blog posts found</div>
              <div className="text-gray-500 text-sm">Check back soon for the latest insights</div>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post, index) => (
                <article 
                  key={post.slug}
                  className="card hover:border-gray-600/50 transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    opacity: 0,
                    animation: 'slideUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image */}
                    <div className="lg:col-span-1">
                      <div 
                        className="h-48 lg:h-full bg-gray-800 rounded-lg bg-cover bg-center min-h-[200px]"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-white mb-3 hover:text-green-400 transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center group"
                        >
                          Read More
                          <svg 
                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-gray-900">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="card bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-500/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get the latest housing market insights and affordability analysis delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input flex-1"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-3">
              No spam. Unsubscribe at any time.
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}