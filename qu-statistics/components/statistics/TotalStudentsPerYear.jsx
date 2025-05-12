"use client";

import { useEffect, useState } from "react";
import { getTotalStudentsPerYear } from "@/app/actions";

const TotalStudentsPerYear = () => {
  const [studentsPerYear, setStudentsPerYear] = useState([]);

  useEffect(() => {
    const fetchStudentsPerYear = async () => {
      const data = await getTotalStudentsPerYear();
      setStudentsPerYear(data);
    };

    fetchStudentsPerYear();
  }, []);

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
};

export default TotalStudentsPerYear;
