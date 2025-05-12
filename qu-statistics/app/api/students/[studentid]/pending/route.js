import { addPendingCourse, removePendingCourse } from '@/repos/students';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS - Handle preflight CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}

// POST - Add a pending course for a student
export async function POST(req, { params }) {
    const { studentid } = params;
    const { classCrn } = await req.json();

    try {
        await addPendingCourse(studentid, classCrn);
        return new Response('Registered successfully', {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error adding pending course:', error);
        return new Response('Failed to register', {
            status: 500,
            headers,
        });
    }
}

// DELETE - Remove a pending course for a student
export async function DELETE(req, { params }) {
    const { studentid } = params;
    const { classCrn } = await req.json();

    try {
        await removePendingCourse(studentid, classCrn);
        return new Response('Unregistered successfully', {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error removing pending course:', error);
        return new Response('Failed to unregister', {
            status: 500,
            headers,
        });
    }
}
