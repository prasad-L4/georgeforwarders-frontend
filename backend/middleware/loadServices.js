const Service = require('../models/Service');

const loadServices = async (req, res, next) => {
  try {
    res.locals.servicesNav = await Service.find({ isPublished: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('title slug')
      .lean();
  } catch (error) {
    console.error('Failed to load services for navigation:', error);
    res.locals.servicesNav = [];
  }
  next();
};

module.exports = loadServices;
