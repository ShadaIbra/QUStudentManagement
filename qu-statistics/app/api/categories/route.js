import { getAllCategories } from '@/repos/categories';

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

// Get all categories to list them for ‘admin-manage’ to create a course
export async function GET() {
    try {
        const categories = await getAllCategories();
        return new Response(JSON.stringify(categories), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return new Response('Server Error', {
            status: 500,
            headers,
        });
    }
}
