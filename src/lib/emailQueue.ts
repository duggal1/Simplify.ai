import Bull from 'bull';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { db } from '@/utils/dbConfig';
import { emailJobs } from '@/utils/schema';
import Redis from 'ioredis';
import { promisify } from 'util';
import dns from 'dns';
import pLimit from 'p-limit';

const resolveMx = promisify(dns.resolveMx);

class RobustRedisClient {
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isReconnecting = false;
  private client: Redis;
  constructor(redisUrl: string) {
    this.client = this.createClient(redisUrl);
  }

  private createClient(redisUrl: string): Redis {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 10) {
          return null; // Stop retrying after 10 attempts
        }
        return Math.min(times * 100, 3000);
      },
    });

    client.on('error', this.handleError.bind(this));
    client.on('connect', () => console.log('Connected to Redis'));
    client.on('ready', () => console.log('Redis client ready'));
    client.on('close', () => console.log('Redis connection closed'));

    return client;
  }

  private handleError(error: Error) {
    console.error('Redis error:', error);
    if (!this.isReconnecting) {
      this.isReconnecting = true;
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect to Redis...');
      this.client.disconnect();
      this.client = this.createClient(process.env.REDIS_URL!);
      this.isReconnecting = false;
    }, 5000) as unknown as NodeJS.Timeout;
  }

  getClient(): Redis {
    return this.client;
  }
}

const robustRedisClient = new RobustRedisClient(process.env.REDIS_URL!);

