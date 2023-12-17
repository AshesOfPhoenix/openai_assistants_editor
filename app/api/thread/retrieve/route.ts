import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/thread/retrieve ${JSON.stringify(req.body)}`)

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1]
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided')
        }

        const openai = new OpenAI({ apiKey: openAIApiKey })
        const data = await req.json()
        const threadId = data.threadId

        const thread = await openai.beta.threads.retrieve(threadId)

        return NextResponse.json({ answer: thread }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { answer: 'Something went wrong!' },
            { status: 500 }
        )
    }
}
