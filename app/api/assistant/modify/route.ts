import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/assistant/modify ${JSON.stringify(req.body)}`)

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1]
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided')
        }

        const data = await req.json()
        const assistant = data.assistant

        const openai = new OpenAI({ apiKey: openAIApiKey })
        const { name, tools, file_ids, instructions, model }: Assistant =
            assistant

        //! TODO: Implement tool saving with custom functions
        // Filter tools with active set to false
        const activeTools = tools.filter((tool) => tool.active)
        const formatedTools = activeTools.map((tool) => {
            const { active, ...rest } = tool

            if (tool.type === 'code_interpreter') {
                return rest as OpenAI.Beta.Assistants.AssistantUpdateParams.AssistantToolsCode
            } else if (tool.type === 'retrieval') {
                return rest as OpenAI.Beta.Assistants.AssistantUpdateParams.AssistantToolsRetrieval
            } else if (tool.type === 'function') {
                return rest as OpenAI.Beta.Assistants.AssistantUpdateParams.AssistantToolsFunction
            } else {
                throw new Error(`Invalid tool type: ${tool.type}`)
            }
        })
        const response = await openai.beta.assistants.update(assistant.id, {
            name,
            file_ids,
            instructions,
            model,
            tools: formatedTools,
        })

        return NextResponse.json(response, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { answer: 'Something went wrong!' },
            { status: 500 }
        )
    }
}
