# The Escort Service - Backend API

Backend API server for The Escort Service website.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
escort-service-backend/
├── data/
│   ├── profiles.js          # Profile data
│   └── websiteSettings.js   # Website settings
├── .env                     # Environment variables
├── .env.example            # Environment template
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔧 API Endpoints

### Health Check
- `GET /health` - Server health status

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get single profile
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### Website Settings
- `GET /api/website-settings` - Get website settings
- `PUT /api/website-settings` - Update website settings

### Search & Contact
- `GET /api/search` - Search profiles with filters
- `POST /api/contact` - Submit contact form
- `POST /api/booking` - Submit booking request

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
WHATSAPP_NUMBER=+1234567890
TELEGRAM_USERNAME=@escort_service
PHONE_NUMBER=+1234567890
EMAIL=contact@escortservice.com
```

## 🔒 CORS Configuration

The server is configured to accept requests from:
- `http://localhost:5173` (default frontend dev server)
- Configure `CORS_ORIGIN` in `.env` for production

## 📝 Data Management

Profile and website data is stored in:
- `data/profiles.js` - Companion profiles
- `data/websiteSettings.js` - Website configuration

To add/edit profiles or settings, modify these files directly.

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production `CORS_ORIGIN`
3. Set up proper contact information

### Deployment Platforms
- Heroku
- Railway
- DigitalOcean
- AWS EC2
- Vercel (serverless)

## 📞 Support

For questions or issues:
- Email: contact@escortservice.com
- WhatsApp: +1234567890