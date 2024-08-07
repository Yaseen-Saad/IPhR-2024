// const domain = "http://127.0.0.1:5501";
const domain = "https://iphr.octphysicsclub.org/competition-2024";
const examDuration = 40 * 60 * 1000;
const examOpenInterval = [
  new Date("2024-08-08T14:00:00Z"),
  new Date("2024-08-08T14:30:00Z"),
];
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
(function () {
  "use strict";
  // Overwriting console methods to display a security message
  Object.getOwnPropertyNames(console)
    .filter(function (property) {
      return typeof console[property] === "function";
    })
    .forEach(function (verb) {
      console[verb] = function () {
        return "Sorry, for security reasons, this action is not allowed.";
      };
    });

  // Detecting if DevTools is open
  const detectDevTools = () => {
    let devtoolsOpen = false;
    const threshold = 160;
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > threshold) {
      devtoolsOpen = true;
    }

    if (devtoolsOpen) {
      alert(
        "Don't Open DevTools, Opening it will lead to automatic disqualification"
      );
      if (localStorage.getItem("devtools")) {
        localStorage.setItem("devtools", localStorage.getItem("devtools") + 1);
      } else {
        localStorage.setItem("devtools", 1);
      }
      window.location.href = "#";
      document.head.innerHTML = "";
      document.body.innerHTML = "DevTools is open, the page is now cleared.";
    }
  };

  // Run the detection periodically
  setInterval(detectDevTools, 1000);

  // Preventing new Function creation
  const originalFunction = window.Function;
  window.Function = function () {
    throw new Error("Sorry, creating new functions is not allowed.");
  };

  // Preventing script execution through eval
  window.eval = function () {
    throw new Error("Sorry, eval is not allowed.");
  };

  // Preventing script execution through setTimeout and setInterval
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback, delay) {
    if (typeof callback === "string") {
      throw new Error(
        "Sorry, using string as code in setTimeout is not allowed."
      );
    }
    return originalSetTimeout(callback, delay);
  };

  const originalSetInterval = window.setInterval;
  window.setInterval = function (callback, delay) {
    if (typeof callback === "string") {
      throw new Error(
        "Sorry, using string as code in setInterval is not allowed."
      );
    }
    return originalSetInterval(callback, delay);
  };
})();
