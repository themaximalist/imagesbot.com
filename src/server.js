const log = require("debug")("imagesbot:server");

const { readFileSync } = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("./middleware/session");
const htmx = require("express-htmx");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(process.env.ASSET_DIR));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session);
app.use(htmx.middleware);
app.locals = {
    NODE_ENV: process.env.NODE_ENV,
    CACHE_BUST: readFileSync("./public/cachebust.txt").toString().trim()
};
app.set("views", "src/views");
app.set("view engine", "ejs");

require("./controllers")(app);

app.start = async function () {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    log(`Server listening on port ${port}`);
};

module.exports = app;
