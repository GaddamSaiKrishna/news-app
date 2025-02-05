const API_KEY = "be21e9633d71492eb26ed4e8d567a77d";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const cardsContainer = document.getElementById("cards-container");
    console.log("Fetching news for:", query); // Log the query
    cardsContainer.innerHTML = "<div class='loading'>Loading...</div>";

    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        console.log("Response Status:", res.status); // Log the response status

        if (res.status === 429) {
            throw new Error("Too many requests. Please try again later.");
        }

        if (!res.ok) {
            throw new Error("Failed to fetch news");
        }

        const data = await res.json();
        console.log("Fetched Data:", data); // Log the fetched data

        if (data.articles.length === 0) {
            cardsContainer.innerHTML = "<div class='no-results'>No results found</div>";
        } else {
            bindData(data.articles);
        }
    } catch (error) {
        cardsContainer.innerHTML = `<div class='error'>${error.message}</div>`;
        console.error(error);
    }
}





function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});