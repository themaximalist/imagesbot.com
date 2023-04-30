require("dotenv").config();
const log = require("debug")("imagesbot:index");
const stability = require("./stability");
const { bufferToFile } = require("./utils");
const ConceptAgent = require("./agents");

// service
// text prompt
// style
// seed

async function main() {
    log("starting");

    const prompt = process.argv.slice(2).join(" ");
    if (!prompt) throw new Error("no prompt provided")
    log(`prompt: ${prompt}`);

    for (let i = 0; i < 5; i++) {
        try {
            ConceptAgent(prompt).then(async (concept) => {
                if (!concept) return;
                console.log(concept);
                const buffer = await stability(null, { stability: concept });
                let filepath = bufferToFile(buffer, true);
                console.log(filepath);
            });
        } catch (e) {
            console.log(e);
        }
    }
}

main();