import { getFailureRatePerCourse } from "@/app/actions";

export default async function FailureRatePerCourse() {
  const failureRates = await getFailureRatePerCourse();

  return (
    <div className="stat-card">
      <h2>Failure Rate Per Course</h2>
      <table className="failure-rate-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Failure Rate</th>
          </tr>
        </thead>
        <tbody>
          {failureRates.map((item, index) => (
            <tr key={index}>
              <td>{item.courseCode}</td>
              <td>{item.failureRate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
