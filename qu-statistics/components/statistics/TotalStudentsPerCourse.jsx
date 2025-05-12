import { getTotalStudentsPerCourse } from "@/app/actions";

export default async function TotalStudentsPerCourse() {
  const studentsPerCourse = await getTotalStudentsPerCourse();

  return (
    <div className="students-course">
      <h3>Total Students Per Course</h3>
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
