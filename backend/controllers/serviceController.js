const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

const deleteImage = (imageName) => {
  if (!imageName) return;

  try {
    const filePath = path.join(__dirname, '..', '..', 'uploads', imageName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Image delete error:', err);
  }
};

const parseKeywords = (metaKeywords) => {
  if (!metaKeywords) return [];
  if (Array.isArray(metaKeywords)) return metaKeywords;
  return metaKeywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
};

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseBenefits = (benefits) => {
  if (!benefits) return [];
  if (Array.isArray(benefits)) return benefits;
  return benefits
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean);
};

const buildServicePayload = (body, files = {}) => {
  const {
    title,
    slug,
    legacySlug,
    metaTitle,
    metaDescription,
    metaKeywords,
    shortDescription,
    heroTitle,
    heroDescription,
    sectionTitle,
    sectionContent,
    calloutText,
    additionalContent,
    features,
    benefits,
    sortOrder,
    isPublished,
    cardStyle
  } = body;

  const payload = {
    title,
    slug,
    legacySlug: legacySlug || undefined,
    metaTitle,
    metaDescription,
    metaKeywords: parseKeywords(metaKeywords),
    shortDescription,
    heroTitle,
    heroDescription,
    sectionTitle,
    sectionContent,
    calloutText: calloutText || '',
    additionalContent: additionalContent || '',
    features: parseFeatures(features),
    benefits: parseBenefits(benefits),
    sortOrder: sortOrder ? Number(sortOrder) : 0,
    isPublished: isPublished === 'true' || isPublished === true,
    cardStyle: cardStyle === 'two' ? 'two' : 'default'
  };

  if (files.heroImage?.[0]) {
    payload.heroImageUrl = files.heroImage[0].filename;
  }
  if (files.cardImage?.[0]) {
    payload.cardImageUrl = files.cardImage[0].filename;
  }
  if (files.iconImage?.[0]) {
    payload.iconImageUrl = files.iconImage[0].filename;
  }

  return payload;
};

exports.createService = async (req, res) => {
  try {
    const payload = buildServicePayload(req.body, req.files);

    const required = [
      'title',
      'metaTitle',
      'metaDescription',
      'shortDescription',
      'heroTitle',
      'heroDescription',
      'sectionContent'
    ];

    for (const field of required) {
      if (!payload[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    if (!payload.heroImageUrl) {
      return res.status(400).json({ message: 'Hero image is required' });
    }

    const service = new Service(payload);
    await service.save();

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Slug already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { metaTitle: { $regex: search, $options: 'i' } },
            { shortDescription: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const services = await Service.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const payload = buildServicePayload(req.body, req.files);

    if (req.files?.heroImage?.[0]) {
      deleteImage(existing.heroImageUrl);
    }
    if (req.files?.cardImage?.[0]) {
      deleteImage(existing.cardImageUrl);
    }
    if (req.files?.iconImage?.[0]) {
      deleteImage(existing.iconImageUrl);
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    res.json({ message: 'Service updated successfully', service: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    deleteImage(service.heroImageUrl);
    deleteImage(service.cardImageUrl);
    deleteImage(service.iconImageUrl);

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};
