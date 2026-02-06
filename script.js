import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore, collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyConAp3gpoCpKv-W5X23qt4ZcvsVdByHys",
  authDomain: "love-notes-for-regine-62c65.firebaseapp.com",
  projectId: "love-notes-for-regine-62c65"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ELEMENTS
const loginDiv = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const viewerNotes = document.getElementById("viewerNotes");

// LOGIN
loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    loginDiv.style.display = "none";
    dashboard.style.display = "block";
    loadNotes();
  } catch {
    error.innerText = "Invalid credentials";
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
  dashboard.style.display = "none";
  loginDiv.style.display = "block";
};

// ADD NOTE
addNote.onclick = async () => {
  await addDoc(collection(db, "notes"), {
    content: noteText.value,
    archived: false,
    createdAt: serverTimestamp()
  });
  noteText.value = "";
  loadNotes();
  loadViewer();
};

// LOAD ADMIN NOTES
async function loadNotes() {
  const snap = await getDocs(collection(db, "notes"));
  notes.innerHTML = "";
  archivedNotes.innerHTML = "";

  snap.forEach(docSnap => {
    const d = docSnap.data();

    const card = `
      <div class="card">
        <p>${d.content}</p>
        <button onclick="archiveNote('${docSnap.id}', ${d.archived})">
          ${d.archived ? "Unarchive" : "Archive"}
        </button>
        <button onclick="deleteNote('${docSnap.id}')">Delete</button>
      </div>
    `;

    if (d.archived) archivedNotes.innerHTML += card;
    else notes.innerHTML += card;
  });
}

// ARCHIVE
window.archiveNote = async (id, state) => {
  await updateDoc(doc(db, "notes", id), { archived: !state });
  loadNotes();
  loadViewer();
};

// DELETE
window.deleteNote = async (id) => {
  await deleteDoc(doc(db, "notes", id));
  loadNotes();
  loadViewer();
};

// VIEWER SIDE
async function loadViewer() {
  const snap = await getDocs(collection(db, "notes"));
  viewerNotes.innerHTML = "";

  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (d.archived) return;

    viewerNotes.innerHTML += `
      <div class="card">
        <p>${d.content}</p>
        <input placeholder="Reply..." id="reply-${docSnap.id}" />
        <button onclick="sendReply('${docSnap.id}')">Reply</button>
        <div id="replies-${docSnap.id}"></div>
      </div>
    `;

    loadReplies(docSnap.id);
  });
}

// REPLIES
window.sendReply = async (noteId) => {
  const msg = document.getElementById(`reply-${noteId}`).value;
  await addDoc(collection(db, "notes", noteId, "replies"), {
    message: msg,
    createdAt: serverTimestamp()
  });
  document.getElementById(`reply-${noteId}`).value = "";
  loadReplies(noteId);
};

async function loadReplies(noteId) {
  const snap = await getDocs(collection(db, "notes", noteId, "replies"));
  const container = document.getElementById(`replies-${noteId}`);
  if (!container) return;
  container.innerHTML = "";

  snap.forEach(r => {
    container.innerHTML += `<div class="reply">💬 ${r.data().message}</div>`;
  });
}

// INITIAL LOAD
loadViewer();
