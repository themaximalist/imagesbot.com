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
    // Maybe inefficient to re-process all results but couldn't get process working with outerHTML
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

document.body.addEventListener("htmx:sseMessage", function (evt) {
    if (evt.detail.type == "concept") {
        swapResult(evt.detail.data);
    } else if (evt.detail.type == "result") {
        swapResult(evt.detail.data);
    }
});

function setupLiveToggle() {
    const checkbox = document.getElementById("live-checkbox");
    if (!checkbox) {
        console.log("could not find live checkbox");
        return;
    }

    document.body.addEventListener('htmx:configRequest', function (evt) {
        evt.detail.parameters['live'] = checkbox.checked;
    });
}

function setupRecentScroll() {
    const container = document.getElementById('recent-results');
    if (container) {
        const width = container.scrollWidth;

        let hovering = false;

        container.onmouseenter = () => {
            hovering = true;
        };

        container.onmouseleave = () => {
            hovering = false;
        };

        window.addEventListener('load', () => {
            self.setInterval(() => {
                if (!hovering && container.scrollLeft !== width) {
                    container.scrollTo(container.scrollLeft + 1, 0);
                }
            }, 150);
        });
    }
}

function searchRecent(prompt) {
    const form = document.getElementById("search-form");
    const search = document.getElementById("search");
    search.value = prompt.slice(0, 254);
    form.submit();
}

setupSearchSwap();
setupLiveToggle();
setupRecentScroll();