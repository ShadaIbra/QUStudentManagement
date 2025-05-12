import { getFailureRatePerCategory } from "@/app/actions";

export default async function FailureRatePerCategory() {
  const failureRates = await getFailureRatePerCategory();

  return (
    <div className="stat-card">
      <h2>Failure Rate Per Course Category</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Failure Rate</th>
          </tr>
        </thead>
        <tbody>
          {failureRates.map((item, index) => (
            <tr key={index}>
              <td>{item.categoryName}</td>
              <td>{item.failureRate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
