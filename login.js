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

    document.querySelector("#student").addEventListener('click', handleUserLogin);
    document.querySelector("#admin").addEventListener('click', handleUserLogin);
    document.querySelector("#instructor").addEventListener('click', handleUserLogin);

    initializeLogin();


});