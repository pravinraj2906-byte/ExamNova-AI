import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        gradeLevel: true,
        learningStyle: true,
        preferredSubjects: true,
      },
    })

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return Response.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const {
      name,
      avatarUrl,
      gradeLevel,
      learningStyle,
      preferredSubjects,
    } = await req.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(avatarUrl && { avatarUrl }),
        ...(gradeLevel && { gradeLevel }),
        ...(learningStyle && { learningStyle }),
        ...(preferredSubjects && { preferredSubjects }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        gradeLevel: true,
        learningStyle: true,
        preferredSubjects: true,
      },
    })

    return Response.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
