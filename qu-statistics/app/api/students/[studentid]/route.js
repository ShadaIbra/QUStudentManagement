import { getStudentById } from '@/repos/students';
import { NextResponse } from 'next/server';

// Get certain student
export async function GET(_, { params }) {
    const { studentid } = await params;

    try {
        const student = await getStudentById(studentid);
        if (!student) {
            return new Response('Student not found', { status: 404 });
        }

        return new Response(JSON.stringify(student), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // for CORS access
            },
        });
    } catch (error) {
        console.error(`Failed to fetch student ${studentid}:`, error);
        return new Response('Server Error', { status: 500 });
    }
}
