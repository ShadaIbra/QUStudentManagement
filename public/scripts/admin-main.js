document.addEventListener("DOMContentLoaded", async function () {

    let pendingClasses = [];
    let inProgressClasses = [];
    let instructorsByExpert = [];

    async function updateClass(crn, data) {
        await fetch(`http://localhost:3000/api/classes/${crn}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }

    async function deleteClass(crn) {
        await fetch(`http://localhost:3000/api/classes/${crn}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function promoteStudents(crn) {
        await fetch(`http://localhost:3000/api/classes/${crn}/promote`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function loadInstructorsByExpert(expertise) {
        const response = await fetch(`http://localhost:3000/api/instructors/expertise/${expertise}`);
        const instructorsByExpert = await response.json();

        return instructorsByExpert;
    }

    async function loadPending() {
        const response = await fetch(`http://localhost:3000/api/classes/status/pending`);
        const pendingClasses = await response.json();

        return pendingClasses;
    }

    async function loadInProgress() {
        const response = await fetch(`http://localhost:3000/api/classes/status/inprogress`);
        const pendingClasses = await response.json();

        return pendingClasses;
    }

    function displayInProgress() {
        const inProgressTable = document.querySelector("#in-progress-classes");

        inProgressTable.innerHTML = inProgressClasses.map(c => `
              <tr>
                <td>${c.course.name}</td>
                <td>${c.course.categoryName}</td>
                <td>${c.crn}</td>
                <td>${c.instructor.name}</td>
              </tr>
            `).join('');
    }

    async function renderPendingClass(course, cls) {
        const tableRow = document.createElement("tr");

        const courseName = document.createElement("td");
        courseName.innerHTML = course.name;
        courseName.classList.add("hide-col");
        tableRow.appendChild(courseName);

        const courseCategory = document.createElement("td");
        courseCategory.innerHTML = course.categoryName;
        courseCategory.classList.add("hide-col");
        tableRow.appendChild(courseCategory);

        const courseCRN = document.createElement("td");
        courseCRN.innerHTML = cls.crn;
        tableRow.appendChild(courseCRN);

        const classInstructor = document.createElement("td");
        tableRow.appendChild(classInstructor);

        const selectInstructor = document.createElement("select");
        selectInstructor.classList.add("instructors");
        selectInstructor.name = "instructors";

        const interestedOptions = course.preferenceList
            .map(instructor => `
                <option value="${instructor.id}" ${cls.instructor.id === instructor.id ? "selected" : ""}>
                ${instructor.name}
                </option>`).join('');

        instructorsByExpert = await loadInstructorsByExpert(course.categoryName);

        const otherOptions = instructorsByExpert
            .map(instructor => `
                  <option value="${instructor.id}" ${cls.instructor.id === instructor.id ? "selected" : ""}>
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
        classStatus.classList.add("hide-col");
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
            updateClass(cls.crn, { instructorId: selectInstructor.value });
        });

        validateButton.addEventListener("click", () => handleValidate(cls, selectInstructor.value));
        CancelButton.addEventListener("click", () => handleCancel(cls.crn));

        return tableRow;
    }

    async function renderPendingClasses() {
        const tableBody = document.querySelector("#pending-classes");
        tableBody.replaceChildren();

        for (const cls of pendingClasses) {
            const course = cls.course;
            const row = await renderPendingClass(course, cls);
            tableBody.appendChild(row);
        }
    }

    async function handleValidate(cls, selectedInstructor) {
        seatsTakenPercent = cls.takenSeats / cls.totalSeats;

        if (seatsTakenPercent < 0.5) {
            alert("This class cannot be validated because it does not have enough student registrations.");
            return;
        }

        if (!selectedInstructor) {
            alert("Please select an instructor before validating the class.");
            return;
        }

        updateClass(cls.crn, { status: "INPROGRESS", validated: true });
        promoteStudents(cls.crn);

        pendingClasses = await loadPending();
        inProgressClasses = await loadInProgress();
        renderPendingClasses();
        displayInProgress();
    }

    async function handleCancel(crn) {

        deleteClass(crn);

        pendingClasses = await loadPending();
        inProgressClasses = await loadInProgress();
        renderPendingClasses();
    }


    pendingClasses = await loadPending();
    inProgressClasses = await loadInProgress();

    renderPendingClasses();
    displayInProgress();

    // localStorage.removeItem("courses");
    // localStorage.removeItem("instructors");
});