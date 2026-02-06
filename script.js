import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE_KEY",
  authDomain: "PASTE_DOMAIN",
  projectId: "PASTE_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById("loginBtn");
const addNoteBtn = document.getElementById("addNote");

loginBtn.onclick = async () => {
  const email = email.value;
  const password = password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    login.style.display = "none";
    dashboard.style.display = "block";
    loadNotes();
  } catch {
    error.innerText = "Invalid credentials";
  }
};

addNoteBtn.onclick = async () => {
  const text = noteText.value;
  import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

await addDoc(collection(db, "notes"), {
  content: text,
  archived: false,
  createdAt: serverTimestamp()
});
  noteText.value = "";
  loadNotes();
};

async function loadNotes() {
  const querySnapshot = await getDocs(collection(db, "notes"));
  notes.innerHTML = "";
  querySnapshot.forEach(doc => {
    notes.innerHTML += `<p>${doc.data().content}</p>`;
  });
}
