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
  
  // Initialize Firebase apps
  const appMain = firebase.initializeApp(firebaseConfigMain, "mainApp");
  const appSecondary = firebase.initializeApp(firebaseConfigSecondary, "secondaryApp");
  
  // Initialize storage instances
  const storageMain = firebase.storage(appMain);
  const storageSecondary = firebase.storage(appSecondary);
  
  // Variable to hold the current storage instance
  let currentStorage = storageMain;
  
  // Function to switch to secondary storage
  function switchToSecondaryStorage() {
    currentStorage = storageSecondary;
    console.log("Switched to secondary storage");
  }
  
  // Function to switch to main storage
  function switchToMainStorage() {
    currentStorage = storageMain;
    console.log("Switched to main storage");
  }
  
  // Usage example
  document.getElementById("switch-to-secondary").addEventListener("click", switchToSecondaryStorage);
  document.getElementById("switch-to-main").addEventListener("click", switchToMainStorage);

  // Video processing and TensorFlow model loading
  const video = document.getElementById("video");
  const status = document.getElementById("status");
  const overlay = document.getElementById("overlay");
  const context = overlay.getContext("2d");  
  cocoSsd
    .load()
    .then((model) => {
      status.textContent = "Model loaded!";
      startVideo(model);
    })
    .catch((error) => {
      console.error("Error loading the COCO-SSD model:", error);
      status.textContent = "Failed to load model.";
    });
  
  function startVideo(model) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        console.log("Video stream started.");
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          console.log("Video metadata loaded.");
          video.play();
          snap = () => takeSnapshot(model, currentStorage);
          setInterval(snap, 10000); // Take snapshot every 10 seconds
        };
      })
      .catch((error) => {
        console.error("Error accessing the camera:", error);
        status.textContent = "Failed to access the camera. Please allow camera permissions.";
      });
  }
  
  function takeSnapshot(model, storage) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvas.toBlob((blob) => {
      uploadToFirebase(blob, storage);
      detectFrame(canvas, model);
    }, "image/jpeg");
  }
  
  function uploadToFirebase(blob, storage) {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`snapshots/${Date.now()}.jpg`);
    imageRef
      .put(blob)
      .then((snapshot) => {
        console.log("Uploaded a snapshot!", snapshot);
        status.textContent = "Successfully uploaded snapshot.";
      })
      .catch((error) => {
        console.error("Error uploading snapshot:", error);
        status.textContent = "Error uploading snapshot.";
      });
  }
  
  function detectFrame(canvas, model) {
    model
      .detect(canvas)
      .then((predictions) => {
        console.log("Predictions:", predictions);
        drawPredictions(predictions);
        checkParticipants(predictions);
      })
      .catch((error) => {
        console.error("Error during detection:", error);
      });
  }
  
  function drawPredictions(predictions) {
    context.clearRect(0, 0, overlay.width, overlay.height);
    predictions.forEach((prediction) => {
      context.beginPath();
      context.rect(...prediction.bbox);
      context.lineWidth = 2;
      context.strokeStyle = "red";
      context.fillStyle = "red";
      context.stroke();
      context.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        prediction.bbox[0],
        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
      );
      context.closePath();
    });
  }
  
  function checkParticipants(predictions) {
    const personPredictions = predictions.filter((prediction) => prediction.class === "person");
    if (personPredictions.length === 0) {
      status.textContent = "No participant in the camera.";
    } else if (personPredictions.length === 1) {
      status.textContent = "One participant in the camera.";
    } else {
      status.textContent = "More than one participant in the camera.";
    }
  }