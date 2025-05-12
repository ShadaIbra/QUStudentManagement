import { getTop3InstructorsByClasses } from "@/app/actions";

export default async function Top3Instructors() {
  const topInstructors = await getTop3InstructorsByClasses();

  return (
    <div className="top-instructors">
      <h3>Top 3 Instructors by Number of Classes</h3>
      <ul>
        {topInstructors.map((instructor) => (
          <li key={instructor.id}>
            {instructor.name} – {instructor._count.classes} classes
          </li>
        ))}
      </ul>
    </div>
  );
}
