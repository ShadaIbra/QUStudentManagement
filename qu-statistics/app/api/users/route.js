import { getAllUsers } from '@/repos/users';

export async function GET() {
  try {
    const users = await getAllUsers();
    return new Response(JSON.stringify(users), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
      },
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return new Response('Server Error', { status: 500 });
  }
}
