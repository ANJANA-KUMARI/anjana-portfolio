import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import { access, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(serverRoot, '..');
const portfolioPath = path.join(serverRoot, 'data', 'portfolio.json');
const messagesPath = path.join(serverRoot, 'data', 'messages.json');
const clientDistPath = path.join(projectRoot, 'client', 'dist');

const app = express();
const port = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed by CORS.'));
    },
  }),
);
app.use(express.json({ limit: '32kb' }));

const submissionWindows = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function contactRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || 'unknown';
  const recentRequests = (submissionWindows.get(key) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    res.status(429).json({
      message: 'Too many messages were submitted. Please wait 15 minutes and try again.',
    });
    return;
  }

  recentRequests.push(now);
  submissionWindows.set(key, recentRequests);
  next();
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function cleanMultilineText(value) {
  return typeof value === 'string'
    ? value
        .trim()
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
    : '';
}

function validateContact(body) {
  const contact = {
    name: cleanText(body.name),
    email: cleanText(body.email).toLowerCase(),
    subject: cleanText(body.subject),
    message: cleanMultilineText(body.message),
    company: cleanText(body.company),
  };

  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (contact.name.length < 2 || contact.name.length > 80) {
    errors.push('Name must be between 2 and 80 characters.');
  }
  if (!emailPattern.test(contact.email) || contact.email.length > 160) {
    errors.push('Enter a valid email address.');
  }
  if (contact.subject.length < 3 || contact.subject.length > 120) {
    errors.push('Subject must be between 3 and 120 characters.');
  }
  if (contact.message.length < 10 || contact.message.length > 2000) {
    errors.push('Message must be between 10 and 2000 characters.');
  }

  return { contact, errors };
}

let messageWriteQueue = Promise.resolve();

function appendMessage(message) {
  messageWriteQueue = messageWriteQueue.then(async () => {
    let messages = [];

    try {
      messages = JSON.parse(await readFile(messagesPath, 'utf8'));
      if (!Array.isArray(messages)) messages = [];
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    messages.push(message);
    const temporaryPath = `${messagesPath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(messages, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, messagesPath);
  });

  return messageWriteQueue;
}

async function notifyWebhook(message) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'portfolio.contact.created',
      data: message,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned HTTP ${response.status}.`);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'portfolio-api', timestamp: new Date().toISOString() });
});

app.get('/api/portfolio', async (_req, res, next) => {
  try {
    const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

app.post('/api/contact', contactRateLimit, async (req, res, next) => {
  try {
    const { contact, errors } = validateContact(req.body || {});

    // Honeypot: respond successfully to bots without saving the message.
    if (contact.company) {
      res.status(201).json({ message: 'Thank you. Your message has been received.' });
      return;
    }

    if (errors.length > 0) {
      res.status(400).json({ message: errors[0], errors });
      return;
    }

    const message = {
      id: randomUUID(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      createdAt: new Date().toISOString(),
      status: 'NEW',
    };

    await appendMessage(message);

    try {
      await notifyWebhook(message);
    } catch (webhookError) {
      console.error('Contact webhook failed:', webhookError.message);
    }

    res.status(201).json({ message: 'Thank you. Your message has been sent successfully.' });
  } catch (error) {
    next(error);
  }
});

async function configureProductionFrontend() {
  try {
    await access(clientDistPath);
    app.use(express.static(clientDistPath, { maxAge: '1d', etag: true }));

    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  } catch {
    if (isProduction) {
      console.warn('Frontend build was not found. Run npm run build before npm start.');
    }
  }
}

await configureProductionFrontend();

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.message === 'Origin is not allowed by CORS.' ? 403 : 500;
  res.status(status).json({
    message: status === 500 ? 'An unexpected server error occurred.' : error.message,
  });
});

app.listen(port, () => {
  console.log(`Portfolio API running at http://localhost:${port}`);
});
