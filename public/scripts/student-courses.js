document.addEventListener("DOMContentLoaded", async function () {

  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("id");

  let student;

  async function loadStudent() {
    const response = await fetch(`http://localhost:3000/api/students/${studentId}`);
    const student = await response.json();

    return student;
  }

  function displayLearningPath() {
    const pendingTable = document.querySelector("#pending-courses");

    pendingTable.innerHTML = student.pendingCourses.map(c => `
              <tr>
                <td>${c.Class.course.name}</td>
                <td>${c.Class.course.categoryName}</td>
                <td>${c.Class.crn}</td>
                <td>${c.Class.instructor.name}</td>
              </tr>
            `).join('');

    const inProgressTable = document.querySelector("#in-progress-courses");

    inProgressTable.innerHTML = student.inProgressCourses.map(c => `
              <tr>
                <td>${c.Class.course.name}</td>
                <td>${c.Class.course.categoryName}</td>
                <td>${c.Class.crn}</td>
                <td>${c.Class.instructor.name}</td>
              </tr>
            `).join('');

    const completedTable = document.querySelector("#completed-courses");

    completedTable.innerHTML = student.completedCourses.map(c => `
              <tr>
                <td>${c.Class.course.name}</td>
                <td>${c.Class.course.categoryName}</td>
                <td>${c.Class.crn}</td>
                <td class="hide-col">${c.Class.instructor.name}</td>
                <td>${c.grade}</td>
              </tr>
            `).join('');
  }

  document.querySelector("#main-btn").addEventListener("click", function () {
    event.preventDefault();
    window.location.href = `student-main.html?id=${studentId}`;
  });

  student = await loadStudent();

  console.log(student);
  displayLearningPath();

  // localStorage.removeItem("students");
  // localStorage.removeItem("courses");
});