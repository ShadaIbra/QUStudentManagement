import { getTotalStudentsPerCategory } from "@/app/actions";

export default async function TotalStudentsPerCategory() {
  const studentsPerCategory = await getTotalStudentsPerCategory();

  return (
    <div className="stat-card">
      <h2>Total Students Per Course Category</h2>
      <ul>
        {studentsPerCategory.map((item, index) => (
          <li key={index}>
            {item.categoryName}: {item.studentCount} students
          </li>
        ))}
      </ul>
    </div>
  );
}
