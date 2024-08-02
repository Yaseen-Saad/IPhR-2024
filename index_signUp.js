const button = document.querySelector("article button");
function addZeros(n) {
  return (n < 10 ? "00" : n < 100 ? "0" : "") + n;
}
button.addEventListener("click", (e) => {
  const verify = async function () {
    const dataRef = firebase
      .firestore(appMain)
      .collection("dashBoard")
      .doc("views");
    const dataresponse = await dataRef.get();
    const dashdata = await dataresponse.data();
    const AmbassadorCode = `IPhR-${addZeros(Number(dashdata.count))}`;
    dataRef.update({
      count: firebase.firestore.FieldValue.increment(1),
    });
    return AmbassadorCode;
  };
  e.preventDefault();
  const [body, overlay] = dummyAlert("Signing you up");
  const db = firebase.firestore(appMain);
  firebase
    .auth()
    .createUserWithEmailAndPassword(
      document.getElementById("email").value,
      document.getElementById("password").value
    )
    .then(async (userCredential) => {
      const user = userCredential.user;
      try {
        const userRef = db.collection("Ambassadors").doc(user.email);
        const code = await verify();
        await userRef.set({ code: code });
        body.remove();
        overlay.remove();
        await giveAlert(
          "Account Created Successfully, Please Sign in.",
          "#003597",
          " "
        );
        location.href = domain;
      } catch (error) {
        body.remove();
        overlay.remove();
        console.log(error.message);
        giveAlert(error.message, "#e92929", " ");
      }
      user.getIdTokenResult().then(async (idTokenResult) => {
        idTokenResult.maxAge = 7200; // 2 hours in seconds
        localStorage.clear();
        localStorage.setItem(idTokenResult.token, idTokenResult.token);
      });
    })
    .catch((error) => {
      body.remove();
      overlay.remove();
      giveAlert(
        error.message ==
          '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}'
          ? "Wrong Email or Password"
          : error.message,
        "#e92929",
        " "
      );
    });
});

function dummyAlert(alert) {
  let body = document.createElement("section"),
    text = document.createElement("p"),
    overlay = document.createElement("section");
  overlay.style.cssText =
    "position:fixed;cursor:pointer;z-index:999998;width:100vw;height:100vh;background-color:#00000030;top:0;left:0;";
  text.textContent = alert + "...";
  body.style.cssText =
    "display:flex;z-index:9999999;padding:30px;align-items:start;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:90%;background-color:#fff;border-radius:5px;flex-direction:column;justify-content:space-evenly;";
  body.append(text);
  document.body.append(body, overlay);
  return [body, overlay];
}
function giveAlert(alert, color, from, clicky, callBackFunction, yesNo) {
  return new Promise((resolve, reject) => {
    let body = document.createElement("div"),
      text = document.createElement("p"),
      response = document.createElement("button"),
      admin = document.createElement("p"),
      overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;cursor:pointer;z-index:99998;width:100vw;height:100vh;background-color:#00000030;top:0;left:0;";
    text.textContent = alert;
    admin.textContent = from || "Admins" + " Says";
    body.style.cssText =
      "display:flex;z-index:999999;padding:30px;align-items:start;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:90%;background-color:#fff;border-radius:5px;flex-direction:column;justify-content:space-evenly;";
    if (!clicky) {
      response.innerText = "OK";
      response.style.cssText = `width:100px;background-color:${
        color || "#0050b2"
      };padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
      overlay.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        if (yesNo) {
          reject();
        }
        resolve();
      });
      response.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        resolve();
      });
    } else {
      callBackFunction(body, overlay, resolve, reject);
    }

    body.append(admin, text);
    if (yesNo) {
      const no = document.createElement("button");
      no.innerText = "No";
      no.style.cssText = `width:120px;background-color:#f00;padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
      no.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        reject();
      });
      response.style.cssText = `width:100px;background-color:#2ecc71;padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
      const res = document.createElement("div");
      response.textContent = "Yes";
      res.append(no, response);
      res.style.cssText =
        "display:flex;justify-content:flex-end;gap:10px;width:100%;";
      body.append(res);
    } else {
      body.append(response);
    }
    document.body.append(body, overlay);
  });
}
