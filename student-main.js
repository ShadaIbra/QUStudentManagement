document.addEventListener("DOMContentLoaded", async function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];
    let student;

    function saveCourses() {
        const courses = JSON.parse(localStorage.getItem("courses"));

        for (const course of courses) {
            const index = courses.findIndex(c => c.crn === courses.crn);

            courses[index] = course;
        }
        localStorage.setItem("courses", JSON.stringify(courses));
    }

    function saveStudents() {
        const students = JSON.parse(localStorage.getItem("students"));
        const index = students.findIndex(s => s.email === student.email);

        if (index !== -1) {
            students[index] = student;
            localStorage.setItem("students", JSON.stringify(students));
        }
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

    async function getAvailableCourses() {
        const courses = await loadCourses();
        return courses.filter(course => course.available);
    }

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
        saveCourses();
        saveStudents();
        renderCourses(courses)
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

    student = await getStudent();
    courses = await getAvailableCourses();
    renderCourses(courses);

    console.log(student);
    console.log(loadCourses());

    // localStorage.removeItem("students");
    // localStorage.removeItem("courses");
});