module.exports = function (req, res) {
    console.log("HTML", req.htmx.isHtmx);
    res.render("index");
}