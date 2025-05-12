import { getStudentCoursesByType } from '@/repos/students';

// Get for this student, the pending/ inprogreess/ completed courses (for student-course)
// export async function GET(request, { params }) {
//   const { studentid, classType } = await params;

//   try {
//     const courses = await getStudentCoursesByType(studentid, classType);

//     return new Response(JSON.stringify(courses), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//       },
//     });
//   } catch (err) {
//     console.error(`Failed to fetch ${classType} courses for student ${studentid}:`, err);
//     return new Response("Server Error", { status: 500 });
//   }
// }



// Patch for this student, add a class into pending courses (for student-main registeration)
e