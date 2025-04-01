document.addEventListener("DOMContentLoaded", async function () {

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];
    let student;

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

        if (student.pendingCRN.includes(course.crn)){
            registerButton.classList.add("registered");
            registerButton.innerText = "Registered";
        };

        registerButton.addEventListener("click", event => handleRegister(event, course.crn));


        return tableRow;
    }

    function handleRegister(event, courseCRN) {

        const passingGrades = ["A", "B+", "B", "C+", "C", "D"];

        const passedCourses = student.completedCourses.filter(course => passingGrades.includes(course.grade)).map(course => course.crn);

        const course = getCourse(courseCRN);

        const hasPassedPrereqs =
            course.prereqsCRN.length === 0 ||
            course.prereqsCRN.every(crn => passedCourses.includes(crn));

        if (hasPassedPrereqs) {
            const registerButton = event.target;

            if (registerButton.classList.contains("registered")) {
                registerButton.classList.remove("registered");
                registerButton.innerText = "Register";

                //crud remove

                const index = student.pendingCRN.indexOf(courseCRN);
                if (index !== -1) {
                    student.pendingCRN.splice(index, 1);
                }

            } else {
                registerButton.classList.add("registered");
                registerButton.innerText = "Registered";

                //crud add

                if (!student.pendingCRN.includes(courseCRN)) {
                    student.pendingCRN.push(courseCRN);
                }
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
        const res = await fetch('repo/data/courses.json');
        const courses = await res.json();

        return courses.filter(course => course.available);
    }

    function getCourse(crn) {
        return courses.find(course => course.crn === crn);
    }

    async function getStudent() {
        const res = await fetch('repo/data/students.json');
        const students = await res.json();

        return students.find(student => student.email === user.email);
    }

    function searchCourses() {
        const search = document.querySelector("#name-search").value.toLowerCase().trim();

        const filteredCourses = courses.filter(course =>
            course.courseName.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search));

        renderCourses(filteredCourses);
    }

    document.querySelector("#search-btn").addEventListener("click", searchCourses);

    student = await getStudent();

    courses = await loadCourses();
    renderCourses(courses);



});