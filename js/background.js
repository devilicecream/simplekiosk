
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
  

  if (message.start_idle) {
    chrome.idle.setDetectionInterval(message.start_idle);

    let msgPar = message.idle_page;
    chrome.idle.onStateChanged.addListener(
      newState => {
        //chrome.extension.getBackgroundPage().console.log(newState);
        
        if(newState === 'idle'){ 
          window.open(msgPar);

          chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length -1; i++) {
                chrome.tabs.remove(tabs[i].id);
            }
          });
        }

      });


    //sendResponse("init");
  }

  if (message.goto_url) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log("Tabs: " + JSON.stringify(tabs));
      console.log("Message: " + JSON.stringify(message));
      chrome.tabs.update(tabs[0].id, {url: message.goto_url})
      sendResponse({"status": "ok"});
    });
  }

  if (message.goto_home) {
    console.log("Message: " + JSON.stringify(message));
    
    window.open(message.goto_home);

    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length -1; i++) {
          chrome.tabs.remove(tabs[i].id);
      }
    });

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

