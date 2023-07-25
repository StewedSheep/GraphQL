import Login from "./login.js"
import Student from "./class.js"
export const main = document.getElementById("main_page")


const currentURL = window.location.href;
const path = currentURL.split("/").pop();
if (path !== "") {
    window.location.href = "/";
}
document.addEventListener("DOMContentLoaded", () => {
    // Check for token
    if (localStorage.getItem("jwt")) {
        const student = new Student()
    } else {
        const login = new Login()
        main.innerHTML = login.render()
        document.getElementById("login_form").addEventListener("submit", login.handleLogin)
    }
})
