document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const crn = urlParams.get('crn');  // getting CRN from the URL parameters thats called in instructor-main.js

    // Fetch courses and students data
    const courses = await fetch('data/courses.json').then(res => res.json());
    const students = await fetch('data/students.json').then(res => res.json());

    // Find the course by CRN
    const course = courses.find(c => c.crn === crn);
    
    // If the course is not found, display an error message
    if (!course) {
        document.querySelector("#course-header").innerHTML = "<p>Course not found!</p>";
        document.querySelector("tbody").innerHTML = "<tr><td colspan='3'>No students enrolled in this course.</td></tr>";
        return;
    }

    // Display the course header with course name and CRN
    const courseHeader = document.querySelector("#course-header");
    courseHeader.innerHTML = `${course.courseName} (CRN: ${course.crn})`;

    const tbody = document.querySelector("tbody");

    // Filter students who are enrolled in this course (pending, in-progress, or completed)
    const enrolledStudents = students.filter(student => {
        const isInProgress = student.inProgressCRN.includes(crn);
        const isCompleted = student.completedCourses.some(c => c.crn === crn);
        const isPending = student.pendingCRN.includes(crn);

        // Return students who are either pending, in-progress, or completed the course
        return isPending || isInProgress || isCompleted;
    });

    // If no students are enrolled in the course, display a message
    if (enrolledStudents.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>No students enrolled in this course.</td></tr>";
    } else {
        // Map over each enrolled student and generate a table row with the student's grade options
        tbody.innerHTML = enrolledStudents.map(student => {
            // Find the completed course for this student and CRN
            const completedCourse = student.completedCourses.find(c => c.crn === crn);
            const currentGrade = completedCourse ? completedCourse.grade : '';

            // Generate the row with the student's email, grade, and grade dropdown
            return `
                <tr>
                    <td>${student.email}</td>
                    <td>${completedCourse ? completedCourse.grade : 'N/A'}</td>
                    <td>
                        <select name="grades" id="grades-${student.email}">
                            <option value="A" ${currentGrade === 'A' ? 'selected' : ''}>A</option>
                            <option value="B+" ${currentGrade === 'B+' ? 'selected' : ''}>B+</option>
                            <option value="B" ${currentGrade === 'B' ? 'selected' : ''}>B</option>
                            <option value="C+" ${currentGrade === 'C+' ? 'selected' : ''}>C+</option>
                            <option value="C" ${currentGrade === 'C' ? 'selected' : ''}>C</option>
                            <option value="D" ${currentGrade === 'D' ? 'selected' : ''}>D</option>
                            <option value="F" ${currentGrade === 'F' ? 'selected' : ''}>F</option>
                        </select>
                    </td>
                </tr>
            `;
        }).join('');
    }

    document.querySelectorAll('select[name="grades"]').forEach(select => {
        select.addEventListener('change', function () {
            const studentEmail = select.closest('tr').querySelector('td').textContent;
            const newGrade = select.value;
            console.log(`New grade for ${studentEmail}: ${newGrade}`);
            // Here you would need to update the student's grade in your data or database
        });
    });
    
    // Log out functionality to remove the logged-in instructor and redirect to the login page
    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
});
