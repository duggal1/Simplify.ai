import { NextRequest } from 'next/server';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { emailJobs } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { Resend } from 'resend';

// Vercel Edge Runtime Config
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Initialize Resend with default domain
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation schema
const newsletterSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(100, 'Email too long')
    .toLowerCase()
    .trim()
    .refine(email => email.includes('.'), 'Invalid email domain')
    .refine(email => !email.includes('temp') && !email.includes('disposable'), 'Temporary emails not allowed'),
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function for welcome email HTML
function getWelcomeEmailHtml(email: string): string {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Our Newsletter!</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
        <h1>Welcome! 🎉</h1>
        <p>Thanks for subscribing!</p>
        <p>Email: ${email}</p>
      </body>
    </html>`;
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

// POST handler for newsletter subscription
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();

  try {
    // Get IP address
    const ip = headers().get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // Parse and validate request
    const body = await req.json();
    const { email } = newsletterSchema.parse(body);

    // Check for existing subscription
    const existing = await db
      .select()
      .from(emailJobs)
      .where(eq(emailJobs.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 409, headers: corsHeaders }
      );
    }

    // Create subscription
    await db.insert(emailJobs).values({
      email,
      status: 'pending',
      ip,
      recipientCount: 1,
      createdAt: new Date(),
    });

    // Send welcome email
    try {
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev', // Using Resend's default domain
        to: email,
        subject: 'Welcome to Our Newsletter!',
        html: getWelcomeEmailHtml(email),
        headers: {
          'X-Request-ID': requestId,
        },
      });

      // Update status to sent
      await db
        .update(emailJobs)
        .set({ 
          status: 'sent',
          sentAt: new Date(),
          error: null
        })
        .where(eq(emailJobs.email, email));

      return NextResponse.json(
        { 
          message: 'Subscribed successfully',
          email,
          id: emailResult.data?.id
        },
        { 
          status: 201,
          headers: {
            ...corsHeaders,
            'X-Request-ID': requestId
          }
        }
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      await db
        .update(emailJobs)
        .set({ 
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Failed to send'
        })
        .where(eq(emailJobs.email, email));

      return NextResponse.json(
        { message: 'Subscribed but email failed', email },
        { status: 207, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Subscription error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
