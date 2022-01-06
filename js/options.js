const messageWrapper = document.getElementById('messageWrapper');

/**
 * Add database list to form option
 * @param {*} response 
 * @param {*} userSettings 
 */
const populateFormOptions = (response, userSettings) => {
    // Get selected notion database id
    const select = document.getElementById('notionDatabase');
    response.results.forEach((database) => {
      // Create option
      const option = document.createElement('option');
      if (database.id === userSettings.notionDatabaseId) {
        option.setAttribute('selected', 'selected');
      }
      option.value = database.id;
      option.textContent = database.title[0].plain_text;
      select.append(option);
    });
};

/**
 * Default form values from option settings
 */
const initFormValues = () => {
  chrome.storage.sync.get('userSettings', (data) => {
    const { userSettings } = data;
    const apiKey = document.getElementById('notionApiKey');
    if (userSettings.notionApiKey && typeof userSettings.notionApiKey === 'string') {
      // Set form input value
      apiKey.value = userSettings.notionApiKey;
      getDatabaseList(userSettings);      
    }
  });
}

/**
 * Get notion database list
 * @param {*} userSettings 
 */
const getDatabaseList = (userSettings) => {
  const notionApi = new NotionApi(userSettings.notionApiKey, 'databases', 'GET');
  notionApi.fetchQuery()
    .then(reponse => {
      return reponse.json();
    })
    .then(response => {
      // Append form options
      populateFormOptions(response, userSettings);
    })
    .catch(err => {
      showMessage(messageWrapper, 'Something went wrong, your API key seems to be invalid', 'error')
    })
};

/**
 * Event listeners
 */

const form = document.getElementById('formOptions');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const userSettings = {
    notionApiKey: document.getElementById('notionApiKey').value,
    notionDatabaseId: document.getElementById('notionDatabase').value
  }
  chrome.storage.sync.set({ userSettings });
  location.reload();
});

initFormValues();
