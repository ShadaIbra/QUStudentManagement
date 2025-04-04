const filePath = "data/courses.json";

let courses = [];

// Load from JSON file or Local Storage
async function load() {
    const saved = localStorage.getItem("courses");

    if (saved) {
        courses = JSON.parse(saved);
    } else {
        const res = await fetch(filePath);
        courses = await res.json();

        saveToLocalStorage();
    }
}

// Save to localStorage
export function saveToLocalStorage() {
    localStorage.setItem("courses", JSON.stringify(courses));
}

// Get all courses
export async function readCourses() {
    await load();
    return courses;
}

// Get one course by CRN
export function readCourse(crn) {
    return courses.find(course => course.crn === crn);
}

// Create a new course
export function create(courseObj) {
    if (readCourse(courseObj.crn)) {
        throw new Error("Course with this CRN already exists");
    }

    const newCourse = {
        courseName: courseObj.courseName || "",
        category: courseObj.category || "",
        crn: courseObj.crn,
        instructor: courseObj.instructor || "",
        takenSeats: 0,
        totalSeats: courseObj.totalSeats,
        prereqsCRN: courseObj.prereqsCRN || [],
        available: true,
        validated: false,
        preferenceList: courseObj.preferenceList || []
    };

    courses.push(newCourse);
    saveToLocalStorage();
    return newCourse;
}

export function updateInstructor(crn, instructorName) {
    const course = readCourse(crn);
    if (course) {
        course.instructor = instructorName;
        saveToLocalStorage();
    }
}

export async function addSeat(crn) {
    const course = readCourse(crn);
    if (course && course.takenSeats < course.totalSeats) {
        course.takenSeats += 1;
        saveToLocalStorage();
    }
}

export async function removeSeat(crn) {
    const course = readCourse(crn);
    if (course && course.takenSeats > 0) {
        course.takenSeats -= 1;
        saveToLocalStorage();
    }
}

export function addPreference(crn, instructorName) {
    const course = readCourse(crn);
    if (course && !course.preferenceList.includes(instructorName)) {
        course.preferenceList.push(instructorName);
        saveToLocalStorage();
    }
}

export function removePreference(crn, instructorName) {
    const course = readCourse(crn);
    if (course) {
        const index = course.preferenceList.indexOf(instructorName);
        if (index !== -1) {
            course.preferenceList.splice(index, 1);
            saveToLocalStorage();
        }
    }
}

export function validate(crn) {
    const course = readCourse(crn);
    if (course) {
        course.validated = true;
        saveToLocalStorage();
    }
}

// Remove a course by CRN
export async function remove(crn) {
    const index = courses.findIndex(course => course.crn === crn);
    if (index === -1) throw new Error("Course not found");

    const removed = courses.splice(index, 1)[0];
    saveToLocalStorage();
    return removed;
}
