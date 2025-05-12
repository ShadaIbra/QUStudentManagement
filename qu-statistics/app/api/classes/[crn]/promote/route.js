import { promotePendingToInProgress } from '@/repos/classes';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS - CORS preflight response
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}

export async function PATCH(req, { params }) {
    const { crn } = params;
    try {
        await promotePendingToInProgress(crn);
        return new Response('Students promoted', {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to promote students', {
            status: 500,
            headers,
        });
    }
}
