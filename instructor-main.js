document.addEventListener("DOMContentLoaded", async function () {
    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const instructors = await fetch('repo/data/instructors.json').then(res => res.json());
    const courses = await fetch('repo/data/courses.json').then(res => res.json());
    
    function getInstructorDetails() {
        return instructors.find(i => i.email === loggedInUser.email);
    }


 
    //only gets courses that are for the current logged in instrctor
    function getInstructorCourses() {
        const instructor = getInstructorDetails();
        if (instructor) {
            return courses.filter(course => course.instructor === instructor.name);  // Return the courses for the logged-in instructor
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
                <button class="grades-button" data-crn="${course.crn}">Grades</button>
            </div>
        `).join('');
        
    }
    function goToGradesPage(crn) {
        localStorage.setItem("currentCRN", crn);  // Store the CRN in localStorage
        window.location.href = `instructor-grades.html?crn=${crn}`; 
    }
    
    document.querySelector("#logout-btn").addEventListener("click", function () {
        localStorage.removeItem("loggedInInstructor");
        window.location.href = "login.html";
    });
    
    document.querySelector("#courses-cards").addEventListener("click", function (event) {
    if (event.target.classList.contains("grades-button")) {
        const crn = event.target.getAttribute("data-crn");
        
        goToGradesPage(crn);

    }
});


displayInstructorCourses();

})