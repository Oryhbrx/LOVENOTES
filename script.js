// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -------------------
// 1. FIREBASE CONFIG
// -------------------
const firebaseConfig = {
  apiKey: "AIzaSyConAp3gpoCpKv-W5X23qt4ZcvsVdByHys",
  authDomain: "love-notes-for-regine-62c65.firebaseapp.com",
  projectId: "love-notes-for-regine-62c65",
  storageBucket: "love-notes-for-regine-62c65.firebasestorage.app",
  messagingSenderId: "804540221651",
  appId: "1:804540221651:web:a2a8fe123bfffe8ebe6c26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------
// 2. ELEMENTS
// -------------------
const loginDiv = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const errorP = document.getElementById("error");

const noteText = document.getElementById("noteText");
const addNoteBtn = document.getElementById("addNote");
const notesDiv = document.getElementById("notes");
const archivedDiv = document.getElementById("archivedNotes");

const viewerDiv = document.getElementById("viewerNotes");

// -------------------
// 3. LOGIN / LOGOUT
// -------------------
loginBtn.onclick = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    errorP.innerText = "";
    loginDiv.style.display = "none";
    dashboard.style.display = "block";
    loadNotes();
    loadViewer();
  } catch (err) {
    console.log(err);
    errorP.innerText = "Login failed: " + err.message;
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
  dashboard.style.display = "none";
  loginDiv.style.display = "block";
};

// -------------------
// 4. ADD NEW NOTE
// -------------------
addNoteBtn.onclick = async () => {
  const text = noteText.value.trim();
  if (text === "") return;

  await addDoc(collection(db, "notes"), {
    content: text,
    archived: false,
    createdAt: serverTimestamp()
  });

  noteText.value = "";
  loadNotes();
  loadViewer();
};

// -------------------
// 5. LOAD NOTES FOR ADMIN
// -------------------
async function loadNotes() {
  const snap = await getDocs(collection(db, "notes"));
  notesDiv.innerHTML = "";
  archivedDiv.innerHTML = "";

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const cardHTML = `
      <div class="card">
        <p>${data.content}</p>
        <button onclick="archiveNote('${id}', ${data.archived})">
          ${data.archived ? "Unarchive" : "Archive"}
        </button>
        <button onclick="deleteNote('${id}')">Delete</button>
      </div>
    `;

    if (data.archived) archivedDiv.innerHTML += cardHTML;
    else notesDiv.innerHTML += cardHTML;
  });
}

// -------------------
// 6. ARCHIVE / DELETE
// -------------------
window.archiveNote = async (id, currentState) => {
  await updateDoc(doc(db, "notes", id), { archived: !currentState });
  loadNotes();
  loadViewer();
};

window.deleteNote = async (id) => {
  await deleteDoc(doc(db, "notes", id));
  loadNotes();
  loadViewer();
};

// -------------------
// 7. VIEWER PANEL
// -------------------
async function loadViewer() {
  const snap = await getDocs(collection(db, "notes"));
  viewerDiv.innerHTML = "";

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    if (data.archived) return; // skip archived

    viewerDiv.innerHTML += `
      <div class="card">
        <p>${data.content}</p>
        <input id="reply-${id}" placeholder="Reply..." />
        <button onclick="sendReply('${id}')">Reply</button>
        <div id="replies-${id}"></div>
      </div>
    `;

    loadReplies(id);
  });
}

// -------------------
// 8. REPLIES SYSTEM
// -------------------
window.sendReply = async (noteId) => {
  const input = document.getElementById(`reply-${noteId}`);
  const msg = input.value.trim();
  if (!msg) return;

  await addDoc(collection(db, "notes", noteId, "replies"), {
    message: msg,
    createdAt: serverTimestamp()
  });

  input.value = "";
  loadReplies(noteId);
};

async function loadReplies(noteId) {
  const snap = await getDocs(collection(db, "notes", noteId, "replies"));
  const container = document.getElementById(`replies-${noteId}`);
  container.innerHTML = "";

  snap.forEach(r => {
    container.innerHTML += `<div class="reply">💬 ${r.data().message}</div>`;
  });
}

// -------------------
// 9. INITIAL LOAD
// -------------------
loadViewer();
