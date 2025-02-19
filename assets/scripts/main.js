import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase.js";
import { loadBooks, initializeModals, showEditModal, showDeleteModal, addBook } from "./bookOperations.js";
import { filterAndDisplayBooks } from "./filterBooks.js";
import { initializeChatbot, askChatBot, handleLocalCommands } from "./chatbot.js";

// Initialize chatbot or any other global features
initializeChatbot();

document.addEventListener("DOMContentLoaded", () => {
  // Initialize modals for editing/deleting books
  initializeModals();

  // Grabbing DOM elements
  
  const sendBtn = document.getElementById("send-btn");
  const bookList = document.getElementById("bookList");
  const organizeBySelect = document.getElementById("organizeBy");
  const bookForm = document.getElementById("bookForm");
  const searchBar = document.getElementById("searchBar");
  const filterGenre = document.getElementById("filterGenre");
  const closeBtn = document.getElementById("chat-close-btn");

  //chatbot elements
  const chatWidget = document.getElementById("chat-widget");
  const chatCircle = document.getElementById("chat-circle");
  const chatHistory = document.getElementById("chat-history");
  const chatInput = document.getElementById("chat-input");
  
  // Sign-out modal elements
  const signOutBttn = document.getElementById("signOutBttn");
  const signOutModal = document.getElementById("signOutModal");
  const confirmSignOut = document.getElementById("confirmSignOut");
  const cancelSignOut = document.getElementById("cancelSignOut");

  // Chat UI Logic ---
  function appendMessage(text, sender = "bot") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    msgDiv.textContent = text;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  sendBtn.addEventListener("click", async () => {
    const userInput = chatInput.value.trim();
    if (!userInput) return;
    appendMessage(userInput, "user");
    chatInput.value = "";

    // Trying local commands first
    const handled = await handleLocalCommands(userInput, appendMessage);
    if (handled) return;

    // Otherwise, send to AI
    const botReply = await askChatBot(userInput);
    appendMessage(botReply, "bot");
  });

  chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  // Book Form Logic
  if (bookForm) {
    bookForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const author = document.getElementById("author").value.trim();
      const genre = document.getElementById("genre").value;
      const rating = document.getElementById("rating").value;
      if (title && author && genre && rating) {
        await addBook(title, author, genre, rating);
        bookForm.reset();
      }
    });
  }

  //Book List Logic (Edit/Delete) ---
  bookList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const bookId = e.target.getAttribute("data-id");
      showEditModal(bookId);
    } else if (e.target.classList.contains("delete-btn")) {
      const bookId = e.target.getAttribute("data-id");
      showDeleteModal(bookId);
    }
  });

  if (organizeBySelect) {
    organizeBySelect.addEventListener("change", () => {
      loadBooks();
    });
  }

  // Filter Logic
  async function applyFilters() {
    const searchText = searchBar.value.toLowerCase();
    const selectedGenre = filterGenre.value;
    await filterAndDisplayBooks(searchText, selectedGenre, bookList);
  }
  if (searchBar) {
    searchBar.addEventListener("input", applyFilters);
  }
  if (filterGenre) {
    filterGenre.addEventListener("change", applyFilters);
  }

  // Chat widget open/close
  chatCircle.addEventListener("click", () => {
    chatWidget.classList.toggle("chat-widget-open");
  });
  closeBtn.addEventListener("click", () => {
    chatWidget.classList.remove("chat-widget-open");
  });

  // onAuthStateChanged to ensure correct user is loaded
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User signed in:", user.email);
      // Load the current user's books
      loadBooks();
    } else {
      console.log("No user is signed in");
    }
  });
  applyFilters();

  // Sign Out Flow with Confirmation Modal
  signOutBttn.addEventListener("click", () => {
    // Show the sign-out confirmation modal
    signOutModal.style.display = "block";
  });

  confirmSignOut.addEventListener("click", async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });

  cancelSignOut.addEventListener("click", () => {
    signOutModal.style.display = "none";
  });
});
