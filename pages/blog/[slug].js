import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const response = await fetch('/data/blog.json');
        const data = await response.json();
        const foundPost = data.posts.find(p => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          // Get related posts (excluding current post)
          const related = data.posts
            .filter(p => p.slug !== slug)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 pt-8">
          <div className="max-w-4xl mx-auto container-padding">
            <div className="loading-shimmer h-8 w-48 rounded mb-4" />
            <div className="loading-shimmer h-12 w-full rounded mb-8" />
            <div className="loading-shimmer h-64 w-full rounded mb-8" />
            <div className="space-y-4">
              <div className="loading-shimmer h-4 w-full rounded" />
              <div className="loading-shimmer h-4 w-5/6 rounded" />
              <div className="loading-shimmer h-4 w-4/6 rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout title="Post Not Found - Affordly">
        <div className="min-h-screen bg-gray-950 pt-8">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog" className="btn-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${post.title} - Affordly Blog`}
      description={post.excerpt}
      canonical={`https://affordly.com/blog/${post.slug}`}
    >
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <div className="pt-8 pb-0">
          <div className="max-w-4xl mx-auto container-padding">
            <Link 
              href="/blog"
              className="inline-flex items-center text-green-400 hover:text-green-300 mb-8 group"
            >
              <svg 
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="section-padding">
          <div className="max-w-4xl mx-auto container-padding">
            {/* Meta */}
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>By {post.author}</span>
              <span>•</span>
              <span>5 min read</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Featured Image */}
            <div className="mb-12">
              <div 
                className="h-64 sm:h-96 bg-gray-800 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-green max-w-none">
              <div className="text-xl text-gray-300 leading-relaxed mb-8">
                {post.excerpt}
              </div>
              
              <div className="text-gray-300 leading-relaxed space-y-6">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Share this article</h3>
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-blue-400 transition-colors">
                      <span className="sr-only">Share on Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <span className="sr-only">Share on LinkedIn</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="section-padding bg-gray-900">
            <div className="max-w-6xl mx-auto container-padding">
              <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <Link 
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="card hover:border-gray-600/50 transition-all duration-300 group"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      opacity: 0,
                      animation: 'slideUp 0.6s ease-out forwards'
                    }}
                  >
                    <div 
                      className="h-48 bg-gray-800 rounded-lg bg-cover bg-center mb-4"
                      style={{ backgroundImage: `url(${relatedPost.image})` }}
                    />
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">
                        {new Date(relatedPost.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {relatedPost.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Explore Housing Data?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Get started with Affordly's comprehensive housing affordability dashboard.
            </p>
            <Link href="/dashboard" className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Open Dashboard
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}