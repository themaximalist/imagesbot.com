const Generate = require('../services/Generate');

module.exports = async function (req, res) {

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    // TODO: mass generate concepts 
    // TODO: can we store the sse connection along with the session in a global object? message it from any controller
    // TODO: how do we trigger from one endpoint and stream from another? look into htmx solutions
    // TODO: turn into an async/generator function
    // TODO: figure out loading
    const result = await Generate(req.params.search_id);
    res.render("partials/_result", { result }, (err, html) => {
        console.log(err);
        console.log(html);
        if (err) {
            console.log(err);
            res.status(500).send("Error");
        } else {
            res.write(`event: result\ndata: ${html.split("\n").join("")}\n\n`);
        }
    });

    // TODO: switch this to a specific /results streaming endpoint, SSE should never trigger generation...bad idea
    // TODO: create a specific /generate endpoint

    // If client closes connection, stop sending events
    res.on('close', () => {
        console.log('client dropped me');
        // clearInterval(interValID);
        res.end();
    });
}