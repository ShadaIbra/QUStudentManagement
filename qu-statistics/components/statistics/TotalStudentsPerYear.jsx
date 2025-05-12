import { getTotalStudentsPerYear } from "@/app/actions";

export default async function TotalStudentsPerYear() {
  const studentsPerYear = await getTotalStudentsPerYear();

  return (
    <div className="students-year">
      <h3>Total Students Per Year</h3>
      <ul>
        {studentsPerYear.map((item, index) => (
          <li key={index}>
            {item.year}: {item.studentCount} students
          </li>
        ))}
      </ul>
    </div>
  );
}
