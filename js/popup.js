// Button to grab current tab article
let grabArticle = document.getElementById("grabArticle");
// Wrapper to show grabbed article data
let grabbedArticleWrapper = document.getElementById("grabbedArticleWrapper");
// Send to notion Button
let sendToNotionButton = document.getElementById('sendToNotion');
// Message wrapper
let messageWrapper = document.getElementById('messageWrapper');

/**
 * Show article inside the popup
 * @param {*} article 
 */
const populateGrabbedArticleWrapper = (article) => {
    // Clean previous grabbed article
    grabbedArticleWrapper.innerHTML = '';
    const wrapper = document.createElement('div');
    
    // Article title
    const title = document.createElement('div');
    title.innerHTML = `
        <h4>Article title: </h4>
        <p>${article.title}</p>
    `;
    wrapper.appendChild(title);
    
    // Article link
    const link = document.createElement('div');
    link.innerHTML = `
        <h4>Article link: </h4>
        <p>${article.link}</p>
    `;
    wrapper.appendChild(link);
    
    // Add article to DOM popup
    grabbedArticleWrapper.appendChild(wrapper);

    // Store article
    chrome.storage.sync.set({ article });
}

/**
 * Show error
 * @param {*} error 
 */
const populateError = (error) => {
    // Clean previous errors
    errorWrapper.innerHTML = '';
    const p = document.createElement('p');
    p.classList.add('message__warning');
    p.innerHTML = error;
    errorWrapper.appendChild(p);
}

/**
 * Show success
 * @param {*} success 
 */
 const populateSuccess = (success) => {
    // Clean previous errors
    errorWrapper.innerHTML = '';
    const p = document.createElement('p');
    p.classList.add('message__warning');
    p.innerHTML = error;
    errorWrapper.appendChild(p);
}

const getRequestBody = (settings) => {
    return {
        "parent": { "database_id": settings.notionDatabaseId },
        "properties": {
            "Name": {
                "title": [
                    {
                        "text": {
                            "content": settings.properties.title
                        }
                    }
                ]
            },
            // TODO
            // "Tags": {
            //     "multi_select": settings.properties.tags
            // },
            "URL": {
                "url": settings.properties.url
            }
        }
    };
}

/**
 * Send grabbed article to notion database
 * @param {*} userSettings 
 * @param {*} article 
 */
const sendArticleToNotion = (userSettings, article) => {
    const bodySettings = {
        notionDatabaseId: userSettings.notionDatabaseId,
        properties: {
            url: article.link,
            // TODO
            // tags: [
            //     {"name": "Javascript"},
            //     {"name": "Best practices"}
            // ],
            title: article.title
        }
    }
    const body = JSON.stringify(getRequestBody(bodySettings));
    const notionApi = new NotionApi(userSettings.notionApiKey, 'pages', 'POST', body);
    notionApi.fetchQuery()
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        showMessage(messageWrapper, 'Article correctly sended to notion', 'success');
        grabbedArticleWrapper.innerHTML = '';
        sendToNotionButton.style.display = 'none';
    }).catch((err) => {
        console.log(err);
    })
}

/**
 * Event listeners
 */

sendToNotionButton.addEventListener('click', () => {
    chrome.storage.sync.get(['userSettings', 'article'], (data) => {
        const { userSettings, article } = data;
        if (userSettings.notionDatabaseId && typeof userSettings.notionDatabaseId === 'string') {
            if (userSettings.notionApiKey && typeof userSettings.notionApiKey === 'string') {
                sendArticleToNotion(userSettings, article);
            } else {
                showMessage(messageWrapper, 'Your Api key seems to be invalid', 'error');
            }
        } else {
            showMessage(messageWrapper, 'Your database seems to be invalid', 'error');
        }
    });

})

grabArticle.addEventListener("click", async () => {
    // Get the current tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // Execute the script on the current tab targeted by tab.id
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/content-script.js']
    });

    grabArticle.textContent = "Grab another article";
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.from === 'grabButtonEvent') {
        if (request.error) {
            showMessage(messageWrapper, request.error, 'error');
        } else {
            populateGrabbedArticleWrapper(request.article);
            sendToNotionButton.style.display = 'block';
        }
      }
    }
);
