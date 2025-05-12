import { updateClassByCrn } from '@/repos/classes';
import { getClassWithStudents } from '@/repos/classes';

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


export async function PATCH(request, { params }) {
    const crn = params.crn;
    const body = await request.json();

    try {
        const updatedClass = await updateClassByCrn(crn, body);
        return new Response(JSON.stringify(updatedClass), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(`Failed to update class ${crn}:`, error);
        return new Response('Server Error', {
            status: 500,
            headers,
        });
    }
}

// Get the class with this crn (for instructor-grades)
export async function GET(_, { params }) {
    const { crn } = params;

    try {
        const result = await getClassWithStudents(crn);
        if (!result) {
            return new Response('Class not found', { status: 404, headers });
        }
        return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (error) {
        console.error('Error fetching class with pending students:', error);
        return new Response('Server Error', { status: 500, headers });
    }
}

// Patch the class with this crn (for validating in admin-main)