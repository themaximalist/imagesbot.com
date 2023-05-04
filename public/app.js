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