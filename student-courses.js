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

  function getCourse(crn) {
    return courses.find(course => course.crn === crn);
  }

  function displayLearningPath() {
    const pendingTable = document.querySelector("#pending-courses");
    const pendingCourses = student.pendingCRN.map(crn => getCourse(crn));

    pendingTable.innerHTML = pendingCourses.map(course => `
              <tr>
                <td>${course.courseName}</td>
                <td>${course.category}</td>
                <td>${course.crn}</td>
                <td>${course.instructor}</td>
              </tr>
            `).join('');

    const inProgressTable = document.querySelector("#in-progress-courses");
    const inProgressCourses = student.inProgressCRN.map(crn => getCourse(crn));

    inProgressTable.innerHTML = inProgressCourses.map(course => `
              <tr>
                <td>${course.courseName}</td>
                <td>${course.category}</td>
                <td>${course.crn}</td>
                <td>${course.instructor}</td>
              </tr>
            `).join('');

    const completedTable = document.querySelector("#completed-courses");
    const completedCourses = student.completedCourses.map(course => ({
      course: getCourse(course.crn),
      grade: course.grade
    }));

    completedTable.innerHTML = completedCourses.map(courseDetails => `
              <tr>
                <td>${courseDetails.course.courseName}</td>
                <td>${courseDetails.course.category}</td>
                <td>${courseDetails.course.crn}</td>
                <td>${courseDetails.course.instructor}</td>
                <td>${courseDetails.grade}</td>
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
  displayLearningPath();

  console.log(student);
  console.log(courses);

  // localStorage.removeItem("students");
  // localStorage.removeItem("courses");

});