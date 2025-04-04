document.addEventListener("DOMContentLoaded", async function () {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];
    let student;

    function saveCoursesToLocalStorage() {
        localStorage.setItem("courses", JSON.stringify(courses));
    }

    function saveStudentToLocalStorage() {
        localStorage.setItem("student", JSON.stringify(student));
    }

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

        if (student.pendingCRN.includes(course.crn)) {
            registerButton.classList.add("registered");
            registerButton.innerText = "Registered";
        };

        registerButton.addEventListener("click", event => handleRegister(event, course));

        return tableRow;
    }

    function renderCourses(courses) {
        const tableBody = document.querySelector("tbody");
        tableBody.replaceChildren();

        courses.forEach(course => {
            tableBody.appendChild(renderCourse(course));
        });
    }

    function handleRegister(event, course) {
        const passingGrades = ["A", "B+", "B", "C+", "C", "D"];
        const passedCourses = student.completedCourses.filter(course => passingGrades.includes(course.grade)).map(course => course.crn);

        const hasPassedPrereqs =
            course.prereqsCRN.length === 0 ||
            course.prereqsCRN.every(crn => passedCourses.includes(crn));

        const seatsRemaining = course.totalSeats - course.takenSeats;
        const registerButton = event.target;

        if (registerButton.classList.contains("registered")) {
            registerButton.classList.remove("registered");
            registerButton.innerText = "Register";
            course.takenSeats -= 1;

            const index = student.pendingCRN.indexOf(course.crn);
            if (index !== -1) {
                student.pendingCRN.splice(index, 1);
            }
        } else {
            if (!hasPassedPrereqs) {
                alert("You cannot register for this course. You must complete all prerequisites.");
                return;
            }

            if (seatsRemaining <= 0) {
                alert("You cannot register for this course. There are no seats available.");
                return;
            }

            registerButton.classList.add("registered");
            registerButton.innerText = "Registered";
            course.takenSeats += 1;

            if (!student.pendingCRN.includes(course.crn)) {
                student.pendingCRN.push(course.crn);
            }
        }
        saveCoursesToLocalStorage();
        saveStudentToLocalStorage();
        renderCourses(courses)
    }

    async function loadCourses() {
        const saved = localStorage.getItem("courses");
        if (saved) {
            return JSON.parse(saved);
        }

        const res = await fetch("repo/data/courses.json");
        const data = await res.json();
        localStorage.setItem("courses", JSON.stringify(data));

        return data.filter(course => course.available);
    }

    async function getStudent() {
        const saved = localStorage.getItem("student");
        if (saved) {
            return JSON.parse(saved);
        }

        const res = await fetch("repo/data/students.json");
        const students = await res.json();
        const found = students.find(s => s.email === loggedInUser.email);

        if (found) {
            localStorage.setItem("student", JSON.stringify(found));
        }
        return found;
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
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    student = await getStudent();
    courses = await loadCourses();
    renderCourses(courses);

    // localStorage.removeItem("student");
    // localStorage.removeItem("courses");


});