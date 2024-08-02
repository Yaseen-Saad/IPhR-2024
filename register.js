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

<p>Using scratch paper is allowed.
</p>
<p>  Make sure that you have a stable internet connection.
</p>
<p>Make sure that you can turn on your camera since both will be monitored. THE WEBSITE WILL ASK FOR PERMISSION, IF YOU DON'T ALLOW IT, THE EXAM WILL NOT START
</p>
<p>The usage of any devices (phones, laptops, smart watches, graphical calculators, etc.) is prohibited. If the participant is seen to use any outside device, they will be disqualified immediately. Please note that the usage of a hand-held calculator (NOT a graphical calculator) is allowed.
</p>
<p>Talking to anyone during the exam is prohibited. Please make sure that you are in a quiet environment. If the participant is heard or seen talking to anyone, they will be disqualified immediately.
</p>
<p>The exam will automatically take screenshots if any faces appear in your camera. Make sure no faces (family members, posters, etc.) other than yours appear in your device’s camera.
</p>
<p>Using any outside resources (books, notebooks, online PDFs, etc.) is prohibited. If the participant is caught using any outside resource, they will be disqualified immediately.
</p>
<p>The online proctor will monitor your tab switching. Participants should stay in the exam’s tab during the whole exam. If the participant switches to any other tab, they will be disqualified immediately.
</p>
<p>For Muslim females, make sure to wear your hijab during the exam, since all footage will be reviewed by males.
</p>
<p>Taking the exam with a smartphone is acceptable. Make sure the phone is placed such that your face is seen clearly.
</p>
<p>All footage will be deleted after the end of the competition; we will not share them with anyone except the organizers of the competition.
</p>
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
