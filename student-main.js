document.addEventListener("DOMContentLoaded", async function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];
    let student;

    function saveCourses() {
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

    function renderClass(course, cls) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.courseName;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.category;
        tableRow.appendChild(courseCategory);

        const courseCRN = document.createElement("td");
        courseCRN.innerHTML = cls.crn;
        tableRow.appendChild(courseCRN);

        const classInstructor = document.createElement("td");
        classInstructor.innerHTML = cls.instructor;
        tableRow.appendChild(classInstructor);

        const classStatus = document.createElement("td");
        classStatus.innerHTML = `${cls.totalSeats - cls.takenSeats} of ${cls.totalSeats} seats remaining`;
        tableRow.appendChild(classStatus);

        const buttonCol = document.createElement("td");
        tableRow.appendChild(buttonCol);

        const registerButton = document.createElement("button");
        registerButton.innerHTML = "Register";
        buttonCol.appendChild(registerButton);

        if (student.pendingCourses.some(c => c.crn === cls.crn)) {
            registerButton.classList.add("registered");
            registerButton.innerHTML = "Registered";
        };

        registerButton.addEventListener("click", event => handleRegister(event, course, cls));

        return tableRow;
    }

    function renderClasses() {
        const tableBody = document.querySelector("tbody");
        tableBody.replaceChildren();

        for (const course of courses) {
            const pendingClasses = course.classes.filter(cls => cls.status === "pending");

            pendingClasses.forEach(cls => {
                tableBody.appendChild(renderClass(course, cls));
            });
        }
    }

    function handleRegister(event, course, cls) {
        const passingGrades = ["A", "B+", "B", "C+", "C", "D"];
        const passedCourses = student.completedCourses.filter(course => passingGrades.includes(course.grade)).map(course => course.code);

        const hasPassedPrereqs =
            course.prereqsCode.length === 0 ||
            course.prereqsCode.every(code => passedCourses.includes(code));

        const seatsRemaining = cls.totalSeats - cls.takenSeats;
        const registerButton = event.target;

        if (registerButton.classList.contains("registered")) {
            registerButton.classList.remove("registered");
            registerButton.innerHTML = "Register";
            cls.takenSeats -= 1;

            const index = student.pendingCourses.findIndex(c => c.crn === cls.crn);
            if (index !== -1) {
                student.pendingCourses.splice(index, 1);
            }

            if (!student.inProgressCourses.some(c => c.crn === cls.crn)) {
                student.inProgressCourses.push({ code: course.code, crn: cls.crn });
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
            registerButton.innerHTML = "Registered";
            cls.takenSeats += 1;

            if (!student.pendingCourses.some(c => c.crn === cls.crn)) {
                student.pendingCourses.push({ code: course.code, crn: cls.crn });
            }
        }
        saveCourses();
        saveStudents();
        renderClasses();
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
    courses = await loadCourses();
    renderClasses();

    console.log(student);
    console.log(loadCourses());

    // localStorage.removeItem("students");
    // localStorage.removeItem("courses");
});