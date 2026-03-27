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
// Routes
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');

const publicRoutes = require('./routes/publicRoutes');

app.use('/admin', adminRoutes);


app.use('/testimonial', testimonialRoutes);
app.use('/api/blog', blogRoutes);

app.use('/api', contactRoutes);
app.use('/', publicRoutes);


app.use(async (req, res) => {
  res.status(404).render('error', { title: 'Page Not Found' });
});

module.exports = app;
