/**
 * API Route: Get Waitlist Count
 * GET /api/waitlist/count
 *
 * Returns the current number of confirmed waitlist entries.
 * Returns 0 if count is less than 100 (hide small numbers).
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

// Cache the count for 5 minutes
let cachedCount: number | null = null;
let cacheExpiry = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const GET: APIRoute = async () => {
  const now = Date.now();

  // Return cached value if still valid
  if (cachedCount !== null && now < cacheExpiry) {
    return new Response(
      JSON.stringify({
        success: true,
        count: cachedCount,
        cached: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  }

  try {
    // Call Supabase function to get count
    const { data, error } = await supabaseAdmin.rpc('get_waitlist_count');

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          count: 0,
          error: 'Failed to get count',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Hide small numbers (return 0 if less than 100)
    const rawCount = data || 0;
    const displayCount = rawCount >= 100 ? rawCount : 0;

    // Update cache
    cachedCount = displayCount;
    cacheExpiry = now + CACHE_TTL;

    return new Response(
      JSON.stringify({
        success: true,
        count: displayCount,
        cached: false,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        count: 0,
        error: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
