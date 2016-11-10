chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
  if (message.goto_url) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log("Tabs: " + JSON.stringify(tabs));
      console.log("Message: " + JSON.stringify(message));
      chrome.tabs.update(tabs[0].id, {url: message.goto_url})
      sendResponse({"status": "ok"});
    });
  }
});