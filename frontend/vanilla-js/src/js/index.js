import Client from "./client.js";

// ========================= ENTRY POINT =================================
function main() {
    let client = new Client("https://en.wikipedia.org/w/api.php");

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