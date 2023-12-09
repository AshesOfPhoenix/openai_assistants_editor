import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/assistant/list ${JSON.stringify(req.body)}`);

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1];
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided');
        }

        const openai = new OpenAI({ apiKey: openAIApiKey });
        const assistantsObject = await openai.beta.assistants.list();

        const assistants = assistantsObject.data.map((assistant: any) => {
            return {
                ...assistant,
                active: false,
                label: assistant.id.toLowerCase(),
            };
        });

        return NextResponse.json(assistants, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ answer: 'Something went wrong!' }, { status: 500 });
    }
}
