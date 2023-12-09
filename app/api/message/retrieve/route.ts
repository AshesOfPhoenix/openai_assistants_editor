import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/message/retrieve ${JSON.stringify(req.body)}`);

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1];
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided');
        }

        const openai = new OpenAI({ apiKey: openAIApiKey });
        const data = await req.json();
        const messageId = data.messageId;
        const threadId = data.threadId;

        const message = await openai.beta.threads.messages.retrieve(threadId, messageId);

        return NextResponse.json({ answer: message }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ answer: 'Something went wrong!' }, { status: 500 });
    }
}
