/*
document.body.addEventListener("htmx:beforeRequest", function(event) {
    let target = event.target;
    if (target.tagName === "BUTTON") {
        target.setAttribute("disabled", true);
        target.dataset.originalContent = target.innerHTML;
        target.innerHTML = '<span class="spinner"></span>';
    }
});

document.body.addEventListener("htmx:afterRequest", function(event) {
    let target = event.target;
    if (target.tagName === "BUTTON") {
        target.removeAttribute("disabled");
        target.innerHTML = target.dataset.originalContent;
    }
});
*/