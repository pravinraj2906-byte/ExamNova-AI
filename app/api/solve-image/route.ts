import { streamText } from 'ai'
import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { bedrock } from '@ai-sdk/amazon-bedrock'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { imageUrl, base64Image } = await req.json()

    if (!imageUrl && !base64Image) {
      return Response.json(
        { error: 'Image URL or base64 image is required' },
        { status: 400 }
      )
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        userId,
        title: 'Image Problem',
        fileType: 'image',
        fileUrl: imageUrl || 'base64',
      },
    })

    // Prepare image for AI SDK
    const imageContent = base64Image
      ? {
          type: 'image' as const,
          image: base64Image,
        }
      : {
          type: 'image' as const,
          image: imageUrl,
        }

    // Call Groq API with vision capabilities
    const result = streamText({
      model: bedrock('amazon.nova-pro-v1:0'),
      messages: [
        {
          role: 'user',
          content: [
            imageContent,
            {
              type: 'text',
              text: `Please analyze this image carefully. If it contains a math problem, chemistry problem, or any academic problem:
1. Identify what the problem is asking
2. Provide a step-by-step solution
3. Explain key concepts
4. Verify the answer

If it's not a problem, describe what you see and provide relevant educational information.`,
            },
          ],
        },
      ],
    })

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Image solver error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
