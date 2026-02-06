// SIMPLE PASSWORDS (pwede mo palitan)
const ADMIN_PASSWORD = "admin";
const USER_PASSWORD = "admin";

function login(role) {
  const input = document.getElementById("password").value;

  if (role === "admin" && input === ADMIN_PASSWORD) {
    localStorage.setItem("role", "admin");
    window.location.href = "admin-panel.html";
  } 
  else if (role === "user" && input === USER_PASSWORD) {
    localStorage.setItem("role", "user");
    window.location.href = "index.html";
  } 
  else {
    alert("Wrong password 💔");
  }
}

function checkAdmin() {
  if (localStorage.getItem("role") !== "admin") {
    window.location.href = "admin.html";
  }
}

function logout() {
  localStorage.removeItem("role");
  window.location.href = "admin.html";
}
