import { useEffect, useState } from "react";
import { getFailureRatePerCategory } from "@/app/actions";

const FailureRatePerCategory = () => {
  const [failureRates, setFailureRates] = useState([]);

  useEffect(() => {
    const fetchFailureRates = async () => {
      const data = await getFailureRatePerCategory();
      setFailureRates(data);
    };

    fetchFailureRates();
  }, []);

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
};

export default FailureRatePerCategory;
