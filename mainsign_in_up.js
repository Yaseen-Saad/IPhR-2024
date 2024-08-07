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
const firebaseConfig5 = {
  apiKey: "AIzaSyDseJkyt7T2dbSBAnZt9Lp5pERi6wQjtJo",
  authDomain: "iphr-2024-2.firebaseapp.com",
  projectId: "iphr-2024-2",
  storageBucket: "iphr-2024-2.appspot.com",
  messagingSenderId: "63958682226",
  appId: "1:63958682226:web:c0ab850118832e5dc0d0eb",
  measurementId: "G-8S07Z8KJY1",
};
const firebaseConfig6 = {
  apiKey: "AIzaSyAgKDLrua5yPKrNalPFhlIcF9xnoQFJ3R8",
  authDomain: "iphr-2024-5.firebaseapp.com",
  projectId: "iphr-2024-5",
  storageBucket: "iphr-2024-5.appspot.com",
  messagingSenderId: "330684274354",
  appId: "1:330684274354:web:bb908ff1b6b275d2845bab",
  measurementId: "G-KFJGJ7L376",
};

const firebaseConfig7 = {
  apiKey: "AIzaSyBgjHCoS8HHT1d7n9eb0cp-cFpGZ3unQKQ",
  authDomain: "iphr-2024-6.firebaseapp.com",
  projectId: "iphr-2024-6",
  storageBucket: "iphr-2024-6.appspot.com",
  messagingSenderId: "426521225758",
  appId: "1:426521225758:web:d1110a8e2e0f248d971c0f",
  measurementId: "G-43QHB4DK64",
};

const firebaseConfig8 = {
  apiKey: "AIzaSyCiUZ5XEl1ZXoX7BdVrGOSbL3oSFnN9MAI",
  authDomain: "iphr-2024-1.firebaseapp.com",
  projectId: "iphr-2024-1",
  storageBucket: "iphr-2024-1.appspot.com",
  messagingSenderId: "596873795229",
  appId: "1:596873795229:web:52a725b4f313e682b9e674",
  measurementId: "G-JQ3T2C40FF",
};

const firebaseConfig9 = {
  apiKey: "AIzaSyCkyI-Iln-eZBLmptF1Qzb9iqTHZJ5WAGs",
  authDomain: "iphr-2024-4.firebaseapp.com",
  projectId: "iphr-2024-4",
  storageBucket: "iphr-2024-4.appspot.com",
  messagingSenderId: "382556149717",
  appId: "1:382556149717:web:8f79ed3e30da3dbd904f5c",
  measurementId: "G-J94CLFQ5RL",
};
const firebaseConfig10 = {
  apiKey: "AIzaSyABkgQNtzGZpHdCgBORccp4oVomJbh0Fvk",
  authDomain: "iphr-2024-3.firebaseapp.com",
  projectId: "iphr-2024-3",
  storageBucket: "iphr-2024-3.appspot.com",
  messagingSenderId: "523976251468",
  appId: "1:523976251468:web:0eed4aa684ebe145187ce9",
  measurementId: "G-JGWT3BSWBH",
};

const appMain = firebase.initializeApp(firebaseConfigMain, "mainApp");
const appSecondary = firebase.initializeApp(
  firebaseConfigSecondary,
  "secondaryApp"
);
const app3 = firebase.initializeApp(firebaseConfig3, "app3");
const app4 = firebase.initializeApp(firebaseConfig4, "app4");
const app5 = firebase.initializeApp(firebaseConfig5, "app5");
const app6 = firebase.initializeApp(firebaseConfig6, "app6");
const app7 = firebase.initializeApp(firebaseConfig7, "app7");
const app8 = firebase.initializeApp(firebaseConfig8, "app8");
const app9 = firebase.initializeApp(firebaseConfig9, "app9");
const app10 = firebase.initializeApp(firebaseConfig10, "app10");
