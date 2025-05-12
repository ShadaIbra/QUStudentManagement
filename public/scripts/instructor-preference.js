document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const instructorId = urlParams.get('id');

    let courses = [];
    let instructor;

    function saveCourses() {
        localStorage.setItem("courses", JSON.stringify(courses));
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

    function renderCourse(course) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.courseName;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.category;
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

        if (course.preferenceList.includes(instructor.name)) {
            interestButton.classList.add("interested");
            interestButton.innerHTML = "Interested";
        }

        interestButton.addEventListener("click", (event) => handleInterest(event, course));

        return tableRow;
    }

    function handleInterest(event, course) {
        const interestButton = event.target;

        if (interestButton.classList.contains("interested")) {
            interestButton.classList.remove("interested");
            interestButton.innerHTML = "Interest";

            const index = course.preferenceList.indexOf(instructor.name);
            if (index !== -1) {
                course.preferenceList.splice(index, 1);
            }

        } else {
            interestButton.classList.add("interested");
            interestButton.innerHTML = "Interested";

            if (!course.preferenceList.includes(instructor.name)) {
                course.preferenceList.push(instructor.name);
            }
        }
        saveCourses();
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
            course.courseName.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search));

        console.log(filteredCourses);
        renderCourses(filteredCourses);
    }

    document.querySelector("#search-btn").addEventListener("click", searchCourses);

    document.querySelector("#main-btn").addEventListener("click", function () {
        event.preventDefault();
        window.location.href = `instructor-main.html?id=${instructorId}`;
    });

    instructor = await getInstructor();
    courses = await loadCourses();

    renderCourses(courses);
});