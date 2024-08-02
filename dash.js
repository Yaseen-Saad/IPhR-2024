const signOut = async (_) => {
  await firebase.auth(appMain).signOut();
  localStorage.clear();
  CheckUserCredits();
};
function toggleCamera() {
  document.querySelector("aside").classList.toggle("hidden");
}
async function CheckUserCredits() {
  let useremail;
  // Wrap onAuthStateChanged in a Promise
  useremail = await new Promise((resolve, reject) => {
    firebase.auth(appMain).onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          if (!localStorage.getItem(idTokenResult.token)) {
            location.href = domain;
            reject("Redirecting due to missing token");
          } else {
            console.log("signed in");
            function checkCameraAccess() {
              navigator.permissions
                .query({ name: "camera" })
                .then((permissionStatus) => {
                  if (permissionStatus.state === "granted") {
                    console.log("Camera access already granted");
                  } else if (permissionStatus.state === "prompt") {
                    console.log("Camera prmpt");
                  } else if (permissionStatus.state === "denied") {
                    alert("Please Allow Camera Access");
                    location.reload();
                  }
                  // Listen for permission state changes
                  permissionStatus.onchange = () => {
                    if (permissionStatus.state === "granted") {
                    } else if (permissionStatus.state === "denied") {
                      alert("Please Allow Camera Access");
                      location.reload();
                    }
                  };
                });
            }

            // Initialize camera access check
            checkCameraAccess();

            resolve(user.email);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        location.href = domain;
        reject("Redirecting due to no user");
      }
    });
  });

  console.log("user", useremail);
  return useremail;
}

