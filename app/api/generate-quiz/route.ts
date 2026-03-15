import { generateText } from 'ai'
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { topic, difficulty, questionCount = 5 } = await req.json()

    if (!topic) {
      return Response.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Create quiz record
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title: `Quiz: ${topic}`,
        subject: topic,
        difficultyLevel: difficulty || 'medium',
        totalQuestions: questionCount,
      },
    })

    // Generate quiz using Groq
    const result = await generateText({
      model: bedrock('amazon.nova-pro-v1:0'),
      prompt: `Create a ${questionCount}-question quiz about "${topic}" at ${difficulty || 'medium'} difficulty level.

Format your response as a JSON array with this structure:
[
  {
    "questionNumber": 1,
    "questionText": "Question text here",
    "questionType": "multiple_choice",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correctAnswer": "A",
    "explanation": "Explanation of why this is correct"
  }
]

Generate questions that test understanding, not just memorization.`,
    })

    try {
      const questions = JSON.parse(result.text)

      // Save questions to database
      for (const q of questions) {
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          },
        })
      }

      // Update quiz with start time
      await prisma.quiz.update({
        where: { id: quiz.id },
        data: { startedAt: new Date() },
      })

      return Response.json({
        success: true,
        quizId: quiz.id,
        questions,
      })
    } catch (parseError) {
      console.error('Failed to parse quiz response:', parseError)
      return Response.json(
        { error: 'Failed to generate quiz questions' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Quiz generation error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
