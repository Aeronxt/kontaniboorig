const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Resend
const resend = new Resend('re_PTgHEabZ_tuhDGworfF9YoVxeh8bvoLGz');

// Basic CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Email service is running' });
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Received email request:', req.body);
    
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      console.log('Missing required fields:', { to, subject, html });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    console.log('Attempting to send email to:', to);

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Kontanibo <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html
    });

    console.log('Email sent successfully:', data);

    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      data: data
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Send email
    await resend.emails.send({
      from: 'Kontanibo <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process contact form',
      error: error.message
    });
  }
});

// Bank notification endpoint
app.post('/api/notify-bank', async (req, res) => {
  const { bankName, bankEmail, subject, content } = req.body;

  try {
    // Validate required fields
    if (!bankName || !bankEmail || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Send email
    await resend.emails.send({
      from: 'Kontanibo <onboarding@resend.dev>',
      to: bankEmail,
      subject: subject,
      html: content
    });

    res.json({
      success: true,
      message: 'Bank notification sent successfully'
    });
  } catch (error) {
    console.error('Error sending bank notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bank notification',
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 