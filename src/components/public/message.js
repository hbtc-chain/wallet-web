import "./message.css";
import classnames from "classnames";

function create(msg, classname, time = 3500) {
  let div = document.createElement("em");
  div.className = classnames("g-message", classname);
  div.innerHTML = msg;
  if (!window.document.querySelector("#msgbox")) {
    createBox();
  }
  window.document.querySelector("#msgbox").appendChild(div);
  setTimeout(() => {
    div.className = classnames("g-message", classname, "close");
    setTimeout(() => {
      window.document.querySelector("#msgbox").removeChild(div);
    }, 3500);
  }, time);
}

function createBox() {
  if (window.document.querySelector("#msgbox")) return;
  let div = document.createElement("div");
  div.id = "msgbox";
  div.className = "g-msgbox";
  window.document.body.appendChild(div);
}
window.addEventListener("load", createBox, false);

function info(msg, t) {
  create(
    `<i class="bhex-icon bhex-icon-info"></i><span>${msg}</span>`,
    null,
    t
  );
}
function warn(msg, t) {
  create(
    `<i class="bhex-icon bhex-icon-suspended1"></i><span>${msg}</span>`,
    "warn",
    t
  );
}
function error(msg, t) {
  create(
    `<i class="bhex-icon bhex-icon-delete"></i><span>${msg}</span>`,
    "error",
    t
  );
}
function success(msg, t) {
  create(
    `<i class="bhex-icon bhex-icon-check"></i><span>${msg}</span>`,
    "success",
    t
  );
}
//点卡页面提示用
function tip(msg, t) {
  create(`<span>${msg}</span>`, "success", t);
}

export default {
  info,
  warn,
  error,
  success,
  tip,
};
