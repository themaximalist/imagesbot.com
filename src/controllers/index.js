module.exports = function setup(app) {
    app.post("/search", require("./search"));
    app.post("/concept/create", require("./create_concept"));
    app.get("/results/:slug", require("./results"));
    app.get("/", require("./home"));
};

