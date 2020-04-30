'use strict';

function extImageURL(image_name) {
  return chrome.extension.getURL(image_name);
}

function setupNavigator() {
  chrome.storage.sync.get({'position-h': 'center', 'position-v': 'bottom'}, function (result) {
    var classes = result['position-h'] + " " + result['position-v'];
    const injectedControls = '<div id="simplekiosk-navigator" class="' + classes + '"><button id="simplekiosk-backbutton"></button><button id="simplekiosk-homebutton"></button><button id="simplekiosk-closebutton"></button></div>';
    $('body').prepend(injectedControls);
    
    $('button#simplekiosk-backbutton').css('background-image', 'url(' + extImageURL('/img/back.png') + ')');
    $('button#simplekiosk-homebutton').css('background-image', 'url(' + extImageURL('/img/home.png') + ')');
    $('button#simplekiosk-closebutton').css('background-image', 'url(' + extImageURL('/img/close.png') + ')');
    
    if (classes == "center top") {
      $('body').prepend('<div id="simplekiosk-paddingmaker" class="top"></div>');
    } else  if (classes == "center bottom") {
      $('body').append('<div id="simplekiosk-paddingmaker" class="bottom"></div>');
    }
    
  });

}

$(document).ready(event => {

  chrome.storage.sync.get({'home_url': "about:newtab", 'timeout': 60}, function (result) {
    chrome.runtime.sendMessage({start_idle: result.timeout,
      idle_page: result.home_url
    });  
	});
});

$(document).on('click', '#simplekiosk-backbutton', event => {
	//const $target = $(event.target);
	console.log("Pressed back button!");
	window.history.back();
});

$(document).on('click', '#simplekiosk-homebutton', event => {
	//const $target = $(event.target);
	console.log("Pressed home button!");
	chrome.storage.sync.get({'home_url': "about:newtab"}, function (result) {
    chrome.runtime.sendMessage({goto_home: result.home_url});
	});
});

$(document).on('click', '#simplekiosk-closebutton', event => {
	//const $target = $(event.target);
	console.log("Pressed close button!");
	chrome.storage.sync.get({'home_url': "about:newtab"}, function (result) {
    chrome.runtime.sendMessage({replace_url: result.home_url});
  });
});


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
  
  if (message.simplekiosk == "hide") {
    $("#simplekiosk-navigator").hide();
    $("#simplekiosk-paddingmaker").hide();
  } else if (message.simplekiosk == "show") {
    $("#simplekiosk-navigator").show();
    $("#simplekiosk-paddingmaker").show();
  } else if (message.simplekiosk == "update") {
    $("#simplekiosk-navigator").remove();
    $("#simplekiosk-paddingmaker").remove();
    setupNavigator();
  }
});


$(function () {
  setupNavigator();
});