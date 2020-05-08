
function idleListener(newState) {
    console.log("Got idle state: " + newState);
    chrome.storage.sync.get({'home_url': "about:newtab", 'autoreload': false}, data => {
        if(newState === 'idle' && data.autoreload){
            console.log("Reloading (" + newState + ")");
            chrome.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.remove(tabs[i].id);
                }
                window.open(data.home_url);
            });
        } else {
            console.log("Not reloading (" + newState + ")");
        }
    });
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
  
  if (message.start_idle) {
      console.log("Message: " + JSON.stringify(message));

      chrome.idle.setDetectionInterval(message.start_idle);

      if (!chrome.idle.onStateChanged.hasListener(idleListener)) {
          chrome.idle.onStateChanged.addListener(idleListener);
      }
      sendResponse({"status": "ok"});
  }

  if (message.replace_url) {
      console.log("Message: " + JSON.stringify(message));

      chrome.tabs.getSelected(null, function(tab) {
        window.open(message.replace_url);
        chrome.tabs.remove(tab.id, function() { });
      });

      sendResponse({"status": "ok"});
  }

});

