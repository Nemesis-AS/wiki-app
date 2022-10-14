import Client from "./client.js";

async function main() {
    const params = new URLSearchParams(window.location.search);
    const articleID = params.get("page");

    let client = new Client("https://en.wikipedia.org/w/api.php");
    let res = await client.getPageByID(articleID);
    console.log(res);

    if (res.error) {
        console.error(`An Error Occured while fetching the article!\n${res.error.code}: ${res.error.info}`);
        return;
    }
    let content = res.parse.text["*"];

    parseArticle(content);
}

function parseArticle(data) {
    let tempEl = document.createElement("div");
    tempEl.innerHTML = data;

    const parsedEl = tempEl.querySelector("div.mw-parser-output");
    parsedEl.querySelectorAll("style").forEach(style => style.remove());
    parsedEl.querySelectorAll("link[rel='mw-deduplicated-inline-style']").forEach(style => style.remove());

    const articleEl = document.querySelector("article");
    articleEl.appendChild(parsedEl);
}

window.addEventListener("load", main);