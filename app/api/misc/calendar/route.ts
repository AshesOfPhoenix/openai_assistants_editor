import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface EventList {
    calendarId: string;
    iCalUID?: string;
    maxAttendees?: number;
    maxResults?: number;
    orderBy?: string; // "startTime" or "updated"
    query?: string;
    showDeleted?: boolean;
    showHiddenInvitations?: boolean;
    singleEvents?: boolean;
    timeMax?: string;
    timeMin?: string;
    timeZone?: string;
    updatedMin?: string;
}

const eventList: EventList = {
    calendarId: 'b03543d0df23f9975a3cba9aa66371dd2ea6dfad6ad0f466b123a8c4b52c7120@group.calendar.google.com',
    maxAttendees: undefined,
    maxResults: 10,
    orderBy: 'startTime', // "startTime" or "updated"
    query: undefined,
    showDeleted: false,
    timeZone: undefined, //
};

export async function GET(req: NextRequest) {
    const queryParams = [
        `calendarId=${eventList.calendarId!}`,
        eventList.maxAttendees !== undefined ? `maxAttendees=${eventList.maxAttendees}` : '',
        eventList.maxResults !== undefined ? `maxResults=${eventList.maxResults}` : '',
        eventList.orderBy ? `orderBy=${eventList.orderBy}` : '',
        eventList.query ? `q=${eventList.query}` : '',
        eventList.showDeleted !== undefined ? `showDeleted=${eventList.showDeleted}` : '',
        eventList.timeZone ? `timeZone=${eventList.timeZone}` : '',
    ];

    const url = `https://v1.nocodeapi.com/ash1phoenix/calendar/CLFyYjxtkBpoVgIx/listEvents?${queryParams
        .filter(Boolean)
        .join('&')}`;

    try {
        return axios
            .get(url)
            .then(function (response: any) {
                const raw_events = response.data.items ?? [];

                if (raw_events === undefined) return NextResponse.json({});

                const events = response.data.items
                    .filter((event: any) => event.status !== 'cancelled')
                    .map((event: any) => {
                        let summary = event.summary;
                        let status = event.status;
                        let start = event.start.dateTime ?? event.start.date;
                        let end = event.end.dateTime ?? event.end.date;
                        // let attendees = event.attendees;
                        let creator = event.creator.email;
                        let organizer = event.organizer.displayName;
                        return `Status: ${status}, Summary: ${summary}, Start time: ${start}, End time: ${end}, Creator: ${creator}, Organizer: ${organizer}`;
                    });

                return NextResponse.json(events, { status: 200 });
            })
            .catch(function (error: any) {
                // handle error
                console.log(error);
                return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
            });
    } catch (err) {
        console.log(err);
    }
}

interface EventCreate {
    calendarId?: string;
    maxAttendees?: number;
    sendNotifications?: boolean;
    sendUpdates?: string;
    body?: {
        summary: string;
        location?: string;
        description?: string;
        start: {
            dateTime: string;
            timeZone: string;
        };
        end: {
            dateTime: string;
            timeZone: string;
        };
        recurrence?: string[];
        sendNotifications?: boolean;
        attendees?: {
            email: string;
        }[];
    };
}

const createEvent: EventCreate = {
    calendarId: 'b03543d0df23f9975a3cba9aa66371dd2ea6dfad6ad0f466b123a8c4b52c7120@group.calendar.google.com',
    body: {
        summary: 'Event summary',
        location: 'Event location details',
        description: 'Event description',
        start: {
            dateTime: '2021-02-21T21:00:00+05:30',
            timeZone: 'IST',
        },
        end: {
            dateTime: '2021-02-21T21:30:00+05:30',
            timeZone: 'IST',
        },
        recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        sendNotifications: true,
        attendees: [
            {
                email: 'hello@example.com',
            },
            {
                email: 'sales@example.com',
            },
        ],
    },
};

export async function POST(req: NextRequest): Promise<any> {
    try {
        const res = await axios.post('https://v1.nocodeapi.com/ash1phoenix/calendar/CLFyYjxtkBpoVgIx/event', req.body);
        return NextResponse.json(res.data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({});
    }
}
