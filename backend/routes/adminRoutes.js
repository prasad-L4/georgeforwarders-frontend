const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const Service = require("../models/Service");
const Testimonial = require("../models/Testimonial");

const { isAuthenticated } = require("../middleware/auth");

const authController = require("../controllers/authController");


// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login Submit
router.post("/login", authController.login);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

router.get("/admin-dashboard", isAuthenticated, async (req, res) => {
  try {
    const [blogs, testimonials, services] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }),
      Testimonial.find().sort({ createdAt: -1 }),
      Service.find().sort({ sortOrder: 1, createdAt: -1 })
    ]);

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      blogs,
      testimonials,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-dashboard", {
      title: "Admin Dashboard",
     
      blogs: [],
      testimonials: [],
      services: [],
      error: "Failed to load dashboard data",
    });
  }
});

router.get("/admin-blogs", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { metaTitle: { $regex: searchTerm, $options: "i" } },
          { author: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.render("admin-blogs", {
      title: "Blog Management",
      blogs,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error("Admin Blog Load Error:", error);

    res.status(500).render("admin-blogs", {
      title: "Blog Management",
      blogs: [],
      searchTerm: "",
      error: "Failed to load blogs",
    });
  }
});


router.get("/admin-services", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { metaTitle: { $regex: searchTerm, $options: "i" } },
          { shortDescription: { $regex: searchTerm, $options: "i" } },
          { sectionContent: { $regex: searchTerm, $options: "i" } }
        ]
      };
    }

    const services = await Service.find(query).sort({ sortOrder: 1, createdAt: -1 });

    res.render("admin-services", {
      title: "Service Management",
      services,
      searchTerm,
      error: null
    });
  } catch (error) {
    console.error("Admin Service Load Error:", error);
    res.status(500).render("admin-services", {
      title: "Service Management",
      services: [],
      searchTerm: "",
      error: "Failed to load services"
    });
  }
});

router.get("/admin-testimonials", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { designation: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    res.render("admin-testimonials", {
      title: "Testimonials Management",
      testimonials,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-testimonials", {
      title: "Testimonials Management",
      testimonials: [],
      searchTerm: "",
      error: "Failed to load testimonials",
    });
  }
});







module.exports = router;
