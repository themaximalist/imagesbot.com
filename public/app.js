document.body.addEventListener("DeleteNode", function (evt) {
    evt.target.remove();
});

function swapResult(data) {
    const { result_id, html } = JSON.parse(data);
    const result = document.getElementById(result_id);
    if (!result) {
        console.log("could not find result for swap", result_id);
        return;
    }

    result.outerHTML = html;
    htmx.process(document.getElementById("results"));
}

function setupSearchSwap() {
    const header = document.getElementById("query-header");
    const query = document.getElementById("search-query");
    const form = document.getElementById("search-form");
    const button = document.getElementById("search-button");
    if (!form || !query || !button || !header) {
        console.log("could not find search elements");
        return;
    }

    header.onclick = function (evt) {
        query.removeAttribute("disabled");
        header.classList.add("hidden");
        form.classList.remove("hidden");
        query.classList.remove("cursor-pointer", "h-14");
        button.classList.remove("hidden");
    }
}

setupSearchSwap();

document.body.addEventListener("htmx:sseMessage", function (evt) {
    if (evt.detail.type == "placeholder") {
        // console.log("SSE PLACEHOLDER");
    } else if (evt.detail.type == "concept") {
        swapResult(evt.detail.data);
    } else if (evt.detail.type == "result") {
        swapResult(evt.detail.data);
    } else {
        console.log("OTHER", evt);
    }
});