import { getClassesByStatus } from '@/repos/classes';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request, { params }) {
    const { status } = await params;

    try {
        const classes = await getClassesByStatus(status);

        return new Response(JSON.stringify(classes), {
            status: 200,
            headers,
        });
    } catch (err) {
        console.error(`Failed to fetch classes with status "${status}":`, err);
        return new Response('Server Error', {
            status: 500,
            headers,
        });
    }
}
