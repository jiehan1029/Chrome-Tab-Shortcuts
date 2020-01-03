### About
This project is a chrome extension that makes it easier to temporarily track useful webpages with custom description and page snippets, or say, a set of handy bookmarks with summary. I got this idea when I have to search through the web for some topic, keep a bunch of tabs open, each with some pieces of useful information -- soon it becomes inconvenient to navigate between tabs and associate them with key info they provided. This extension will save the url, a short explanation or keywords, and optionally a snippet of what's important, making it easier to grab the snippet, and retrive webpage corresponding to a specific piece of information.

The extension contains the following components:
* a popup that allow user to show, add, edit, or clear current tab's url, brief explanation and snippet
* an override page that replaced the default newtab page, showing the same info as in popup
	* when there exists some entries, there will be an "ON" badge over extension icon, and the override page will replace the default newtab, otherwise no badge nor replacement.
* a context menu that allow user to highlight pharagraphs in page and add as tab snippet



