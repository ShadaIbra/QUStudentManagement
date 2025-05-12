import { getCoursesPerStudent } from "@/app/actions";

export default async function TotalCoursesPerStudent() {
  const coursesPerStudent = await getCoursesPerStudent();

  return (
    <div className="stat-card">
      <h2>Total Courses per Student</h2>
      <ul>
        {coursesPerStudent.map((item) => (
          <li key={item.studentId}>
            Student {item.studentId} has participated in {item.coursesCount}{" "}
            unique courses
          </li>
        ))}
      </ul>
    </div>
  );
}
