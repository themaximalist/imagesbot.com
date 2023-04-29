require("dotenv").config();
const log = require("debug")("imagesbot:index");
const stability = require("./stability");
const { bufferToFile } = require("./utils");
const { evolveOptions } = require("./evolve");
const ConceptAgent = require("./agents");

/*
async function generateConcept(input) {
    ConceptAgent([input]).then(text_prompts => {
        console.log(text_prompts);

        for (let i = 0; i < 5; i++) {
            let options = { seed: 55555, text_prompts };
            options = evolveOptions(options);
            console.log(options);
            stability(null, { stability: options }).then(buffer => {
                let filepath = bufferToFile(buffer, true);
                console.log(filepath);
            });
        }
    });
}
*/

async function main() {
    log("starting");

    while (true) {
        const concept = await ConceptAgent("a red rose");
        console.log(concept);

        const buffer = await stability(null, { stability: concept });
        let filepath = bufferToFile(buffer, true);
        console.log(filepath);
    }
}

main();