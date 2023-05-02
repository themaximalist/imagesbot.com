module.exports = function setup(app) {
    app.get("/", require("./home"));
    app.post("/search", require("./search"));
    app.get("/results/:search_id", require("./results"));
    app.get("/realtime/:search_id/", require("./realtime"));
    app.post("/generate/:search_id/", require("./generate"));
    app.post("/favorite/:result_id/", require("./favorite"));
    app.post("/unfavorite/:result_id/", require("./unfavorite"));
};