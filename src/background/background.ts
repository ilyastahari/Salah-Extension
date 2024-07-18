chrome.runtime.onInstalled.addListener(() => {
    console.log('Installed chrome extension.')
});

chrome.bookmarks.onCreated.addListener(() => {
    console.log('Bookmarked this page.')
});