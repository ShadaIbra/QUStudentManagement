import { getTotalStudentsPerCategory } from "@/app/actions";

export default async function TotalStudentsPerCategory() {
  const studentsPerCategory = await getTotalStudentsPerCategory();

  return (
    <div className="stat-card">
      <h2>Total Students Per Course Category</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Students</th>
          </tr>
        </thead>
        <tbody>
          {studentsPerCategory.map((item, index) => (
            <tr key={index}>
              <td>{item.categoryName}</td>
              <td>{item.studentCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
