import { getAllInstructors } from '@/repos/instructors';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}

// Get all instructors (for login and for admin-manage)
export async function GET() {
    try {
        const instructors = await getAllInstructors();
        return new Response(JSON.stringify(instructors), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return new Response('Failed to fetch instructors', {
            status: 500,
            headers,
        });
    }
}
