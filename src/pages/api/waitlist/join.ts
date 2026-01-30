/**
 * API Route: Join Waitlist
 * POST /api/waitlist/join
 *
 * Adds an email to the waitlist and sends a confirmation email.
 */

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseAdmin, type JoinWaitlistResult } from '../../../lib/supabase';
import { getWaitlistConfirmationEmail } from '../../../lib/email-templates';

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Rate limiting
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      email,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer,
      landing_page,
      referred_by_code,
    } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email is required.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Call Supabase function to join waitlist
    const { data, error } = await supabaseAdmin.rpc('join_waitlist', {
      p_email: email,
      p_utm_source: utm_source || null,
      p_utm_medium: utm_medium || null,
      p_utm_campaign: utm_campaign || null,
      p_utm_term: utm_term || null,
      p_utm_content: utm_content || null,
      p_referrer: referrer || null,
      p_landing_page: landing_page || null,
      p_referred_by_code: referred_by_code || null,
    });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to join waitlist. Please try again.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = data?.[0] as JoinWaitlistResult;

    if (!result?.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result?.error_message || 'Failed to join waitlist.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Send confirmation email
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const siteUrl = import.meta.env.SITE_URL || 'https://accountabilitybet.ch';

    if (resendApiKey && result.confirmation_token) {
      try {
        const resend = new Resend(resendApiKey);
        const confirmationUrl = `${siteUrl}/api/waitlist/confirm?token=${result.confirmation_token}`;

        const emailContent = getWaitlistConfirmationEmail({
          confirmationUrl,
          position: result.position || 1,
          siteUrl,
        });

        await resend.emails.send({
          from: 'Accountability Bet <noreply@accountabilitybet.ch>',
          to: email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Don't fail the request if email fails - they're still on the waitlist
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        position: result.position,
        message: result.error_message || 'Check your email to confirm your spot!',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
