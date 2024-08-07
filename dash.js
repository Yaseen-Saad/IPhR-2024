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
            function checkCameraAccess() {
              navigator.permissions
                .query({ name: "camera" })
                .then((permissionStatus) => {
                  if (permissionStatus.state === "granted") {
                  } else if (permissionStatus.state === "prompt") {
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
      console.log(data);

      if (data?.timeOpened) {
        localStorage.setItem("timeOpened", data.timeOpened);
      } else {
        localStorage.setItem("timeOpened", Date.now());
      }
      if (!data?.registeredTime) {
        if (localStorage.getItem("timeOpened")) {
          if (+localStorage.getItem("timeOpened") + examDuration > Date.now()) {
            let personHistory = [];
            const video = document.getElementById("video");
            const detectionInterval = 300; // ms
            const checkDuration = 4000; // ms
            const historyLength = checkDuration / detectionInterval;
            const confidenceThreshold = 0.65; // Adjust this threshold as needed
            const capDelay = 3 * 60 * 1000;
            const switchDBDelay = 3.4 * 60 * 1000;
            const storage1 = firebase.storage(appMain);
            const storage2 = firebase.storage(appSecondary);
            const storage3 = firebase.storage(app3);
            const storage4 = firebase.storage(app4);
            const storage5 = firebase.storage(app5);
            const storage6 = firebase.storage(app6);
            const storage7 = firebase.storage(app7);
            const storage8 = firebase.storage(app8);
            const storage9 = firebase.storage(app9);
            const storage10 = firebase.storage(app10);
            let currentStorage = storage1;

            const timerInterval = setInterval(() => {
              updateTimer();
            }, 1000);
            window.onbeforeunload = function () {
              return "No data will be submitted if you left the page.";
            };
            const storages = [
              storage1,
              storage2,
              storage3,
              storage4,
              storage5,
              storage6,
              storage7,
              storage8,
              storage9,
              storage10,
            ];
            function switchStorage() {
              if (currentStorage != storage10) {
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
                ...document.querySelectorAll(
                  "#registration-form article input[type=text]"
                ),
              ].map(function (field) {
                mainDataObject[field.getAttribute("name")] = field.value;
              });
              [
                ...document.querySelectorAll(
                  "#registration-form input[type=radio]"
                ),
              ]
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
              mainDataObject.DevToolsOpened = localStorage.getItem("devtools");
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
              let questions = [
                {
                  statement: `A planet orbiting a star has a period of 4 days and the length of the semi-major axis between them is 8000Km. If the period suddenly increased to 8 days, what is the new semi-major axis length in km?`,
                },
                {
                  statement: `Two identical blocks of the same mass are released simultaneously: one is thrown horizontally from the top of a mountain, and the other is dropped vertically. Which object is traveling faster when it hits the ground below?`,
                  choices: [
                    `The first block`,
                    `The second block`,
                    `They have the same speed when hitting the ground`,
                    `It is impossible to determine from the given information`,
                  ],
                },
                {
                  statement: `Vector A = (2.0i + 2.0j) and B = (2.0i - 4.0j). What is the angle, in degrees, that the vector sum of the two vectors makes with the origin?`,
                },
                {
                  statement: `In one-dimensional motion, what properties does the average speed of an object exhibit if it travels from one location to another and then returns to its original position?`,
                  choices: [
                    `It is positive`,
                    `It is negative`,
                    `It is zero`,
                    `It can be negative, positive, or zero`,
                  ],
                },
                {
                  statement: `A particle at \\(x_i = 3m\\) is moving with velocity \\(v_i = 10m/s\\) and is under uniform acceleration. If after some time t=2s the velocity of the particle becomes \\(v_f = -7m/s\\). What is the final position of the particle?`,
                },
                {
                  statement: `Which of the following is equivalent to Joule (J):`,
                  choices: [
                    `\\(\\dfrac{Kg.m}{s^2}\\)`,
                    `\\(\\dfrac{Kg.m^2}{s}\\)`,
                    `\\(\\dfrac{Kg.m^2}{s^2}\\)`,
                    `\\(\\dfrac{Kg^2.m^2}{s^2}\\)`,
                  ],
                },
                {
                  statement: `A small object of mass 300 g was released from a 7 m height, what's its velocity at a height of 0.5 m?`,
                },
                {
                  statement: `Consider six variables a, b, c, d, etc, and f which are related by the equation \\(ab+c=\\frac{d}{e} - f\\). If the units of a, b, and e are Pa, J, and N respectively, what are the units of c,d, and f?`,
                  choices: [
                    `\\(\\frac{N(\\frac{N}{m^2}{m} \ | \ \\frac{N^3}{m} \ | \ \\frac{N^2}{m}\\)`,
                    `\\} \ | \ \\frac{N^2}{m} \ | \ \\frac{N}{m}\\)`,
                    `\\(\\frac{N^2}{m^2} \ | \ \\frac{N^3}{m^2} \ | \ \\frac{N^2}{m^2}\\)`,
                    `\\(\\frac{N}{m^2} \ | \ \\frac{N^2}{m^2} \ | \ \\frac{N}{m^2}\\)`,
                  ],
                },
                {
                  statement: `If a rotating object with an angular velocity \\((\\omega = 40rad/s)\\) produces 50J of energy every second, what is the applied torque on this object?`,
                },
                {
                  statement: `Which of the following is true about torque \\((\\tau)\\) ?`,
                  choices: [
                    `torque is a vector quantity whose direction is tangent to the trajectory of the rotation.`,
                    `torque is a vector quantity whose direction is towards the axis of rotation.`,
                    `torque is a vector quantity whose direction is perpendicular on the plane of the trajectory.`,
                    `torque is a scalar quantity which has no direction.`,
                  ],
                },
                {
                  statement: `50 Newtons of force are needed to compress a spring with an initial length of 50 cm to a final length of 48 cm. What is the spring constant, k, of this spring?`,
                  choices: [
                    `\\(250 N/m\\)`,
                    `\\(250 kg \\cdot s^2\\)`,
                    `\\(2500 N \\cdot meter\\)`,
                    `\\(2500 kg/s^2\\)`,
                  ],
                },
                {
                  statement: `What determines the speed of a wave travelling through a medium?`,
                  choices: [
                    `The wave's frequency`,
                    `The wave's amplitude`,
                    `The properties of the medium`,
                    `The properties of the observer`,
                  ],
                },
                {
                  statement: `What is the restoring force and the energy of a spring? If the spring's position was at 2m, then it compressed to -3m. [k= 2.85N/m]`,
                  choices: [
                    `-14.25N, 35.63J`,
                    `14.25N, 35.63J`,
                    `-14.25N, 36.63J`,
                    `14.25N, 36.63J`,
                  ],
                },
                {
                  statement: `What is the angular frequency of a simple pendulum? \n \n \\(l\\): the length of the pendulum \n g: the acceleration due to gravity \n m: mass of the pendulum \n k: the young's modulus of the string`,
                  choices: [
                    `\\(\\sqrt{\\dfrac{k}{m}}\\)`,
                    `\\(\\dfrac{k}{m}\\)`,
                    `\\(\\dfrac{g}{\\ell}\\)`,
                    `\\(\\sqrt{\\dfrac{g}{\\ell}}\\)`,
                  ],
                },
                {
                  statement: `The power of a wave increased the most in which of the following`,
                  choices: [
                    `amplitude is doubled`,
                    `velocity is doubled`,
                    `angular frequency decreased to half`,
                    `mass per unit length triples`,
                  ],
                },
                {
                  statement: `If a system is considered adiabatic and the work is done on the system then:`,
                  choices: [
                    `\\(\\Delta U=W\\)`,
                    `\\(\\Delta U=-W\\)`,
                    `\\(\\Delta U=Q\\)`,
                    `\\(\\Delta U=-Q\\)`,
                  ],
                },
                {
                  statement: `Which of the following processes occurs with constant entropy?`,
                  choices: [
                    `Isentropic process`,
                    `Isenthalpic process`,
                    `All of the above`,
                    `None of the above`,
                  ],
                },
                {
                  statement: `If a Carnot engine has a heat reservoir of \\(225^{\\circ} c\\) and \\(a\\) cold reservoir at a temperature of \\(40^{\\circ} c\\), Its operating efficiency to the nearest percent will be:`,
                  choices: [`52 %`, `68 %`, `82 %`, `98 %`],
                },
                {
                  statement: `The length of a sheet of aluminum is \\(L = 40m\\) at \\(10^{\\circ} c\\), so what is the increase of its length, \\(\\Delta L\\), at \\(50^{\\circ} C\\)? (Linear expansion coefficient (\\(\\alpha)\\) of aluminum \\(= 24 \\times{10^{-6}})\\)`,
                  choices: [`6.84 cm`, `5.84 cm`, `4.84 cm`, `3.84 cm`],
                },
                {
                  statement: `if three electric lines are coming out from \\(Q\\) and only two entering \\(q\\) then:`,
                  choices: [
                    `\\(Q\\) is -, \\(q\\) +, \\(2q=3Q\\)`,
                    `\\(Q\\) is +, \\(q\\) -, \\(3q=2Q\\)`,
                    `\\(Q\\) is -, \\(q\\) -, \\(3q=2Q\\)`,
                    `\\(Q\\) is +, \\(q\\) +, \\(2q=3Q\\)`,
                  ],
                },
                {
                  statement: `A volt is:`,
                  choices: [
                    `the amount of work done to transfer a charge`,
                    `the amount of work done to create a current`,
                    `a vector quantity`,
                    `a and b`,
                  ],
                },
                {
                  statement: `A charge of 10 coulombs is represented by 20 electric field lines. How many lines will represent a 5-coulomb charge?`,
                  choices: [`20`, `10`, `5`, `2.5`],
                },
                {
                  statement: `Which of the following statements describe the potential difference across a parallel combination of resistors correctly?`,
                  choices: [
                    `They all have the same potential difference.`,
                    `The closest resistor to the battery has the largest potential difference.`,
                    `The farthest resistor from the battery has the largest potential difference.`,
                    `Depends on the resistance of each resistor.`,
                  ],
                },
                {
                  statement: `What is the acceleration of an electron moving through an electric field of \\(E = 1 \\times 10^5 N/C\\)?`,
                  choices: [
                    `\\(1.76 \\times 10^{16} m/s^2\\)`,
                    `\\(1.67 \\times 10^{16} m/s^2\\)`,
                    `\\(1.67 \\times 10^{6} m/s^2\\)`,
                    `\\(1.76 \\times 10^{6} m/s^2\\)`,
                  ],
                },
                {
                  statement: `If a wire is 5 meters long and carries 5 mA with no internal resistance. Calculate the force exerted on that conductor when it is placed in a uniform magnetic field equals \\(6 \\times 10^{-3}\\) Tesla`,
                  choices: [
                    `\\(1.4 \\times 10^{-4}\\)`,
                    `\\(1.4 \\times 10^{-6}\\)`,
                    `\\(1.5 \\times 10^{-4}\\)`,
                    `\\(1.5 \\times 10^{-6}\\)`,
                  ],
                },
                {
                  statement: `With the beginning of the alien invasion of Earth, an Unidentified flying Object, of cylindrical shape of height \\(3m\\) and its diameter is \\(10m\\), is flying horizontally in a vertical uniform electric field of magnitude \\(2 \\times 10^4\\). Determine the electric flux through the bottom of the strange aircraft.`,
                  choices: [
                    `\\( 1.885 \\times 10^7 \\)`,
                    `\\( 1.571 \\times 10^6 \\)`,
                    `\\(4.712 \\times 10^6\\)`,
                    `\\( 6.283 \\times 10^6 \\)`,
                  ],
                },
                {
                  statement: `The resistance of a wire of 0.01 cm radius is 10 Ω. If the resistivity of the material of the wire is \\(50 \\times 10^{-8} \\Omega m\\), find the length of the wire.`,
                  choices: [`0.628 cm`, `6.28 cm`, `0.628 m`, `62.8 m`],
                },
                {
                  statement: `If a person is diagnosed with nearsightedness, he should wear a lens with an angular magnification factor, this is`,
                  choices: [
                    `equal to 1`,
                    `slightly more than 1`,
                    `less than 0`,
                    `more than 0`,
                  ],
                },
                {
                  statement: `If the radius of the first curvature in a thin lens is -35 cm, the radius of the second curvature is 25 cm, and the refractive index (n) of the lens is 1.5, what is the focal length of this lens?`,
                  choices: [`29 cm`, `28 cm`, `27 cm`, `26 cm`],
                },
                {
                  statement: `After nearly 3 months of preparation, an IPhR organizer wanted to regain his fitness, so he decided to exercise by speeding from rest to 0.95c. Calculate the energy he used in this process if his mass is m kg.`,
                  choices: [
                    `\\(1.1mc^2\\)`,
                    `\\(2.2mc^2\\)`,
                    `\\(3mc^2\\)`,
                    `\\(3.1mc^2\\)`,
                  ],
                },
              ];
              if (data?.category === "regular") {
                questions = [];
              }
              const artConst = document.createElement("article");
              const titleConst = document.createElement("h2");
              const statementConst = document.createElement("span");
              statementConst.innerText = `Earth's Gravitational Acceleration: \\( g = 9.8 \\, \\dfrac{\\text{m}}{\\text{s}^2} \\)
                    Speed of Light: \\( c = 3 \\times 10^8 \\, \\dfrac{\\text{m}}{\\text{s}} \\)
                    Speed of Sound at Room Temperature: \\( v_{s} = 343 \\, \\dfrac{\\text{m}}{\\text{s}} \\)
                    Planck's Constant: \\( h = 6.626 \\times 10^{-34} \\, \\text{Js} \\)
                    Boltzmann Constant: \\( k_{B} = 1.381 \\times 10^{-23} \\, \\dfrac{\\text{J}}{\\text{K}} \\)
                    Gravitational Constant: \\( G = 6.674 \\times 10^{-11} \\, \\dfrac{\\text{N} \\cdot\\text{m}^2}{\\text{kg}^2} \\)
                    Atmospheric Pressure: \\( P_{a} = 10^5 \\, \\text{Pa} \\)
                    Elementary Charge: \\( e = 1.602 \\times 10^{-19} \\, \\text{C} \\)
                    Electron Mass: \\( m_{e} = 9.109 \\times 10^{-31} \\, \\text{kg} \\)
                    Proton Mass: \\( m_{p} = 1.673 \\times 10^{-27} \\, \\text{kg} \\)
                    Coulomb's Constant: \\( k_{e} = 8.988 \\times 10^9 \\, \\dfrac{\\text{N} \\cdot \\text{m}^2}{\\text{C}^2} \\)
                    Permeability of Free Space: \\(\\mu_{0} = 4 \\pi \\times 10^{-7} \\, \\dfrac{\\text{N}}{\\text{A}^2} \\)
                    Permittivity of Free Space: \\(\\epsilon_{0} = 8.854 \\times 10^{-12} \\, \\dfrac{\\text{C}^2}{\\text{N}\\cdot \\text{m}^2} \\)
                    Density of Air at Room Temperature: \\( \\rho_{a} = 1.2 \\, \\dfrac{\\text{kg}}{\\text{m}^3} \\)
                    Radius of the Earth: \\( R = 6371 \\, \\text{km} \\)
                    Surface Temperature of the Earth: \\( T_{e} = 290 \\, \\text{K} \\)
                    Surface Temperature of the Sun: \\( T_{s} = 5800 \\, \\text{K} \\)
`;
              titleConst.innerText = `List of Constants:`;
              artConst.append(titleConst, statementConst);
              form.append(artConst);
              renderMathInElement(form);

              for (const question of questions) {
                const art = document.createElement("article");
                const title = document.createElement("h2");
                const statement = document.createElement("span");
                statement.innerText = question.statement;
                title.innerText = `Question ${questions.indexOf(question) + 1}`;
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
                  input.setAttribute("placeholder", "Answer");
                  art.append(title, statement, input);
                }
                form.append(art);
                renderMathInElement(form);
              }
              const newArticle = document.createElement("article");
              const info = document.createElement("p");
              const issues = document.createElement("p");
              const submit = document.createElement("button");
              info.innerHTML = `For more information about STEM October Physics Club, please visit the <a
                      href="https://octphysicsclub.org/">club's webpage</a>.`;
              issues.innerHTML = `In case you encounter any issues or have any inquiries, email us at <a href="mailto:support@iphr.octphysicsclub.org">support@iphr.octphysicsclub.org</a>.`;
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
              }, capDelay);
              setInterval(() => {
                switchStorage();
              }, switchDBDelay);

              if (data?.timeOpened) {
                localStorage.setItem("timeOpened", data.timeOpened);
              } else {
                await dataFirestore.update({ timeOpened: Date.now() + 1000 });
                localStorage.setItem("timeOpened", Date.now() + 1000);
              }
              setTimeout(() => {
                document.querySelector(".loader").style.display = "none";
              }, 400);
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
    alert("getUserMedia() is not supported by your browser");
  }
} else {
  location.href = domain;
}
