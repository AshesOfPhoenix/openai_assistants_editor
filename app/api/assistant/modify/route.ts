import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/assistant/modify ${JSON.stringify(req.body)}`);

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1];
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided');
        }

        const data = await req.json();
        const assistant = data.assistant;

        const openai = new OpenAI({ apiKey: openAIApiKey });
        const { name, tools, file_ids, instructions, model }: Assistant = assistant;

        //! TODO: Implement tool saving with custom functions
        const formatedTools = tools.map((tool) => {
            return {
                type: tool.type,
            };
        });
        const response = await openai.beta.assistants.update(assistant.id, {
            name,
            file_ids,
            instructions,
            model,
        });

        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ answer: 'Something went wrong!' }, { status: 500 });
    }
}
