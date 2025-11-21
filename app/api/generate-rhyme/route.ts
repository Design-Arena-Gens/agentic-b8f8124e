import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Generate rhyme using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative poet who writes engaging rhymes. Create short, catchy rhymes (4-8 lines) that are suitable for songs or videos.'
        },
        {
          role: 'user',
          content: `Write a creative rhyme about: ${topic}`
        }
      ],
      temperature: 0.9,
      max_tokens: 200,
    })

    const rhyme = completion.choices[0].message.content || 'Unable to generate rhyme'

    return NextResponse.json({ rhyme, topic })
  } catch (error: any) {
    console.error('Error generating rhyme:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate rhyme' },
      { status: 500 }
    )
  }
}
