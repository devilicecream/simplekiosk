var defaultHome = "chrome://newtab";

function loadOptions() {
	chrome.storage.sync.get({'home_url': defaultHome, "position-h": "center", "position-v": "bottom"}, function (result) {
	  console.log("Got options: " + JSON.stringify(result))
	  var home = result.home_url;
	  var home_url = document.getElementById("home_url");
	  $('input[value="' + result['position-h'] + '"]').prop('checked', true);
	  $('input[value="' + result['position-v'] + '"]').prop('checked', true);
	  home_url.value = home;
	});
}

function saveOptions() {
	var home_url = document.getElementById("home_url").value;
	if (!home_url.startsWith("http")) {
	  home_url = "http://" + home_url;
	}
	var positionH = $('input[name="position-h"]:checked').val();
	var positionV = $('input[name="position-v"]:checked').val();
	chrome.storage.sync.set({'home_url': home_url, 'position-h': positionH, 'position-v': positionV}, function () {
	  console.log("Was set!");
	  updateNavigator();
	});
}

function eraseOptions() {
  chrome.storage.sync.remove(['home_url', 'position-h', 'position-v']);
  var home_url = document.getElementById("home_url").value = defaultHome;
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
