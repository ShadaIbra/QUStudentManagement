import { getTop3Courses } from "@/app/actions";

export default async function Top3Courses() {
  const data = await getTop3Courses();

  return (
    <div className="stat-card">
      <h2>Top 3 Courses by Class Count</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Number of Classes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((course, idx) => (
            <tr key={idx}>
              <td>{course.name}</td>
              <td>{course.classCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
