let url = document.getElementById('url');
let name = document.getElementById('name');
let snippet = document.getElementById('snippet');
let addBtn = document.getElementById('add-btn');
let clearBtn = document.getElementById('clear-btn');
let clearAllBtn = document.getElementById('clear-all-btn');
let tabsContainer = document.getElementById('tabs-container');
let saveNotice = document.getElementById('notice-p');


// prefill url and name if available
chrome.storage.sync.get('TStemp', function(data){
  // data.TStemp is set via contextMenu
  if(Object.values(data.TStemp).length > 0){
    url.setAttribute('value', data.TStemp.url);
    name.setAttribute('value', data.TStemp.name);
    snippet.setAttribute('value', data.TStemp.snippet);
    // then clear the temp
    clearTStemp();
  }
  // or get info from current tab
  else{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let curr = tabs[0];
      url.setAttribute('value', curr.url);
      name.setAttribute('value', curr.title);
    });    
  }
});



// create list of previously marked
let currList = loadCurrentTabShortCuts(createTabList);
function createTabList(res){
  if(res.length > 0){
    addBadge();
    tabsContainer.innerHTML = '';
  }
  else{
    removeBadge();
    tabsContainer.innerHTML = '<p id="no-data-p">No records found.</p>'
  }
  for(let i=0; i<res.length; i++){
    let temp = res[i];

    let div = document.createElement('div');
    div.setAttribute('id', temp.id);
    div.classList.add('item-div');

    let header = document.createElement('header');
    header.classList.add('item-header');

    let anchor = document.createElement('a');
    anchor.classList.add('item-title');
    anchor.setAttribute('href', temp.url);
    anchor.innerText = temp.name;
    header.appendChild(anchor);

    let closeIcon = document.createElement('span');
    closeIcon.innerHTML = '<i style="margin-left: 10px; color: #fc0335; font-size: 10px; cursor: pointer;">Remove</i>';
    closeIcon.classList.add('delete-record');
    closeIcon.addEventListener('click', function(e, recordId=temp.id){
      chrome.storage.sync.get('tabShortcuts', function(data){
        let res = data.tabShortcuts || [];
        res = res.filter(el=>el.id !== recordId);
        chrome.storage.sync.set({'tabShortcuts': res}, function(){
          console.log('deleted saved record: ', recordId);
          loadCurrentTabShortCuts(createTabList);
        });
      });
    });
    header.appendChild(closeIcon);

    div.appendChild(header);

    if(temp.snippet && temp.snippet.length > 0){
      let p = document.createElement('p');
      p.classList.add('item-p');
      p.innerHTML = temp.snippet;
      p.setAttribute('contenteditable', true);
      p.addEventListener('input', function(e){
        let newSnippet = e.target.innerHTML;
        updateRecord(temp.id, {'snippet': newSnippet});
      });

      div.appendChild(p);
    }

    tabsContainer.appendChild(div);
  }
}


// attach event listener to buttons
addBtn.addEventListener('click', async function(e){
  let urlVal = url.value;
  let nameVal = name.value;
  let snippetVal = snippet.value;
  // check if url and name fields are filled and show warning if not
  if(!urlVal || urlVal === '' || !nameVal || nameVal === ''){
    saveNotice.style.color = '#fc0335';
    saveNotice.style.display = 'block';
    saveNotice.innerHTML = 'Please fill both <b>Page URL</b> and <b>Custom Name</b> fields';
    return;
  }

  // currList should be set via the previous storage.get callback
  // if not, then first load the current list
  loadCurrentTabShortCuts(addNewRecord);

  function addNewRecord(res){
    res.unshift({
      "id": res.length,
      "name": nameVal,
      "url": urlVal,
      "snippet": snippetVal
    });
    // save current inputs to storage
    chrome.storage.sync.set({
        "tabShortcuts": res
      }, function(){
      // show success text
      saveNotice.style.color = '#0537ed';
      saveNotice.style.display = 'block';
      saveNotice.innerText = 'Record Saved!';

      clearInputs();
      clearTStemp();

      // refersh popup
      loadCurrentTabShortCuts(createTabList);
    });
  }
});

clearBtn.addEventListener('click', function(e){
  clearInputs();
  clearTStemp();
});

clearAllBtn.addEventListener('click', function(e){
  // clear data in storage
  chrome.storage.sync.set({
      "tabShortcuts": []
    }, function(){
      console.log('cleared all records.');
      // refersh popup
      loadCurrentTabShortCuts(createTabList);
  });
});



// utilities
async function updateRecord(id, fields){
  let res = await chrome.storage.sync.get('tabShortcuts', function(data){
    res = data.tabShortcuts || [];
    for(let i=0; i<res.length; i++){
      if(res[i].id === id){
        res[i] = Object.assign(res[i], fields);
        break;
      }
    }
    chrome.storage.sync.set({'tabShortcuts': res}, function(){
      console.log('updated record: ', id);
    })
  });
  return res;
}
function clearTStemp(){
  chrome.storage.sync.set({"TStemp": {}}, function(){
    console.log('clear TStemp.');
  });
}

function clearInputs(){
  url.setAttribute('value', '');
  name.setAttribute('value', '');
  snippet.setAttribute('value', '');
}

async function loadCurrentTabShortCuts(callback){
  let res = await chrome.storage.sync.get('tabShortcuts', function(data){
    res = data.tabShortcuts || [];
    if(callback){
      callback(res);
    }
  })
  return res;
}

function addBadge(){
  chrome.browserAction.setBadgeText({text: 'ON'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
}
function removeBadge(){
  chrome.browserAction.setBadgeText({text: ''});
}
