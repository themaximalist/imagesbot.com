module.exports = function setup(app) {
    app.get("/", require("./home"));
    app.post("/search", require("./search"));
    app.get("/results/:search_id", require("./results"));
    app.get("/generate/:search_id/", require("./generate"));
};

    // app.post("/concept/:search_id/create/", require("./create_concept"));
    // app.post("/image/:concept_id/create/", require("./create_image"));

