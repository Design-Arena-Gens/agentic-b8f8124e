# 🤖 AI Rhyme Automation Agent

A fully automated AI-powered agent that generates creative rhymes, creates audio and video content, and automatically uploads to YouTube - all orchestrated through a beautiful web interface.

## 🌟 Features

- **🎨 AI Rhyme Generation**: GPT-powered creative rhyme writing on any topic
- **📊 Google Sheets Logging**: Automatic tracking and analytics of all workflows
- **🎵 Audio Generation**: AI-powered music creation using Meta's MusicGen
- **🎬 Video Generation**: Automated video creation with Stable Video Diffusion
- **📺 YouTube Upload**: Direct publishing to YouTube with metadata
- **⚡ Real-time Monitoring**: Live workflow status updates and history
- **🎯 Fully Automated Pipeline**: End-to-end automation from idea to published video

## 🚀 Quick Start

### Installation

```bash
npm install
cp .env.example .env.local
# Configure your API keys in .env.local
npm run dev
# Open http://localhost:3000
```

## 🔧 Configuration

Create `.env.local` with your API credentials. See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed setup.

## 📋 Setup Guide

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for complete instructions on:
- Getting API keys
- Google Sheets setup
- YouTube OAuth configuration
- Free tier limits
- Troubleshooting

## 🛠️ Technology Stack

- Next.js 14, React, TypeScript, Tailwind CSS
- OpenAI GPT-3.5, Replicate MusicGen, Stable Video Diffusion
- Google Sheets API, YouTube Data API v3

## 🚀 Deployment

```bash
vercel --prod
```

## 📄 License

MIT License
