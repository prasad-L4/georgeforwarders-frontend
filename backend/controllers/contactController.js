const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.submitContact = async (req, res) => {
  try {
    const { Name, phone, email, service, message } = req.body;


    if (!Name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }


    const newContact = new Contact({
      name: Name,
      phone,
      email,
      service,
      message
    });

    await newContact.save();


    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,  
        replyTo: email,                 
        to: process.env.EMAIL_USER,
        subject: `New Contact from ${Name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><b>Name:</b> ${Name}</p>
          <p><b>Phone:</b> ${phone || 'N/A'}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Service:</b> ${service || 'N/A'}</p>
          <p><b>Message:</b> ${message}</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Email Error:", emailError);

      }
    }

  
    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};