import { getStudentsWithAtLeastOneFailure } from "@/app/actions";

export default async function StudentsPerFailures() {
  const count = await getStudentsWithAtLeastOneFailure();

  return (
    <div className="stat-card">
      <h2>Students Who Failed At Least One Course</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Number of Students</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{count} students</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
