import { getAverageGradePerCourse } from "@/app/actions";

export default async function AverageGradePerCourse() {
  const averageGrades = await getAverageGradePerCourse();

  return (
    <div className="avg-grade">
      <h3>Average Grade Per Course</h3>
      <ul>
        {averageGrades.map((item, index) => (
          <li key={index}>
            {item.courseCode}: {item.averageGrade.toFixed(2)} average grade
          </li>
        ))}
      </ul>
    </div>
  );
}
