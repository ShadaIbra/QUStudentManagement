import { getInProgClassesByInstructor } from '@/repos/classes';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers });
}

export async function GET(req, { params }) {
    const { instructorid } = params;

    try {
        const classes = await getInProgClassesByInstructor(instructorid);
        return new Response(JSON.stringify(classes), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Failed to fetch in progress classes for instructor:', error);
        return new Response('Server Error', {
            status: 500,
            headers,
        });
    }
}
