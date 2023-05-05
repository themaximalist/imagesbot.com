const { randomElement } = require("../utils");
const RecentResults = require("../services/RecentResults");

const suggested = [
    "Aurora Borealis",
    "Milky Way Galaxy",
    "Wildlife in Action",
    "Underwater Wonders",
    "Architectural Masterpieces",
    "Extreme Sports",
    "Aerial Landscapes",
    "Volcanic Eruptions",
    "Macro Photography",
    "Iconic Monuments",
    "Astrophotography",
    "National Parks",
    "Cultural Festivals",
    "Street Art",
    "Classic Cars",
    "Fashion Through the Ages",
    "Futuristic Architecture",
    "Rare Animals",
    "Optical Illusions",
    "Drone Photography"
];

module.exports = async function (req, res) {
    const placeholder = randomElement(suggested);
    const recent = await RecentResults();
    res.render("home", { placeholder, recent });
}