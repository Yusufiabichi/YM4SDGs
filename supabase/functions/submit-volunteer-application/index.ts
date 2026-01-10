import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { 
      name,
      first_name,
      last_name,
      email, 
      phone, 
      role,
      type,
      areas_of_interest,
      experience,
      motivation,
      organization,
      portfolio
    } = await req.json();

    // Handle both formats: combined name or separate first/last names
    let firstName = first_name;
    let lastName = last_name;
    
    if (name && !first_name && !last_name) {
      const nameParts = name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Validate required fields
    if (!firstName || !email || !phone || (!role && !type)) {
      return new Response(
        JSON.stringify({ error: 'First name, email, phone, and role are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert volunteer application into database
    const { data, error } = await supabaseClient
      .from('volunteers')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          type: type || role,
          areas_of_interest: areas_of_interest || [],
          experience: experience || '',
          motivation: motivation || '',
          organization: organization || '',
          portfolio_social: portfolio || '',
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});