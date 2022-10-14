class Client {
    constructor(baseUrl, options) {
        this.baseUrl = baseUrl;
        this.options = options;
    }

    buildUrl(args) {
        let url = `${this.baseUrl}?`;

        Object.keys(this.options).forEach(key => {
            url += `${key}=${this.options[key]}&`;
        });
        Object.keys(args).forEach(key => {
            let paddedStr = String(args[key]).replaceAll(" ", "_");
            url += `${key}=${paddedStr}&`;
        });

        if (url.endsWith("&")) return url.slice(0, url.length - 1);
        return url;
    }

    async fetchJson(url) {
        try {
            let res = await fetch(url);
            let obj = await res.json();
            return obj;
        } catch (err) {
            console.error(`An Error Occured while fetching data: ${err}`);
            return {};
        }
    }

    async searchQuery(query, limit = 5) {
        let args = {
            action: "query",
            prop: "info",
            list: "search",
            srsearch: query,
            srlimit: limit
        };
        let url = this.buildUrl(args);

        return await this.fetchJson(url);
    }

    async getPage(pageID) {
        let args = {
            prop: "text",
            action: "parse",
            formatversion: "2",
            page: pageID
        }
        let url = this.buildUrl(args);

        return await this.fetchJson(url);
    }

}

export default Client;