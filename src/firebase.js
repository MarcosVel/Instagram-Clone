import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDxyW3CHvLRCBdzxUY1xcub65fRBE878kU",
  authDomain: "instagram-clone-430fa.firebaseapp.com",
  databaseURL: "https://instagram-clone-430fa.firebaseio.com",
  projectId: "instagram-clone-430fa",
  storageBucket: "instagram-clone-430fa.appspot.com",
  messagingSenderId: "228016305580",
  appId: "1:228016305580:web:12f441201cd8a95de5b609"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };