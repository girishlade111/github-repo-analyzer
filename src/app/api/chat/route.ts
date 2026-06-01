import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, systemPrompt } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Use z-ai-web-dev-sdk for LLM completion
    const { llm } = await import('z-ai-web-dev-sdk')

    // Build conversation history
    const conversation = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    // Call LLM with system prompt
    const result = await llm({
      messages: conversation,
      systemPrompt: systemPrompt,
      model: 'claude-3-5-sonnet'
    })

    return NextResponse.json({
      message: result.content,
      model: result.model
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}