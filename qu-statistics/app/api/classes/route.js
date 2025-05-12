import { createClass } from '@/repos/classes';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}

// Post a new class
export async function POST(req) {
    try {
        const body = await req.json();
        const newClass = await createClass(body);

        return new Response(JSON.stringify(newClass), {
            status: 201,
            headers,
        });
    } catch (error) {
        console.error('Error creating class:', error);
        return new Response('Failed to create class', {
            status: 500,
            headers,
        });
    }
}
