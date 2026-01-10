import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
  areas_of_interest?: string[];
  created_at?: string;
}

interface Program {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  participants: number;
  max_participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  location: string;
  category?: string;
  duration?: string;
  image?: string;
  full_description?: string;
  objectives?: string[];
  impact?: string;
  sdgs?: number[];
  requirements?: string[];
  benefits?: string[];
  schedule?: Array<{ time: string; activity: string }>;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'replied';
}

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  created_at: string;
  status: 'published' | 'draft';
  category: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [programImagePreview, setProgramImagePreview] = useState<string>('');
  const [blogImagePreview, setBlogImagePreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    checkAuth();
    fetchData();
    ensureStorageBucket();
  }, []);

  const ensureStorageBucket = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const imagesBucket = buckets?.find(b => b.name === 'images');
      
      if (!imagesBucket) {
        // Create bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket('images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });
        
        if (error) {
          console.error('Error creating storage bucket:', error);
        }
      }
    } catch (error) {
      console.error('Error checking storage bucket:', error);
    }
  };

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch volunteers
      const { data: volunteersData } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (volunteersData) {
        setVolunteers(volunteersData.map(v => ({
          id: v.id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          role: v.role,
          status: v.status,
          applied_date: new Date(v.created_at).toISOString().split('T')[0],
          areas_of_interest: v.areas_of_interest,
          created_at: v.created_at
        })));
      }

      // Fetch programs
      const { data: programsData } = await supabase
        .from('programs')
        .select('id, title, description, start_date, end_date, participants, max_participants, status, location')
        .order('start_date', { ascending: false });
      
      if (programsData) {
        setPrograms(programsData.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          start_date: p.start_date,
          end_date: p.end_date,
          participants: p.participants || 0,
          max_participants: p.max_participants,
          status: p.status,
          location: p.location
        })));
      }

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (messagesData) {
        setMessages(messagesData.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          created_at: new Date(m.created_at).toISOString().split('T')[0],
          status: m.status
        })));
      }

      // Fetch blogs
      const { data: blogsData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (blogsData) {
        setBlogs(blogsData.map(b => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          image: b.image,
          created_at: new Date(b.created_at).toISOString().split('T')[0],
          status: b.status,
          category: b.category
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleVolunteerAction = async (volunteerId: number, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status: action })
        .eq('id', volunteerId);

      if (error) throw error;

      setVolunteers(volunteers.map(v => 
        v.id === volunteerId ? { ...v, status: action } : v
      ));
      setShowModal(false);
      setSelectedVolunteer(null);
    } catch (error) {
      console.error('Error updating volunteer:', error);
    }
  };

  const handleDeleteVolunteer = async (volunteerId: number) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', volunteerId);

      if (error) throw error;

      setVolunteers(volunteers.filter(v => v.id !== volunteerId));
      setShowModal(false);
      setSelectedVolunteer(null);
    } catch (error) {
      console.error('Error deleting volunteer:', error);
    }
  };

  const handleDeleteProgram = async (programId: number) => {
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;

      setPrograms(programs.filter(p => p.id !== programId));
      setShowModal(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const handleMessageAction = async (messageId: number, status: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, status } : m
      ));
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== messageId));
      setShowModal(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleAddProgram = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('programs')
        .insert([{
          title: formData.title,
          category: formData.category,
          description: formData.description,
          full_description: formData.fullDescription,
          start_date: formData.startDate,
          end_date: formData.endDate,
          duration: formData.duration,
          max_participants: parseInt(formData.maxParticipants),
          status: formData.status,
          location: formData.location,
          image: formData.image,
          objectives: formData.objectives,
          impact: formData.impact,
          sdgs: formData.sdgs,
          requirements: formData.requirements,
          benefits: formData.benefits,
          schedule: formData.schedule,
          participants: 0
        }]);

      if (error) throw error;

      await fetchData();
      setShowProgramForm(false);
    } catch (error) {
      console.error('Error adding program:', error);
    }
  };

  const handleUpdateProgram = async (formData: any) => {
    if (!selectedProgram) return;

    try {
      const { error } = await supabase
        .from('programs')
        .update({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          full_description: formData.fullDescription,
          start_date: formData.startDate,
          end_date: formData.endDate,
          duration: formData.duration,
          max_participants: parseInt(formData.maxParticipants),
          status: formData.status,
          location: formData.location,
          image: formData.image,
          objectives: formData.objectives,
          impact: formData.impact,
          sdgs: formData.sdgs,
          requirements: formData.requirements,
          benefits: formData.benefits,
          schedule: formData.schedule
        })
        .eq('id', selectedProgram.id);

      if (error) throw error;

      await fetchData();
      setShowProgramForm(false);
      setSelectedProgram(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const handleAddBlog = async (formData: any) => {
    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          title: formData.title,
          slug: slug,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image,
          status: formData.status,
          category: formData.category,
          author: formData.author || 'YM4SDGs Team',
          published_date: formData.published_date || new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      await fetchData();
      setShowBlogForm(false);
      setBlogImagePreview('');
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Failed to add blog. Please try again.');
    }
  };

  const handleUpdateBlog = async (formData: any) => {
    if (!selectedBlog) return;

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          slug: slug,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image,
          category: formData.category,
          status: formData.status,
          author: formData.author || 'YM4SDGs Team',
          published_date: formData.published_date || selectedBlog.published_date
        })
        .eq('id', selectedBlog.id);

      if (error) throw error;

      await fetchData();
      setShowBlogForm(false);
      setSelectedBlog(null);
      setIsEditMode(false);
      setBlogImagePreview('');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog. Please try again.');
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      setBlogs(blogs.filter(b => b.id !== blogId));
      setShowModal(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleProgramImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      setUploadError('');
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file (PNG, JPG, WEBP)');
        setUploadingImage(false);
        return null;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        setUploadingImage(false);
        return null;
      }
      
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `programs/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        
        // If bucket doesn't exist, try to create it
        if (error.message.includes('Bucket not found')) {
          await ensureStorageBucket();
          setUploadError('Storage is being set up. Please try uploading again in a moment.');
        } else {
          setUploadError(`Upload failed: ${error.message}`);
        }
        
        setUploadingImage(false);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setProgramImagePreview(publicUrl);
      setUploadingImage(false);
      setUploadError('');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setUploadingImage(false);
      return null;
    }
  };

  const handleBlogImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      setUploadError('');
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file (PNG, JPG, WEBP)');
        setUploadingImage(false);
        return null;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        setUploadingImage(false);
        return null;
      }
      
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        
        // If bucket doesn't exist, try to create it
        if (error.message.includes('Bucket not found')) {
          await ensureStorageBucket();
          setUploadError('Storage is being set up. Please try uploading again in a moment.');
        } else {
          setUploadError(`Upload failed: ${error.message}`);
        }
        
        setUploadingImage(false);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setBlogImagePreview(publicUrl);
      setUploadingImage(false);
      setUploadError('');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setUploadingImage(false);
      return null;
    }
  };

  const stats = [
    { label: 'Total Volunteers', value: volunteers.length.toString(), icon: 'ri-group-line', color: 'from-red-500 to-red-600' },
    { label: 'Active Programs', value: programs.filter(p => p.status === 'ongoing' || 'upcoming').length.toString(), icon: 'ri-calendar-line', color: 'from-green-500 to-green-600' },
    { label: 'Unread Messages', value: messages.filter(m => m.status === 'unread').length.toString(), icon: 'ri-mail-line', color: 'from-blue-500 to-blue-600' },
    { label: 'Published Blogs', value: blogs.filter(b => b.status === 'published').length.toString(), icon: 'ri-article-line', color: 'from-yellow-500 to-yellow-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-5xl text-teal-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="../ym4sdgs-logo.jpg" 
                alt="YM4SDGs Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">YM4SDGs Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <i className="ri-external-link-line"></i>
                <span className="hidden md:inline">View Website</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-line"></i>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center`}>
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {['Overview', 'Volunteers', 'Programs', 'Messages', 'Blogs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-4 font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                
                <div className="space-y-4">
                  {volunteers.slice(0, 2).map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-user-add-line text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{volunteer.name}</p>
                        <p className="text-sm text-gray-600">applied as a volunteer</p>
                      </div>
                      <div className="text-sm text-gray-500">{volunteer.applied_date}</div>
                    </div>
                  ))}
                  {messages.slice(0, 2).map((message) => (
                    <div key={message.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-mail-line text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{message.name}</p>
                        <p className="text-sm text-gray-600">sent a contact message</p>
                      </div>
                      <div className="text-sm text-gray-500">{message.created_at}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'volunteers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Volunteer Applications</h2>
                    <p className="text-gray-600">Manage and review volunteer applications</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                      {volunteers.filter(v => v.status === 'pending').length} Pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {volunteers.filter(v => v.status === 'approved').length} Approved
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{volunteer.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              volunteer.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p><i className="ri-mail-line mr-2"></i>{volunteer.email}</p>
                            <p><i className="ri-phone-line mr-2"></i>{volunteer.phone}</p>
                            <p><i className="ri-briefcase-line mr-2"></i>{volunteer.role}</p>
                            <p><i className="ri-calendar-line mr-2"></i>Applied: {volunteer.applied_date}</p>
                          </div>
                          {volunteer.areas_of_interest && (
                            <div className="flex flex-wrap gap-2">
                              {volunteer.areas_of_interest.map((area, idx) => (
                                <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                                  {area}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedVolunteer(volunteer);
                              setShowModal(true);
                            }}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Program Management</h2>
                    <p className="text-gray-600">Manage all programs and events</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {programs.filter(p => p.status === 'ongoing').length} Ongoing
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {programs.filter(p => p.status === 'upcoming').length} Upcoming
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowProgramForm(true);
                        setIsEditMode(false);
                        setSelectedProgram(null);
                      }}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-add-line"></i>
                      Add Program
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div key={program.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              program.status === 'upcoming' ? 'bg-purple-100 text-purple-700' :
                              program.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{program.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <p><i className="ri-calendar-line mr-2"></i>Start: {program.start_date}</p>
                            <p><i className="ri-calendar-check-line mr-2"></i>End: {program.end_date}</p>
                            <p><i className="ri-map-pin-line mr-2"></i>{program.location}</p>
                            <p><i className="ri-group-line mr-2"></i>{program.participants} / {program.max_participants} participants</p>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-teal-600 h-2 rounded-full transition-all"
                                style={{ width: `${(program.participants / program.max_participants) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowProgramForm(true);
                              setIsEditMode(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap cursor-pointer"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowModal(true);
                            }}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
                    <p className="text-gray-600">View and respond to contact form submissions</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      {messages.filter(m => m.status === 'unread').length} Unread
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {messages.filter(m => m.status === 'replied').length} Replied
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`rounded-lg p-6 transition-colors cursor-pointer ${
                      message.status === 'unread' ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              message.status === 'unread' ? 'bg-red-100 text-red-700' :
                              message.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p><i className="ri-mail-line mr-2"></i>{message.email}</p>
                            <p><i className="ri-calendar-line mr-2"></i>{message.created_at}</p>
                          </div>
                          <p 
                            className="font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowModal(true);
                              if (message.status === 'unread') {
                                handleMessageAction(message.id, 'read');
                              }
                            }}
                          >
                            Subject: {message.subject}
                          </p>
                          <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowModal(true);
                              if (message.status === 'unread') {
                                handleMessageAction(message.id, 'read');
                              }
                            }}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                    <p className="text-gray-600">Create and manage blog posts</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {blogs.filter(b => b.status === 'published').length} Published
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                        {blogs.filter(b => b.status === 'draft').length} Drafts
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowBlogForm(true);
                        setIsEditMode(false);
                        setSelectedBlog(null);
                      }}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-add-line"></i>
                      Add Blog
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                      <div className="relative h-48">
                        <img 
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            blog.status === 'published' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                          }`}>
                            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                          </span>
                          <span className="px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-semibold">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <i className="ri-calendar-line"></i>
                          <span>{blog.created_at}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBlog(blog);
                              setShowBlogForm(true);
                              setIsEditMode(true);
                            }}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all whitespace-nowrap cursor-pointer"
                          >
                            <i className="ri-edit-line mr-2"></i>Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBlog(blog);
                              setShowModal(true);
                            }}
                            className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                          >
                            <i className="ri-eye-line mr-2"></i>View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Form Modal */}
      {showProgramForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Program' : 'Add New Program'}
              </h3>
              <button
                onClick={() => {
                  setShowProgramForm(false);
                  setSelectedProgram(null);
                  setIsEditMode(false);
                  setProgramImagePreview('');
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                // Parse objectives
                const objectivesText = formData.get('objectives') as string;
                const objectives = objectivesText ? objectivesText.split('\n').filter(o => o.trim()) : [];
                
                // Parse requirements
                const requirementsText = formData.get('requirements') as string;
                const requirements = requirementsText ? requirementsText.split('\n').filter(r => r.trim()) : [];
                
                // Parse benefits
                const benefitsText = formData.get('benefits') as string;
                const benefits = benefitsText ? benefitsText.split('\n').filter(b => b.trim()) : [];
                
                // Parse SDGs
                const sdgsText = formData.get('sdgs') as string;
                const sdgs = sdgsText ? sdgsText.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
                
                // Parse schedule
                const scheduleText = formData.get('schedule') as string;
                const schedule = scheduleText ? scheduleText.split('\n').filter(s => s.trim()).map(line => {
                  const [time, ...activityParts] = line.split(':');
                  return { time: time?.trim() || '', activity: activityParts.join(':').trim() || '' };
                }).filter(s => s.time && s.activity) : [];
                
                const data = {
                  title: formData.get('title') as string,
                  category: formData.get('category') as string,
                  description: formData.get('description') as string,
                  fullDescription: formData.get('fullDescription') as string,
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                  duration: formData.get('duration') as string,
                  maxParticipants: formData.get('maxParticipants') as string,
                  status: formData.get('status') as string,
                  location: formData.get('location') as string,
                  image: programImagePreview || (formData.get('image') as string),
                  objectives,
                  impact: formData.get('impact') as string,
                  sdgs,
                  requirements,
                  benefits,
                  schedule
                };
                
                if (isEditMode) {
                  handleUpdateProgram(data);
                } else {
                  handleAddProgram(data);
                }
              }} className="space-y-6">
                
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i className="ri-information-line text-teal-600"></i>
                    Basic Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Program Title *</label>
                    <input 
                      type="text"
                      name="title"
                      required
                      defaultValue={selectedProgram?.title || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter program title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select 
                      name="category"
                      required
                      defaultValue={selectedProgram?.category || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select a category</option>
                      <option value="Climate Action">Climate Action</option>
                      <option value="Youth Empowerment">Youth Empowerment</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Education">Education</option>
                      <option value="Community Development">Community Development</option>
                      <option value="Environmental Conservation">Environmental Conservation</option>
                      <option value="Advocacy">Advocacy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description *</label>
                    <textarea 
                      name="description"
                      rows={3}
                      required
                      defaultValue={selectedProgram?.description || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Brief description for cards (max 200 characters)"
                      maxLength={200}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description *</label>
                    <textarea 
                      name="fullDescription"
                      rows={6}
                      required
                      defaultValue={selectedProgram?.full_description || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Detailed program description"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Program Image *</label>
                    
                    {/* Error Message */}
                    {uploadError && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <i className="ri-error-warning-line text-red-600 text-lg mt-0.5"></i>
                        <p className="text-sm text-red-700">{uploadError}</p>
                      </div>
                    )}

                    {/* Image Preview */}
                    {(programImagePreview || selectedProgram?.image) && (
                      <div className="mb-4 relative">
                        <img 
                          src={programImagePreview || selectedProgram?.image} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProgramImagePreview('');
                            setUploadError('');
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-3 mb-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-all text-center">
                          <i className="ri-upload-cloud-line text-2xl text-gray-400 mb-2"></i>
                          <p className="text-sm text-gray-600">
                            {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleProgramImageUpload(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* URL Input as Alternative */}
                    <div className="relative">
                      <input 
                        type="url"
                        name="image"
                        defaultValue={selectedProgram?.image || ''}
                        value={programImagePreview}
                        onChange={(e) => {
                          setProgramImagePreview(e.target.value);
                          setUploadError('');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Or paste image URL here"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Use Stable Diffusion format like https://imageurl/api/image%&width=800&height=600&seq=prog1&orientation=landscape
                    </p>
                  </div>
                </div>

                {/* Schedule & Location */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i className="ri-calendar-line text-teal-600"></i>
                    Schedule & Location
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                      <input 
                        type="date"
                        name="startDate"
                        required
                        defaultValue={selectedProgram?.start_date || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                      <input 
                        type="date"
                        name="endDate"
                        required
                        defaultValue={selectedProgram?.end_date || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                    <input 
                      type="text"
                      name="duration"
                      required
                      defaultValue={selectedProgram?.duration || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., 3 months, 6 weeks, 1 year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <input 
                      type="text"
                      name="location"
                      required
                      defaultValue={selectedProgram?.location || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Schedule</label>
                    <textarea 
                      name="schedule"
                      rows={5}
                      defaultValue={selectedProgram?.schedule?.map(s => `${s.time}: ${s.activity}`).join('\n') || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Enter schedule (one per line)&#10;Example:&#10;9:00 AM: Opening Session&#10;10:00 AM: Workshop&#10;12:00 PM: Lunch Break"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Format: Time: Activity (one per line)</p>
                  </div>
                </div>

                {/* Program Details */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i className="ri-file-list-line text-teal-600"></i>
                    Program Details
                  </h4>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Objectives</label>
                    <textarea 
                      name="objectives"
                      rows={5}
                      defaultValue={selectedProgram?.objectives?.join('\n') || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Enter objectives (one per line)"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Impact Statement</label>
                    <textarea 
                      name="impact"
                      rows={3}
                      defaultValue={selectedProgram?.impact || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Describe the expected impact of this program"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Related SDGs</label>
                    <input 
                      type="text"
                      name="sdgs"
                      defaultValue={selectedProgram?.sdgs?.join(', ') || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter SDG numbers separated by commas (e.g., 1, 4, 13)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter SDG numbers (1-17) separated by commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                    <textarea 
                      name="requirements"
                      rows={5}
                      defaultValue={selectedProgram?.requirements?.join('\n') || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Enter requirements (one per line)"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits</label>
                    <textarea 
                      name="benefits"
                      rows={5}
                      defaultValue={selectedProgram?.benefits?.join('\n') || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Enter benefits (one per line)"
                    ></textarea>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i className="ri-settings-line text-teal-600"></i>
                    Settings
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Max Participants *</label>
                      <input 
                        type="number"
                        name="maxParticipants"
                        required
                        min="1"
                        defaultValue={selectedProgram?.max_participants || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                      <select 
                        name="status"
                        required
                        defaultValue={selectedProgram?.status || 'upcoming'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowProgramForm(false);
                      setSelectedProgram(null);
                      setIsEditMode(false);
                      setProgramImagePreview('');
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                  >
                    {isEditMode ? 'Update Program' : 'Add Program'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blog Form Modal */}
      {showBlogForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h3>
              <button
                onClick={() => {
                  setShowBlogForm(false);
                  setSelectedBlog(null);
                  setIsEditMode(false);
                  setBlogImagePreview('');
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  title: formData.get('title'),
                  excerpt: formData.get('excerpt'),
                  content: formData.get('content'),
                  image: blogImagePreview || formData.get('image'),
                  category: formData.get('category'),
                  status: formData.get('status'),
                  author: formData.get('author'),
                  published_date: formData.get('published_date')
                };
                if (isEditMode) {
                  handleUpdateBlog(data);
                } else {
                  handleAddBlog(data);
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title *</label>
                  <input 
                    type="text"
                    name="title"
                    required
                    defaultValue={selectedBlog?.title || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter blog title"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                    <input 
                      type="text"
                      name="author"
                      required
                      defaultValue={selectedBlog?.author || 'YM4SDGs Team'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date *</label>
                    <input 
                      type="date"
                      name="published_date"
                      required
                      defaultValue={selectedBlog?.published_date || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt *</label>
                  <textarea 
                    name="excerpt"
                    rows={2}
                    required
                    maxLength={200}
                    defaultValue={selectedBlog?.excerpt || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Brief summary (max 200 characters)"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                  <textarea 
                    name="content"
                    rows={8}
                    required
                    defaultValue={selectedBlog?.content || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter full blog content"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Image *</label>
                    
                    {/* Error Message */}
                    {uploadError && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <i className="ri-error-warning-line text-red-600 text-lg mt-0.5"></i>
                        <p className="text-sm text-red-700">{uploadError}</p>
                      </div>
                    )}

                    {/* Image Preview */}
                    {(blogImagePreview || selectedBlog?.image) && (
                      <div className="mb-4 relative">
                        <img 
                          src={blogImagePreview || selectedBlog?.image} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBlogImagePreview('');
                            setUploadError('');
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-3 mb-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-all text-center">
                          <i className="ri-upload-cloud-line text-2xl text-gray-400 mb-2"></i>
                          <p className="text-sm text-gray-600">
                            {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleBlogImageUpload(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* URL Input as Alternative */}
                    <div className="relative">
                      <input 
                        type="url"
                        name="image"
                        defaultValue={selectedBlog?.image || ''}
                        value={blogImagePreview}
                        onChange={(e) => {
                          setBlogImagePreview(e.target.value);
                          setUploadError('');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Or paste image URL here"
                      />
                    </div>
                  </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <input 
                      type="text"
                      name="category"
                      required
                      defaultValue={selectedBlog?.category || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Events, Climate Action"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select 
                      name="status"
                      required
                      defaultValue={selectedBlog?.status || 'draft'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowBlogForm(false);
                      setSelectedBlog(null);
                      setIsEditMode(false);
                      setBlogImagePreview('');
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                  >
                    {isEditMode ? 'Update Blog' : 'Add Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedVolunteer && 'Volunteer Details'}
                {selectedProgram && 'Program Details'}
                {selectedMessage && 'Message Details'}
                {selectedBlog && 'Blog Details'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVolunteer(null);
                  setSelectedProgram(null);
                  setSelectedMessage(null);
                  setSelectedBlog(null);
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6">
              {selectedVolunteer && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <p className="text-gray-900">{selectedVolunteer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{selectedVolunteer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <p className="text-gray-900">{selectedVolunteer.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <p className="text-gray-900">{selectedVolunteer.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Applied Date</label>
                    <p className="text-gray-900">{selectedVolunteer.applied_date}</p>
                  </div>
                  {selectedVolunteer.areas_of_interest && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Areas of Interest</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedVolunteer.areas_of_interest.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedVolunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      selectedVolunteer.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                    </span>
                  </div>

                  {selectedVolunteer.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleVolunteerAction(selectedVolunteer.id, 'approved')}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-check-line mr-2"></i>Approve
                      </button>
                      <button
                        onClick={() => handleVolunteerAction(selectedVolunteer.id, 'rejected')}
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-close-line mr-2"></i>Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteVolunteer(selectedVolunteer.id)}
                    className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>Delete Application
                  </button>
                </div>
              )}

              {selectedProgram && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Program Title</label>
                    <p className="text-gray-900 text-lg font-semibold">{selectedProgram.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <p className="text-gray-900">{selectedProgram.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                      <p className="text-gray-900">{selectedProgram.start_date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                      <p className="text-gray-900">{selectedProgram.end_date}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <p className="text-gray-900">{selectedProgram.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Participants</label>
                    <p className="text-gray-900">{selectedProgram.participants} / {selectedProgram.max_participants}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className="bg-teal-600 h-3 rounded-full transition-all"
                        style={{ width: `${(selectedProgram.participants / selectedProgram.max_participants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedProgram.status === 'upcoming' ? 'bg-purple-100 text-purple-700' :
                      selectedProgram.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProgram.status.charAt(0).toUpperCase() + selectedProgram.status.slice(1)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteProgram(selectedProgram.id)}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>Delete Program
                  </button>
                </div>
              )}

              {selectedMessage && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                    <p className="text-gray-900 font-semibold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <p className="text-gray-900">{selectedMessage.created_at}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <p className="text-gray-900 font-semibold">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedMessage.status === 'unread' ? 'bg-red-100 text-red-700' :
                      selectedMessage.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {selectedMessage.status !== 'replied' && (
                      <button
                        onClick={() => {
                          handleMessageAction(selectedMessage.id, 'replied');
                          setShowModal(false);
                          setSelectedMessage(null);
                        }}
                        className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-reply-line mr-2"></i>Mark as Replied
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-delete-bin-line mr-2"></i>Delete
                    </button>
                  </div>
                </div>
              )}

              {selectedBlog && (
                <div className="space-y-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img 
                      src={selectedBlog.image}
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <p className="text-gray-900 text-xl font-bold">{selectedBlog.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                        {selectedBlog.category}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedBlog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedBlog.status.charAt(0).toUpperCase() + selectedBlog.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <p className="text-gray-900">{selectedBlog.created_at}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
                    <p className="text-gray-900">{selectedBlog.excerpt}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedBlog.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteBlog(selectedBlog.id)}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>Delete Blog
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
