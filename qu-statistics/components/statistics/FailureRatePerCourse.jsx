"use client";

import { useEffect, useState } from "react";
import { getFailureRatePerCourse } from "@/app/actions";

const FailureRatePerCourse = () => {
  const [failureRates, setFailureRates] = useState([]);

  useEffect(() => {
    const fetchFailureRates = async () => {
      const data = await getFailureRatePerCourse();
      setFailureRates(data);
    };

    fetchFailureRates();
  }, []);

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
};

export default FailureRatePerCourse;
