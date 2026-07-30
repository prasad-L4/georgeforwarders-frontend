const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

// Check if required environment variables are set
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../assets')));
app.set('view engine', 'ejs');

// Sessions
app.use(
  session({
      secret: process.env.SESSION_SECRET || 'default-secret-key', 
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
      })
  })
);
app.use('/uploads', express.static('uploads'));

app.locals.resolveImage = function (url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  if (url.startsWith('images/')) return `/${url}`;
  return `/uploads/${url}`;
};

/** Render stored service HTML, or wrap plain text into paragraphs for legacy entries */
app.locals.formatServiceHtml = function (content) {
  if (!content) return '';
  const trimmed = String(content).trim();
  if (!trimmed) return '';
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;

  const escape = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const formatChunk = (chunk) => {
    const text = chunk.trim();
    if (!text) return '';
    if (
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith('\u201c') && text.endsWith('\u201d'))
    ) {
      const quote = text.replace(/^["\u201c]|["\u201d]$/g, '');
      return `<blockquote class="service-intro-quote"><p>${escape(quote)}</p></blockquote>`;
    }
    const qa = text.match(/^((?:What|Why|Where|How)[^?]*\?)\s*([\s\S]*)$/i);
    if (qa) {
      const body = qa[2].trim();
      return `<h2>${escape(qa[1])}</h2>${body ? `<p>${escape(body)}</p>` : ''}`;
    }
    if (text.length < 100 && !text.includes('. ')) {
      return `<h1>${escape(text)}</h1>`;
    }
    return `<p>${escape(text).replace(/\n/g, '<br>')}</p>`;
  };

  if (/\?\s+(?=(?:What|Why|Where|How)\s)/i.test(trimmed)) {
    const chunks = trimmed.split(/\s+(?=(?:(?:What|Why|Where|How)\s))/i).filter((c) => c.trim());
    if (chunks.length > 1) {
      return chunks.map(formatChunk).join('\n');
    }
  }

  const blocks = trimmed.split(/\n\s*\n/).filter((b) => b.trim());
  return blocks.map(formatChunk).join('\n');
};

const loadServices = require('./middleware/loadServices');
app.use(loadServices);

// Routes
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');

const publicRoutes = require('./routes/publicRoutes');

app.use('/admin', adminRoutes);


app.use('/testimonial', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/service', serviceRoutes);

app.use('/api', contactRoutes);
app.use('/', publicRoutes);


app.use(async (req, res) => {
  res.status(404).render('error', { title: 'Page Not Found' });
});

module.exports = app;
