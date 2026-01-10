
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web'
    }
  }
});

// Add error handler for auth errors
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

// Types
export interface Program {
  id: number;
  title: string;
  category: string;
  duration: string;
  participants: string;
  image: string;
  description: string;
  full_description: string;
  objectives: string[];
  impact: string;
  sdgs: number[];
  requirements: string[];
  benefits: string[];
  schedule: Array<{ time: string; activity: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramRegistration {
  id?: number;
  program_id: number;
  program_title: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  organization?: string;
  experience: string;
  motivation: string;
  availability: string;
  created_at?: string;
}