const emailQueue = new Bull('emailQueue', {
  createClient: (type) => {
    switch (type) {
      case 'client':
        return robustRedisClient.getClient();
      case 'subscriber':
        return robustRedisClient.getClient().duplicate();
      default:
        return robustRedisClient.getClient().duplicate();
    }
  },
  limiter: {
    max: 100,  // Increased from 3 to 100
    duration: 1000
  },
  defaultJobOptions: {
    attempts: 7,
    backoff: {
      type: 'exponential',
      delay: 10000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

let transporter: nodemailer.Transporter;

async function initializeTransporter(retries = 5): Promise<void> {
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: true
      },
      pool: true,
      maxConnections: 100,  // Increased from 5 to 100
      maxMessages: Infinity
    });

    await transporter.verify();
    console.log('✅ Email transporter verified and ready');
  } catch (error) {
    console.error('❌ Transporter initialization failed:', error);
    if (retries > 0) {
      console.log(`Retrying transporter initialization in 10 seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      await initializeTransporter(retries - 1);
    } else {
      throw new Error('Failed to initialize email transporter after multiple attempts');
    }
  }
}

// Initialize transporter immediately
initializeTransporter().catch(error => {
  console.error('Critical error initializing transporter:', error);
  process.exit(1);
});

async function isValidEmail(email: string): Promise<boolean> {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return false;

  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    console.error(`Error validating email ${email}:`, error);
    return false;
  }
}

function createStyledHtmlEmail(textContent: string | undefined, websiteUrl: string, uploadedImages: string[]): string {
  const content = textContent || 'Email content not available.';

  // Create image sections based on number of images
  const imageSection = uploadedImages.length > 0 ? `
    <div class="images-container">
      ${uploadedImages.map((imgUrl, index) => `
        <div class="image-wrapper image-${index + 1}">
          <img src="${imgUrl}" alt="Email Image ${index + 1}" class="email-image" />
        </div>
      `).join('')}
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email from Corely.io</title>
        <style>
            body {
                font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f0f4f8;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #ff80b5, #9089fc, #3b82f6);
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: 0.5px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .image {
                width: 100%;
                height: auto;
                border-bottom: 1px solid #e5e7eb;
            }
            .content {
                padding: 40px 30px;
                background-color: #ffffff;
            }
            .content p {
                margin-bottom: 20px;
                font-size: 16px;
                line-height: 1.8;
                color: #4b5563;
                text-align: justify;
                letter-spacing: 0.3px;
                border-left: 3px solid #e5e7eb;
                padding-left: 15px;
            }
            .cta {
                text-align: center;
                margin: 30px 0;
                padding: 0 20px;
            }
            .cta a {
                display: inline-block;
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 700;
                font-size: 18px;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }
            .cta a:hover {
                background: linear-gradient(45deg, #8b5cf6, #3b82f6);
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
            }
            .footer {
                background: linear-gradient(to right, #f9fafb, #f3f4f6);
                padding: 30px 20px;
                text-align: center;
                font-size: 14px;
                color: #6b7280;
            }
            .footer a {
                color: #3b82f6;
                text-decoration: none;
                font-weight: 600;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #4b5563;
                text-decoration: none;
                transition: color 0.3s;
                font-weight: 500;
            }
            .social-links a:hover {
                color: #3b82f6;
            }
            
            .images-container {
                padding: 20px;
                display: block;
                width: 100%;
            }
            
            .image-wrapper {
                margin-bottom: 20px;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .email-image {
                width: 100%;
                height: auto;
                display: block;
                transition: transform 0.3s ease;
            }
            
            .image-1 { margin-top: 0; }
            .image-2 { margin: 30px 0; }
            .image-3 { margin-bottom: 30px; }
            
            @media (max-width: 600px) {
                .image-wrapper {
                    margin: 15px 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Hello, {{firstName}}!</h1>
            </div>
            
            <!-- First image placed at the top -->
            ${uploadedImages.length > 0 ? `
                <div class="image-wrapper image-1">
                    <img src="${uploadedImages[0]}" alt="Main Image" class="email-image" />
                </div>
            ` : ''}
            
            <div class="content">
                ${content.split('\n').map(paragraph => `
                    <p>${paragraph}</p>
                `).join('')}
                
                <!-- Second image placed in the middle of the content -->
                ${uploadedImages.length > 1 ? `
                    <div class="image-wrapper image-2">
                        <img src="${uploadedImages[1]}" alt="Secondary Image" class="email-image" />
                    </div>
                ` : ''}
                
                <!-- Third image placed near the bottom -->
                ${uploadedImages.length > 2 ? `
                    <div class="image-wrapper image-3">
                        <img src="${uploadedImages[2]}" alt="Additional Image" class="email-image" />
                    </div>
                ` : ''}
            </div>
            
            <div class="cta">
                <a href="${websiteUrl}">Experience Corely.io</a>
            </div>
            <div class="footer">
                <p>Visit our website: <a href="${websiteUrl}">${websiteUrl}</a></p>
                <div class="social-links">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">LinkedIn</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

emailQueue.process(async (job) => {
  console.log(`🚀 Starting job ${job.id}`);
  const { recipients, subject, htmlContent, textContent, websiteUrl, uploadedImages } = job.data;
  
  if (!recipients?.length) {
    throw new Error('No recipients provided');
  }

  // Use htmlContent if provided, otherwise generate it from textContent
  const emailContent = htmlContent || createStyledHtmlEmail(textContent, websiteUrl, uploadedImages);

  const sendEmail = async (recipient: { email: string, firstName: string }, attemptNumber = 1): Promise<boolean> => {
    try {
      if (!(await isValidEmail(recipient.email))) {
        console.warn(`Invalid email address: ${recipient.email}`);
        return false;
      }

      // Personalize the content for each recipient
      const personalizedHtmlContent = emailContent.replace(/{{firstName}}/g, recipient.firstName);

      const info: SentMessageInfo = await transporter.sendMail({
        from: {
          name: process.env.EMAIL_SENDER_NAME || 'Corely.io',
          address: process.env.NODE_MAILER_EMAIL!
        },
        to: recipient.email,
        subject,
        html: personalizedHtmlContent,
        text: textContent ? textContent.replace(/{{firstName}}/g, recipient.firstName) : undefined
      });

      console.log(`✅ Email sent successfully to ${recipient.email}. Message ID: ${info.messageId}`);
      
      await db.insert(emailJobs).values({
        email: recipient.email,
        status: 'sent',
        sentAt: new Date(),
        error: '',
        ip: job.data.ip || '',
        createdAt: new Date(),
        recipientCount: 1
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${recipient.email} (attempt ${attemptNumber}):`, error);

      await db.insert(emailJobs).values({
        email: recipient.email,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: job.data.ip || '',
        createdAt: new Date(),
        recipientCount: 1
      });

      if (attemptNumber < 5) {
        const delay = Math.min(attemptNumber * 10000, 60000);
        console.log(`🔄 Retrying email to ${recipient.email} in ${delay/1000} seconds... (attempt ${attemptNumber + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendEmail(recipient, attemptNumber + 1);
      }

      return false;
    }
  };

  const limit = pLimit(100);  // Process 100 emails concurrently
  const emailPromises = recipients.map((recipient: { email: string, firstName: string }) => 
    limit(() => sendEmail(recipient))
  );

  const results = await Promise.all(emailPromises);

  const successCount = results.filter(result => result).length;
  const failureCount = results.length - successCount;

  console.log(`✅ Job completed. Success: ${successCount}, Failed: ${failureCount}`);
  return {
    success: true,
    totalProcessed: recipients.length,
    successCount,
    failureCount
  };
});

emailQueue.on('failed', async (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
  await db.insert(emailJobs).values({
    email: job.data.email || '',
    status: 'job_failed',
    error: err.message,
    ip: job.data.ip || '',
    createdAt: new Date(),
    recipientCount: 0
  }).catch(console.error);
});

emailQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

emailQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

emailQueue.on('stalled', (job) => {
  console.warn(`⚠ Job ${job.id} has stalled - will be retried`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing queue and connections...');
  await emailQueue.close();
  await robustRedisClient.getClient().quit();
  process.exit(0);
});

export default emailQueue;
export { createStyledHtmlEmail };
