require("dotenv").config();
const log = require("debug")("imagesbot:index");
const stability = require("./stability");
const { bufferToFile } = require("./utils");
const { evolveOptions } = require("./evolve");

async function main() {
    log("starting");

    while (true) {
        let options = { seed: 55555 };
        options = evolveOptions(options);
        let buffer = await stability("a red rose", { stability: options });
        let filepath = bufferToFile(buffer, true);
        console.log(filepath);

        options = evolveOptions(options);
        buffer = await stability("a red rose", { stability: options });
        filepath = bufferToFile(buffer, true);
        console.log(filepath);
    }
    /*
    const buffer = await stability("a red rose", { stability: options });
    const filepath = bufferToFile(buffer, true);
    console.log(filepath);
    */
    /*
    const buffer = await stability("a red rose", { stability: { cfg_scale: 5, seed: 1 } });
    const filepath = bufferToFile(buffer, true);
    console.log(filepath);
    */

    /*
    for (let cfg_scale = 5; cfg_scale <= 35; cfg_scale++) {
        const buffer = await stability("a red rose", { stability: { cfg_scale, seed: 1 } });
        const filepath = bufferToFile(buffer, true);
        console.log(filepath);
    }
    */
}

main();

// TODO: you want to do a broad search first on the best parameters, then do a more fine-grained tuning while combining new promtps