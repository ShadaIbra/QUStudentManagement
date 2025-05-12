document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const instructorId = params.get("id");

    let instructorCourses = [];

    async function loadInstructorCourses() {
        const response = await fetch(`http://localhost:3000/api/classes/status/inprogress/${instructorId}`);
        const instructorCourses = await response.json();

        return instructorCourses;
    }

    function displayInstructorCourses() {
        const coursesTable = document.querySelector("#courses-cards");

        if (instructorCourses.length === 0) {
            coursesTable.innerHTML = "<p>No courses available for this instructor.</p>";
            return;
        }

        coursesTable.innerHTML = instructorCourses.map(c => `
            <div class="course-card">
                <h3>${c.course.name}</h3>
                <h4>${c.course.categoryName}</h4>
                <h4>CRN: ${c.crn}</h4>
                <button class="grades-button" data-crn="${c.crn}">Grades</button>
            </div>
        `).join('');
    }

    document.querySelector("#courses-cards").addEventListener("click", function (event) {
        if (event.target.classList.contains("grades-button")) {
            const crn = event.target.getAttribute("data-crn");

            window.location.href = `instructor-grades.html?crn=${crn}`;
        }
    });

    instructorCourses = await loadInstructorCourses();

    console.log(instructorCourses);

    displayInstructorCourses();

    // localStorage.removeItem("currentCRN");

})
