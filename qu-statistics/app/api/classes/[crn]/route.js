import { updateClassByCrn } from '@/repos/classes';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

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

// OPTIONS - CORS preflight response
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}


// Get the class with this crn (for instructor-grades)


// Patch the class with this crn (for validating in admin-main)