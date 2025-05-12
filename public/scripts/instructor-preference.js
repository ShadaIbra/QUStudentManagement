document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const instructorId = urlParams.get('id');

    let courses = [];
    let instructor;

    async function addPreference(courseCode) {
        await fetch(`http://localhost:3000/api/instructors/${instructorId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseCode }),
        });
    }

    async function deletePreference(courseCode) {
        await fetch(`http://localhost:3000/api/instructors/${instructorId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseCode }),
        });
    }

    async function loadCourses() {
        const response = await fetch(`http://localhost:3000/api/courses/preference`);
        const courses = await response.json();

        return courses;
    }

    async function loadInstructor() {
        const response = await fetch(`http://localhost:3000/api/instructors/${instructorId}`);
        const instructor = await response.json();

        return instructor;
    }

    function renderCourse(course) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.nameame;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.categoryName;
        courseCategory.classList.add("hide-col");
        tableRow.appendChild(courseCategory);

        const courseCode = document.createElement("td");
        courseCode.innerHTML = course.code;
        tableRow.appendChild(courseCode);

        const buttonCol = document.createElement("td");
        tableRow.appendChild(buttonCol);

        const interestButton = document.createElement("button");
        interestButton.innerHTML = "Interest";
        buttonCol.appendChild(interestButton);

        const preferenceList = course.preferenceList.map(i => i.id);

        if (preferenceList.includes(instructor.id)) {
            interestButton.classList.add("interested");
            interestButton.innerHTML = "Interested";
        }

        interestButton.addEventListener("click", (event) => handleInterest(event, course));

        return tableRow;
    }

    async function handleInterest(event, course) {
        const interestButton = event.target;
        const preferenceList = course.preferenceList.map(i => i.id);

        if (interestButton.classList.contains("interested")) {
            interestButton.classList.remove("interested");
            interestButton.innerHTML = "Interest";

            if (preferenceList.includes(instructor.id)) {
                deletePreference(course.code);
            }


        } else {
            interestButton.classList.add("interested");
            interestButton.innerHTML = "Interested";

            if (!preferenceList.includes(instructor.id)) {
                addPreference(course.code);
            }
        }
        instructor = await loadInstructor();
        courses = await loadCourses();
        renderCourses(courses);
    }

    function renderCourses(courses) {
        const tableBody = document.querySelector("tbody");
        tableBody.replaceChildren();

        courses.forEach(course => {
            tableBody.appendChild(renderCourse(course));
        });
    }

    function searchCourses() {
        const search = document.querySelector("#name-search").value.toLowerCase().trim();

        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(search) ||
            course.categoryName.toLowerCase().includes(search));

        console.log(filteredCourses);
        renderCourses(filteredCourses);
    }

    document.querySelector("#search-btn").addEventListener("click", searchCourses);

    document.querySelector("#main-btn").addEventListener("click", function () {
        event.preventDefault();
        window.location.href = `instructor-main.html?id=${instructorId}`;
    });

    instructor = await loadInstructor();
    courses = await loadCourses();

    renderCourses(courses);
});