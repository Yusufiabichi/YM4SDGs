import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase, type Program } from '../../../lib/supabase';
import Footer from '@/pages/home/components/Footer';
import BackToTop from '@/pages/home/components/BackToTop';

export default function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    organization: '',
    experience: '',
    motivation: '',
    availability: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (id) {
      fetchProgram();
    }
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', parseInt(id || '0'))
        .single();

      if (fetchError) throw fetchError;

      if (!data) {
        navigate('/programs');
        return;
      }

      setProgram(data);
    } catch (err) {
      console.error('Error fetching program:', err);
      setError('Failed to load program details.');
      setTimeout(() => navigate('/programs'), 3000);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error: insertError } = await supabase
        .from('program_registrations')
        .insert([
          {
            program_id: program.id,
            program_title: program.title,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            age: parseInt(formData.age),
            location: formData.location,
            organization: formData.organization || null,
            experience: formData.experience,
            motivation: formData.motivation,
            availability: formData.availability
          }
        ]);

      if (insertError) throw insertError;

      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        location: '',
        organization: '',
        experience: '',
        motivation: '',
        availability: ''
      });
      
      setTimeout(() => {
        setShowRegistrationForm(false);
        setSubmitStatus('idle');
      }, 3000);
    } catch (err) {
      console.error('Error submitting registration:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterClick = () => {
    if (program?.registration_form_url) {
      // Open external form in new tab
      window.open(program.registration_form_url, '_blank', 'noopener,noreferrer');
    } else {
      // Show built-in registration form
      setShowRegistrationForm(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The program you are looking for does not exist.'}</p>
          <Link 
            to="/programs"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i> Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="../ym4sdgs-logo.jpg" 
                alt="YM4SDGs Logo" 
                className="h-12 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap">
                Home
              </Link>
              <Link to="/programs" className="text-sm font-medium text-teal-600 transition-colors whitespace-nowrap">
                Programs
              </Link>
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-yellow-300 transition-all hover:scale-105 whitespace-nowrap cursor-pointer"
              >
                Register Now
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 cursor-pointer text-gray-900"
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3">
              <Link to="/" className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Home
              </Link>
              <Link to="/programs" className="block w-full text-left px-4 py-2 rounded-lg text-teal-600 bg-teal-50 transition-colors">
                Programs
              </Link>
              <button
                onClick={() => {
                  setShowRegistrationForm(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                Register Now
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-red-700">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/programs" className="inline-flex items-center gap-2 text-white hover:text-yellow-400 transition-colors mb-6 cursor-pointer">
            <i className="ri-arrow-left-line"></i>
            <span>Back to Programs</span>
          </Link>
          
          <div className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
            {program.category}
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            {program.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-white">
              <i className="ri-time-line text-yellow-400 text-xl"></i>
              <span className="font-medium">{program.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <i className="ri-group-line text-yellow-400 text-xl"></i>
              <span className="font-medium">{program.participants}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            {program.sdgs.map(sdg => (
              <div 
                key={sdg}
                className={`${sdgColors[sdg]} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
              >
                SDG {sdg}
              </div>
            ))}
          </div>

          <button
            onClick={handleRegisterClick}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transition-all flex items-center gap-3 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl"
          >
            <i className="ri-user-add-line text-2xl"></i>
            Register Now
          </button>
        </div>
      </section>

      {/* Program Image */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={program.image}
              alt={program.title}
              className="w-full h-[500px] object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {program.full_description}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {program.description}
                </p>
              </div>

              {/* Objectives */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Objectives</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {program.objectives.map((objective, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-teal-50 p-4 rounded-xl">
                      <i className="ri-checkbox-circle-fill text-teal-600 text-xl flex-shrink-0 mt-0.5"></i>
                      <span className="text-gray-700 font-medium">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Schedule</h2>
                <div className="space-y-4">
                  {program.schedule.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-gray-50 p-6 rounded-xl">
                      <div className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-semibold">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="bg-green-700 p-8 rounded-3xl text-white">
                <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                <p className="text-lg leading-relaxed">
                  {program.impact}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Requirements */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {program.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <i className="ri-check-line text-teal-600 text-xl flex-shrink-0"></i>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-teal-50 p-6 rounded-2xl border-2 border-teal-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Get</h3>
                <ul className="space-y-3">
                  {program.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <i className="ri-gift-line text-teal-600 text-xl flex-shrink-0"></i>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-6 rounded-2xl text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Join?</h3>
                <p className="text-gray-800 mb-6">
                  Register now and be part of this transformative program!
                </p>
                <button
                  onClick={handleRegisterClick}
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 whitespace-nowrap cursor-pointer"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full my-8 relative">
            <button
              onClick={() => setShowRegistrationForm(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer z-10"
            >
              <i className="ri-close-line text-lg text-gray-700"></i>
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 pr-8">Register for {program.title}</h2>
              <p className="text-gray-600 text-sm mb-6">Fill out the form below to secure your spot.</p>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded">
                  <div className="flex items-center gap-2">
                    <i className="ri-checkbox-circle-fill text-green-500 text-xl"></i>
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Registration Successful!</p>
                      <p className="text-green-700 text-xs">We'll contact you soon with more details.</p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
                  <div className="flex items-center gap-2">
                    <i className="ri-error-warning-fill text-red-500 text-xl"></i>
                    <div>
                      <p className="font-semibold text-red-900 text-sm">Submission Failed</p>
                      <p className="text-red-700 text-xs">Please try again later.</p>
                    </div>
                  </div>
                </div>
              )}

              <form id="program-registration-form" data-readdy-form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="15"
                      max="35"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="Your age"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Location (City, State) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="e.g., Lagos, Lagos State"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Organization/Institution (Optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="Your school, company, or organization"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Relevant Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                    placeholder="Tell us about your experience with climate action, volunteering, or related activities"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">{formData.experience.length}/500</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Why do you want to join? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                    placeholder="Share your motivation and what you hope to achieve"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">{formData.motivation.length}/500</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="">Select your availability</option>
                    <option value="Full-time">Full-time commitment</option>
                    <option value="Part-time">Part-time commitment</option>
                    <option value="Weekends">Weekends only</option>
                    <option value="Flexible">Flexible schedule</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all text-sm whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-teal-600 text-white px-4 py-2.5 rounded-full font-semibold hover:bg-teal-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <BackToTop />
      <Footer />
    </div>
  );
}
