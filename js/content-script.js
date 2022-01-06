
// If we are on a feedly web page
if (document.getElementById('feedlyChrome')) {
    // If an article is open
    if (document.querySelector('.floatingEntryScroller')) {
        const article = {
            title: document.querySelector('.floatingEntryScroller .entryHeader .entry__title').textContent,
            link: document.querySelector('.floatingEntryScroller .entryHeader .entry__title').href
        }
        chrome.runtime.sendMessage({from: 'grabButtonEvent', article: article});
    } else {
        chrome.runtime.sendMessage({from: 'grabButtonEvent', error: 'You need to open an article'});
    }
} else {
    chrome.runtime.sendMessage({from: 'grabButtonEvent', error: 'You need to open feedly'});
}
