# 🚀 Deployment Instructions

## Prerequisites

You need a VERCEL_TOKEN to deploy this application. If you don't have one set as an environment variable, follow these steps:

### Get Vercel Token

1. **Go to Vercel Dashboard**: https://vercel.com/account/tokens
2. **Create New Token**:
   - Click "Create"
   - Name it (e.g., "CLI Token")
   - Set expiration (optional)
   - Copy the token immediately (it won't be shown again)

3. **Use Token for Deployment**:

```bash
# Option 1: Export as environment variable
export VERCEL_TOKEN=your_token_here

# Option 2: Use inline with deployment
VERCEL_TOKEN=your_token_here vercel deploy --prod --yes --name agentic-b8f8124e

# Option 3: Use --token flag
vercel deploy --prod --yes --name agentic-b8f8124e --token your_token_here
```

## Deployment Steps

### 1. Build and Test Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally (optional)
npm start
```

### 2. Deploy to Vercel

```bash
# Deploy to production
vercel deploy --prod --yes --name agentic-b8f8124e --token $VERCEL_TOKEN
```

### 3. Verify Deployment

```bash
# Wait for DNS propagation (5-10 seconds)
sleep 10

# Test the deployment
curl https://agentic-b8f8124e.vercel.app
```

### 4. Configure Environment Variables

After deployment, set environment variables in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project: `agentic-b8f8124e`
3. Go to Settings → Environment Variables
4. Add all variables from `.env.example`:
   - `OPENAI_API_KEY`
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
   - `REPLICATE_API_TOKEN`
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`
   - `YOUTUBE_REFRESH_TOKEN`

5. Redeploy to apply environment variables:
```bash
vercel deploy --prod --yes --name agentic-b8f8124e --token $VERCEL_TOKEN
```

## Production URL

Your application will be available at:
**https://agentic-b8f8124e.vercel.app**

## Troubleshooting

### Deployment Fails
```bash
# Check Vercel status
vercel --version

# Re-authenticate if needed
vercel login

# Try deployment again
vercel deploy --prod --yes --name agentic-b8f8124e
```

### Build Errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Working
- Make sure variables are set for "Production" environment
- Redeploy after adding variables
- Check for typos in variable names

### 502/504 Errors
- API routes may be timing out
- Check Vercel function logs
- Verify external API keys are valid

## Alternative Deployment Options

### Using Vercel Dashboard

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure environment variables
5. Deploy

### Using Vercel CLI (Interactive)

```bash
# Login first
vercel login

# Deploy interactively
vercel

# Follow the prompts
```

## Post-Deployment Checklist

- [ ] Application loads at production URL
- [ ] Environment variables are configured
- [ ] API routes respond correctly
- [ ] Test rhyme generation workflow
- [ ] Verify Google Sheets logging works
- [ ] Test with all API integrations enabled

## Monitoring

Access logs and analytics:
- Dashboard: https://vercel.com/dashboard
- Logs: Project → Deployments → View Function Logs
- Analytics: Project → Analytics

## Security

- Never commit `.env.local` or `.env` files
- Rotate API keys regularly
- Use Vercel's environment variable encryption
- Enable deployment protection for production
- Set up monitoring and alerts

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for API setup
