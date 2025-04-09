document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const crn = urlParams.get('crn');  // getting CRN from the URL parameters thats called in instructor-main.js

    let courses = [];
    let students = [];
    let course;

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

    function getCourseAndClass(crn) {
        for (const course of courses) {
            const cls = course.classes.find(cls => cls.crn === crn);
            if (cls) {
                return { course, class: cls };
            }
        }
        return null;
    }

    function renderStudents() {
        const courseDetails = getCourseAndClass(crn);
        // Display the course header with course name and CRN
        const courseHeader = document.querySelector("#course-header");
        courseHeader.innerHTML = `${courseDetails.course.courseName} (CRN: ${courseDetails.class.crn})`;

        const tbody = document.querySelector("tbody");

        // Filter students who are enrolled in this course (pending, in-progress, or completed)
        const enrolledStudents = students.filter(student => {
            const isInProgress = student.inProgressCourses.some(c => c.crn === crn);

            // Return students who are either pending, in-progress, or completed the course
            return isInProgress;
        });

        // If no students are enrolled in the course, display a message
        if (enrolledStudents.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3'>No students enrolled in this course.</td></tr>";
        } else {
            // Map over each enrolled student and generate a table row with the student's grade options
            tbody.innerHTML = enrolledStudents.map(student => {
                // Find the completed course for this student and CRN
                const inProgressCourses = student.inProgressCourses.find(c => c.crn === crn);
                const currentGrade = inProgressCourses ? inProgressCourses.grade : '';

                // Generate the row with the student's email, grade, and grade dropdown
                return `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>
                        <select name="grades" id="grades-${student.email}" data-email="${student.email}">
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
                const email = select.dataset.email;
                const newGrade = select.value;

                const student = students.find(s => s.email === email);

                student.inProgressCourses = student.inProgressCourses.filter(c => c.crn !== crn);

                if (newGrade) {
                    student.inProgressCourses.push({ code: courseDetails.course.code, crn: crn, grade: newGrade });
                }

                // Save updated students array
                saveStudents();
            });
        });
    }

    // Log out functionality to remove the logged-in instructor and redirect to the login page
    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    courses = await loadCourses();
    students = await loadStudents();

    renderStudents();

    // localStorage.removeItem("instructors");
    // localStorage.removeItem("courses");
    // localStorage.removeItem("students");
});
