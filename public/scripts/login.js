document.addEventListener("DOMContentLoaded", async function () {

    function hideLogin(usersToHide) {
        for (const user of usersToHide) {
            user.classList.remove("show-login");
            user.classList.add("hide-login");
        }
    }

    function handleUserChoice(event) {
        const usersToHide = []
        const users = document.querySelectorAll(".user-login");
        const selectedUserId = event.target.id + "-login";

        for (const user of users) {
            if (user.id === selectedUserId) {
                user.classList.remove("hide-login");
                user.classList.add("show-login");
            }
            else {
                usersToHide.push(user);
            }

        }
        hideLogin(usersToHide)
    }

    function initializeLogin() {
        const usersToHide = document.querySelectorAll(".user-login");
        hideLogin(usersToHide);
    }

    async function handleUserLogin(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const userType = event.target.id.replace(/\s*-login$/, "");

        const email = formData.get("email");
        const password = formData.get("password");
        // const res = await fetch('data/users.json')
        // const users = await res.json();

        const response = await fetch('http://localhost:3000/api/users');
        const users = await response.json();

        const match = users.find(user =>
            user.email === email &&
            user.password === password &&
            user.userType === userType.toUpperCase()
        );

        if (match) {
            if (userType === "student") {
                window.location.href = `student-main.html?email=${match.id}`;
            }
            else if (userType === "admin") {
                window.location.href = `admin-main.html?email=${match.id}`;
            }
            else if (userType === "instructor") {
                window.location.href = `instructor-main.html?email=${match.id}`;
            }
        } else {
            alert("Login failed: Invalid email, password, or user type.");
        }
    }

    document.querySelectorAll(".user > button").forEach(form => {
        form.addEventListener('click', handleUserChoice);
    });

    document.querySelectorAll("form.user-login").forEach(form => {
        form.addEventListener("submit", handleUserLogin);
    });

    await initializeLogin();

    // localStorage.removeItem("categories");
    // localStorage.removeItem("courses");
    // localStorage.removeItem("currentCRN");
    // localStorage.removeItem("instructors");
    // localStorage.removeItem("loggedInUser");
    // localStorage.removeItem("students");

});