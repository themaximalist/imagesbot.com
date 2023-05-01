const log = require("debug")("imagesbot:realtime");
const { listen, unlisten } = require("../services/Dispatch");
const { Search } = require("../models");

// This isn't perfect, if a user has the same search in multiple tabs it will duplicate
// Also may leak some small amounts of memory over time if connections don't cleanup properly
module.exports = async function (req, res) {
    const search_id = req.params.search_id;
    const search = await Search.findOne({ where: { id: search_id } });
    if (!search) {
        return res.status(404).send("Search not found");
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    log(`client ${req.session} connected to ${search_id} realtime results`);

    res.on("close", () => {
        unlisten(search_id);
        res.end();
    });

    listen(search_id, (data) => {
        res.write(`event: result\ndata: ${data}\n\n`);
    });

    res.write(`event: connected\ndata: ${req.session}\n\n`);
};