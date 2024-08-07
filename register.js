let useremail;
let interval = setInterval(() => checkTime(timeOpened), 1000);
let timeOpened;
let timeLeft = parseInt((-Date.now() + examOpenInterval[0].getTime()) / 1000);
firebase.auth(appMain).onAuthStateChanged(async (user) => {
  if (user) {
    useremail = user.email;
    const dataFirestore = firebase
      .firestore(appMain)
      .collection("parts")
      .doc(useremail);
    try {
      if (Date.now() > examOpenInterval[0].getTime()) {
        if (Date.now() < examOpenInterval[1].getTime()) {
          const request = await dataFirestore.get();
          const data = request.data();
          timeOpened = data?.timeOpened;
          if (data?.timeOpened + examDuration > Date.now()) {
            location.href = domain + "/exam.html";
          } else {
            timeok(data?.timeOpened);
          }
        } else {
          alert("The Competition has ended");
        }
      } else {
        alert("The Competition has not started yet");
      }
    } catch (error) {
      console.log(error.message);
    }
  } else {
    location.href = domain;
  }
});
async function startCompetition(timeOpened) {
  try {
    if (Date.now() > examOpenInterval[0].getTime()) {
      if (Date.now() < examOpenInterval[1].getTime()) {
        if (!timeOpened) {
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
    let timeLeft = parseInt(
      (-Date.now() + examOpenInterval[0].getTime()) / 1000
    );
    const hours = Math.floor(timeLeft / 3600);
    timeLeft %= 3600;
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const formattedHours = `${hours < 10 ? "0" + hours.toString() : hours}`;
    const formattedMinutes = `${min < 10 ? "0" + min.toString() : min}`;
    const formattedSeconds = `${sec < 10 ? "0" + sec.toString() : sec}`;
    document.querySelector(
      "main #Competition"
    ).innerHTML = `<span id="timer">${formattedHours}:${formattedMinutes}:${formattedSeconds}</span>`;
  } else {
    clearInterval(interval);
    timeok(timeOpened);
  }
}
function timeok(timeOpened) {
  document.querySelector("main #Competition").innerHTML = `
  <article>
  <h2>Instructions:</h2>
  <ul>
  <li>Read every question carefully.</li>
  <li>The questions are ordered by difficulty.</li>
  <li>Using scratch paper is allowed.</li>
  <li>The usage of any devices (phones, laptops, smart watches, graphical calculators, etc.) is prohibited. If the participant is seen to use any outside device, they will be disqualified immediately. Please note that the usage of a hand-held calculator (NOT a graphical calculator) is allowed.</li>
  <li>Make sure that you have a stable internet connection.</li>
  <li>Make sure that you can turn on your camera since both will be monitored. <b>THE WEBSITE WILL ASK FOR PERMISSION, IF YOU DON'T ALLOW IT, THE EXAM WILL NOT START</b></li>
  <li>Talking to anyone during the exam is prohibited. Please make sure that you are in a <b>quiet environment</b>. If the participant is heard or seen talking to anyone, they will be disqualified immediately.</li>
  <li>The exam will automatically take snapshots if any faces appear in your camera. Make sure no faces (family members, posters, etc.) other than yours appear in your device’s camera.</li>
  <li>Using any outside resources (books, notebooks, online PDFs, etc.) is prohibited. If the participant is caught using any outside resource, they will be disqualified immediately.</li>
  <li>The online proctor will monitor your tab switching. Participants <b>should stay in the exam’s tab during the whole exam</b>. If the participant switches to any other tab or minimize the exam tab, they will be disqualified immediately.</li>
  <li>For Muslim females, make sure to <b>wear your hijab</b> during the exam, since all footage will be reviewed.</li>
  <li>Taking the exam with a smartphone is acceptable. Make sure the phone is placed such that your face is seen clearly.</li>
  <li>All footage will be deleted after the end of the competition; we will not share them with anyone except the organizers of the competition.</li>
</ul>
</article>
<article>
<p>In case you encounter any issues or have any inquiries, email us at
<a href="mailto:support@iphr.octphysicsclub.org">support@iphr.octphysicsclub.org</a>.
or call us on <a href="#">+20-120-847-3755</a>
</p>
<button>Start</button>
</article>`;
  const submitButton = document.querySelector("article button");
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    startCompetition(timeOpened);
  });
}
