import { getMostPopularCategory } from "@/app/actions";

export default async function MostPopularCategory() {
  const data = await getMostPopularCategory();

  if (!data) return null;

  return (
    <div className="stat-card">
      <h2>Most Popular Category</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Enrollments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.categoryName}</td>
            <td>{data.totalEnrollments}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
