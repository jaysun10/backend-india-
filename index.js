import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profiles from './data/profiles.js';
import websiteSettings from './data/websiteSettings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API Routes

// Get all profiles
app.get('/api/profiles', (req, res) => {
  try {
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single profile by ID
app.get('/api/profiles/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const profile = profiles.find(p => p.id === id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new profile
app.post('/api/profiles', (req, res) => {
  try {
    const newProfile = {
      id: Math.max(...profiles.map(p => p.id)) + 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Basic validation
    if (!newProfile.name || !newProfile.age || !newProfile.location) {
      return res.status(400).json({ error: 'Missing required fields: name, age, location' });
    }
    
    profiles.push(newProfile);
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
app.put('/api/profiles/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const index = profiles.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    profiles[index] = { 
      ...profiles[index], 
      ...req.body, 
      id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    res.json(profiles[index]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete profile
app.delete('/api/profiles/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const index = profiles.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    profiles.splice(index, 1);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get website settings
app.get('/api/website-settings', (req, res) => {
  try {
    res.json(websiteSettings);
  } catch (error) {
    console.error('Error fetching website settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update website settings
app.put('/api/website-settings', (req, res) => {
  try {
    Object.assign(websiteSettings, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json(websiteSettings);
  } catch (error) {
    console.error('Error updating website settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, message, profileId } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, message' });
    }
    
    // Here you would typically send an email or save to database
    console.log('Contact form submission:', { name, email, phone, message, profileId });
    
    res.json({ 
      message: 'Contact form submitted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking endpoint
app.post('/api/booking', (req, res) => {
  try {
    const { customerName, phoneNumber, country, state, girlName, platform } = req.body;
    
    // Basic validation
    if (!customerName || !phoneNumber || !girlName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Here you would typically save booking to database or send notification
    console.log('Booking submission:', { customerName, phoneNumber, country, state, girlName, platform });
    
    res.json({ 
      message: 'Booking submitted successfully',
      bookingId: `BK${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search profiles
app.get('/api/search', (req, res) => {
  try {
    const { q, location, age, premium } = req.query;
    
    let filteredProfiles = [...profiles];
    
    if (q) {
      const searchTerm = q.toString().toLowerCase();
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm) ||
        profile.shortDescription.toLowerCase().includes(searchTerm) ||
        profile.services.some(service => service.toLowerCase().includes(searchTerm))
      );
    }
    
    if (location) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.location.toLowerCase().includes(location.toString().toLowerCase())
      );
    }
    
    if (age) {
      const targetAge = parseInt(age.toString());
      if (!isNaN(targetAge)) {
        filteredProfiles = filteredProfiles.filter(profile =>
          Math.abs(profile.age - targetAge) <= 2
        );
      }
    }
    
    if (premium !== undefined) {
      const isPremium = premium === 'true';
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.isPremium === isPremium
      );
    }
    
    res.json(filteredProfiles);
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});