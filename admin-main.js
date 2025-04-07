document.addEventListener("DOMContentLoaded", async function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let courses = [];

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

    function displayInProgress() {
        const inProgressTable = document.querySelector("#in-progress-courses");
        const inProgressCourses = courses.filter(course => course.status === "in-progress");

        inProgressTable.innerHTML = inProgressCourses.map(course => `
                  <tr>
                    <td>${course.courseName}</td>
                    <td>${course.category}</td>
                    <td>${course.crn}</td>
                    <td>${course.instructor}</td>
                  </tr>
                `).join('');
    }

    function renderPendingCourse(course) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.courseName;
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.category;
        tableRow.appendChild(courseCategory);

        const courseCRN = document.createElement("td");
        courseCRN.innerHTML = course.crn;
        tableRow.appendChild(courseCRN);

        const courseInstructor = document.createElement("td");
        tableRow.appendChild(courseInstructor);

        const selectInstructor = document.createElement("select");
        selectInstructor.classList.add("instructors");
        selectInstructor.name = "instructors";

        selectInstructor.innerHTML = `
        <option value="" disabled ${!course.instructor ? "selected" : ""}>-</option>
        ${course.preferenceList.map(instructorName => `<option value="${instructorName}" ${course.instructor === instructorName ? "selected" : ""}>${instructorName}</option>`).join('')}
        `;

        courseInstructor.appendChild(selectInstructor);

        const courseStatus = document.createElement("td");
        courseStatus.innerHTML = `${course.totalSeats - course.takenSeats} of ${course.totalSeats} seats remaining`;
        tableRow.appendChild(courseStatus);

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
            course.instructor = selectInstructor.value;
            saveCourses();
        });

        validateButton.addEventListener("click", event => handleValidate(event, course, selectInstructor.value));
        CancelButton.addEventListener("click", event => handleCancel(event, course));

        return tableRow;
    }

    function renderPendingCourses(courses) {
        const tableBody = document.querySelector("#pending-courses");
        tableBody.replaceChildren();

        pendingCourses = courses.filter(course => course.status === "pending");

        pendingCourses.forEach(course => {
            tableBody.appendChild(renderPendingCourse(course));
        });
    }

    function handleValidate(event, course, selectedInstructor) {
        seatsTakenPercent = course.takenSeats / course.totalSeats;

        if (seatsTakenPercent < 0.5) {
            alert("This course cannot be validated because it does not have enough student registrations.");
            return;
        }

        if (!selectedInstructor) {
            alert("Please select an instructor before validating the course.");
            return;
        }

        course.validated = true;
        course.status = "in-progress";

        saveCourses();
        renderPendingCourses(courses);
        displayInProgress();
    }

    function handleCancel(event, cancelCourse) {

        courses = courses.filter(course => course.crn !== cancelCourse.crn);

        saveCourses();
        renderPendingCourses(courses);
    }

    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    courses = await loadCourses();

    renderPendingCourses(courses);

    displayInProgress();

    // localStorage.removeItem("courses");
});