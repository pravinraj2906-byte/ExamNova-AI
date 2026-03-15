import { streamText } from "ai"
import { bedrock } from "@ai-sdk/amazon-bedrock"
import { verifyAuth } from "@/lib/auth"
import prisma from "@/lib/db"
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, sessionId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 })
    }

    // Create or retrieve chat session
    let session
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      })

      if (!session || session.userId !== userId) {
        return new Response('Session not found or unauthorized', { status: 404 })
      }
    } else {
      session = await prisma.chatSession.create({
        data: {
          userId,
          title: 'New Chat',
        },
      })
    }

    // Convert messages to Groq format
    const groqMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Call Groq API for streaming
    const result = streamText({
      model: bedrock('amazon.nova-pro-v1:0'),
      system: `You are ExamNova AI, an intelligent tutoring assistant. Your role is to:
- Help students understand complex concepts
- Solve math problems step-by-step
- Explain scientific concepts clearly
- Provide study tips and learning strategies
- Be encouraging and adaptive to different learning styles

Always provide clear, detailed explanations and break down concepts into digestible parts.`,
      messages: groqMessages,
    })

    // Save user message to database
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          userId,
          role: lastMessage.role,
          content: lastMessage.content,
        },
      })
    }

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get recent chat sessions
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    })

    return Response.json(sessions)
  } catch (error) {
    console.error('Chat GET error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
