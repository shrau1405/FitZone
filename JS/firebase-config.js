// JS/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyA3kadHHF6_ZoY_W7UPOehm4VVA9gJH91M",
  authDomain: "gymmanagementsystem-7de1d.firebaseapp.com",
  projectId: "gymmanagementsystem-7de1d",
  storageBucket: "gymmanagementsystem-7de1d.appspot.com",
  messagingSenderId: "303230208780",
  appId: "1:303230208780:web:d46f5af97972ec33fc9729",
  measurementId: "G-P5NCEDQXGY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();
