import { getFailureRatePerCategory } from "@/app/actions";

export default async function FailureRatePerCategory() {
  const failureRates = await getFailureRatePerCategory();

  return (
    <div className="failures-category">
      <h3>Failure Rate Per Course Category</h3>
      <ul>
        {failureRates.map((item, index) => (
          <li key={index}>
            {item.categoryName}: {item.failureRate.toFixed(2)} failure rate
          </li>
        ))}
      </ul>
    </div>
  );
}
