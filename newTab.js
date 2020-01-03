function domReady(callback) {
  // If we're early to the party
  document.addEventListener("DOMContentLoaded", callback);
  // If late; I mean on time.
  if (document.readyState === "interactive" || document.readyState === "complete" ) {
    callback();
  }
}

domReady(hideOrShow);

function hideOrShow(){
	console.log('dome ready!');
	document.getElementsByTagName('body')[0].style.display = 'none';
	chrome.storage.sync.get('tabShortcuts', function(data){
		if(!data.tabShortcuts || data.tabShortcuts.length === 0){
			chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
				let active = tabs[0].id;
				chrome.tabs.update(active, { url: "chrome-search://local-ntp/local-ntp.html" });
			});
		}
		else{
			document.getElementsByTagName('body')[0].style.display = 'block';
		}
	})

}