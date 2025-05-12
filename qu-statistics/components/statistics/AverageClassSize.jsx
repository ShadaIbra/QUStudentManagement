"use client";

import { useEffect, useState } from "react";
import { getAverageClassSizePerCourse } from "@/app/actions";

const AverageClassSize = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAverageClassSizePerCourse();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div className="average-size">
      <h3>Top 5 Courses by Average Class Size</h3>
      <ul>
        {data.map((course, index) => (
          <li key={index}>
            {course.name} – {course.avgSize} seats per class
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AverageClassSize;
