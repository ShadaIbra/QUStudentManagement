import { getAllCourses, createCourse } from '@/repos/courses';

// Get all courses (for admin-manage)
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}

export async function GET() {
    try {
        const courses = await getAllCourses();
        return new Response(JSON.stringify(courses), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        return new Response('Server Error', {
            status: 500,
            headers,
        });
    }
}

// Post new course
export async function POST(req) {
    try {
        const body = await req.json();
        const newCourse = await createCourse(body);

        return new Response(JSON.stringify(newCourse), {
            status: 201,
            headers,
        });
    } catch (error) {
        console.error('Error creating course:', error);
        return new Response('Failed to create course', {
            status: 500,
            headers,
        });
    }
}