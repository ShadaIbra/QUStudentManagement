import { getTotalStudentsPerCourse } from "@/app/actions";

export default async function TotalStudentsPerCourse() {
  const studentsPerCourse = await getTotalStudentsPerCourse();

  return (
    <div className="stat-card">
      <h2>Total Students Per Course</h2>
      <ul>
        {studentsPerCourse.map((item, index) => (
          <li key={index}>
            {item.courseCode}: {item.studentCount} students
          </li>
        ))}
      </ul>
    </div>
  );
}
