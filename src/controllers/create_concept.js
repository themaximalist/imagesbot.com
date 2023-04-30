module.exports = async function (req, res) {
    setTimeout(function () {
        res.render("partials/_concept");
    }, 1000);
}