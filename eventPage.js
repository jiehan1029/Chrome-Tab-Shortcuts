/* Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version.
*/
chrome.runtime.onInstalled.addListener(function() {
  // if no tabShortcuts saved yet, initialize it to empty list
  chrome.storage.sync.get('tabShortcuts', function(data) {
    if(!data.tabShortcuts){
      chrome.storage.sync.set({tabShortcuts:[]}, function(){
        console.log('set tabShortcuts to empty list.');
      });
    }
    else{
      addBadge();
    }
  });
  // clear temp
  chrome.storage.sync.set({'TStemp': undefined}, function(){
    console.log('clear TStemp on installed.');
  })
});

/* create contextMenu
*/
var menu = chrome.contextMenus.create({
  "title": 'Add tab shortcut/snippet', 
  "contexts":['selection', 'page'],
  "id": 'selectionContextMenu'
});
chrome.contextMenus.onClicked.addListener(function(info, tab){
  console.log('context info = ', info);
  console.log('tab info = ', tab)
  // save data to local storage
  chrome.storage.sync.set({
    'TStemp': {
      "url": info.pageUrl,
      "name": tab.title,
      "snippet": info.selectionText || ''
    }
  }, function(){
    console.log('info saved!');
  });
  // open a new tab (overriden by the extension)
  chrome.windows.create();
});


function addBadge(){
  chrome.browserAction.setBadgeText({text: 'ON'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
}