# AI Rhyme Automation Agent - Implementation Guide

## 🎯 Overview

This is a fully automated AI agent that:
1. **Generates creative rhymes** using OpenAI GPT
2. **Logs data to Google Sheets** for tracking and analytics
3. **Creates audio** using AI music generation (Replicate/MusicGen)
4. **Generates videos** using AI video generation (Stable Video Diffusion)
5. **Uploads to YouTube** automatically with metadata
6. **Maintains complete logs** of all operations

## 🏗️ Architecture

```
User Input (Topic)
    ↓
AI Rhyme Generation (OpenAI)
    ↓
Log to Google Sheets
    ↓
Audio Generation (Replicate/MusicGen)
    ↓
Video Generation (Stable Video Diffusion)
    ↓
YouTube Upload (YouTube Data API v3)
    ↓
Final Log Update
```

## 📋 Prerequisites

### 1. OpenAI API Key (For Rhyme Generation)
- Sign up at https://platform.openai.com/
- Create an API key in the dashboard
- Free tier: $5 credit for new users
- Cost: ~$0.002 per rhyme generation

### 2. Google Sheets API Setup
**Steps:**
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create Service Account
   - Generate JSON key
5. Create a Google Sheet and share it with the service account email
6. Copy the Sheet ID from the URL

**Free tier:** Unlimited (part of Google Cloud free tier)

### 3. Replicate API Token (For Audio/Video Generation)
- Sign up at https://replicate.com/
- Get API token from account settings
- Free tier: Limited credits per month
- Cost: Pay-as-you-go for audio/video generation

### 4. YouTube Data API v3 Setup
**Steps:**
1. Go to https://console.cloud.google.com/
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials:
   - Create OAuth client ID
   - Add authorized redirect URI: `http://localhost:3000/api/oauth-callback`
4. Get refresh token:
   ```bash
   # Use OAuth Playground or implement OAuth flow
   # https://developers.google.com/oauthplayground/
   ```
5. Quota: 10,000 units/day (free)

## 🔧 Environment Setup

Create `.env.local` file:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Google Sheets API
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1abc123def456ghi789jkl

# Replicate API
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxx

# YouTube API
YOUTUBE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
YOUTUBE_REFRESH_TOKEN=1//xxxxxxxxxxxxx
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Or deploy to production directly
vercel --prod

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

## 📊 Google Sheet Setup

Create a sheet with these columns:
| Workflow ID | Timestamp | Topic | Rhyme | Audio URL | Video URL | YouTube URL | Status |
|-------------|-----------|-------|-------|-----------|-----------|-------------|--------|

## 🎬 Free Tools Alternatives

### Audio Generation Alternatives:
1. **MusicGen (Meta)** - via Replicate ✅ (Used in this project)
2. **Bark** - Text-to-speech with music
3. **AudioCraft** - Meta's audio generation
4. **Stable Audio** - Stability AI (limited free tier)

### Video Generation Alternatives:
1. **Stable Video Diffusion** ✅ (Used in this project)
2. **Zeroscope** - Text-to-video
3. **ModelScope** - Text-to-video
4. **Deforum Stable Diffusion** - Animation generation

### Workflow Automation Alternatives:
1. **n8n** - Self-hosted automation (100% free)
2. **Zapier** - Limited free tier (100 tasks/month)
3. **Make (Integromat)** - Limited free tier
4. **Pipedream** - Generous free tier

## 🔄 Usage Flow

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:3000

3. **Enter a topic**: e.g., "ocean", "love", "adventure"

4. **Click "Start Workflow"**

5. **Watch the automation**:
   - Rhyme generation (5-10 seconds)
   - Sheet logging (2-3 seconds)
   - Audio generation (30-60 seconds)
   - Video generation (60-120 seconds)
   - YouTube upload (10-30 seconds)

6. **View results** in the workflow history

## 🛠️ API Endpoints

- `POST /api/generate-rhyme` - Generate AI rhyme
- `POST /api/log-to-sheet` - Log to Google Sheets
- `POST /api/generate-audio` - Generate audio from text
- `POST /api/generate-video` - Generate video with audio
- `POST /api/upload-youtube` - Upload to YouTube

## 🎨 Advanced Features

### Customization Options:
1. **Rhyme Style**: Edit the system prompt in `generate-rhyme/route.ts`
2. **Audio Style**: Modify MusicGen parameters in `generate-audio/route.ts`
3. **Video Style**: Adjust video generation settings in `generate-video/route.ts`
4. **Upload Settings**: Configure YouTube metadata in `upload-youtube/route.ts`

### Scaling:
1. Add queue system (Bull/BullMQ)
2. Implement webhook notifications
3. Add user authentication
4. Multi-tenant support
5. Batch processing

## 🔒 Security Best Practices

1. Never commit `.env.local` to git
2. Use environment variables for all secrets
3. Rotate API keys regularly
4. Implement rate limiting
5. Add authentication for production use

## 📈 Monitoring & Logs

All workflows are logged to:
1. **Google Sheets** - Permanent record
2. **Browser Console** - Real-time debugging
3. **Server Logs** - API errors and issues

## 🐛 Troubleshooting

### Issue: "Failed to generate rhyme"
- Check OpenAI API key validity
- Verify API quota hasn't been exceeded
- Check internet connection

### Issue: "Failed to log to Google Sheets"
- Verify service account email has edit access to sheet
- Check private key format (should include \n characters)
- Ensure Sheet ID is correct

### Issue: "Failed to generate audio/video"
- Check Replicate API token
- Verify account has sufficient credits
- Try using demo mode for testing

### Issue: "Failed to upload to YouTube"
- Verify OAuth tokens are valid
- Check YouTube API quota (10,000 units/day)
- Ensure video file is accessible

## 💡 Tips for Production

1. **Use a queue system** for long-running tasks
2. **Implement retries** for failed API calls
3. **Add webhooks** for completion notifications
4. **Cache generated content** to avoid regeneration
5. **Monitor API costs** and set budgets
6. **Use CDN** for serving generated media files

## 🌟 Free Tier Limits

| Service | Free Tier | Notes |
|---------|-----------|-------|
| OpenAI | $5 credit | New users only |
| Google Sheets | Unlimited | 100 requests/100 seconds |
| Replicate | Limited credits | Pay-as-you-go after |
| YouTube | 10K units/day | 1 upload ≈ 1,600 units |
| Vercel | 100GB bandwidth | Hobby plan |

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Sheets API Guide](https://developers.google.com/sheets/api)
- [Replicate Documentation](https://replicate.com/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

This is an open-source automation agent. Contributions welcome!

## 📄 License

MIT License - Free to use and modify
