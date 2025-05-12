document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id");

    let pendingClasses = [];
    let student;

    async function updateSeats(crn, taken) {
        await fetch(`http://localhost:3000/api/classes/${crn}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ takenSeats: taken }),
        });
    }

    async function addClass(classCrn) {
        await fetch(`http://localhost:3000/api/students/${studentId}/pending`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classCrn }),
        });
    }

    async function deleteClass(classCrn) {
        await fetch(`http://localhost:3000/api/students/${studentId}/pending`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classCrn }),
        });

    }

    async function loadCourses() {
        const response = await fetch(`http://localhost:3000/api/classes/status/pending`);
        const pendingClasses = await response.json();

        return pendingClasses;
    }

    async function loadStudent() {

        const response = await fetch(`http://localhost:3000/api/students/${studentId}`);
        const student = await response.json();

        return student;
    }

    function renderClass(course, cls) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.name;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.categoryName;
        courseCategory.classList.add("hide-col");
        tableRow.appendChild(courseCategory);

        const courseCRN = document.createElement("td");
        courseCRN.innerHTML = cls.crn;
        tableRow.appendChild(courseCRN);

        const classInstructor = document.createElement("td");
        classInstructor.innerHTML = cls.instructor.name;
        classInstructor.classList.add("hide-col");
        tableRow.appendChild(classInstructor);

        const classStatus = document.createElement("td");
        classStatus.innerHTML = `${cls.totalSeats - cls.takenSeats} of ${cls.totalSeats} seats remaining`;
        classStatus.classList.add("hide-col");
        tableRow.appendChild(classStatus);

        const buttonCol = document.createElement("td");
        tableRow.appendChild(buttonCol);

        const registerButton = document.createElement("button");
        registerButton.innerHTML = "Register";
        buttonCol.appendChild(registerButton);

        if (student.pendingCourses.some(c => c.classCrn === cls.crn)) {
            registerButton.classList.add("registered");
            registerButton.innerHTML = "Registered";
        };

        registerButton.addEventListener("click", event => handleRegister(event, course, cls));

        return tableRow;
    }

    function renderClasses(pendingClasses) {
        const tableBody = document.querySelector("tbody");
        tableBody.replaceChildren();

        pendingClasses.forEach(cls => {
            const course = cls.course;
            tableBody.appendChild(renderClass(course, cls));
        });
    }

    async function handleRegister(event, course, cls) {
        const passingGrades = ["A", "B+", "B", "C+", "C", "D"];
        const passedCourses = student.completedCourses.filter(course => passingGrades.includes(course.grade)).map(course => course.code);

        const hasPassedPrereqs =
            course.coursePrerequisites.length === 0 ||
            course.coursePrerequisites.every(code => passedCourses.includes(code));

        const seatsRemaining = cls.totalSeats - cls.takenSeats;
        const registerButton = event.target;

        let takenSeats = cls.takenSeats;

        if (registerButton.classList.contains("registered")) {
            registerButton.classList.remove("registered");
            registerButton.innerHTML = "Register";
            takenSeats -= 1;

            const index = student.pendingCourses.findIndex(c => c.classCrn === cls.crn);
            if (index !== -1) {
                deleteClass(cls.crn);
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
            takenSeats += 1;

            if (!student.pendingCourses.some(c => c.classCrn === cls.crn)) {
                addClass(cls.crn);
            }
        }
        updateSeats(cls.crn, takenSeats);
        student = await loadStudent(); // re-fetch updated student info
        pendingClasses = await loadCourses(); // re-fetch classes
        renderClasses(pendingClasses); // refresh the interface
    }

    function searchCourses() {
        const search = document.querySelector("#name-search").value.toLowerCase().trim();

        const filteredCourses = pendingClasses.filter(c =>
            c.course.name.toLowerCase().includes(search) ||
            c.course.categoryName.toLowerCase().includes(search));


        renderClasses(filteredCourses);
    }

    document.querySelector("#search-btn").addEventListener("click", searchCourses);

    document.querySelector("#courses-btn").addEventListener("click", function () {
        event.preventDefault();
        window.location.href = `student-courses.html?id=${studentId}`;
    });

    student = await loadStudent();
    pendingClasses = await loadCourses();
    renderClasses(pendingClasses);

    console.log(student);
    console.log(pendingClasses);

    // localStorage.removeItem("students");
    // localStorage.removeItem("courses");
});