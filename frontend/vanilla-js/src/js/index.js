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

// ========================= ENTRY POINT =================================
function main() {
    let client = new Client("https://en.wikipedia.org/w/api.php", {
        format: "json",
        origin: "*"
    });

    addEventListeners(client);
}
// ========================================================================

function addEventListeners(client) {
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    searchForm.addEventListener("submit", async e => {
        e.preventDefault();
        let query = searchInput.value;
        let res = await client.searchQuery(query);
        buildResultMarkup(res);
    });
}

// ========================== RENDERING =====================================
function buildResultMarkup(resObj) {
    const rootEl = document.getElementById("searchResults");
    rootEl.textContent = "";

    if (resObj.error) {
        let errorEl = document.createElement("div");
        errorEl.classList.add("error-div");
        errorEl.innerHTML = `An Error Occured while fetching data...<br />${resObj.error.code}: ${resObj.error.info}`;
        rootEl.appendChild(errorEl);
        return;
    }

    let results = resObj.query.search;

    results.forEach(res => {
        console.log(res);
        // return;

        let resultEl = document.createElement("div");
        resultEl.classList.add("result");
        let titleEl = document.createElement("a");
        titleEl.classList.add("title");
        titleEl.href = `/article.html?page=${res.pageid}`
        titleEl.textContent = res.title;
        resultEl.appendChild(titleEl);
        let subEl = document.createElement("p");
        subEl.classList.add("subtext");
        subEl.innerHTML = res.snippet;
        resultEl.appendChild(subEl);
        rootEl.appendChild(resultEl);
    });
}
// ==========================================================================
window.addEventListener("load", main);