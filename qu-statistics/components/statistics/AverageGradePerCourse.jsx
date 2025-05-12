import { useEffect, useState } from "react";
import { getAverageGradePerCourse } from "@/app/actions";

const AverageGradePerCourse = () => {
  const [averageGrades, setAverageGrades] = useState([]);

  useEffect(() => {
    const fetchAverageGrades = async () => {
      const data = await getAverageGradePerCourse();
      setAverageGrades(data);
    };

    fetchAverageGrades();
  }, []);

  return (
    <div className="average-grade">
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
};

export default AverageGradePerCourse;
