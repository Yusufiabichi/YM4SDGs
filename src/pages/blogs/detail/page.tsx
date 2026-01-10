import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import Footer from '@/pages/home/components/Footer';
import BackToTop from '@/pages/home/components/BackToTop';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published_date: string;
  status: string;
  created_at?: string;
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (blogError) throw blogError;

      setBlog(blogData);

      // Fetch related blogs from same category
      if (blogData) {
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .eq('category', blogData.category)
          .neq('id', id)
          .limit(3);

        setRelatedBlogs(relatedData || []);
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Events': 'bg-red-600',
      'Climate Action': 'bg-green-600',
      'Youth Empowerment': 'bg-blue-600',
      'Policy Advocacy': 'bg-yellow-600',
      'Success Stories': 'bg-red-500',
      'News': 'bg-green-500'
    };
    return colors[category] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://static.readdy.ai/image/6f2b631dac997628c51208e81abd8495/bae95d7e5a287882c8956dbc7f84acd7.jpeg" 
                alt="YM4SDGs Logo" 
                className="h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">
                Home
              </Link>
              <Link to="/programs" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">
                Programs
              </Link>
              <Link to="/blogs" className="text-sm font-medium text-red-600 transition-colors whitespace-nowrap">
                Blog
              </Link>
              <Link to="/#contact" className="bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-yellow-500 transition-all hover:scale-105 whitespace-nowrap cursor-pointer">
                Join Movement
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 cursor-pointer text-gray-900"
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3">
              <Link to="/" className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Home
              </Link>
              <Link to="/programs" className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Programs
              </Link>
              <Link to="/blogs" className="block w-full text-left px-4 py-2 rounded-lg text-red-600 bg-red-50 transition-colors">
                Blog
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading blog post...</p>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
                <div>
                  <p className="font-semibold text-red-900">Error Loading Blog Post</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <Link
                to="/blogs"
                className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all cursor-pointer"
              >
                Back to Blogs
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && blog && (
          <>
            {/* Blog Header */}
            <article className="max-w-4xl mx-auto px-6">
              <div className="mb-8">
                <Link 
                  to="/blogs"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-6 cursor-pointer"
                >
                  <i className="ri-arrow-left-line"></i> Back to Blogs
                </Link>

                <div className="flex items-center gap-4 mb-6">
                  <span className={`${getCategoryColor(blog.category)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                    {blog.category}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {formatDate(blog.published_date)}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.title}
                </h1>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-red-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{blog.author}</p>
                    <p className="text-sm text-gray-600">Author</p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl">
                <img 
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-96 object-cover object-top"
                />
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none mb-16">
                <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {blog.excerpt}
                </p>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              {/* Share Section */}
              <div className="border-t border-b border-gray-200 py-8 mb-16">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Share this article</h3>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                      <i className="ri-facebook-fill"></i>
                    </button>
                    <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                      <i className="ri-twitter-fill"></i>
                    </button>
                    <button className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                      <i className="ri-linkedin-fill"></i>
                    </button>
                    <button className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all cursor-pointer">
                      <i className="ri-mail-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog.id}
                        to={`/blogs/${relatedBlog.id}`}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                      >
                        <div className="relative h-48">
                          <img 
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`${getCategoryColor(relatedBlog.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                              {relatedBlog.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(relatedBlog.published_date)}
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {relatedBlog.excerpt}
                          </p>
                          <span className="text-red-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all whitespace-nowrap">
                            Read More <i className="ri-arrow-right-line"></i>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-red-700">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Join the Movement
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Be part of the change. Get involved with our programs and help drive sustainable development.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    to="/#contact"
                    className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    Get Involved <i className="ri-arrow-right-line"></i>
                  </Link>
                  <Link 
                    to="/blogs"
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-700 transition-all whitespace-nowrap cursor-pointer"
                  >
                    More Articles
                  </Link>
                </div>
              </div>
            </section>
            <BackToTop />
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
