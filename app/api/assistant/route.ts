import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

const openAIApiKey = process.env.OPENAI_API_KEY;
if (!openAIApiKey) throw new Error(`Expected env var SUPABASE_URL`);

async function waitForRunCompletion(run: any, thread: any) {
    while (run.status === 'queued' || run.status === 'in_progress') {
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        setTimeout(() => {}, 1000); // Wait for 1 second before checking again
    }
    return run;
}

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/assistant ${JSON.stringify(req.body)}`);

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1];
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided');
        }

        const openai = new OpenAI({ apiKey: openAIApiKey });
        const data = await req.json();
        console.log(data);
        const question = data.question;
        const history = data.history;
        const activeAssistantId = data.activeAssistant.id;

        const assistant = await openai.beta.assistants.retrieve(activeAssistantId);

        const thread = await openai.beta.threads.create();

        const message = await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: question,
        });

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
        });
        console.log('run ===> ', run);

        const completedRun = await waitForRunCompletion(run, thread);
        console.log('completed run ===> ', completedRun);

        const messages = await openai.beta.threads.messages.list(thread.id, {
            order: 'asc',
            after: message.id,
        });
        console.log('messages ===> ', messages);

        console.log('messages[0] ===> ', messages.data[0].content);

        const content = messages.data[0].content[0];
        const answer = content.text ? content.text.value : '';
        return NextResponse.json({ answer }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ answer: 'Something went wrong!' }, { status: 500 });
    }
}
