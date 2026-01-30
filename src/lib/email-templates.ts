/**
 * Email Templates for Accountability Bet Waitlist
 * Phase 2: Landing Page & Waitlist
 */

const BRAND_COLORS = {
  purple: '#9333ea',
  purpleDark: '#7c3aed',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  white: '#ffffff',
};

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    margin: 0;
    padding: 0;
    background-color: ${BRAND_COLORS.grayLight};
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .card {
    background-color: ${BRAND_COLORS.white};
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  .logo {
    font-size: 24px;
    font-weight: 700;
    color: ${BRAND_COLORS.purple};
    text-align: center;
    margin-bottom: 32px;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 16px 0;
    text-align: center;
  }
  p {
    color: ${BRAND_COLORS.gray};
    margin: 0 0 16px 0;
    font-size: 16px;
  }
  .button {
    display: inline-block;
    background: linear-gradient(135deg, ${BRAND_COLORS.purple} 0%, ${BRAND_COLORS.purpleDark} 100%);
    color: ${BRAND_COLORS.white} !important;
    text-decoration: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin: 24px 0;
  }
  .button:hover {
    opacity: 0.9;
  }
  .button-container {
    text-align: center;
  }
  .footer {
    text-align: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    font-size: 14px;
    color: #9ca3af;
  }
  .footer a {
    color: ${BRAND_COLORS.purple};
    text-decoration: none;
  }
  .highlight {
    background-color: ${BRAND_COLORS.grayLight};
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  }
  .position {
    font-size: 48px;
    font-weight: 800;
    color: ${BRAND_COLORS.purple};
    text-align: center;
    margin: 16px 0;
  }
`;

interface WaitlistConfirmationEmailProps {
  confirmationUrl: string;
  position: number;
  siteUrl: string;
}

export function getWaitlistConfirmationEmail({
  confirmationUrl,
  position,
  siteUrl,
}: WaitlistConfirmationEmailProps): { subject: string; html: string; text: string } {
  const subject = 'Confirm your spot on the Accountability Bet waitlist';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">Accountability Bet</div>

      <h1>Confirm Your Spot</h1>

      <p style="text-align: center;">
        You're one click away from joining the waitlist for Accountability Bet -
        the app that helps you achieve your goals with real financial stakes.
      </p>

      <div class="highlight">
        <p style="text-align: center; margin-bottom: 8px; font-size: 14px;">Your current position:</p>
        <div class="position">#${position}</div>
      </div>

      <div class="button-container">
        <a href="${confirmationUrl}" class="button">Confirm My Email</a>
      </div>

      <p style="text-align: center; font-size: 14px; color: #9ca3af;">
        This link expires in 24 hours.
      </p>

      <div class="footer">
        <p>
          If you didn't sign up for Accountability Bet, you can safely ignore this email.
        </p>
        <p style="margin-top: 16px;">
          <a href="${siteUrl}">accountabilitybet.ch</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Confirm Your Spot on Accountability Bet

You're one click away from joining the waitlist for Accountability Bet - the app that helps you achieve your goals with real financial stakes.

Your current position: #${position}

Click here to confirm your email:
${confirmationUrl}

This link expires in 24 hours.

---

If you didn't sign up for Accountability Bet, you can safely ignore this email.

accountabilitybet.ch
`;

  return { subject, html, text };
}

interface WaitlistWelcomeEmailProps {
  position: number;
  referralCode: string;
  referralUrl: string;
  siteUrl: string;
}

export function getWaitlistWelcomeEmail({
  position,
  referralCode,
  referralUrl,
  siteUrl,
}: WaitlistWelcomeEmailProps): { subject: string; html: string; text: string } {
  const subject = "You're on the list! Welcome to Accountability Bet";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">Accountability Bet</div>

      <h1>You're In!</h1>

      <p style="text-align: center;">
        Your email is confirmed. You're officially on the Accountability Bet waitlist!
      </p>

      <div class="highlight">
        <p style="text-align: center; margin-bottom: 8px; font-size: 14px;">Your position:</p>
        <div class="position">#${position}</div>
      </div>

      <p style="text-align: center;">
        <strong>Want to move up the list?</strong><br>
        Share your referral link with friends. Each friend who joins moves you up.
      </p>

      <div class="highlight" style="text-align: center;">
        <p style="font-size: 14px; margin-bottom: 8px;">Your referral link:</p>
        <p style="font-size: 16px; font-weight: 600; color: ${BRAND_COLORS.purple}; word-break: break-all;">
          ${referralUrl}
        </p>
      </div>

      <p style="text-align: center; font-size: 14px;">
        Your referral code: <strong>${referralCode}</strong>
      </p>

      <div class="footer">
        <p>
          We'll email you when it's your turn to join.
        </p>
        <p style="margin-top: 16px;">
          <a href="${siteUrl}">accountabilitybet.ch</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const text = `
You're In! Welcome to Accountability Bet

Your email is confirmed. You're officially on the Accountability Bet waitlist!

Your position: #${position}

---

Want to move up the list?

Share your referral link with friends. Each friend who joins moves you up.

Your referral link: ${referralUrl}
Your referral code: ${referralCode}

---

We'll email you when it's your turn to join.

accountabilitybet.ch
`;

  return { subject, html, text };
}
