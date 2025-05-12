import { getOpenPreferenceCourses } from '@/repos/courses';

// Get all courses with preference = true (for instructor-preference)
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

export async function GET() {
  try {
    const courses = await getOpenPreferenceCourses();
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Failed to fetch preference-open courses:', error);
    return new Response('Server Error', {
      status: 500,
      headers,
    });
  }
}
