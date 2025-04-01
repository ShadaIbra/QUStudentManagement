document.addEventListener("DOMContentLoaded", async function () {

    localStorage.getItem("loggedInUser");

    async function renderCourses() {

        const res = await fetch('repo/data/courses.json');
        const courses = await res.json();

        console.log(courses);

        const availableCourses = courses.filter(course => course.available);

        console.log(availableCourses);

        const tableBody = document.querySelector("tbody");

        for (const course of availableCourses) {

            const tableRow = document.createElement("tr");
            tableBody.appendChild(tableRow);

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

        }
    }

    renderCourses();



});