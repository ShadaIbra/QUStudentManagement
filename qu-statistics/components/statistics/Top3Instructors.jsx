import { useEffect, useState } from "react";
import { getTop3InstructorsByClasses } from "@/app/actions";

const Top3Instructors = () => {
  const [topInstructors, setTopInstructors] = useState([]);

  useEffect(() => {
    const fetchTopInstructors = async () => {
      const result = await getTop3InstructorsByClasses();
      setTopInstructors(result);
    };

    fetchTopInstructors();
  }, []);

  return (
    <div className="top-instructors">
      <h3>Top 3 Instructors by Number of Classes</h3>
      <ul>
        {topInstructors.map((instructor) => (
          <li key={instructor.id}>
            {instructor.name} – {instructor._count.classes} classes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Top3Instructors;
