
class NotionApi {
    constructor(apiKey, endpoint, method = 'GET', body = null) {
        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.method = method;
        this.body = body;

        this.setHeaders();
        this.init();
    }

    init() {
        this.fetchParams = {
            method: this.method,
            headers: this.headers,
            body: this.body,
            mode: 'cors'
        }
    }

    setHeaders() {
        this.headers = new Headers({
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2021-08-16'
        });
    }

    fetchQuery() {
        return fetch(`https://api.notion.com/v1/${this.endpoint}`, this.fetchParams)
    };
};
