/**
 * Supabase Client for Accountability Bet Landing Page
 * Uses service role key for server-side operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase environment variables not configured');
}

// Service role client for server-side operations (API routes)
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Type definitions for waitlist functions
export interface JoinWaitlistResult {
  success: boolean;
  waitlist_id: string | null;
  confirmation_token: string | null;
  position: number | null;
  error_message: string | null;
}

export interface ConfirmWaitlistResult {
  success: boolean;
  email: string | null;
  position: number | null;
  referral_code: string | null;
  error_message: string | null;
}

export interface ReferrerInfo {
  found: boolean;
  referrer_email: string | null;
  referral_count: number | null;
}
