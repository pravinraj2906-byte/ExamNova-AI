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

    const {
      subject,
      difficulty,
      durationDays = 7,
      goals = 'Master the fundamentals',
    } = await req.json()

    if (!subject) {
      return Response.json(
        { error: 'Subject is required' },
        { status: 400 }
      )
    }

    // Create study plan record
    const plan = await prisma.studyPlan.create({
      data: {
        userId,
        title: `Study Plan: ${subject}`,
        subject,
        difficultyLevel: difficulty || 'medium',
        durationDays,
        goals,
        topics: '', // Placeholder, will be updated after generation
      },
    })

    // Generate study plan using Groq
    const result = await generateText({
      model: bedrock('amazon.nova-pro-v1:0'),
      prompt: `Create a ${durationDays}-day study plan for "${subject}" at ${difficulty || 'medium'} difficulty level.

Goal: ${goals}

Format your response as a JSON object with this structure:
{
  "topics": ["Topic 1", "Topic 2", ...],
  "days": [
    {
      "dayNumber": 1,
      "topic": "Topic name",
      "content": "Detailed learning content for this day",
      "exercises": ["Exercise 1", "Exercise 2", "Exercise 3"]
    }
  ]
}

Make the plan progressive, building from basics to advanced concepts. Include practice exercises for each day.`,
    })

    try {
      const cleaned = result.text.replace(/```json|```/g, "").trim()
      const planData = JSON.parse(cleaned)

      // Update plan with topics
      await prisma.studyPlan.update({
        where: { id: plan.id },
        data: { topics: planData.topics },
      })

      // Create study plan days
      for (const day of planData.days) {
        await prisma.studyPlanDay.create({
          data: {
            planId: plan.id,
            dayNumber: day.dayNumber,
            topic: day.topic,
            content: day.content,
            exercises: day.exercises,
          },
        })
      }

      return Response.json({
        success: true,
        planId: plan.id,
        plan: planData,
      })
    } catch (parseError) {
      console.error('Failed to parse study plan response:', parseError)
      return Response.json(
        { error: 'Failed to generate study plan' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Study plan generation error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
