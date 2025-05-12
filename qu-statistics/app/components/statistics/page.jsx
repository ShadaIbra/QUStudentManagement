"use client";

import { useEffect, useState } from "react";
import { getAverageGradePerCourse } from "@/app/actions";
import { getClassCountPerCourse } from "@/app/actions";
import { getFailureRatePerCourse } from '@/app/actions';
import { getStudentCountPerCategory } from '@/app/actions';
import { getStudentCountPerCourse } from '@/app/actions';
import { getStudentCountPerYear } from '@/app/actions';
import { getStudentsWithFailures } from '@/app/actions';
import { getTop3Courses } from '@/app/actions';
import { getTop3Instructors } from '@/app/actions';
import { getValidatedClassCounts } from '@/app/actions';

export default function AverageGradePerCourse() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAverageGradePerCourse().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Average Grade per Course</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function ClassCountPerCourse() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getClassCountPerCourse().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Number of Classes per Course</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function FailureRatePerCourse() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getFailureRatePerCourse().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Failure Rate per Course</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function StudentsPerCategory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStudentCountPerCategory().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Students per Course Category</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function StudentsPerCourse() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStudentCountPerCourse().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Students per Course</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function StudentsPerYear() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStudentCountPerYear().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Students per Academic Year</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function StudentsWithFailures() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStudentsWithFailures().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Students Who Failed At Least One Course</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function Top3Courses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTop3Courses().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Top 3 Most Enrolled Courses</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function Top3Instructors() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTop3Instructors().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Top 3 Instructors by Number of Students</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function ValidatedClassCounts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getValidatedClassCounts().then(setData);
  }, []);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Validated vs. Non-validated Classes</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
