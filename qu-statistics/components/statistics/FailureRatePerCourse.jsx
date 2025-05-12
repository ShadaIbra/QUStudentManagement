import { getFailureRatePerCourse } from "@/app/actions";

export default async function FailureRatePerCourse() {
  const failureRates = await getFailureRatePerCourse();

  return (
    <div className="failures-course">
      <h3>Failure Rate Per Course</h3>
      <ul>
        {failureRates.map((item, index) => (
          <li key={index}>
            {item.courseCode}: {item.failureRate.toFixed(2)} failure rate
          </li>
        ))}
      </ul>
    </div>
  );
}
