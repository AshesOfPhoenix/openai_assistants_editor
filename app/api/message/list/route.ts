import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/message/list ${JSON.stringify(req.body)}`);

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1];
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided');
        }

        const openai = new OpenAI({ apiKey: openAIApiKey });
        const data = await req.json();
        const threadId = data.threadId;

        if (!threadId) {
            return NextResponse.json({ answer: 'Missing threadId' }, { status: 400 });
        }

        const messages = await openai.beta.threads.messages.list(threadId, { order: 'asc' });

        return NextResponse.json({ answer: messages }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ answer: 'Something went wrong!' }, { status: 500 });
    }
}
