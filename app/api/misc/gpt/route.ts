import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions.mjs';
const openai = new OpenAI();

const openAIApiKey = process.env.OPENAI_API_KEY;
if (!openAIApiKey) throw new Error(`Expected env var SUPABASE_URL`);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log(data);

        const thread = await openai.beta.threads.create({
            messages: [
                {
                    role: 'user',
                    content: 'Create 3 data visualizations based on the trends in this file.',
                },
            ],
        });

        const threadFetched = await openai.beta.threads.retrieve(thread.id);
        console.log(threadFetched);

        const assistant = await openai.beta.assistants.create({
            name: 'Data visualizer',
            description:
                'You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.',
            model: 'gpt-4-1106-preview',
            tools: [{ type: 'code_interpreter' }],
        });

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            model: 'gpt-4-1106-preview',
            instructions: 'additional instructions',
            tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
        });

        const threadFetched2 = await openai.beta.threads.retrieve(thread.id);
        console.log(threadFetched2);

        return NextResponse.json({ answer: run }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ answer: 'Something went wrong!' }, { status: 500 });
    }
}
