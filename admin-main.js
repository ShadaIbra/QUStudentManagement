document.addEventListener("DOMContentLoaded", async function () {

    let courses = [];
    let instructors = [];
    let students = [];

    function saveCourses() {
        localStorage.setItem("courses", JSON.stringify(courses));
    }

    function saveStudents() {
        localStorage.setItem("students", JSON.stringify(students));
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

    function displayInProgress() {
        const inProgressTable = document.querySelector("#in-progress-classes");
        let html = "";

        for (const course of courses) {
            const inProgressClasses = course.classes.filter(cls => cls.status === "in-progress");

            html += inProgressClasses.map(cls => `
                <tr>
                    <td>${course.courseName}</td>
                    <td>${course.category}</td>
                    <td>${cls.crn}</td>
                    <td>${cls.instructor}</td>
                </tr>
            `).join('');
        }

        inProgressTable.innerHTML = html;
    }

    function renderPendingClass(course, cls) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.courseName;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.category;
        tableRow.appendChild(courseCategory);

        const classCRN = document.createElement("td");
        classCRN.innerHTML = cls.crn;
        tableRow.appendChild(classCRN);

        const classInstructor = document.createElement("td");
        tableRow.appendChild(classInstructor);

        const selectInstructor = document.createElement("select");
        selectInstructor.classList.add("instructors");
        selectInstructor.name = "instructors";

        const interestedOptions = course.preferenceList
            .map(instructorName => `
                <option value="${instructorName}" ${cls.instructor === instructorName ? "selected" : ""}>
                ${instructorName}
                </option>`).join('');

        const otherOptions = instructors
            .filter(instructor => instructor.expertiseAreas.includes(course.courseName))
            .map(instructor => `
                  <option value="${instructor.name}" ${cls.instructor === instructor.name ? "selected" : ""}>
                    ${instructor.name}
                  </option>
                `).join('');

        selectInstructor.innerHTML = `
                <option value="" disabled ${!cls.instructor ? "selected" : ""}>-</option>
                ${interestedOptions ? `<optgroup label="Interested Instructors">${interestedOptions}</optgroup>` : ''}
                ${otherOptions ? `<optgroup label="Instructors">${otherOptions}</optgroup>` : ''}`;

        classInstructor.appendChild(selectInstructor);

        const classStatus = document.createElement("td");
        classStatus.innerHTML = `${cls.totalSeats - cls.takenSeats} of ${cls.totalSeats} seats remaining`;
        tableRow.appendChild(classStatus);

        const buttonCol = document.createElement("td");
        buttonCol.classList.add("validate-btns");
        tableRow.appendChild(buttonCol);

        const validateButton = document.createElement("button");
        validateButton.innerHTML = "Validate";
        buttonCol.appendChild(validateButton);

        const CancelButton = document.createElement("button");
        CancelButton.innerHTML = "Cancel";
        CancelButton.classList.add("cancel-btn")
        buttonCol.appendChild(CancelButton);

        selectInstructor.addEventListener("change", function () {
            cls.instructor = selectInstructor.value;
            saveCourses();
        });

        validateButton.addEventListener("click", () => handleValidate(course, cls, selectInstructor.value));
        CancelButton.addEventListener("click", () => handleCancel(cls));

        return tableRow;
    }

    function renderPendingClasses() {
        const tableBody = document.querySelector("#pending-classes");
        tableBody.replaceChildren();

        for (const course of courses) {
            const pendingClasses = course.classes.filter(cls => cls.status === "pending");

            pendingClasses.forEach(cls => {
                tableBody.appendChild(renderPendingClass(course, cls));
            });
        }
    }

    function handleValidate(course, cls, selectedInstructor) {
        seatsTakenPercent = cls.takenSeats / cls.totalSeats;

        if (seatsTakenPercent < 0.5) {
            alert("This class cannot be validated because it does not have enough student registrations.");
            return;
        }

        if (!selectedInstructor) {
            alert("Please select an instructor before validating the class.");
            return;
        }

        cls.validated = true;
        cls.status = "in-progress";

        for (const s of students) {
            const index = s.pendingCourses.findIndex(c => c.crn === cls.crn);
            if (index !== -1) {
                s.pendingCourses.splice(index, 1);
            }

            s.inProgressCourses.push({ code: course.code, crn: cls.crn });

        }

        saveStudents();
        saveCourses();
        renderPendingClasses();
        displayInProgress();
    }

    function handleCancel(cancelClass) {

        for (const course of courses) {
            course.classes = course.classes.filter(cls => cls.crn !== cancelClass.crn);
        }

        for (const s of students) {
            const index = s.pendingCourses.findIndex(c => c.crn === c.crn);
            if (index !== -1) {
                s.pendingCourses.splice(index, 1);
            }
        }

        saveStudents();
        saveCourses();
        renderPendingClasses(courses);
    }

    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    courses = await loadCourses();
    instructors = await loadInstructors();
    students = await loadStudents();

    console.log(courses);
    console.log(instructors);

    renderPendingClasses(courses);

    displayInProgress();

    // localStorage.removeItem("courses");
    // localStorage.removeItem("instructors");
});