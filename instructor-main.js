document.addEventListener("DOMContentLoaded", async function () {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let instructor;
    let instructorCourses = [];
    let courses = [];

    async function loadInstructors() {
        const saved = localStorage.getItem("instructors");
        if (saved) {
            return JSON.parse(saved);
        }

        const res = await fetch("data/instructors.json");
        let data = await res.json();

        localStorage.setItem("instructors", JSON.stringify(data));
        return data;
    }

    async function getInstructor() {
        const instructors = await loadInstructors();
        return instructors.find(instructor => instructor.email === loggedInUser.email);
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

    //only gets courses that are for the current logged in instructor
    function getInstructorCourses() {
        const result = [];

        for (const course of courses) {
            for (const cls of course.classes) {
                if (cls.instructor === instructor.name) {
                    result.push({ course, class: cls });
                }
            }
        }

        return result;
    }

    function displayInstructorCourses() {
        const coursesTable = document.querySelector("#courses-cards");

        if (instructorCourses.length === 0) {
            coursesTable.innerHTML = "<p>No courses available for this instructor.</p>";
            return;
        }

        coursesTable.innerHTML = instructorCourses.map(c => `
            <div class="course-card">
                <h3>${c.course.courseName}</h3>
                <h4>${c.course.category}</h4>
                <h4>CRN: ${c.class.crn}</h4>
                <button class="grades-button" data-crn="${c.class.crn}">Grades</button>
            </div>
        `).join('');
    }

    function goToGradesPage(crn) {
        localStorage.setItem("currentCRN", crn);  // Store the CRN in localStorage
        window.location.href = `instructor-grades.html?crn=${crn}`;
    }

    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    document.querySelector("#courses-cards").addEventListener("click", function (event) {
        if (event.target.classList.contains("grades-button")) {
            const crn = event.target.getAttribute("data-crn");

            goToGradesPage(crn);
        }
    });

    instructor = await getInstructor();
    courses = await loadCourses();

    instructorCourses = getInstructorCourses();

    console.log(instructor);
    console.log(instructorCourses);

    displayInstructorCourses();

    // localStorage.removeItem("currentCRN");

})