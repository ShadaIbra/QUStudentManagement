import {
    getInstructorById,
    addPreferredCourse,
    removePreferredCourse
} from '@/repos/instructors';


// patch the instructors prefered list (for instructor-preferences)
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers });
}

export async function GET(_, { params }) {
    const { instructorid } = await params;

    try {
        const instructor = await getInstructorById(instructorid);

        if (!instructor) {
            return new Response('Instructor not found', { status: 404, headers });
        }

        return new Response(JSON.stringify(instructor), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(`Failed to fetch instructor ${instructorid}:`, error);
        return new Response('Server Error', { status: 500, headers });
    }
}


export async function POST(req, { params }) {
    const { instructorid } = await params;
    const { courseCode } = await req.json();

    try {
        await addPreferredCourse(instructorid, courseCode);
        return new Response('Course preference added', { status: 200, headers });
    } catch (error) {
        console.error('Failed to add preference:', error);
        return new Response('Server error', { status: 500, headers });
    }
}

export async function DELETE(req, { params }) {
    const { instructorid } = await params;
    const { courseCode } = await req.json();

    try {
        await removePreferredCourse(instructorid, courseCode);
        return new Response('Course preference removed', { status: 200, headers });
    } catch (error) {
        console.error('Failed to remove preference:', error);
        return new Response('Server error', { status: 500, headers });
    }
}