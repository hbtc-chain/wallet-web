import StoreCenter from "./scripts/store";
import extension from "extensionizer";
import MessageManager from "./scripts/message";
import ExtensionPlatform from "./scripts/platform";
import NotificationManager from "./scripts/notification-manager";

const openTabsIDs = {};
let popupIsOpen = false;
let notificationIsOpen = false;
const notificationManager = new NotificationManager();
const platform = new ExtensionPlatform();

//let ports = new Map();

async function triggerUi() {
  if (!popupIsOpen) {
    await notificationManager.showPopup();
  }
}
/**
 * Opens the browser popup for user confirmation of watchAsset
 * then it waits until user interact with the UI
 */
async function openPopup() {
  await triggerUi();
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!notificationIsOpen) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

// 接收popup的消息
const messages = new MessageManager({
  openPopup,
  platform,
});

// On first install, open a new tab with
extension.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    const tab = await platform.openExtensionInBrowser("/welcome");
  }
});

window.store = StoreCenter;
window.platform = platform;
