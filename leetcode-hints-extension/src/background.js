// background.js
chrome.action.onClicked.addListener((tab) => {
    // 1. Get the screen dimensions to position it nicely
    // Note: We can't access screen directly in service worker, so we guess or center it later.

    // 2. Create the window
    chrome.windows.create({
        url: "whiteboard.html", // This is your React app
        type: "popup",          // "popup" removes the address bar and tabs
        width: 900,             // Nice and wide
        height: 600,
        focused: true
    });
});