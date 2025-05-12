import { useEffect, useState } from "react";
import { getMostPopularCategory } from "@/app/actions";

const MostPopularCategory = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMostPopularCategory();
      setData(result);
    };
    fetchData();
  }, []);

  if (!data) return null;

  return (
    <div className="popular-category">
      <h3>Most Popular Category</h3>
      <p>
        {data.categoryName} – {data.totalEnrollments} total enrollments
      </p>
    </div>
  );
};

export default MostPopularCategory;
