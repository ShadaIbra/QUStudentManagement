import { getTop3InstructorsByClasses } from "@/app/actions";

export default async function Top3Instructors() {
  const topInstructors = await getTop3InstructorsByClasses();

  return (
    <div className="stat-card">
      <h2>Top 3 Instructors by Number of Classes</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Instructor</th>
            <th>Number of Classes</th>
          </tr>
        </thead>
        <tbody>
          {topInstructors.map((instructor) => (
            <tr key={instructor.id}>
              <td>{instructor.name}</td>
              <td>{instructor.classCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
