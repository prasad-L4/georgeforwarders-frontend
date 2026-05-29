const Service = require('../models/Service');

const defaultServices = [
  {
    title: 'Clearing & Forwarding',
    slug: 'clearing',
    legacySlug: 'clearing',
    metaTitle: 'Clearing & Forwarding | George Forwarders',
    metaDescription: 'Expert customs clearance and forwarding services at major ports.',
    metaKeywords: ['clearing', 'forwarding', 'customs', 'logistics'],
    shortDescription:
      'Our experienced team ensures smooth customs clearance and efficient shipment handling at major ports.',
    heroTitle: 'Clearing & Forwarding',
    heroDescription:
      'We maintain strong connections with shipping lines and NVOCC operators for seamless logistics operations.',
    heroImageUrl: 'images/george/ser-1.jpg',
    cardImageUrl: 'images/home2-classic/service-thumb1.png',
    iconImageUrl: 'images/home2/service-icon1.png',
    sectionTitle: 'Reliable Customs & Port Handling',
    sectionContent:
      '<p>Our experienced team ensures smooth customs clearance and efficient shipment handling at major ports. We coordinate documentation, compliance, and port operations so your cargo moves without delays.</p>',
    calloutText:
      'We ensure every consignment is cleared accurately and dispatched on schedule.',
    features: [
      {
        title: 'Customs Expertise',
        description: 'Accurate documentation and regulatory compliance.',
        icon: 'fa-solid fa-file-contract'
      },
      {
        title: 'Port Coordination',
        description: 'Strong relationships with lines and terminal operators.',
        icon: 'fa-solid fa-ship'
      }
    ],
    benefits: [
      'Faster customs clearance',
      'Reduced port delays',
      'End-to-end shipment support',
      'Trusted global network'
    ],
    sortOrder: 1,
    cardStyle: 'default'
  },
  {
    title: 'Transportation',
    slug: 'transportation',
    legacySlug: 'transportation',
    metaTitle: 'Transportation | George Forwarders',
    metaDescription: 'Reliable 20ft and 40ft truck transportation from exporter to port.',
    metaKeywords: ['transportation', 'trucking', 'logistics'],
    shortDescription:
      'We provide reliable transportation using our fleet of 20ft and 40ft trucks for safe and timely delivery.',
    heroTitle: 'Transportation Services',
    heroDescription:
      'Dedicated fleet operations ensuring safe and timely delivery from your location to the port.',
    heroImageUrl: 'images/george/ser-1.jpg',
    cardImageUrl: 'images/home2-classic/service-thumb2.png',
    iconImageUrl: 'images/home2/service-icon2.png',
    sectionTitle: 'Fleet & Route Reliability',
    sectionContent:
      '<p>We operate a dedicated fleet of 20ft and 40ft trucks to transport cargo safely from the exporter’s location to the port with professional handling at every stage.</p>',
    calloutText: 'On-time pickup and delivery backed by experienced drivers and dispatch.',
    features: [
      {
        title: '20ft & 40ft Fleet',
        description: 'Flexible capacity for varied shipment sizes.',
        icon: 'fa-solid fa-truck'
      },
      {
        title: 'Safe Handling',
        description: 'Careful loading and transit monitoring.',
        icon: 'fa-solid fa-shield-halved'
      }
    ],
    benefits: ['Timely port delivery', 'Professional drivers', 'Flexible scheduling', 'Nationwide coverage'],
    sortOrder: 2,
    cardStyle: 'two'
  },
  {
    title: 'Warehousing',
    slug: 'warehouse',
    legacySlug: 'warehouse',
    metaTitle: 'Warehousing | George Forwarders',
    metaDescription: 'Secure warehousing and cargo handling for exporters.',
    metaKeywords: ['warehousing', 'storage', 'logistics'],
    shortDescription:
      'Our secure warehousing facilities ensure safe storage and handling of goods with flexible solutions.',
    heroTitle: 'Premium Warehousing Services',
    heroDescription:
      'Secure and reliable warehousing designed to meet storage and handling needs while maintaining cargo condition.',
    heroImageUrl: 'images/george/ser-1.jpg',
    cardImageUrl: 'images/home2-classic/service-thumb3.png',
    iconImageUrl: 'images/home2/service-icon3.png',
    sectionTitle: 'Flexible Storage & Efficiency',
    sectionContent:
      '<p>Whether you need temporary storage before shipment or support with stuffing challenges, our warehouse services offer flexibility, safety, and operational efficiency.</p>',
    calloutText:
      'We ensure safe storage, efficient handling, and seamless movement of goods without disruptions.',
    features: [
      {
        title: 'Secure Storage',
        description: 'Safe, monitored facilities preventing damage and theft.',
        icon: 'fa-solid fa-warehouse'
      },
      {
        title: 'Efficient Handling',
        description: 'Expert loading, unloading, and careful cargo handling.',
        icon: 'fa-solid fa-people-carry-box'
      }
    ],
    benefits: [
      'Safe & secure storage space',
      'Flexible storage options',
      'Proper cargo handling',
      'Reduced risk & damage'
    ],
    sortOrder: 3,
    cardStyle: 'default'
  },
  {
    title: 'Cargo Consolidation',
    slug: 'cargo',
    legacySlug: 'cargo',
    metaTitle: 'Cargo Consolidation | George Forwarders',
    metaDescription: 'Cost-effective LCL cargo consolidation at competitive rates.',
    metaKeywords: ['cargo', 'LCL', 'consolidation'],
    shortDescription:
      'We offer efficient LCL cargo consolidation services at competitive rates for smaller shipments.',
    heroTitle: 'Cargo Consolidation',
    heroDescription:
      'Cost-effective LCL solutions enabling exporters to ship smaller loads with ease and efficiency.',
    heroImageUrl: 'images/george/ser-1.jpg',
    cardImageUrl: 'images/home2-classic/service-thumb4.png',
    iconImageUrl: 'images/home2/service-icon4.png',
    sectionTitle: 'LCL Consolidation Expertise',
    sectionContent:
      '<p>We specialize in consolidating less-than-container loads at competitive rates, helping exporters optimize cost while maintaining reliable transit schedules.</p>',
    calloutText: 'Ship smaller volumes without compromising service quality or timelines.',
    features: [
      {
        title: 'LCL Expertise',
        description: 'Efficient grouping of compatible shipments.',
        icon: 'fa-solid fa-boxes-stacked'
      },
      {
        title: 'Competitive Rates',
        description: 'Optimized pricing for partial container loads.',
        icon: 'fa-solid fa-tags'
      }
    ],
    benefits: ['Lower shipping costs', 'Flexible volumes', 'Reliable schedules', 'Global reach'],
    sortOrder: 4,
    cardStyle: 'two'
  }
];

async function seedServices() {
  const count = await Service.countDocuments();
  if (count > 0) return;

  await Service.insertMany(defaultServices);
  console.log('Default services seeded successfully');
}

module.exports = seedServices;
