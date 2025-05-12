import { getInstructorWithMostClasses } from "@/app/actions";

export default async function InstructorWithMostClasses() {
  const data = await getInstructorWithMostClasses();

  if (!data) return null;

  return (
    <div className="stat-card">
      <h2>Instructor with Most Classes</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Instructor Name</th>
            <th>Number of Classes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.name}</td>
            <td>{data.classCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
