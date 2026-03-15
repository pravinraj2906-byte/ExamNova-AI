import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get or create progress tracking record
    let progress = await prisma.progressTracking.findFirst({
      where: { userId },
    })

    if (!progress) {
      progress = await prisma.progressTracking.create({
        data: {
          userId,
          subject: 'Overall',
        },
      })
    }

    // Get stats from quizzes
    const quizzes = await prisma.quiz.findMany({
      where: { userId, completedAt: { not: null } },
    })

    const quizAnswers = await prisma.quizAnswer.findMany({
      where: {
        quiz: { userId },
      },
    })

    const correctAnswers = quizAnswers.filter(a => a.isCorrect).length
    const accuracy = quizAnswers.length > 0 
      ? (correctAnswers / quizAnswers.length) * 100 
      : 0

    // Get study hours from study plans
    const studyPlans = await prisma.studyPlan.findMany({
      where: { userId },
    })

    return Response.json({
      success: true,
      progress: {
        ...progress,
        totalQuizzes: quizzes.length,
        totalQuestions: quizAnswers.length,
        correctAnswers,
        accuracy: Math.round(accuracy * 100) / 100,
        studyPlansCreated: studyPlans.length,
      },
    })
  } catch (error) {
    console.error('Progress API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { subject, problemsSolved, correctAnswers, studyHours } = await req.json()

    // Update or create progress
    let progress = await prisma.progressTracking.findFirst({
      where: {
        userId,
        subject: subject || 'Overall',
      },
    })

    if (progress) {
      progress = await prisma.progressTracking.update({
        where: { id: progress.id },
        data: {
          totalProblemsSolved: { increment: problemsSolved || 0 },
          correctAnswers: { increment: correctAnswers || 0 },
          totalStudyHours: { increment: studyHours || 0 },
          lastStudiedAt: new Date(),
        },
      })
    } else {
      progress = await prisma.progressTracking.create({
        data: {
          userId,
          subject: subject || 'Overall',
          totalProblemsSolved: problemsSolved || 0,
          correctAnswers: correctAnswers || 0,
          totalStudyHours: studyHours || 0,
          lastStudiedAt: new Date(),
        },
      })
    }

    // Calculate accuracy
    const accuracy = progress.totalProblemsSolved > 0
      ? (progress.correctAnswers / progress.totalProblemsSolved) * 100
      : 0

    // Award achievements if milestones reached
    if (progress.totalProblemsSolved === 10) {
      await prisma.achievement.create({
        data: {
          userId,
          title: 'First Steps',
          description: 'Solved 10 problems',
          badgeType: 'bronze',
        },
      })
    }

    if (progress.totalProblemsSolved === 50) {
      await prisma.achievement.create({
        data: {
          userId,
          title: 'Problem Solver',
          description: 'Solved 50 problems',
          badgeType: 'silver',
        },
      })
    }

    if (accuracy >= 90) {
      await prisma.achievement.create({
        data: {
          userId,
          title: 'Accuracy Master',
          description: 'Achieved 90% accuracy',
          badgeType: 'gold',
        },
      })
    }

    return Response.json({
      success: true,
      progress,
    })
  } catch (error) {
    console.error('Progress update error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
