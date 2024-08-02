// const domain = "http://127.0.0.1:5500";
const domain = "http://iphr.octphysicsclub.org/IPhR-2024";
// const domain = "https://ambassador.octphysicsclub.org";
const examDuration = 45 * 60 * 1000;
const examOpenInterval = [
  new Date("2024-08-02T17:00:00+03:00"),
  new Date("2024-08-02T17:20:00+03:00"),
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
