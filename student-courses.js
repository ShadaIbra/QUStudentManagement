document.addEventListener("DOMContentLoaded", async function () {

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  let courses = [];
  let student;

  async function loadStudents() {
    const saved = localStorage.getItem("students");
    if (saved) {
      return JSON.parse(saved);
    }

    const res = await fetch("data/students.json");
    const data = await res.json();
    localStorage.setItem("students", JSON.stringify(data));
    return data;
  }

  async function getStudent() {
    const students = await loadStudents();
    return students.find(s => s.email === loggedInUser.email);
  }

  async function loadCourses() {
    const saved = localStorage.getItem("courses");
    if (saved) {
      return JSON.parse(saved);
    }

    const res = await fetch("data/courses.json");
    let data = await res.json();

    localStorage.setItem("courses", JSON.stringify(data));
    return data;
  }

  function getCourseAndClass(code, crn) {
    const course = courses.find(course => course.code === code);
    if (!course) return null;

    const cls = course.classes.find(cls => cls.crn === crn);
    if (!cls) return null;

    return { course, class: cls };
  }

  function displayLearningPath() {
    const pendingTable = document.querySelector("#pending-courses");
    const pendingCourses = student.pendingCourses.map(course => getCourseAndClass(course.code, course.crn));

    pendingTable.innerHTML = pendingCourses.map(c => `
              <tr>
                <td>${c.course.courseName}</td>
                <td>${c.course.category}</td>
                <td>${c.class.crn}</td>
                <td>${c.class.instructor}</td>
              </tr>
            `).join('');

    const inProgressTable = document.querySelector("#in-progress-courses");
    const inProgressCourses = student.inProgressCourses.map(course => getCourseAndClass(course.code, course.crn));

    inProgressTable.innerHTML = inProgressCourses.map(c => `
              <tr>
                <td>${c.course.courseName}</td>
                <td>${c.course.category}</td>
                <td>${c.class.crn}</td>
                <td>${c.class.instructor}</td>
              </tr>
            `).join('');

    const completedTable = document.querySelector("#completed-courses");
    const completedCourses = student.completedCourses.map(course => ({
      ...getCourseAndClass(course.code, course.crn),
      grade: course.grade
    }));

    completedTable.innerHTML = completedCourses.map(c => `
              <tr>
                <td>${c.course.courseName}</td>
                <td>${c.course.category}</td>
                <td>${c.class.crn}</td>
                <td>${c.class.instructor}</td>
                <td>${c.grade}</td>
              </tr>
            `).join('');
  }

  document.querySelector("#logout-btn").addEventListener("click", function () {
    event.preventDefault();
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  student = await getStudent();
  courses = await loadCourses();

  console.log(student);
  console.log(courses);
  displayLearningPath();

  // localStorage.removeItem("students");
  // localStorage.removeItem("courses");
});