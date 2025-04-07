document.addEventListener("DOMContentLoaded", async function () {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];
    let instructor;

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

        const buttonCol = document.createElement("td");
        tableRow.appendChild(buttonCol);

        const interestButton = document.createElement("button");
        interestButton.innerText = "Interest";
        buttonCol.appendChild(interestButton);

        if (!course.preferenceList) {
            course.preferenceList = [];
        }

        if (course.preferenceList.includes(instructor.name)) {
            interestButton.classList.add("interested");
            interestButton.innerText = "Interested";
        }

        interestButton.addEventListener("click", (event) => handleInterest(event, course));


        return tableRow;
    }

    function handleInterest(event, course) {

        const interestButton = event.target;

        if (!course.preferenceList) {
            course.preferenceList = [];
        }

        if (interestButton.classList.contains("interested")) {
            interestButton.classList.remove("interested");
            interestButton.innerText = "Interest";

            //crud remove

            const index = course.preferenceList.indexOf(instructor.name);
            if (index !== -1) {
                course.preferenceList.splice(index, 1);
            }

        } else {
            interestButton.classList.add("interested");
            interestButton.innerText = "Interested";

            //crud add

            if (!course.preferenceList.includes(instructor.name)) {
                course.preferenceList.push(instructor.name);
            }
        }

    }
    
    function renderCourses(courses) {
        const tableBody = document.querySelector("tbody");
        tableBody.replaceChildren();

        courses.forEach(course => {
            tableBody.appendChild(renderCourse(course));
        });
    }

    async function loadCourses() {
        const res = await fetch('data/courses.json');
        const courses = await res.json();

        return courses.filter(course => !course.instructor);
    }

    async function getInstructor() {
        const res = await fetch('data/instructors.json');
        const instructors = await res.json();

        return instructors.find(instructor => instructor.email === loggedInUser.email);
    }

    function searchCourses() {
        const search = document.querySelector("#name-search").value.toLowerCase().trim();

        const filteredCourses = courses.filter(course =>
            course.courseName.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search));

        renderCourses(filteredCourses);
    }

    document.querySelector("#search-btn").addEventListener("click", searchCourses);

    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    instructor = await getInstructor();

    courses = await loadCourses();
    renderCourses(courses);

});