const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'fa-solid fa-check' }
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    legacySlug: { type: String, lowercase: true, trim: true },

    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: [String], default: [] },

    shortDescription: { type: String, required: true },

    heroTitle: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroImageUrl: { type: String, required: true },

    cardImageUrl: { type: String },
    iconImageUrl: { type: String },

    sectionTitle: { type: String, default: '' },
    sectionContent: { type: String, required: true },
    calloutText: { type: String, default: '' },
    additionalContent: { type: String, default: '' },

    features: { type: [featureSchema], default: [] },
    benefits: { type: [String], default: [] },

    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    cardStyle: { type: String, enum: ['default', 'two'], default: 'default' }
  },
  { timestamps: true }
);

ServiceSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);
