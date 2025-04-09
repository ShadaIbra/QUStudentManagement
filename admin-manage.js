document.addEventListener("DOMContentLoaded", async function () {
    categories = [];
    courses = [];
    instructors = [];

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

    async function loadCategories() {
        const saved = localStorage.getItem("categories");
        if (saved) {
            return JSON.parse(saved);
        }

        const res = await fetch("data/categories.json");
        let data = await res.json();

        localStorage.setItem("categories", JSON.stringify(data));
        return data;
    }

    async function loadInstructors() {
        const saved = localStorage.getItem("instructors");
        if (saved) {
            return JSON.parse(saved);
        }

        const res = await fetch("data/instructors.json");
        let data = await res.json();

        localStorage.setItem("instructors", JSON.stringify(data));
        return data;
    }
    function getCourse(code) {
        return courses.find(course => course.code === code);
    }

    function renderPage() {
        const categoriesSelect = document.querySelector("#category");
        categoriesSelect.innerHTML = `<option value="" disabled selected>Select a category</option>`;
        categoriesSelect.innerHTML += categories.map(category => `<option value="${category}">${category}</option>`).join('');

        const prereqsSelect = document.querySelector("#prereqs");
        prereqsSelect.innerHTML = courses.map(course => `<option value="${course.code}">${course.courseName} (${course.code})</option>`).join('');

        const courseSelect = document.querySelector("#course-code");
        courseSelect.innerHTML = `<option value="" disabled selected>Select a Course</option>`;
        courseSelect.innerHTML += courses.map(course => `<option value="${course.code}">${course.courseName} (${course.code})</option>`).join('');

        const instructorSelect = document.querySelector("#instructor");
        instructorSelect.innerHTML = `<option value="" disabled selected>Select a Instructor</option>`;
        instructorSelect.innerHTML += instructors.map(instructor => `<option value="${instructor.name}">${instructor.name}</option>`).join('');
    }

    function addCourse(event) {
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
            courseName,
            category,
            code,
            preferenceOpen: enablePref,
            prereqscodeCode: prereqs || [],
            preferenceList: [],
            classes: []
        }

        courses.push(newCourse);
        form.reset();

        saveCourses();
        renderPage();
    };

    function addClass(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const crn = formData.get("class-crn").trim();
        const code = formData.get("course-code");
        const totalSeats = parseInt(formData.get("total-seats"));

        const instructor = formData.get("instructor");
        const course = getCourse(code);

        for (const c of courses) {
            if (c.classes.find(c => c.crn === crn)) {
                alert("A class with this crn already exists.");
                return;
            }
        }

        const newClass = {
            crn,
            instructor,
            takenSeats: 0,
            totalSeats,
            status: "pending",
            validated: false
        }

        course.classes.push(newClass);
        form.reset();

        saveCourses();
        renderPage();
    }

    document.querySelector("#logout-btn").addEventListener("click", function () {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    courses = await loadCourses();
    categories = await loadCategories();
    instructors = await loadInstructors();

    console.log(categories);
    console.log(courses);
    console.log(instructors);

    document.querySelector("#add-course-form").addEventListener("submit", addCourse);
    document.querySelector("#add-class-form").addEventListener("submit", addClass);

    renderPage();

    // localStorage.removeItem("courses");
    // localStorage.removeItem("categories");
    // localStorage.removeItem("instructors");
});