
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 


const firebaseConfig = {
  apiKey: "AIzaSyASLU7Th5Zm5TnSrBidIkZs1vs9P1XukK0",
  authDomain: "irctc-f451c.firebaseapp.com",
  projectId: "irctc-f451c",
  storageBucket: "irctc-f451c.firebasestorage.app",
  messagingSenderId: "28140086035",
  appId: "1:28140086035:web:b51c3620562b6a7c66f0e6",
  measurementId: "G-28J7T08YWR"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);

export { auth, analytics }; 