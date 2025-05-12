import { getStudentsWithAtLeastOneFailure } from "@/app/actions";

export default async function StudentsPerFailures() {
  const count = await getStudentsWithAtLeastOneFailure();

  return (
    <div className="students-with-failure">
      <h3>Students Who Failed At Least One Course</h3>
      <p>{count} students</p>
    </div>
  );
}
