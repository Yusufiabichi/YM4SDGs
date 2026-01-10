import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Footer from '../home/components/Footer';
import BackToTop from '../home/components/BackToTop';

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  created_at: string;
  status: 'published' | 'draft';
  category: string;
  published_date: string;
}

export default function BlogsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
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

  const categories = ['all', ...Array.from(new Set(blogs.map(blog => blog.category)))];
  
  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Events': 'bg-red-600',
      'Climate Action': 'bg-green-600',
      'Youth Empowerment': 'bg-blue-600',
      'Leadership': 'bg-yellow-600',
      'Community': 'bg-red-700',
      'Education': 'bg-green-700'
    };
    return colors[category] || 'bg-red-600';
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
                className="h-12 w-auto"
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-red-700 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Stay updated with our latest programs, events, and youth-driven initiatives towards achieving the Sustainable Development Goals.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-20 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Loading blogs...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
                <div>
                  <p className="font-semibold text-red-900">Error Loading Blogs</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchBlogs}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <i className="ri-article-line text-6xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 text-lg">No blogs available in this category.</p>
            </div>
          )}

          {!loading && !error && filteredBlogs.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative h-64">
                    <img 
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`${getCategoryColor(blog.category)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(blog.published_date)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{blog.author}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <span className="text-red-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all whitespace-nowrap">
                      Read More <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-green-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Be part of the change. Subscribe to our newsletter and stay updated with our latest initiatives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/#contact"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              Get Involved <i className="ri-arrow-right-line"></i>
            </Link>
            <Link 
              to="/"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-700 transition-all whitespace-nowrap cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
      <BackToTop />

      {/* Footer */}
      <Footer />
    </div>
  );
}
