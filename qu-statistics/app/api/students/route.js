import { getAllStudents } from '@/repos/students';

// Get all students (for login)
// export async function GET() {
//   try {
//     const students = await getAllStudents();

//     return new Response(JSON.stringify(students), {
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*', 
//       },
//     });
//   } catch (error) {
//     console.error('Failed to fetch students:', error);
//     return new Response('Server Error', { status: 500 });
//   }
// }

