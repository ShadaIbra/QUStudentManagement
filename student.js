document.addEventListener("DOMContentLoaded", async function () {

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    let courses = [];

    function renderCourse(course) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerText = course.courseName;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerText = course.category;
        tableRow.appendChild(courseCategory);

        const courseCRN = document.createElement("td");
        courseCRN.innerText = course.crn;
        tableRow.appendChild(courseCRN);

        const courseInstructor = document.createElement("td");
        courseInstructor.innerText = course.instructor;
        tableRow.appendChild(courseInstructor);

        const courseStatus = document.createElement("td");
        courseStatus.innerText = `${course.totalSeats - course.takenSeats} of ${course.totalSeats} seats remaining`;
        tableRow.appendChild(courseStatus);

        const buttonCol = document.createElement("td");
        tableRow.appendChild(buttonCol);

        const registerButton = document.createElement("button");
        registerButton.innerText = "Register";
        buttonCol.appendChild(registerButton);

        registerButton.addEventListener("click", function () {
            if (registerButton.classList.contains("registered")) {
                registerButton.classList.remove("registered");
                registerButton.innerText = "Register";
            } else {
                registerButton.classList.add("registered");
                registerButton.innerText = "Registered";
            }
        });

        return tableRow;

    }

    function renderCourses(courses) {
        const tableBody = document.querySelector("tbody");
        tableBody.replaceChildren();

        courses.forEach(course => {
            tableBody.appendChild(renderCourse(course));
        });
    }

    async function loadCourses() {
        const res = await fetch('repo/data/courses.json');
        const courses = await res.json();

        return courses.filter(course => course.available);
    }

    function searchCourses() {
        const search = document.querySelector("#name-search").value.toLowerCase().trim();

        const filteredCourses = courses.filter(course =>
            course.courseName.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search));

        renderCourses(filteredCourses);
    }

    document.querySelector("#search-btn").addEventListener("click", searchCourses);

    courses = await loadCourses();
    renderCourses(courses);

});