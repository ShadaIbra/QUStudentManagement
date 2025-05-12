import { getStudentsWithAtLeastOneFailure } from "@/app/actions";

export default async function StudentsPerFailures() {
  const count = await getStudentsWithAtLeastOneFailure();

  return (
    <div className="stat-card">
      <h2>Students Who Failed At Least One Course</h2>
      <p>{count} students</p>
    </div>
  );
}
