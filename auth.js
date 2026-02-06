const ADMIN_PASSWORD = "admin";

function initAdmin() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  document.getElementById("loginScreen").style.display = isAdmin ? "none" : "block";
  document.getElementById("adminScreen").style.display = isAdmin ? "block" : "none";
}

function loginAdmin() {
  const pass = document.getElementById("adminPass").value;

  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    initAdmin();
  } else {
    alert("Wrong password 💔");
  }
}

function logout() {
  localStorage.removeItem("isAdmin");
  initAdmin();
}
