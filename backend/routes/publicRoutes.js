const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');

const getPublishedServices = () =>
  Service.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 });

const legacyServicePaths = ['clearing', 'transportation', 'warehouse', 'cargo'];

async function redirectLegacyService(req, res) {
  try {
    const legacy = req.path.replace(/^\//, '');
    const service = await Service.findOne({
      $or: [{ slug: legacy }, { legacySlug: legacy }],
      isPublished: true
    });

    if (service) {
      return res.redirect(301, `/service/${service.slug}`);
    }

    return res.status(404).render('error', { title: 'Service Not Found' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading service');
  }
}

router.get('/', async (req, res) => {
  try {
    const [blogs, testmonials, services] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }),
      Testimonial.find().sort({ date: -1 }),
      getPublishedServices()
    ]);

    res.render('home', {
      title: 'Home',
      blogs,
      testmonials,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading home page data');
  }
});

router.get('/about', async (req, res) => {
  try {
    const [blogs, testmonials, services] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }),
      Testimonial.find().sort({ date: -1 }),
      getPublishedServices()
    ]);

    res.render('about', {
      title: 'about',
      blogs,
      testmonials,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading home page data');
  }
});

router.get('/blog', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const total = await Blog.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render('blogs', {
      title: 'Blogs',
      blogs,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading blogs page data');
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    res.render('blog-details', {
      title: blog.metaTitle || blog.title,
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading blog details');
  }
});

router.get('/service', async (req, res) => {
  try {
    const services = await getPublishedServices();
    res.render('service', { title: 'Services', services });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading services page');
  }
});

router.get('/service/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isPublished: true
    }).lean();

    if (!service) {
      return res.status(404).render('error', { title: 'Service Not Found' });
    }

    res.render('service-details', {
      title: service.metaTitle || service.title,
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading service details');
  }
});

legacyServicePaths.forEach((pathName) => {
  router.get(`/${pathName}`, redirectLegacyService);
});

router.get('/contact', async (req, res) => {
  try {
    const services = await getPublishedServices();
    res.render('contact', { title: 'contact us', services });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading contact page data');
  }
});

module.exports = router;
