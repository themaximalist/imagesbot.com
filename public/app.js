document.body.addEventListener("DeleteNode", function (evt) {
    evt.target.remove();
});

document.body.addEventListener("htmx:sseMessage", function (evt) {
    if (evt.detail.type == "placeholder") {
        // console.log("SSE PLACEHOLDER");
    } else if (evt.detail.type == "concept") {
        const { result_id, concept } = JSON.parse(evt.detail.data);
        const result = document.getElementById(result_id);
        if (!result) {
            console.log("could not find result for concept update", result_id);
            return;
        }

        result.classList.add("opacity-0");
        result.outerHTML = concept;
        result.classList.remove("opacity-0");
    } else {
        console.log("OTHER", evt);
    }
});