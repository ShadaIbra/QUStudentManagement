document.addEventListener("DOMContentLoaded", async function () {

    categories = [];
    courses = [];
    classes = [];
    instructors = [];

    function saveCourses() {
        localStorage.setItem("courses", JSON.stringify(courses));
    }

    function saveClasses() {
        localStorage.setItem("classes", JSON.stringify(classes));
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

    async function loadClasses() {
        const saved = localStorage.getItem("classes");
        if (saved) {
            return JSON.parse(saved);
        }

        const res = await fetch("data/classes.json");
        let data = await res.json();

        localStorage.setItem("classes", JSON.stringify(data));
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

    function renderPage() {
        const categoriesSelect = document.querySelector("#category");
        categoriesSelect.innerHTML = `<option value="" disabled selected>Select a category</option>`;
        categoriesSelect.innerHTML += categories.map(category => `<option value="${category}">${category}</option>`).join('');

        const prereqsSelect = document.querySelector("#prereqs");
        prereqsSelect.innerHTML = courses.map(course => `<option value="${course.crn}">${course.courseName} (${course.crn})</option>`).join('');

        const courseSelect = document.querySelector("#class-crn");
        courseSelect.innerHTML = `<option value="" disabled selected>Select a Course</option>`;
        courseSelect.innerHTML += courses.map(course => `<option value="${course.crn}">${course.courseName} (${course.crn})</option>`).join('');

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
        const crn = formData.get("crn").trim();

        const prereqs = formData.getAll("prereqs");

        const enablePref = form.querySelector("#enable-pref").checked;

        if (courses.find(course => course.crn === crn)) {
            alert("A course with this CRN already exists. Please choose a unique CRN.");
            return;
        }

        const newCourse = {
            courseName,
            category,
            crn,
            prereqsCRN: prereqs || [],
            preferenceOpen: enablePref,
            preferenceList: [],
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

        const classCode = formData.get("class-code").trim();
        const crn = formData.get("class-crn");
        const totalSeats = parseInt(formData.get("total-seats"));

        // const course = courses.find(course => course.crn === crn);

        const instructor = formData.get("instructor");

        if (classes.find(c => c.classCode === classCode)) {
            alert("A class with this code already exists.");
            return;
        }

        const newClass = {
            classCode,
            crn,
            instructor,
            takenSeats: 0,
            totalSeats,
            status: "pending",
            validated: false
        }

        classes.push(newClass);
        form.reset();

        saveClasses();
        renderPage();
    }

    courses = await loadCourses();
    categories = await loadCategories();
    classes = await loadClasses();
    instructors = await loadInstructors();

    console.log(categories);
    console.log(courses);
    console.log(classes);
    console.log(instructors);

    document.querySelector("#add-course-form").addEventListener("submit", addCourse);
    document.querySelector("#add-class-form").addEventListener("submit", addClass);

    renderPage();

    // localStorage.removeItem("courses");
    // localStorage.removeItem("categories");
    // localStorage.removeItem("classes");
    // localStorage.removeItem("instructors");
});