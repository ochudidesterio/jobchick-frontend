import {initializeApp} from 'firebase/app'
import {getStorage} from "firebase/storage"
import {ref as storageRef} from "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyCjmV64DA5oYzXBZSncscOpoAKwpC7p9w0",
    authDomain: "safiri-cb63b.firebaseapp.com",
    projectId: "safiri-cb63b",
    storageBucket: "safiri-cb63b.appspot.com",
    messagingSenderId: "965038465174",
    appId: "1:965038465174:web:07d140ddaae90979f962b7",
    measurementId: "G-C85FL8VFZ4"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app)
  export{storageRef}