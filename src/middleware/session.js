const log = require("debug")("imagesbot:session");
const uuid = require("uuid").v4;

async function session(req, res, next) {

    let sessionId;
    if (req.signedCookies && req.signedCookies.sessionId) {
        sessionId = req.signedCookies.sessionId;
    }

    if (!sessionId) {
        sessionId = uuid();
        log(`new session from ${sessionId}`);
        res.cookie("sessionId", sessionId, { signed: true, httpOnly: true });
    }

    req.session = sessionId;

    next();
}

module.exports = session;