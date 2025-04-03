document.addEventListener("DOMContentLoaded", async function () {
    
    const courses = await fetch('repo/data/courses.json').then(res => res.json());

    // getting courses that have no instructor
    let availableCourses = courses.filter(course => !course.instructor);

    const tbody = document.querySelector("tbody");
    const courseNameInput = document.querySelector("#course-name");
    const courseCategoryInput = document.querySelector("#course-category");

    // storing interested cuorses 
    const interestedCourses = new Set(JSON.parse(localStorage.getItem("interestedCourses")) || []);

  
    function displayCourses(filteredCourses) {
        if (filteredCourses.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4'>No available courses.</td></tr>";
            return;
        }

        tbody.innerHTML = filteredCourses.map(course => `
            <tr>
                <td>${course.courseName}</td>
                <td>${course.category}</td>
                <td>${course.crn}</td>
                <td>
                    <button class="interest-btn ${interestedCourses.has(course.crn) ? 'interested' : ''}" 
                        data-crn="${course.crn}">
                        ${interestedCourses.has(course.crn) ? "Interested" : "Interest"}
                    </button>
                </td>
            </tr>
        `).join('');

        //fr button event listener
        attachInterestEventListeners();
    }

    // dislaying courses according to search 
    function filterCourses() {
        const searchName = courseNameInput.value.toLowerCase();
        const searchCategory = courseCategoryInput.value.toLowerCase();

        //going thro each of the avaialble courses to match their name n category to the search
        //displays all avaialve course if no search
        
        const filteredCourses = availableCourses.filter(course => 
            (searchName === "" || course.courseName.toLowerCase().includes(searchName)) &&
            (searchCategory === "" || course.category.toLowerCase().includes(searchCategory))
        );

        displayCourses(filteredCourses);
    }

    //  event listeners to interest buttons
    function attachInterestEventListeners() {
        document.querySelectorAll(".interest-btn").forEach(button => {
            const crn = button.dataset.crn;

            button.addEventListener("click", function () {
                if (interestedCourses.has(crn)) {  //deselecting interest button
                    interestedCourses.delete(crn);
                    button.textContent = "Interest"; // Change text back
                    button.classList.remove("interested"); // Remove green color
                } else {                            //selecting interest button
                    interestedCourses.add(crn);
                    button.textContent = "Interested"; // Change text when selected
                    button.classList.add("interested"); // Add green color
                }
            });
        });
    }

    //when page first loads this called
    displayCourses(availableCourses);

    // Event listeners for search inputs
    courseNameInput.addEventListener("input", filterCourses);
    courseCategoryInput.addEventListener("input", filterCourses);

    // Submit button: Save interested courses
    document.querySelector(".submit-button").addEventListener("click", function () {
        localStorage.setItem("interestedCourses", JSON.stringify([...interestedCourses]));
        alert("Preferences saved!");
    });

    // Logout functionality
    document.querySelector("#logout-btn").addEventListener("click", function () {
        localStorage.removeItem("loggedInInstructor");
        window.location.href = "login.html";
    });
});
