"use client";

import { useEffect, useState } from "react";
import { getStudentsWithAtLeastOneFailure } from "@/app/actions";

const StudentsPerFailures = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchFailureData = async () => {
      const result = await getStudentsWithAtLeastOneFailure();
      setCount(result);
    };

    fetchFailureData();
  }, []);

  return (
    <div className="students-with-failure">
      <h3>Students Who Failed At Least One Course</h3>
      <p>{count} students</p>
    </div>
  );
};

export default StudentsPerFailures;
