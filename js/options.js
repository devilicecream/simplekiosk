var defaultHome = "https://www.google.com";

function loadOptions() {
	chrome.storage.sync.get({
	    timeout: 60,
	    home_url: defaultHome,
	    "position-h": "center",
	    "position-v": "bottom",
	    autoreload: false
	}, function (result) {
	  console.log("Got options: " + JSON.stringify(result))
	  
	  $('input[value="' + result['position-h'] + '"]').prop('checked', true);
	  $('input[value="' + result['position-v'] + '"]').prop('checked', true);
	  $('input[name="autoreload"]').prop('checked', result.autoreload);
    
    var home_url = document.getElementById("home_url");
    home_url.value = result.home_url;
    
    var tout = document.getElementById("timeout");
    tout.value = result.timeout;
	});
}

function saveOptions() {
	var home_url = document.getElementById("home_url").value;
	if (!home_url.startsWith("http") && home_url != defaultHome) {
	  home_url = "https://" + home_url;
    }
    var timeout =  document.getElementById("timeout").value * 1;
    var autoreload = document.getElementById("autoreload").checked;

	var positionH = $('input[name="position-h"]:checked').val();
	var positionV = $('input[name="position-v"]:checked').val();
	chrome.storage.sync.set({
	    timeout: timeout,
	    home_url: home_url,
	    "position-h": positionH,
	    "position-v": positionV,
	    autoreload: autoreload
	}, function () {
	    updateNavigator();
	});
}

function eraseOptions() {
  chrome.storage.sync.remove(['home_url', 'position-h', 'position-v', 'autoreload', 'timeout']);
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
