document.addEventListener("DOMContentLoaded", async function () {

    function hideLogin(usersToHide) {
        for (const user of usersToHide) {
            user.classList.remove("show-login");
            user.classList.add("hide-login");
        }
    }

    function handleUserLogin(event) {
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

    async function checkLogin(event) {
        event.preventDefault();
 
        const form = event.target;
        const formData = new FormData(form);
       
        const email = formData.get("email");
        const password = formData.get("password");
        const res = await fetch('repo/data/users.json'); // adjust path if needed
       
        const users = await res.json();
       
        const match = users.find(user => user.email === email && user.password === password);
        if (match) {
 
            localStorage.setItem("loggedInUser", JSON.stringify(match));
     
     
            window.location.href = "student-main.html";
          }

      }

      document.querySelectorAll("form.user-login").forEach(form => {
        form.addEventListener("submit", checkLogin);
      });
    document.querySelector("#student").addEventListener('click', handleUserLogin);
    document.querySelector("#admin").addEventListener('click', handleUserLogin);
    document.querySelector("#instructor").addEventListener('click', handleUserLogin);

    initializeLogin();


});