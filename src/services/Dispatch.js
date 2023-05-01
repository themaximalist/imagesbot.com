const log = require("debug")("imagesbot:dispatch");

const listeners = [];

function listen(route, callback) {
    log(`listening for ${route}`);
    listeners.push({ route, callback });
}

function trigger(route, data) {
    if (typeof data !== "string") throw new Error("data must be a string")

    const found = listeners.filter(l => l.route === route);
    if (found.length == 0) {
        log(`no listener for ${route}`);
        return;
    }

    log(`triggering ${found.length} listeners for ${route}`);
    for (const listener of found) {
        listener.callback(data);
    }
}

function unlisten(route) {
    log(`unlistening for ${route}`);
    delete listeners[route];
}

module.exports = { listen, trigger, unlisten };