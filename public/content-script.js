import extension from "extensionizer";
import CONST from "../src/util/const";

function injectScript() {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.innerText = "{inpageContent}";
    container.insertBefore(scriptTag, container.children[0]);
    //container.removeChild(scriptTag)
  } catch (e) {
    console.error("MetaMask provider injection failed.", e);
  }
}

/**
 * Determines if the provider should be injected
 *
 * @returns {boolean} {@code true} - if the provider should be injected
 */
function shouldInjectProvider() {
  return (
    doctypeCheck() &&
    suffixCheck() &&
    documentElementCheck() &&
    !blockedDomainCheck()
  );
}

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} - if the doctype is html or if none exists
 */
function doctypeCheck() {
  const { doctype } = window.document;
  if (doctype) {
    return doctype.name === "html";
  }
  return true;
}

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} - whether or not the extension of the current document is prohibited
 */
function suffixCheck() {
  const prohibitedTypes = [/\.xml$/u, /\.pdf$/u];
  const currentUrl = window.location.pathname;
  for (let i = 0; i < prohibitedTypes.length; i++) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} - if the documentElement is an html node or if none exists
 */
function documentElementCheck() {
  const documentElement = document.documentElement.nodeName;
  if (documentElement) {
    return documentElement.toLowerCase() === "html";
  }
  return true;
}

/**
 * Checks if the current domain is blocked
 *
 * @returns {boolean} {@code true} - if the current domain is blocked
 */
function blockedDomainCheck() {
  const blockedDomains = [
    "uscourts.gov",
    "dropbox.com",
    "webbyawards.com",
    "cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html",
    "adyen.com",
    "gravityforms.com",
    "harbourair.com",
    "ani.gamer.com.tw",
    "blueskybooking.com",
    "sharefile.com",
  ];
  const currentUrl = window.location.href;
  let currentRegex;
  for (let i = 0; i < blockedDomains.length; i++) {
    const blockedDomain = blockedDomains[i].replace(".", "\\.");
    currentRegex = new RegExp(
      `(?:https?:\\/\\/)(?:(?!${blockedDomain}).)*$`,
      "u"
    );
    if (!currentRegex.test(currentUrl)) {
      return true;
    }
  }
  return false;
}

/**
 * Redirects the current page to a phishing information page
 */
function redirectToPhishingWarning() {
  const extensionURL = chrome.runtime.getURL("phishing.html");
  window.location.href = `${extensionURL}#${querystring.stringify({
    hostname: window.location.hostname,
    href: window.location.href,
  })}`;
}

/**
 * Returns a promise that resolves when the DOM is loaded (does not wait for images to load)
 */
async function domIsReady() {
  // already loaded
  if (["interactive", "complete"].includes(document.readyState)) {
    return undefined;
  }
  // wait for load
  return new Promise((resolve) =>
    window.addEventListener("DOMContentLoaded", resolve, { once: true })
  );
}

if (shouldInjectProvider()) {
  injectScript();
  //start()
}

let port = extension.runtime.connect({ name: "port-from-client" });
port.onMessage.addListener((message) => {
  if (message) {
    try {
      let obj = JSON.parse(message);
      if (obj.to) {
        console.log("content-script get msg:" + message);
      }
      if (
        obj.to == CONST.MESSAGE_FROM_PAGE &&
        (obj.from == CONST.MESSAGE_FROM_BACKGROUND ||
          obj.from == CONST.MESSAGE_FROM_POPUP)
      ) {
        window.postMessage(message);
      }
    } catch (e) {
      console.warn(e.message);
      console.warn(message);
    }
  }
});

// 监听网页 postmessage, 发送到backgrund
window.onmessage = (e) => {
  let data = e.data;
  console.log(data);
  // 发送消息到background
  try {
    data =
      Object.prototype.toString.call(data) == ["object Object"]
        ? data
        : JSON.parse(data);
    if (
      (data.to == CONST.MESSAGE_FROM_BACKGROUND ||
        data.to == CONST.MESSAGE_FROM_POPUP) &&
      data.from == CONST.MESSAGE_FROM_PAGE
    ) {
      console.log(
        "content-script get msg and send background: " + JSON.stringify(data)
      );
      port.postMessage(JSON.stringify(data));
      // extension.runtime
      //   .sendMessage(JSON.stringify(data))
      //   .then((res) => console.log(res));
    }
  } catch (e) {
    console.warn(e.message);
    console.warn(data);
  }
};

// 监听 background， popup发送的消息,  发送到page
// extension.runtime.onMessage.addListener((message, sender, res) => {
//   if (message) {
//     try {
//       let obj = JSON.parse(message);
//       if (obj.to) {
//         console.log("content-script get msg:" + message);
//       }
//       if (
//         obj.to == CONST.MESSAGE_FROM_PAGE &&
//         (obj.from == CONST.MESSAGE_FROM_BACKGROUND ||
//           obj.from == CONST.MESSAGE_FROM_POPUP)
//       ) {
//         window.postMessage(message);
//       }
//     } catch (e) {
//       console.error(e.message);
//       console.error(message);
//     }
//   }
//   return Promise.reject({ response: "content script got msg" });
// });
