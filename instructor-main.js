document.addEventListener("DOMContentLoaded", async function () {
    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const instructors = await fetch('repo/data/instructors.json').then(res => res.json());
    let courses = []; //we add the courses to this array for current instructor
    

 
    //only gets courses that are for the current logged in instrctor
    function getInstructorCourses() {
        const instructor = instructors.find(i => i.email === loggedInUser.email);
        if (instructor) {
            return instructor.courses; // Return the courses for the logged-in instructor
        }
        return [];
    }
    
    function displayInstructorCourses() {
        const coursesTable = document.querySelector("#courses-cards");
        const instructorCourses = getInstructorCourses();
    
        if (instructorCourses.length === 0) {
            coursesTable.innerHTML = "<p>No courses available for this instructor.</p>";
            return;
        }

        coursesTable.innerHTML = instructorCourses.map(course => `
            <div class="course-card">
                <h3>${course.courseName}</h3>
                <h4>${course.category}</h4>
                <h4>CRN: ${course.crn}</h4>
                <button class="grades-button" onclick="goToGradesPage('${course.crn}')">Grades</button>
            </div>
        `).join('');
    }
    function goToGradesPage(crn) {
        // to the grades page with specific CRN as parameter
        window.location.href = `instructor-grades.html?crn=${crn}`;
    }
    
    document.querySelector("#logout-btn").addEventListener("click", function () {
        localStorage.removeItem("loggedInInstructor");
        window.location.href = "login.html";
    });
    
    document.querySelector("#courses-cards").addEventListener("click", function (event) {
    if (event.target.classList.contains("grades-button")) {
        const crn = event.target.getAttribute("data-crn");
        window.location.href = `instructor-grades.html?crn=${crn}`;

    }
});


displayInstructorCourses();

})