import Client from "./client.js";

let client = new Client("https://en.wikipedia.org/w/api.php", {
    format: "json",
    origin: "*"
});
console.log(client);