document.addEventListener("DOMContentLoaded", async function () {

    categories = [];
    courses = [];
    instructors = [];

    async function addCourse(course) {
        console.log(course);
        await fetch(`http://localhost:3000/api/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
        });
    }

    async function addClass(cls) {
        await fetch(`http://localhost:3000/api/classes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cls),
        });
    }

    async function loadCourses() {
        const response = await fetch(`http://localhost:3000/api/courses`);
        const courses = await response.json();

        return courses;
    }

    async function loadCategories() {
        const response = await fetch(`http://localhost:3000/api/categories`);
        const categories = await response.json();

        return categories;
    }

    async function loadInstructors() {
        const response = await fetch(`http://localhost:3000/api/instructors`);
        const instructors = await response.json();

        return instructors;
    }

    function renderPage() {
        const categoriesSelect = document.querySelector("#category");
        categoriesSelect.innerHTML = `<option value="" disabled selected>Select a category</option>`;
        categoriesSelect.innerHTML += categories.map(category => `<option value="${category.categoryName}">${category.categoryName}</option>`).join('');

        const prereqsSelect = document.querySelector("#prereqs");
        prereqsSelect.innerHTML = courses.map(course => `<option value="${course.code}">${course.name} (${course.code})</option>`).join('');

        const courseSelect = document.querySelector("#course-code");
        courseSelect.innerHTML = `<option value="" disabled selected>Select a Course</option>`;
        courseSelect.innerHTML += courses.map(course => `<option value="${course.code}">${course.name} (${course.code})</option>`).join('');

        const instructorSelect = document.querySelector("#instructor");
        instructorSelect.innerHTML = `<option value="" disabled selected>Select a Instructor</option>`;
        instructorSelect.innerHTML += instructors.map(instructor => `<option value="${instructor.id}">${instructor.name}</option>`).join('');
    }

    async function handleAddCourse(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const courseName = formData.get("course-name").trim();
        const category = formData.get("category");
        const code = formData.get("code").trim();

        const prereqs = formData.getAll("prereqs");

        const enablePref = form.querySelector("#enable-pref").checked;

        if (courses.find(course => course.code === code)) {
            alert("A course with this Code already exists. Please choose a unique Code.");
            return;
        }

        const newCourse = {
            name: courseName,
            categoryName: category,
            code,
            preferenceOpen: enablePref,
            coursePrerequisites: prereqs
        };


        addCourse(newCourse)
        form.reset();

        courses = await loadCourses();
        renderPage();
    };

    function handleAddClass(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const crn = formData.get("class-crn").trim();
        const courseCode = formData.get("course-code");
        const totalSeats = parseInt(formData.get("total-seats"));

        const instructorId = formData.get("instructor");

        for (const course of courses) {
            if (course.Class.find(c => c.crn === crn)) {
                alert("A class with this crn already exists.");
                return;
            }
        }

        const newClass = {
            crn,
            instructorId: instructorId || null,
            takenSeats: 0,
            totalSeats,
            status: "PENDING",
            validated: false,
            code: courseCode

        }

        addClass(newClass);
        form.reset();

        renderPage();
    }

    courses = await loadCourses();
    categories = await loadCategories();
    instructors = await loadInstructors();

    console.log(categories);
    console.log(courses);
    console.log(instructors);

    document.querySelector("#add-course-form").addEventListener("submit", handleAddCourse);
    document.querySelector("#add-class-form").addEventListener("submit", handleAddClass);


    renderPage();

    // localStorage.removeItem("courses");
    // localStorage.removeItem("categories");
    // localStorage.removeItem("instructors");
});