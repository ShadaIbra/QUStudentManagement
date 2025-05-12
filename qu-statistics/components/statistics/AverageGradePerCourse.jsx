import { getAverageGradePerCourse } from "@/app/actions";

export default async function AverageGradePerCourse() {
  const averageGrades = await getAverageGradePerCourse();

  return (
    <div className="stat-card">
      <h2>Average Grade Per Course</h2>
      <table className="average-grade-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Average Grade</th>
          </tr>
        </thead>
        <tbody>
          {averageGrades.map((item, index) => (
            <tr key={index}>
              <td>{item.courseCode}</td>
              <td>{parseFloat(item.averageGrade).toFixed(2)}</td>{" "}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
