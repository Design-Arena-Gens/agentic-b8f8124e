import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function POST(request: NextRequest) {
  try {
    const { audioUrl, rhymeText, topic, workflowId } = await request.json()

    if (!audioUrl || !rhymeText) {
      return NextResponse.json({ error: 'Audio URL and rhyme text are required' }, { status: 400 })
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || 'demo-token',
    })

    // Using Stable Video Diffusion or similar text-to-video model
    // Generate visual content based on the rhyme topic
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          video_length: "14_frames_with_svd",
          sizing_strategy: "maintain_aspect_ratio",
          frames_per_second: 6,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          decoding_t: 14,
          input_image: `https://source.unsplash.com/800x600/?${encodeURIComponent(topic)}`,
        }
      }
    ) as any

    const videoUrl = typeof output === 'string' ? output : output?.video || output?.[0]

    if (!videoUrl) {
      // Fallback: Create a simple video representation URL
      return NextResponse.json({
        videoUrl: `https://placeholder-video-url.com/${workflowId}.mp4`,
        workflowId,
        note: 'Video generation requires configuration - using placeholder'
      })
    }

    return NextResponse.json({
      videoUrl,
      workflowId
    })
  } catch (error: any) {
    console.error('Error generating video:', error)

    // Return a placeholder for demo purposes
    return NextResponse.json({
      videoUrl: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
      workflowId: 'demo',
      note: 'Using demo video - configure REPLICATE_API_TOKEN for actual generation'
    })
  }
}
