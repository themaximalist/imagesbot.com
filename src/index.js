require("dotenv").config();
const log = require("debug")("imagesbot:index");
const stability = require("./stability");
const { bufferToFile } = require("./utils");
const ConceptAgent = require("./agents");

async function main() {
    log("starting");

    while (true) {
        const concept = await ConceptAgent("a beautiful a-frame cabin in the woods illustration");
        console.log(concept);

        const buffer = await stability(null, { stability: concept });
        let filepath = bufferToFile(buffer, true);
        console.log(filepath);
    }
}

main();