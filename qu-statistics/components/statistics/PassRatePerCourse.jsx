import { getPassRatePerCourse } from "@/app/actions";

export default async function PassRatePerCourse() {
  const passRates = await getPassRatePerCourse();

  return (
    <div className="stat-card">
      <h2>Pass Rate Per Course</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Pass Rate</th>
          </tr>
        </thead>
        <tbody>
          {passRates.map((item, index) => (
            <tr key={index}>
              <td>{item.courseCode}</td>
              <td>{parseFloat(item.passRate).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
