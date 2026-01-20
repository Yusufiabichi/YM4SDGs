import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import BackToTop from './components/BackToTop';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  stagger,
  zoomIn
} from '@/animations/motion';



export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [modalType, setModalType] = useState<'volunteer' | 'creator' | 'ambassador' | 'partnership'>('volunteer');
  
  // New states for programs and blogs
  const [programs, setPrograms] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  
  // Form states
  const [volunteerForm, setVolunteerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    portfolio: '',
    motivation: '',
    areasOfInterest: [] as string[]
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [volunteerMessage, setVolunteerMessage] = useState({ type: '', text: '' });
  const [contactMessage, setContactMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'programs', 'impact', 'campaigns', 'gallery', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch latest programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setPrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, []);

  // Fetch latest blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const openModal = (type: 'volunteer' | 'creator' | 'ambassador' | 'partnership') => {
    setModalType(type);
    setShowVolunteerModal(true);
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerSubmitting(true);
    setVolunteerMessage({ type: '', text: '' });

    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/submit-volunteer-application`;
      const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY; 

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}` 
        },
        body: JSON.stringify({
          name: `${volunteerForm.firstName} ${volunteerForm.lastName}`,
          email: volunteerForm.email,
          phone: volunteerForm.phone,
          role: modalType,
          areas_of_interest: volunteerForm.areasOfInterest,
          experience: volunteerForm.portfolio || volunteerForm.organization || '',
          motivation: volunteerForm.motivation
        })
      });

      const result = await response.json();

      if (response.ok) {
        setVolunteerMessage({ type: 'success', text: 'Application submitted successfully! We\'ll get back to you soon.' });
        setVolunteerForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          portfolio: '',
          motivation: '',
          areasOfInterest: []
        });
        setTimeout(() => {
          setShowVolunteerModal(false);
          setVolunteerMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setVolunteerMessage({ type: 'error', text: result.error || 'Failed to submit application' });
      }
    } catch (error) {
      setVolunteerMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactMessage({ type: '', text: '' });

    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/submit-contact-form`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(contactForm)
      });

      const result = await response.json();

      if (response.ok) {
        setContactMessage({ type: 'success', text: 'Message sent successfully! We\'ll respond soon.' });
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setContactMessage({ type: 'error', text: result.error || 'Failed to send message' });
      }
    } catch (error) {
      setContactMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleAreaToggle = (area: string) => {
    setVolunteerForm(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.includes(area)
        ? prev.areasOfInterest.filter(a => a !== area)
        : [...prev.areasOfInterest, area]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

  const modalTitles = {
    volunteer: 'Become a Volunteer',
    creator: 'Join as Content Creator',
    ambassador: 'Become Social Media Ambassador',
    partnership: 'Partnership Inquiry'
  };

  const modalDescriptions = {
    volunteer: 'Help us drive change in your community. Fill out the form below and we\'ll get back to you soon.',
    creator: 'Share your creative talents to amplify our message. Tell us about your content creation experience.',
    ambassador: 'Represent YM4SDGs on social media platforms. Let us know about your social media presence.',
    partnership: 'Let\'s collaborate to create greater impact. Share your organization details and partnership ideas.'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="ym4sdgs-logo.jpg" 
                alt="YM4SDGs Logo" 
                className="h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {['Home', 'About', 'Programs', 'Impact', 'Campaigns', 'Gallery', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-yellow-400'
                  } ${activeSection === item.toLowerCase() ? (scrolled ? 'text-red-600' : 'text-yellow-400') : ''}`}
                >
                  {item}
                </button>
              ))}
              <Link 
                to="/blogs"
                className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-yellow-400'
                }`}
              >
                Blog
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-yellow-500 transition-all hover:scale-105 whitespace-nowrap cursor-pointer"
              >
                Join Movement
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 cursor-pointer ${scrolled ? 'text-gray-900' : 'text-white'}`}
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3">
              {['Home', 'About', 'Programs', 'Impact', 'Campaigns', 'Gallery', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
              <Link 
                to="/blogs"
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                Blog
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            src="./hero-bg.jpg"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-yellow-900/70"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Amplifying Youth Voices<br />
              for Global Goals
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl font-light tracking-wide">
              Empowering young people to shape policies, drive grassroots action, and build a sustainable future.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                Join Us <i className="ri-arrow-right-line"></i>
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-900 transition-all whitespace-nowrap cursor-pointer"
              >
                See Our Impact
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="ri-arrow-down-line text-white text-3xl"></i>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-5xl font-bold text-gray-900 mb-4">Our Impact</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-600">Building the largest youth movement for sustainable development</motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={zoomIn}
              whileHover={{ y: -8 }} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-group-line text-3xl text-red-600"></i>
              </div>
              <div className="text-5xl font-bold text-red-600 mb-3">
                1M+
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Youth by 2026</p>
              <p className="text-gray-600">Building the largest youth movement for sustainable development</p>
            </motion.div>

            <motion.div
              variants={zoomIn}
              whileHover={{ y: -8 }} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-flag-line text-3xl text-green-600"></i>
              </div>
              <div className="text-5xl font-bold text-green-600 mb-3">
                17
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Goals, 1 Movement</p>
              <p className="text-gray-600">United action across all Sustainable Development Goals</p>
            </motion.div>

            <motion.div
              variants={zoomIn}
              whileHover={{ y: -8 }} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-links-line text-3xl text-yellow-600"></i>
              </div>
              <div className="text-5xl font-bold text-yellow-600 mb-3">
                50+
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Partnerships</p>
              <p className="text-gray-600">Collaborating with organizations worldwide for greater impact</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
              <h2 className="text-5xl font-bold text-gray-900 mb-4">Empowering the Next Generation of Changemakers</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We are a global youth network advancing advocacy, innovation, and grassroots action for the UN SDGs. Our mission is to empower youth to influence policy and drive sustainable solutions for a better world.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeLeft} className="bg-white border-l-4 border-red-600 p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:bg-red-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-eye-line text-2xl text-red-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A world where youth-led action delivers development and equity, creating lasting change for communities worldwide through sustainable solutions.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white border-l-4 border-green-600 p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:bg-green-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-compass-line text-2xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Approach</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Through education, advocacy, and direct action, we build capacity in young leaders and create platforms for meaningful participation in global development.
              </p>
            </motion.div>

            <motion.div variants={fadeRight} className="bg-white border-l-4 border-yellow-600 p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:bg-yellow-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="ri-heart-line text-2xl text-yellow-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To empower youth to influence policy and drive sustainable solutions, creating a global movement that transforms communities and advances the UN SDGs.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-red-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
              <h2 className="text-5xl font-bold text-white mb-4">Our Core Values: VOICE</h2>
            <p className="text-xl text-red-100">The principles that guide our movement</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { letter: 'V', title: 'Voice', desc: 'Amplifying youth perspectives in decision-making', color: 'text-yellow-400' },
              { letter: 'O', title: 'Ownership', desc: 'Taking responsibility for sustainable change', color: 'text-green-400' },
              { letter: 'I', title: 'Innovation', desc: 'Creating new solutions for old problems', color: 'text-blue-400' },
              { letter: 'C', title: 'Consistency', desc: 'Sustained commitment to our mission', color: 'text-red-400' },
              { letter: 'E', title: 'Empowerment', desc: 'Building capacity in young leaders', color: 'text-yellow-400' }
            ].map((value, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }} 
                key={index} 
                className="group relative bg-red-700/50 rounded-2xl p-8 hover:bg-yellow-400 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="text-center">
                  <div className={`text-7xl font-bold ${value.color} group-hover:text-gray-900 transition-colors mb-4`}>
                    {value.letter}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gray-900 transition-colors mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-red-100 group-hover:text-gray-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Featured Programs</h2>
            <p className="text-xl text-gray-600">Driving change through innovative initiatives</p>
          </motion.div>

          {loadingPrograms ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : programs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {programs.map((program) => (
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4 }}
                  key={program.id}
                  className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative h-96">
                    <img 
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-3">{program.title}</h3>
                    <p className="text-white/90 mb-4 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>
                    <Link 
                      to={`/programs/${program.id}`}
                      className="text-yellow-400 font-semibold flex items-center gap-2 hover:gap-4 transition-all whitespace-nowrap cursor-pointer">
                      Learn More <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="ri-folder-open-line text-6xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 text-lg">No programs available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/programs"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all whitespace-nowrap cursor-pointer inline-block"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Key Campaigns</h2>
            <p className="text-xl text-gray-600">Mobilizing action across multiple fronts</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            <motion.div variants={fadeLeft} className="bg-red-600 rounded-2xl p-6 lg:p-8 text-white hover:scale-105 transition-transform cursor-pointer">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-code-box-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">#PolicyHackChallenge</h3>
                  <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                    Innovating policy solutions through technology
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeRight} className="bg-green-600 rounded-2xl p-6 lg:p-8 text-white hover:scale-105 transition-transform cursor-pointer">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-plant-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">#FromGrassrootsToGoals</h3>
                  <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                    Community-driven sustainable development
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeLeft} className="bg-blue-600 rounded-2xl p-6 lg:p-8 text-white hover:scale-105 transition-transform cursor-pointer">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-mic-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">#YouthSDGVoices</h3>
                  <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                    Amplifying youth stories and perspectives
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeRight} className="bg-yellow-500 rounded-2xl p-6 lg:p-8 text-gray-900 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-14 h-14 bg-gray-900/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-rocket-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">#Act4SDGsSeries</h3>
                  <p className="text-gray-900/90 text-base lg:text-lg leading-relaxed">
                    Action-oriented campaigns for each SDG
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <Gallery />
      </section>


      {/* Blogs Section */}
      <section id="blog" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600">Stay updated with our programs, events, and youth-driven initiatives towards the SDGs</p>
          </motion.div>

          {loadingBlogs ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <motion.div 
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  key={blog.id}
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
                        {formatDate(blog.published_date || blog.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <Link 
                      to={`/blogs/${blog.id}`}
                      className={`font-semibold flex items-center gap-2 hover:gap-4 transition-all whitespace-nowrap ${getCategoryColor(blog.category).replace('bg-', 'text-')}`}>
                      Read More <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="ri-article-line text-6xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 text-lg">No blog posts available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/blogs"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all whitespace-nowrap cursor-pointer inline-block"
            >
              View All Blog Posts
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-red-700">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Shape the Future?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of young changemakers working towards a sustainable and equitable world. Your voice matters, your action counts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              Become a Volunteer <i className="ri-arrow-right-line"></i>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-700 transition-all whitespace-nowrap cursor-pointer"
            >
              Partner With Us
            </button>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Let's work together to create positive change</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line text-xl text-red-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <a href="mailto:contact@ymsdgs.org" className="text-red-600 hover:underline cursor-pointer">
                      info@ym4sdgs.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-global-line text-xl text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Website</h4>
                    <a href="https://www.ym4sdgs.org" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline cursor-pointer">
                      www.ymsdgs.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Get Involved</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => openModal('volunteer')}
                    className="w-full text-left px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Volunteer</span>
                      <i className="ri-arrow-right-line text-red-600"></i>
                    </div>
                  </button>
                  <button 
                    onClick={() => openModal('creator')}
                    className="w-full text-left px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Content Creator</span>
                      <i className="ri-arrow-right-line text-green-600"></i>
                    </div>
                  </button>
                  <button 
                    onClick={() => openModal('ambassador')}
                    className="w-full text-left px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Social Media Ambassador</span>
                      <i className="ri-arrow-right-line text-blue-600"></i>
                    </div>
                  </button>
                  <button 
                    onClick={() => openModal('partnership')}
                    className="w-full text-left px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Partnership</span>
                      <i className="ri-arrow-right-line text-yellow-600"></i>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input 
                    type="text"
                    name="subject"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={5}
                    name="message"
                    required
                    maxLength={500}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">Maximum 500 characters</p>
                </div>

                {contactMessage.text && (
                  <div className={`p-4 rounded-lg ${contactMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {contactMessage.text}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <BackToTop />

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{modalTitles[modalType]}</h3>
              <button 
                onClick={() => {
                  setShowVolunteerModal(false);
                  setVolunteerMessage({ type: '', text: '' });
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-8">
              <p className="text-gray-600 mb-8 text-lg">
                {modalDescriptions[modalType]}
              </p>

              <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <input 
                      type="text"
                      name="firstName"
                      required
                      value={volunteerForm.firstName}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                    <input 
                      type="text"
                      name="lastName"
                      required
                      value={volunteerForm.lastName}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={volunteerForm.phone}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>

                {modalType === 'partnership' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name *</label>
                    <input 
                      type="text"
                      name="organization"
                      required
                      value={volunteerForm.organization}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your organization"
                    />
                  </div>
                )}

                {(modalType === 'creator' || modalType === 'ambassador') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {modalType === 'creator' ? 'Portfolio/Website' : 'Social Media Handles'}
                    </label>
                    <input 
                      type="text"
                      name="portfolio"
                      value={volunteerForm.portfolio}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, portfolio: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder={modalType === 'creator' ? 'https://yourportfolio.com' : '@yourusername'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {modalType === 'partnership' ? 'Partnership Proposal' : 'Why do you want to join?'} *
                  </label>
                  <textarea 
                    rows={5}
                    name="motivation"
                    required
                    maxLength={500}
                    value={volunteerForm.motivation}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, motivation: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about yourself and your motivation..."
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">Maximum 500 characters</p>
                </div>

                {modalType === 'volunteer' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Areas of Interest</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Climate Action', 'Education', 'Community Outreach', 'Event Planning', 'Social Media', 'Research'].map((area) => (
                        <label key={area} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={volunteerForm.areasOfInterest.includes(area)}
                            onChange={() => handleAreaToggle(area)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {volunteerMessage.text && (
                  <div className={`p-4 rounded-lg ${volunteerMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {volunteerMessage.text}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowVolunteerModal(false);
                      setVolunteerMessage({ type: '', text: '' });
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={volunteerSubmitting}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {volunteerSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
