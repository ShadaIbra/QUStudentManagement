import TopCourses from "./statistics/Top3Courses";
import TotalStudentsPerYear from "./statistics/TotalCoursesPerStudent";
import TotalStudentsPerCategory from "./statistics/TotalStudentsPerCategory";
import TotalStudentsPerCourse from "./statistics/TotalStudentsPerCourse";
import FailureRatePerCourse from "./statistics/FailureRatePerCourse";
import FailureRatePerCategory from "./statistics/FailureRatePerCategory";
import AverageGradePerCourse from "./statistics/AverageGradePerCourse";
import Top3Instructors from "./statistics/Top3Instructors";
import MostPopularCategory from "./statistics/MostPopularCategory";
import AverageClassSize from "./statistics/AverageClassSize";
import PassRatePerCourse from "./statistics/PassRatePerCourse";


import "/app/globals.css";

const StatisticsPage = () => {
  return (
    <div className="statistics-page">
      <h1>Statistics</h1>
      <div className="grid-container">
        <TopCourses />
        <TotalStudentsPerYear />
        <TotalStudentsPerCategory />
        <TotalStudentsPerCourse />
        <FailureRatePerCourse />
        <FailureRatePerCategory />
        <AverageGradePerCourse />
        <Top3Instructors />
        <MostPopularCategory />
        <AverageClassSize />
        <PassRatePerCourse />
       
      </div>
    </div>
  );
};

export default StatisticsPage;
