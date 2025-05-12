import TopCourses from "../components/statistics/Top3Courses";
import TotalStudentsPerYear from "../components/statistics/TotalStudentsPerYear";
import TotalStudentsPerCategory from "../components/statistics/TotalStudentsPerCategory";
import TotalStudentsPerCourse from "../components/statistics/TotalStudentsPerCourse";
import FailureRatePerCourse from "../components/statistics/FailureRatePerCourse";
import FailureRatePerCategory from "../components/statistics/FailureRatePerCategory";
import AverageGradePerCourse from "../components/statistics/AverageGradePerCourse";
import Top3Instructors from "../components/statistics/Top3Instructors";
import MostPopularCategory from "../components/statistics/MostPopularCategory";
import AverageClassSize from "../components/statistics/AverageClassSize";

const StatisticsPage = () => {
  return (
    <div className="statistics">
      <h1>Statistics</h1>
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
    </div>
  );
};

export default StatisticsPage;
