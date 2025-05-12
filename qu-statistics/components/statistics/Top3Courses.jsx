import { useEffect, useState } from "react";
import { getTop3Courses } from "@/app/actions";

const TopCourses = () => {
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const fetchTopCourses = async () => {
      const courses = await getTop3Courses();
      setTopCourses(courses);
    };

    fetchTopCourses();
  }, []);

  return (
    <div className="top-courses">
      <h3>Top 3 Most Popular Courses</h3>
      <ul>
        {topCourses.map((course, index) => (
          <li key={index}>
            {course.courseCode} - {course.studentCount} students
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCourses;
