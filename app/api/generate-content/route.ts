import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { decryptApiKey } from "@/lib/encryption";
import { z } from 'zod';

interface Post {
  id: string
  platform: string
  content: string
  hashtags?: string[]
  title?: string
}

interface GenerateRequest {
  prompt: string
  platforms: string[]
  config: any
  model: string
  provider: string
  apiKey: string
  openAIBaseURL?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, provider, apiKey, openAIBaseURL } = body

    if (!prompt || !provider || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const decryptedApiKey = decryptApiKey(apiKey)
    if (!decryptedApiKey) {
      return NextResponse.json({ error: "Invalid or corrupted API key" }, { status: 400 })
    }

    let aiModel
    if (provider === "OpenAI") {
      const openai = createOpenAI({
        apiKey: decryptedApiKey,
        baseURL: openAIBaseURL ? openAIBaseURL : undefined
      })
      aiModel = openai
    } else if (provider === "Google") {
      const gemini = createGoogleGenerativeAI({
        apiKey: decryptedApiKey,
      })
      aiModel = gemini
    } else {
      return NextResponse.json({ error: "Invalid provider selected" }, { status: 400 })
    }

    const generatedPosts: Post[] = []

    const systemPrompt = `You are the Lead Social Media Strategist for Cuemath. Your goal is to translate the user's rough idea into a highly engaging, multi-slide educational Instagram Carousel designed for parents.
    
    CRITICAL STRUCTURE:
    - Slide 1 MUST be a "Hook" (Grabs attention, states the problem).
    - Middle slides MUST "Build" (Explain the concept simply, use analogies).
    - Final slide MUST be a "Takeaway" (Actionable advice or Cuemath value prop).
    
    For each slide, provide the exact text copy AND a "Visual Concept" so the designer knows what to draw.`

    const userPrompt = `Turn this messy idea into a Cuemath Carousel storyboard: ${prompt}`

    try {
      const { object } = await generateObject({
        model: aiModel('gemini-2.5-flash'), 
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.7,
        output: 'array',
        schema: z.object({
          slides: z.array(z.object({
            slideNumber: z.number(),
            slideType: z.enum(['Hook', 'Build', 'Takeaway']),
            text: z.string().describe("The exact text written on the slide"),
            visualConcept: z.string().describe("A brief description of the background image or illustration for this slide")
          })),
          caption: z.string().describe("The Instagram caption to accompany the post"),
          hashtags: z.array(z.string())
        })
      })

      object.forEach((post: any) => {
        let formattedContent = post.slides.map((s: any) => 
          `📱 SLIDE ${s.slideNumber} [${s.slideType}]\n📝 Copy: ${s.text}\n🎨 Visual Idea: ${s.visualConcept}`
        ).join('\n\n---\n\n');

        formattedContent += `\n\n====================\n\n💬 POST CAPTION:\n${post.caption}`;

        generatedPosts.push({
          id: `cuemath-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          platform: "Instagram Carousel", // <-- REVERTED TO REAL NAME
          content: formattedContent,
          title: "Cuemath Social Media Studio",
          hashtags: post.hashtags || [],
        })
      })
    } catch (error) {
      console.error(`Error generating Cuemath content:`, error)
      return NextResponse.json({ error: "Failed to generate carousel structure." }, { status: 500 })
    }

    if (generatedPosts.length === 0) {
      return NextResponse.json({ error: "Failed to generate any content" }, { status: 500 })
    }

    return NextResponse.json({ posts: generatedPosts })
  } catch (error) {
    console.error("Error in generate-content API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}