function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (
  Date.now() >= examOpenInterval[0].getTime() &&
  Date.now() <= examOpenInterval[1].getTime()
) {
  if (getUserMediaSupported()) {
    (async () => {
      if (!localStorage.getItem("SwitchedTabsCount")) {
        localStorage.setItem("SwitchedTabsCount", "[]");
      }
      if (!localStorage.getItem("Snapshots")) {
        localStorage.setItem("Snapshots", "[]");
      }
      if (!localStorage.getItem("NoOneCount")) {
        localStorage.setItem("NoOneCount", "[]");
      }
      if (!localStorage.getItem("moreThanOneCount")) {
        localStorage.setItem("moreThanOneCount", "[]");
      }
      let useremail = await CheckUserCredits();
      const dataFirestore = firebase
        .firestore(appMain)
        .collection("parts")
        .doc(useremail);
      const request = await dataFirestore.get();
      const data = request.data();
      localStorage.setItem("timeOpened", data.timeOpened);
      if (!data?.registeredTime) {
        if (localStorage.getItem("timeOpened")) {
          console.log(
            +localStorage.getItem("timeOpened") + examDuration > Date.now()
          );
          if (+localStorage.getItem("timeOpened") + examDuration > Date.now()) {
            let personHistory = [];
            const video = document.getElementById("video");
            const detectionInterval = 300; // ms
            const checkDuration = 4000; // ms
            const historyLength = checkDuration / detectionInterval;
            const confidenceThreshold = 0.6; // Adjust this threshold as needed
            const capDelay = 3 * 60 * 1000;
            const switchDBDelay = 5 * 60 * 1000;
            const storage1 = firebase.storage(appMain);
            const storage2 = firebase.storage(appSecondary);
            const storage3 = firebase.storage(app3);
            const storage4 = firebase.storage(app4);
            let currentStorage = storage1;
            const timerInterval = setInterval(() => {
              updateTimer();
            }, 1000);
            window.onbeforeunload = function () {
              return "No data will be submitted if you left the page.";
            };
            const storages = [storage1, storage2, storage3, storage4];
            function switchStorage() {
              console.log(currentStorage);
              if (currentStorage != storage4) {
                currentStorage = storages[storages.indexOf(currentStorage) + 1];
              } else {
                currentStorage = storages[0];
              }
            }
            // Timer function
            function updateTimer() {
              let timeLeft = parseInt(
                (-Date.now() +
                  examDuration +
                  +localStorage.getItem("timeOpened")) /
                  1000
              );
              const min = Math.floor(timeLeft / 60);
              const sec = timeLeft % 60;
              const formattedMinutes = `${
                min < 10 ? "0" + min.toString() : min
              }`;
              const formattedSeconds = `${
                sec < 10 ? "0" + sec.toString() : sec
              }`;
              document.getElementById(
                "timer"
              ).textContent = `${formattedMinutes}:${formattedSeconds}`;
              if (timeLeft <= 0 && +localStorage.getItem("timeOpened") != 0) {
                clearInterval(timerInterval);
                submitdata();
                showAlert("Time is Up");
              }
            }
            async function submitdata() {
              localStorage.setItem("timeOpened", 0);
              const mainDataObject = {};
              document.querySelector(".loader").style.display = "grid";
              [
                ...document.querySelectorAll("form article input[type=text]"),
              ].map(function (field) {
                mainDataObject[field.getAttribute("name")] = field.value;
              });
              [...document.querySelectorAll("form input[type=radio]")]
                .filter(function (field) {
                  return field.checked === true;
                })
                .map((answer) => {
                  mainDataObject[answer.name] = answer.id.split(
                    `${answer.name}`
                  )[1];
                });
              mainDataObject.SwitchedTabsCount = JSON.parse(
                localStorage.getItem("SwitchedTabsCount")
              );
              mainDataObject.Snapshots = JSON.parse(
                localStorage.getItem("Snapshots")
              );
              mainDataObject.NoOneCount = JSON.parse(
                localStorage.getItem("NoOneCount")
              );
              mainDataObject.moreThanOneCount = JSON.parse(
                localStorage.getItem("moreThanOneCount")
              );
              window.onbeforeunload = null;
              async function addDocument(answers) {
                try {
                  await firebase
                    .firestore(appMain)
                    .collection("parts")
                    .doc(useremail)
                    .update(
                      {
                        ...answers,
                        registeredTime: new Date(Date.now()).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                          }
                        ),
                      },
                      { merge: true }
                    );
                  (async function () {
                    await alert(
                      "Answer Submitted Successfully ",
                      "#04AA6D",
                      "International Physics Realm"
                    );
                    location.href = "https://octphysicsclub.org/competition/";
                  })();
                } catch (e) {
                  console.error("Error adding document: ", e);
                }
              }
              await addDocument(mainDataObject);
            }
            async function setupCamera() {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
              });
              video.srcObject = stream;

              return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                  resolve(video);
                };
              });
            }
            async function detectPeople(video, model) {
              const canvas = document.getElementById("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = video.width;
              canvas.height = video.height;

              const predictions = await model.detect(video);

              // Clear the canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              let personCount = 0;

              // Draw bounding boxes and marks
              predictions.forEach((prediction) => {
                if (
                  prediction.class === "person" &&
                  prediction.score >= confidenceThreshold
                ) {
                  personCount++;
                  const [x, y, width, height] = prediction.bbox;
                  ctx.strokeStyle = "#00FFFF";
                  ctx.lineWidth = 4;
                  ctx.strokeRect(x, y, width, height);
                  ctx.font = "18px Arial";
                  ctx.fillStyle = "#00FFFF";
                  ctx.fillText(
                    `${prediction.class} (${Math.round(
                      prediction.score * 100
                    )}%)`,
                    x,
                    y - 10
                  );

                  // Draw a mark (red circle) at the center of the bounding box
                  const centerX = x + width / 2;
                  const centerY = y + height / 2;
                  ctx.beginPath();
                  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
                  ctx.fillStyle = "red";
                  ctx.fill();
                }
              });

              // Update person history
              personHistory.push(personCount);
              if (personHistory.length > historyLength) {
                personHistory.shift();
              }

              // Calculate the percentage of readings
              const totalReadings = personHistory.length;
              const aloneReadings = personHistory.filter(
                (count) => count === 1
              ).length;
              const notAloneReadings = personHistory.filter(
                (count) => count > 1
              ).length;
              const notPresentReadings = personHistory.filter(
                (count) => count === 0
              ).length;
              const alonePercentage = (aloneReadings / totalReadings) * 100;
              const notAlonePercentage =
                (notAloneReadings / totalReadings) * 100;
              const notPresentPercentage =
                (notPresentReadings / totalReadings) * 100;
              console.log(personHistory);
              // Check the conditions
              if (totalReadings >= 10) {
                if (notAlonePercentage > 50) {
                  personHistory = [];
                  showAlert("Please sit alone.");
                }
                if (notPresentPercentage > 50) {
                  personHistory = [];
                  showAlert("Please sit in front of the camera.");
                }
              }
            }

            async function main() {
              const video = await setupCamera();
              video.play();
              const model = await cocoSsd.load();
              const detectLoop = async () => {
                await detectPeople(video, model);
                setTimeout(detectLoop, detectionInterval);
              };
              detectLoop();
              const form = document.querySelector("#registration-form");
              let questions;
              console.log(data.category);

              if (data?.category === "regular") {
                questions = [
                  {
                    statement: `The two functions \\(f(x) = x^2\\) and \\(g(x) = \\frac{1}{2}x^2+5\\) cross at two points. Let these two points be \\(a\\) and \\(b\\) such that \\(a < b\\). Find the area between the two curves on the interval \\([a,b]\\).`,
                    choices: [
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{3}}+ 5}}{42}-1}{5}\\)`,
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{4}}+ 5}}{42}-1}{5}\\)`,
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{5}}+ 5}}{42}-1}{5}\\)`,
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{6}}+ 5}}{42}-1}{5}\\)`,
                    ],
                  },
                  {
                    statement: `Evalute: \\[\\int_{0}^{\\infty} \\frac{x^2 \\sin(x)}{e^x - 1}\\, dx\\]`,
                  },
                  {
                    statement: `Evaluate:
\\[ \\sum_{n=1}^{\\infty}\\frac{2^{n+1}}{8\\cdot4^n-6\\cdot 2^n + 1}\\]`,
                    choices: [
                      `\\(5n^{34}\\)`,
                      `\\(\\dfrac{1}{3}\\)`,
                      `\\[ \\sum_{n=1}^{\\infty}\\frac{2}{8n+ 1}\\]`,
                      `\\(850n\\)`,
                    ],
                  },
                  { statement: "Physics or Bio Club?" },
                  {
                    statement: ` \\[\\lim_{x\\to6}\\dfrac{\\text{(Helmy)}^3+\\dfrac{1}{3}\\cdot4^3}{e^4\\pi\\times\\rho}\\]@Mohab Mekawi`,
                  },
                ];
              } else {
                questions = [
                  {
                    statement: `The F functions \\(f(x) = x^2\\) and \\(g(x) = \\frac{1}{2}x^2+5\\) cross at two points. Let these two points be \\(a\\) and \\(b\\) such that \\(a < b\\). Find the area between the two curves on the interval \\([a,b]\\).`,
                    choices: [
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{3}}+ 5}}{42}-1}{5}\\)`,
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{4}}+ 5}}{42}-1}{5}\\)`,
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{5}}+ 5}}{42}-1}{5}\\)`,
                      `\\(\\dfrac{\\dfrac{\\sqrt{x^{\\dfrac{2}{6}}+ 5}}{42}-1}{5}\\)`,
                    ],
                  },
                  {
                    statement: `Evalute:
    \\[\\left(\\lim_{x\\to0} \\dfrac{e^{7x}-1}{x}\\right)^8 + \\left(\\lim_{x\\to12}\\dfrac{x^2-25}{x+5}\\right)^7\\]`,
                    choices: [
                      `\\[\\lim_{x\\to 0} \\dfrac{-\\ln(1+78524(e^x-1))}{x}\\]`,
                      `\\[\\lim_{x\\to \\infty} \\dfrac{-\\ln(e^x-1)}{x}\\]`,
                      `\\[\\lim_{x\\to \\infty} \\dfrac{1}{x}\\]`,
                      `\\[\\lim_{x\\to 0} \\dfrac{-\\ln(69)}{x}\\]`,
                    ],
                  },
                  {
                    statement: `Find a solution to the following 2nd-order differential equation: \\[\\dfrac{d^2x}{dt^2} = -\\omega^2 x\\]`,
                    choices: [
                      `\\[V\\cos(\\omega t + \\kappa)\\]`,
                      `\\[Z\\cos(\\alpha t + \\kappa) +C\\]`,
                      `\\[Z\\cos(\\alpha t + \\theta) +C\\]`,
                      `\\[V\\cos(\\gamma t + \\kappa)\\]`,
                    ],
                  },
                  {
                    statement:
                      "Evaluate: \\[(-35e^{\\pi i })^2 - \\left(\\lim_{x\\to 31} \\frac{x^2-9}{x-3}\\right)^2 \\]",
                  },
                  { statement: "ENGLISH OR SPANISH ????????????" },
                ];
              }
              for (const question of questions) {
                const art = document.createElement("article");
                const title = document.createElement("h2");
                const statement = document.createElement("span");
                statement.innerText = question.statement;
                title.innerText = `Question ${questions.indexOf(question) + 1}`;
                console.log(question);
                if (question?.choices?.length) {
                  const choicesContainer = document.createElement("div");
                  for (choice of question.choices) {
                    const container = document.createElement("div");
                    const radio = document.createElement("input");
                    const label = document.createElement("label");
                    radio.name = `Q${questions.indexOf(question) + 1}`;
                    radio.id = `Q${questions.indexOf(question) + 1}${
                      ["A", "B", "C", "D"][question.choices.indexOf(choice)]
                    })`;
                    radio.type = "radio";
                    label.setAttribute(
                      "for",
                      `Q${questions.indexOf(question) + 1}${
                        ["A", "B", "C", "D"][question.choices.indexOf(choice)]
                      })`
                    );
                    label.innerText = choice;
                    container.append(radio, label);
                    choicesContainer.append(container);
                  }
                  art.append(title, statement, choicesContainer);
                } else {
                  const input = document.createElement("input");
                  input.type = "text";
                  input.id = `Q${questions.indexOf(question) + 1}`;
                  input.name = `Q${questions.indexOf(question) + 1}`;
                  input.setAttribute("placeholder", "Fill in this gap");
                  art.append(title, statement, input);
                }
                form.append(art);
                renderMathInElement(form);
              }
              const newArticle = document.createElement("article");
              const info = document.createElement("p");
              const issues = document.createElement("p");
              const submit = document.createElement("button");
              info.innerHTML = `For more information about STEM October's Physics Club, please visit the <a
                      href="https://octphysicsclub.org/">club's webpage</a>.`;
              issues.innerHTML = `In case you encounter any issues or have any inquiries, email us at <a href="mailto:octphysicsclub@gmail.com">octphysicsclub@gmail.com</a>.`;
              submit.type = "submit";
              submit.id = "submit";
              submit.innerText = "Submit";
              newArticle.append(info, issues, submit);
              form.append(newArticle);
              document
                .getElementById("submit")
                .addEventListener("click", (event) => {
                  event.preventDefault();
                  submitdata();
                });
              setInterval(() => {
                showAlert(currentStorage);
                console.log("regular capture");
                console.log(currentStorage);
              }, capDelay);
              setInterval(() => {
                switchStorage();
              }, switchDBDelay);
              document.querySelector(".loader").style.display = "none";
            }
            main();

            function reporterror(message, url) {
              try {
                if (message === "Please stay on the page.") {
                  localStorage.setItem(
                    "SwitchedTabsCount",
                    JSON.stringify([
                      ...JSON.parse(localStorage.getItem("SwitchedTabsCount")),
                      Date.now(),
                    ])
                  );
                } else if (message === "Please sit alone.") {
                  localStorage.setItem(
                    "moreThanOneCount",
                    JSON.stringify([
                      ...JSON.parse(localStorage.getItem("moreThanOneCount")),
                      { [Date.now()]: url },
                    ])
                  );
                } else if (message === "Please sit in front of the camera.") {
                  localStorage.setItem(
                    "NoOneCount",
                    JSON.stringify([
                      ...JSON.parse(localStorage.getItem("NoOneCount")),
                      { [Date.now()]: url },
                    ])
                  );
                } else {
                  localStorage.setItem(
                    "Snapshots",
                    JSON.stringify([
                      ...JSON.parse(localStorage.getItem("Snapshots")),
                      { [Date.now()]: url },
                    ])
                  );
                }
              } catch (e) {
                console.error(e);
              }
            }

            async function captureAndUpload(storage) {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              return new Promise((resolve, reject) => {
                canvas.toBlob(async (blob) => {
                  try {
                    const compressedBlob = await compressImage(blob, 0.3);
                    const uploadTask = storage
                      .ref()
                      .child(`snapshot/${useremail}/${Date.now()}.png`)
                      .put(compressedBlob);

                    uploadTask.on(
                      "state_changed",
                      null,
                      (error) => {
                        console.error("Upload failed:", error);
                        reject(error);
                      },
                      async () => {
                        const downloadURL =
                          await uploadTask.snapshot.ref.getDownloadURL();
                        console.log("File available at", downloadURL);
                        resolve(downloadURL);
                      }
                    );
                  } catch (err) {
                    reject(err);
                  }
                }, "image/jpeg");
              });
            }

            function compressImage(imageFile, quality) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function (event) {
                  const img = new Image();

                  img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                      function (blob) {
                        resolve(blob);
                      },
                      "image/jpeg",
                      quality
                    );
                  };

                  img.src = event.target.result;
                };

                reader.readAsDataURL(imageFile);
              });
            }

            async function showAlert(message) {
              if (message !== "Please stay on the page.") {
                const url = await captureAndUpload(currentStorage);
                reporterror(message, url);
              } else {
                reporterror(message);
              }
            }
            window.addEventListener("blur", () => {
              console.log(
                "User opened another window or switched to another application."
              );
              showAlert("Please stay on the page.");
            });
          } else {
            alert("Time is Up");
            location.href = domain;
          }
        } else {
          location.href = domain;
          alert("Exam not found.");
        }
      } else {
        alert("You can only join this exam once");
        location.href = domain;
      }
    })();
  } else {
    console.log("getUserMedia() is not supported by your browser");
  }
} else {
  location.href = domain;
}
