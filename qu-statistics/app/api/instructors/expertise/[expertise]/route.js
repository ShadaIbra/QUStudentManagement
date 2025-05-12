import { getInstructorsByExpertise } from '@/repos/instructors';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers });
}

export async function GET(_, { params }) {
    const { expertise } = params;

    try {
        const instructors = await getInstructorsByExpertise(expertise);
        return new Response(JSON.stringify(instructors), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error fetching instructors by expertise:', error);
        return new Response('Server Error', {
            status: 500,
            headers,
        });
    }
}
