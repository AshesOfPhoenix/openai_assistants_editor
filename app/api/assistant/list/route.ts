import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const allTools = [
    {
        type: 'retrieval',
        active: false,
    },
    {
        type: 'code_interpreter',
        active: false,
    },
    {
        type: 'function',
        active: false,
    },
]

export async function POST(req: NextRequest) {
    try {
        console.log(`POST /api/assistant/list ${JSON.stringify(req.body)}`)

        const openAIApiKey = req.headers.get('Authorization')?.split(' ')[1]
        if (!openAIApiKey) {
            throw new Error('No OpenAI API key provided')
        }

        const openai = new OpenAI({ apiKey: openAIApiKey })
        const assistantsObject = await openai.beta.assistants.list()

        const assistants = await Promise.all(
            assistantsObject.data.map(async (assistant: any) => {
                // Enrich assistant tool objects with active property
                assistant.tools = assistant.tools.map((tool: any) => {
                    return {
                        ...tool,
                        active: true,
                    }
                })
                // Add all tools to assistant, which are not present in the allTools but with active property set to false
                assistant.tools = assistant.tools.concat(
                    allTools.filter(
                        (tool) =>
                            !assistant.tools.find(
                                (assistantTool: any) =>
                                    assistantTool.type === tool.type
                            )
                    )
                )

                const files = await Promise.all(
                    assistant.file_ids.map(async (fileId: string) => {
                        const fileObject = await openai.files.retrieve(fileId)
                        return fileObject
                    })
                )

                return {
                    ...assistant,
                    pendingChanges: false,
                    label: assistant.id.toLowerCase(),
                    files: files,
                }
            })
        )

        return NextResponse.json(assistants, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { answer: 'Something went wrong!' },
            { status: 500 }
        )
    }
}
