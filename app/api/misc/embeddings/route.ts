import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { NextRequest, NextResponse } from 'next/server';
import client from '@/supabase/client';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const res = await axios.get('http://localhost:3000/api/calendar');

        let events = [
            'Status: confirmed, Summary: Workout, Start time: 2023-10-31T19:00:00+01:00, End time: 2023-10-31T22:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Job, Start time: 2023-11-01T08:00:00+01:00, End time: 2023-11-01T16:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Workout, Start time: 2023-11-01T16:45:00+01:00, End time: 2023-11-01T19:45:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Job, Start time: 2023-11-02T08:00:00+01:00, End time: 2023-11-02T16:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Workout, Start time: 2023-11-02T19:00:00+01:00, End time: 2023-11-02T22:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Job, Start time: 2023-11-03T08:00:00+01:00, End time: 2023-11-03T16:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Workout, Start time: 2023-11-03T16:45:00+01:00, End time: 2023-11-03T19:45:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Hiking, Start time: 2023-11-04T06:00:00+01:00, End time: 2023-11-04T09:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Work, Start time: 2023-11-04T13:00:00+01:00, End time: 2023-11-04T16:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
            'Status: confirmed, Summary: Date night, Start time: 2023-11-04T20:00:00+01:00, End time: 2023-11-04T23:00:00+01:00, Creator: kristjan.krizman@gmail.com, Organizer: Supacal',
        ];

        events = res.data;

        const eventObjects = events.map((event, index) => {
            const eventSplit = event.split(' ');
            // Return event object converted from string
            // After splitting by space, we have an array of strings item[1] == status, item[3] == summary, item[5] == start, item[7] == end, item[9] == creator, item[11] == organizer
            const start = new Date(eventSplit[6].replace(',', ''));
            const end = new Date(eventSplit[9].replace(',', ''));
            return {
                // status: eventSplit[1],
                // summary: eventSplit[3],
                // creator: eventSplit[11],
                // organizer: eventSplit[13],
                startYear: start.getFullYear(),
                startMonth: start.getMonth() + 1,
                startDay: start.getDate(),
                startHour: start.getHours(),
                startMinute: start.getMinutes(),
                endYear: end.getFullYear(),
                endMonth: end.getMonth() + 1,
                endDay: end.getDate(),
                endHour: end.getHours(),
                endMinute: end.getMinutes(),
            };
        });

        console.log('creating embeddings');
        await SupabaseVectorStore.fromTexts(events, eventObjects, new OpenAIEmbeddings(), {
            client,
            tableName: 'documents',
        });
        console.log('done');
    } catch (err) {
        console.log(err);
    }
    return NextResponse.json({ message: 'Created embeddings!' }, { status: 200 });
}
