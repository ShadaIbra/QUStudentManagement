import { useEffect, useState } from "react";
import { getTotalStudentsPerCourse } from "@/app/actions";

const TotalStudentsPerCourse = () => {
  const [studentsPerCourse, setStudentsPerCourse] = useState([]);

  useEffect(() => {
    const fetchStudentsPerCourse = async () => {
      const data = await getTotalStudentsPerCourse();
      setStudentsPerCourse(data);
    };

    fetchStudentsPerCourse();
  }, []);

  return (
    <div className="students-course">
      <h3>Total Students Per Course</h3>
      <ul>
        {studentsPerCourse.map((item, index) => (
          <li key={index}>
            {item.courseCode}: {item.studentCount} students
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TotalStudentsPerCourse;
