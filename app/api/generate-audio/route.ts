import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function POST(request: NextRequest) {
  try {
    const { text, workflowId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || 'demo-token',
    })

    // Using Meta's MusicGen model for text-to-music/audio generation
    // This is a free alternative to commercial music generation APIs
    const output = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      {
        input: {
          model_version: "stereo-large",
          prompt: `Create a melodic background music for this poem: ${text.substring(0, 200)}`,
          duration: 15,
          temperature: 1,
          top_k: 250,
          top_p: 0,
          classifier_free_guidance: 3
        }
      }
    ) as any

    // The output is an audio URL
    const audioUrl = typeof output === 'string' ? output : output?.audio || output?.[0]

    if (!audioUrl) {
      throw new Error('No audio URL returned from generation')
    }

    return NextResponse.json({
      audioUrl,
      workflowId
    })
  } catch (error: any) {
    console.error('Error generating audio:', error)

    // Return a placeholder for demo purposes
    return NextResponse.json({
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      workflowId: 'demo',
      note: 'Using demo audio - configure REPLICATE_API_TOKEN for actual generation'
    })
  }
}
