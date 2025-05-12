import { useEffect, useState } from "react";
import { getTotalStudentsPerCategory } from "@/app/actions";

const TotalStudentsPerCategory = () => {
  const [studentsPerCategory, setStudentsPerCategory] = useState([]);

  useEffect(() => {
    const fetchStudentsPerCategory = async () => {
      const data = await getTotalStudentsPerCategory();
      setStudentsPerCategory(data);
    };

    fetchStudentsPerCategory();
  }, []);

  return (
    <div className="students-category">
      <h3>Total Students Per Course Category</h3>
      <ul>
        {studentsPerCategory.map((item, index) => (
          <li key={index}>
            {item.categoryName}: {item.studentCount} students
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TotalStudentsPerCategory;
