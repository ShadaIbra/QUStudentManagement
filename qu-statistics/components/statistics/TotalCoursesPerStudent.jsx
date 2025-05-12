import { getCoursesPerStudent } from "@/app/actions";

export default async function TotalCoursesPerStudent() {
  const coursesPerStudent = await getCoursesPerStudent();

  return (
    <div className="stat-card">
      <h2>Total Courses Per Student</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Number of Courses</th>
          </tr>
        </thead>
        <tbody>
          {coursesPerStudent.map((item) => (
            <tr key={item.studentId}>
              <td>{item.studentId}</td>
              <td>{item.coursesCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
