import { getMostPopularCategory } from "@/app/actions";

export default async function MostPopularCategory() {
  const data = await getMostPopularCategory();

  if (!data) return null;

  return (
    <div className="popular-category">
      <h3>Most Popular Category</h3>
      <p>
        {data.categoryName} – {data.totalEnrollments} total enrollments
      </p>
    </div>
  );
}
