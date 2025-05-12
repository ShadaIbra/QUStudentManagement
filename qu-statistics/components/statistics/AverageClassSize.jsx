import { getAverageClassSizePerCourse } from "@/app/actions";

export default async function AverageClassSize() {
  const data = await getAverageClassSizePerCourse();

  return (
    <div className="avg-size">
      <h2>Top 5 Courses by Avg Class Size</h2>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Average Size</th>
          </tr>
        </thead>
        <tbody>
          {data.map((course, i) => (
            <tr key={i}>
              <td>{course.courseName}</td>
              <td>{course.avgSize}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
