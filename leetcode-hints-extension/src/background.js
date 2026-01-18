// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: "whiteboard.html",
        type: "popup",
        width: 900,
        height: 600,
        focused: true
    });
});