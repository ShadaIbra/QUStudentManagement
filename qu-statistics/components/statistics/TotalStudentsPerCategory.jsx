import { getTotalStudentsPerCategory } from "@/app/actions";

export default async function TotalStudentsPerCategory() {
  const studentsPerCategory = await getTotalStudentsPerCategory();

  return (
    <div className="students-category">
      <h3>Total Students Per Course Category</h3>
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
