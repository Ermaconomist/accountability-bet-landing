/**
 * API Route: Confirm Waitlist
 * GET /api/waitlist/confirm?token=xxx
 *
 * Verifies the confirmation token and marks the email as confirmed.
 * Redirects to success page on completion.
 */

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseAdmin, type ConfirmWaitlistResult } from '../../../lib/supabase';
import { getWaitlistWelcomeEmail } from '../../../lib/email-templates';

export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get('token');
  const siteUrl = import.meta.env.SITE_URL || 'https://accountabilitybet.ch';

  if (!token) {
    return redirect('/waitlist/error?reason=missing_token');
  }

  try {
    // Call Supabase function to confirm
    const { data, error } = await supabaseAdmin.rpc('confirm_waitlist', {
      p_token: token,
    });

    if (error) {
      console.error('Supabase error:', error);
      return redirect('/waitlist/error?reason=server_error');
    }

    const result = data?.[0] as ConfirmWaitlistResult;

    if (!result?.success) {
      const reason = result?.error_message?.includes('expired')
        ? 'expired'
        : result?.error_message?.includes('Invalid')
        ? 'invalid'
        : 'unknown';
      return redirect(`/waitlist/error?reason=${reason}`);
    }

    // Send welcome email with referral code
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey && result.email && result.referral_code) {
      try {
        const resend = new Resend(resendApiKey);
        const referralUrl = `${siteUrl}?ref=${result.referral_code}`;

        const emailContent = getWaitlistWelcomeEmail({
          position: result.position || 1,
          referralCode: result.referral_code,
          referralUrl,
          siteUrl,
        });

        await resend.emails.send({
          from: 'Accountability Bet <noreply@accountabilitybet.ch>',
          to: result.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Don't fail - they're still confirmed
      }
    }

    // Redirect to success page with position and referral code
    const successParams = new URLSearchParams();
    if (result.position) successParams.set('position', result.position.toString());
    if (result.referral_code) successParams.set('code', result.referral_code);

    return redirect(`/waitlist/confirmed?${successParams.toString()}`);
  } catch (err) {
    console.error('Unexpected error:', err);
    return redirect('/waitlist/error?reason=server_error');
  }
};
