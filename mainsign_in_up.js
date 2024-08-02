// Your Firebase configurations
const firebaseConfigMain = {
  apiKey: "AIzaSyCHgco_wCd9dU5omM-iBANzMD0H9vgpEIY",
  authDomain: "stem-october.firebaseapp.com",
  projectId: "stem-october",
  storageBucket: "stem-october.appspot.com",
  messagingSenderId: "406537495339",
  appId: "1:406537495339:web:11a024fe39c5e628e75b6e",
  measurementId: "G-4TMZ8601NM",
};

const firebaseConfigSecondary = {
  apiKey: "AIzaSyBFAzmoAPFyC6F8KX7i3GVOQTyt3FUx020",
  authDomain: "test-8cee9.firebaseapp.com",
  databaseURL: "https://test-8cee9-default-rtdb.firebaseio.com",
  projectId: "test-8cee9",
  storageBucket: "test-8cee9.appspot.com",
  messagingSenderId: "948419772366",
  appId: "1:948419772366:web:1f2d00b6a6947a8654759f",
  measurementId: "G-HH00QTEQP9",
};
const firebaseConfig3 = {
  apiKey: "AIzaSyCQP7EKxCdys_IFqhfBzrbop625K6k8H8E",
  authDomain: "stem-october-courses.firebaseapp.com",
  projectId: "stem-october-courses",
  storageBucket: "stem-october-courses.appspot.com",
  messagingSenderId: "914099608418",
  appId: "1:914099608418:web:387c0d2a9c6ded3df22a3b",
  measurementId: "G-J3L01X5T31",
};
const firebaseConfig4 = {
  apiKey: "AIzaSyABZhi1dRA3s1VnaJACrpTy2XJZPRIb23Q",
  authDomain: "esp32-b7b1a.firebaseapp.com",
  databaseURL: "https://esp32-b7b1a-default-rtdb.firebaseio.com",
  projectId: "esp32-b7b1a",
  storageBucket: "esp32-b7b1a.appspot.com",
  messagingSenderId: "629790213722",
  appId: "1:629790213722:web:7eec5c2481fad8f384ba63",
};
// Initialize Firebase apps
const appMain = firebase.initializeApp(firebaseConfigMain, "mainApp");
const appSecondary = firebase.initializeApp(
  firebaseConfigSecondary,
  "secondaryApp"
);
const app3 = firebase.initializeApp(
  firebaseConfig3,
  "app3"
);
const app4 = firebase.initializeApp(
  firebaseConfig4,
  "app4"
);
