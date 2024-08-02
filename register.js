let useremail;
let interval = setInterval(() => checkTime(timeOpened), 1000);
let timeOpened;
let timeLeft = parseInt((-Date.now() + examOpenInterval[0].getTime()) / 1000);
firebase.auth(appMain).onAuthStateChanged(async (user) => {
  useremail = user.email;
  const dataFirestore = firebase
    .firestore(appMain)
    .collection("parts")
    .doc(useremail);
  try {
    const request = await dataFirestore.get();
    const data = request.data();
    timeOpened = data?.timeOpened;
    if (Date.now() > examOpenInterval[0].getTime()) {
      if (Date.now() < examOpenInterval[1].getTime()) {
        if (data?.timeOpened + examDuration > Date.now()) {
          location.href = domain + "/exam.html";
        } else {
          timeok(data?.timeOpened);
        }
      } else {
        alert("The Competition has ended");
      }
    } else {
      console.log(Date.now(),examOpenInterval[0].getTime());

      alert("The Competition has not started yet");
    }
  } catch (error) {
    giveAlert(error);
  }
});
async function startCompetition(timeOpened) {
  try {
    if (Date.now() > examOpenInterval[0].getTime()) {
      if (Date.now() < examOpenInterval[1].getTime()) {
        localStorage.setItem("dateStarted", Date.now());
        const ref = firebase
          .firestore(appMain)
          .collection("parts")
          .doc(useremail);
        if (!timeOpened) {
          await ref.set({ timeOpened: Date.now() }, { merge: true });
          location.href = domain + "/exam.html";
        } else {
          if (timeOpened + examDuration > Date.now())
            location.href = domain + "/exam.html";
          else {
            alert("You can only take the test once!");
            location.href = domain;
          }
        }
      } else {
        alert("The Competition has ended");
      }
    } else {
      alert("The Competition has not started yet");
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function checkTime(timeOpened) {
  if (Date.now() <= examOpenInterval[0].getTime()) {
    timeLeft = parseInt((-Date.now() + examOpenInterval[0].getTime()) / 1000);
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const formattedMinutes = `${min < 10 ? "0" + min.toString() : min}`;
    const formattedSeconds = `${sec < 10 ? "0" + sec.toString() : sec}`;
    console.log(formattedMinutes, formattedSeconds, timeLeft);
    document.querySelector(
      "main #Competition"
    ).innerHTML = `<span id="timer">${formattedMinutes}:${formattedSeconds}</span>`;
  } else {
    clearInterval(interval);
    timeok(timeOpened);
  }
}

function timeok(timeOpened) {
  document.querySelector("main #Competition").innerHTML = `        <article>
  Instructions
  <p>Don't switch tabs</p>
  <p>Don't close the exam</p>
  <p>Don't go away from camera</p>
</article>
<article>
  <p>In case you encounter any issues or have any inquiries, email us at
      <a href="mailto:octphysicsclub@gmail.com">octphysicsclub@gmail.com</a>.
      or call us on <a href="#">+20-103-355-3865</a>
  </p>
  <button>Start</button>
</article>`;
  const submitButton = document.querySelector("article button");
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    startCompetition(timeOpened);
  });
}
