document.addEventListener("DOMContentLoaded", async function () {

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];
    let student;

    async function getStudent() {
        const res = await fetch('repo/data/students.json');
        const students = await res.json();

        return students.find(student => student.email === user.email);
    }

    async function loadCourses() {
        const res = await fetch('repo/data/courses.json');
        return await res.json();

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

    student = await getStudent();

    document.querySelector("#logout-btn").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    courses = await loadCourses();

    displayLearningPath();

});