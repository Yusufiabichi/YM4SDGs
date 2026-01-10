import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Program } from '../../lib/supabase';
import Footer from '../home/components/Footer';
import BackToTop from '../home/components/BackToTop';
import { motion } from 'framer-motion';
import { fadeUp, fadeLeft, fadeRight, stagger } from '@/animations/motion';


export default function ProgramsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
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
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .order('id', { ascending: true });

      if (fetchError) throw fetchError;

      setPrograms(data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load programs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sdgColors: { [key: number]: string } = {
    1: 'bg-red-500',
    2: 'bg-yellow-500',
    3: 'bg-green-500',
    4: 'bg-red-600',
    6: 'bg-blue-400',
    7: 'bg-yellow-400',
    8: 'bg-red-700',
    11: 'bg-orange-500',
    12: 'bg-yellow-600',
    13: 'bg-green-600',
    14: 'bg-blue-500',
    15: 'bg-green-700',
    17: 'bg-blue-800'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="./ym4sdgs-logo.jpg" 
                alt="YM4SDGs Logo" 
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap">
                Home
              </Link>
              <Link to="/programs" className="text-sm font-medium text-teal-600 transition-colors whitespace-nowrap">
                Programs
              </Link>
              <Link to="/blogs" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap">
                Blog
              </Link>
              <Link to="/#contact" className="bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-yellow-300 transition-all hover:scale-105 whitespace-nowrap cursor-pointer">
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
              <Link to="/programs" className="block w-full text-left px-4 py-2 rounded-lg text-teal-600 bg-teal-50 transition-colors">
                Programs
              </Link>
              <Link to="/blogs" className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Blog
              </Link>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative pt-32 pb-20 bg-red-700 overflow-hidden"
      >

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Programs
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Discover our comprehensive initiatives designed to empower youth, drive climate action, and advance the Sustainable Development Goals across Africa.
          </motion.p>
        </div>
      </motion.section>

      {/* Programs Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Loading programs...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
                <div>
                  <p className="font-semibold text-red-900">Error Loading Programs</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchPrograms}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && programs.length === 0 && (
            <div className="text-center py-20">
              <i className="ri-folder-open-line text-6xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 text-lg">No programs available at the moment.</p>
            </div>
          )}

          {!loading && !error && programs.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16"
            >
              {programs.map((program, index) => (
                <motion.div
                  variants={index % 2 === 0 ? fadeLeft : fadeRight}
                  key={program.id}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-12 items-center`}
                >
                  <div className="lg:w-1/2">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-3xl overflow-hidden shadow-2xl group"
                    >
                      <img 
                        src={program.image}
                        alt={program.title}
                        className="w-full h-96 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-6 left-6 flex gap-2">
                        {program.sdgs.map(sdg => (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`${sdgColors[sdg]} text-white px-4 py-2 rounded-full`}
                          >
                              SDG {sdg}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="lg:w-1/2">
                    <div className="inline-block bg-teal-100 text-teal-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                      {program.category}
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{program.title}</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-calendar-line text-red-600 text-xl"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm font-semibold">{new Date(program.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-time-line text-blue-600 text-xl"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Duration</p>
                          <p className="text-sm font-semibold">{program.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-map-pin-line text-green-600 text-xl"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Location</p>
                          <p className="text-sm font-semibold">{program.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-group-line text-yellow-600 text-xl"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Participants</p>
                          <p className="text-sm font-semibold">{program.max_participants ? `Up to ${program.max_participants}` : program.participants}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Key Objectives</h3>
                      <motion.ul variants={stagger} initial="hidden" whileInView="visible">
                        {program.objectives.map((objective, idx) => (
                          <motion.li
                            key={idx}
                            variants={fadeUp}
                            className="flex items-start gap-3"
                          >
                            <i className="ri-checkbox-circle-fill text-teal-600 text-xl flex-shrink-0 mt-0.5"></i>
                            <span className="text-gray-700">{objective}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                    <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Impact</h3>
                      <p className="text-gray-700 leading-relaxed">{program.impact}</p>
                    </div>

                    <Link 
                      to={`/programs/${program.id}`}
                      className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all hover:scale-105 whitespace-nowrap cursor-pointer"
                    >
                      Learn More & Register <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-green-700"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join one of our programs and become part of the movement driving sustainable change across Africa.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/#contact"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              Apply Now <i className="ri-arrow-right-line"></i>
            </Link>
            <Link 
              to="/"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-700 transition-all whitespace-nowrap cursor-pointer"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.section>
      <BackToTop />

      {/* Footer */}
      <Footer />

    </div>
  );
}
