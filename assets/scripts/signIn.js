import { auth } from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const signInBttn = document.getElementById("googleSignInBtn");

// const sw = new URL('service-worker.js', import.meta.url);

// if ('serviceWorker' in navigator) {
//     const s = navigator.serviceWorker;
//     s.register(sw.href, {
//         scope: '/CheckList/'
//     }).then(_ => console.log('Service Worker Registered for scope:', sw.href, 'with', import.meta.url))
//         .catch(err => console.error('Service Worker Error:', err));
// }

function signIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Sign-in result:", result);
        const user = result.user;
        localStorage.setItem("email", JSON.stringify(user.email));
        console.log("User email saved. Redirecting to main.html");
        window.location.href = "main.html";
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });
  }
  
signInBttn.addEventListener("click", function(event) {
    signIn();
});