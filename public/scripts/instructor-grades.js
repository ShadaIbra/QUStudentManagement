document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const crn = urlParams.get('crn');  // getting CRN from the URL parameters thats called in instructor-main.js

    const instructorId = urlParams.get('instructorId');

    let students = [];
    let cls;

    async function updateGrade(studentid, newGrade) {
        await fetch(`http://localhost:3000/api/classes/${crn}/${studentid}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grade: newGrade }),
        });
    }

    async function loadClass() {
        const response = await fetch(`http://localhost:3000/api/classes/${crn}`);
        const cls = await response.json();

        return cls;
    }

    function renderStudents(cls) {
        // Display the course header with course name and CRN
        const courseHeader = document.querySelector("#course-header");
        courseHeader.innerHTML = `${cls.course.name} (CRN: ${cls.crn})`;

        const tbody = document.querySelector("tbody");

        // If no students are enrolled in the course, display a message
        if (students.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3'>No students enrolled in this course.</td></tr>";
        } else {
            // Map over each enrolled student and generate a table row with the student's grade options
            tbody.innerHTML = students.map(s => {
                // Generate the row with the student's email, grade, and grade dropdown
                return `
                <tr>
                    <td>${s.student.name}</td>
                    <td>${s.student.id}</td>
                    <td>
                        <select name="grades" id="grades-${s.student.id}" data-id="${s.student.id}">
                            <option value="A" ${s.grade === 'A' ? 'selected' : ''}>A</option>
                            <option value="B+" ${s.grade === 'B+' ? 'selected' : ''}>B+</option>
                            <option value="B" ${s.grade === 'B' ? 'selected' : ''}>B</option>
                            <option value="C+" ${s.grade === 'C+' ? 'selected' : ''}>C+</option>
                            <option value="C" ${s.grade === 'C' ? 'selected' : ''}>C</option>
                            <option value="D" ${s.grade === 'D' ? 'selected' : ''}>D</option>
                            <option value="F" ${s.grade === 'F' ? 'selected' : ''}>F</option>
                            <option value="-" ${s.grade === '-' ? 'selected' : ''}>-</option>
                        </select>
                    </td>
                </tr>
            `;
            }).join('');
        }

        document.querySelectorAll('select[name="grades"]').forEach(select => {
            select.addEventListener('change', function () {
                const id = select.dataset.id;
                const newGrade = select.value;

                if (newGrade) {
                    updateGrade(id, newGrade);
                }
            });
        });
    }

    document.querySelector("#main-btn").addEventListener("click", function () {
        event.preventDefault();
        window.location.href = `instructor-main.html?id=${instructorId}`;
    });

    cls = await loadClass();
    students = cls.inProgressStudents;

    renderStudents(cls);

    // localStorage.removeItem("instructors");
    // localStorage.removeItem("courses");
    // localStorage.removeItem("students");
});