var defaultHome = "chrome://newtab";

function loadOptions() {
	chrome.storage.sync.get({timeout: 60, 'home_url': defaultHome, "position-h": "center", "position-v": "bottom"}, function (result) {
	  console.log("Got options: " + JSON.stringify(result))
	  
	  $('input[value="' + result['position-h'] + '"]').prop('checked', true);
	  $('input[value="' + result['position-v'] + '"]').prop('checked', true);
    
    var home_url = document.getElementById("home_url");
    home_url.value = result.home_url;
    
    var tout = document.getElementById("timeout");
    tout.value = result.timeout;
	});
}

function saveOptions() {
	var home_url = document.getElementById("home_url").value;
	if (!home_url.startsWith("http")) {
	  home_url = "http://" + home_url;
  }
  var timeout =  document.getElementById("timeout").value * 1;

	var positionH = $('input[name="position-h"]:checked').val();
	var positionV = $('input[name="position-v"]:checked').val();
	chrome.storage.sync.set({'timeout': timeout,'home_url': home_url, 'position-h': positionH, 'position-v': positionV}, function () {
	  console.log("Was set!");
	  updateNavigator();
	});
}

function eraseOptions() {
  chrome.storage.sync.remove(['home_url', 'position-h', 'position-v']);
  document.getElementById("home_url").value = defaultHome;
  document.getElementById("timeout").value = 60;
}

function updateNavigator() {
  chrome.tabs.query({ }, function (tabs) {
    for (var index in tabs) {
      var tab = tabs[index];
      chrome.tabs.sendMessage(tab.id, {simplekiosk: "update"});
    }
  });
}

function hideNavigator() {
  chrome.tabs.query({ }, function (tabs) {
    for (var index in tabs) {
      var tab = tabs[index];
      chrome.tabs.sendMessage(tab.id, {simplekiosk: "hide"});
    }
  });
}

function showNavigator() {
  chrome.tabs.query({ }, function (tabs) {
    for (var index in tabs) {
      var tab = tabs[index];
      chrome.tabs.sendMessage(tab.id, {simplekiosk: "show"});
    }
  });
}

$(function () {
  loadOptions();
  $('#save').click(saveOptions);
  $('#erase').click(eraseOptions);
  $('#hide').click(hideNavigator);
  $('#show').click(showNavigator);
})
