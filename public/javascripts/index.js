const errors = document.getElementsByClassName("error");
document.getElementById("status").style.display = "none";

function hideError() {
  for (let i = 0; i < 3; i++) {
    errors[i].style.display = "none";
  }
}
hideError();

function disableUi() {
  document.getElementById("id").disabled = true;
  document.getElementById("siteurl").disabled = true;
  document.getElementById("timeInterval").disabled = true;
  document.getElementById("monitor").disabled = true;
}

function play() {
  console.log("alert");
  var audio = new Audio("/sounds/alert.wav");
  audio.play();
}

function changeDetected(id) {
  let time = new Date().toLocaleString();
  play();
  $("#log-list").append(
    "<li>Change detected for the element with ID : " +
      id +
      " at " +
      time +
      "</li><hr/>"
  );
}

function handleSubmit() {
  hideError();
  const id = document.getElementById("id").value;
  const url = document.getElementById("siteurl").value;
  const delay = document.getElementById("timeInterval").value * 1000;

  let expression1 =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  let expression2 = /^[A-Za-z]+[\w\-\:\.]*$/;

  let regex1 = new RegExp(expression1);
  let regex2 = new RegExp(expression2);
  let validId = id.match(regex2);
  // let validUrl = url.match(regex1)
  let validUrl = true;
  let res;
  if (validId && validUrl && delay !== "") {
    res = true;
    hideError();
  } else {
    res = false;
    if (!validUrl) {
      errors[0].style.display = "block";
    }
    if (!validId) {
      errors[1].style.display = "block";
    }
    if (delay === "") {
      errors[2].style.display = "block";
    }
  }

  if (res) {
    document.getElementById("status").style.display = "block";
    disableUi();
    let host;
    host = window.location.href;
    console.log(host);
    host = host.split(":");
    host[0] === "https" ? (host[0] = "wss") : (host[0] = "ws");

    const ws_url = host.join(":");

    const ws = new WebSocket(ws_url);

    ws.onmessage = async (event) => {
      console.log(`Server has sent : ${await event.data}`);

      changeDetected(id);
      notifyMe(url);
    };

    ws.addEventListener("open", () => {
      ws.send(`${url},${id},${delay}`);
      console.log("Now we are connected");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!Notification) {
    alert("Desktop notifications not available in your browser. Try Chromium.");
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission().then();
});

function notifyMe(url) {
  console.log("notify");
  if (Notification.permission !== "granted") Notification.requestPermission();
  else {
    var notification = new Notification("Change Detected", {
      icon: "https://icons8.com/icon/z8yqcMdq4T2h/notification",
      body: "A change in the contents of the provided website has been detected...!",
    });
    notification.onclick = function () {
      window.open(url);
    };
  }
}
