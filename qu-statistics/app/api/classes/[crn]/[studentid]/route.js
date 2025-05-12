// Patch this class of this student (for instructor-grades to update grade)
import { updateStudentGrade } from '@/repos/classes';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers,
    });
}

export async function PATCH(request, { params }) {
    const { crn, studentid } = params;
    const { grade } = await request.json();

    try {
        const updated = await updateStudentGrade(crn, studentid, grade);
        return new Response(JSON.stringify(updated), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(`Failed to update grade for student ${studentid} in class ${crn}:`, error);
        return new Response('Server Error', { status: 500, headers });
    }
}
