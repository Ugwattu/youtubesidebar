var clickedOnce = false;
var dclickTimer;
chrome.action.onClicked.addListener(function(tab) {
    if (clickedOnce == true) {
        clickedOnce = false;
        clearTimeout(dclickTimer);
    } else {
        clickedOnce = true;
        dclickTimer = setTimeout(function() {
            // do your dbleclick work
            clearTimeout(dclickTimer);
            clickedOnce = false;
        }, 250);
    }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url != null && (tab.url.match('^https:\/\/.*\.youtube\.com(.*)$'))) {
        chrome.action.enable(tabId);
    }else{
        chrome.action.disable(tabId);
    }
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {cmd: 'hashchange', url: changeInfo.url})
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.cmd !== null) {
        if (request.cmd === 'ShowAppIcon') {
        // chrome.action.show(sender.tab.id);
        } else {
        }
    }
});
