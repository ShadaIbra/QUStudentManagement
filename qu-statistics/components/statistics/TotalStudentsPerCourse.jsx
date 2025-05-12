import { getTotalStudentsPerCourse } from "@/app/actions";

export default async function TotalStudentsPerCourse() {
  const studentsPerCourse = await getTotalStudentsPerCourse();

  return (
    <div className="stat-card">
      <h2>Total Students Per Course</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Total Students</th>
          </tr>
        </thead>
        <tbody>
          {studentsPerCourse.map((item, index) => (
            <tr key={index}>
              <td>{item.courseCode}</td>
              <td>{item.studentCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
