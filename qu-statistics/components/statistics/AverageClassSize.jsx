import { getAverageClassSizePerCourse } from "@/app/actions";

export default async function AverageClassSize() {
  const data = await getAverageClassSizePerCourse();

  return (
    <div className="stat-card">
      <h2>Top 5 Courses by Avg Class Size</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Average Class Size</th>
          </tr>
        </thead>
        <tbody>
          {data.map((course, i) => (
            <tr key={i}>
              <td>{course.courseName}</td>
              <td>{parseFloat(course.avgSize).toFixed(2)}</td>{" "}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
