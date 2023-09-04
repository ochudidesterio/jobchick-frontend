import {initializeApp} from 'firebase/app'
import {getStorage} from "firebase/storage"
import {ref as storageRef} from "firebase/storage"
import { initializeFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyC3F5rcDAhmJlQlQ9L-CmHtkkjSxv-e7Co",
  authDomain: "jobchickmobile.firebaseapp.com",
  projectId: "jobchickmobile",
  storageBucket: "jobchickmobile.appspot.com",
  messagingSenderId: "338370420511",
  appId: "1:338370420511:web:77b0692d25aa121b721a2a",
  measurementId: "G-W33XRZ01QB"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app)
  const db = initializeFirestore(app, {experimentalForceLongPolling: true});
  export{db}
  export{storageRef}