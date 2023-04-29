require("dotenv").config();
const log = require("debug")("imagesbot:index");
const stability = require("./stability");
const { bufferToFile } = require("./utils");

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const EVOLVE_OPTIONS = {
    seed: {
        type: "int",
        min: 1,
        max: 4294967295,
        default: 1
    },
    cfg_scale: {
        type: "int",
        min: 1,
        max: 35,
        default: 7
    },
    steps: {
        type: "int",
        min: 10,
        max: 150,
        default: 50
    },
    clip_guidance_preset: {
        type: "array",
        values: ["FAST_BLUE", "FAST_GREEN", "NONE", "SIMPLE", "SLOW", "SLOWER", "SLOWEST"],
    },
    sampler: {
        type: "array",
        values: ["DDIM", "DDPM", "K_DPMPP_2M", "K_DPMPP_2S_ANCESTRAL", "K_DPM_2", "K_DPM_2_ANCESTRAL", "K_EULER", "K_EULER_ANCESTRAL", "K_HEUN", "K_LMS"],
    },
    style_preset: {
        type: "array",
        values: ["3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"],
    }
}

function evolveNumber(existingValue, min, max, stepRange = 3) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const step = Math.floor(Math.random() * (stepRange + 1));
    let newValue = existingValue + direction * step;

    // Ensure the new value stays within the min and max boundaries
    if (newValue < min) {
        newValue = min;
    } else if (newValue > max) {
        newValue = max;
    }

    return newValue;
}


function getRandomItem(currentValue, arr, percentage = 35) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non-empty array');
    }

    if (typeof currentValue === 'undefined' || !arr.includes(currentValue)) {
        throw new Error('currentValue must be a valid element in the array');
    }

    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
        throw new Error('percentage must be a number between 0 and 100');
    }

    const shouldPickRandom = Math.random() < (percentage / 100);
    if (shouldPickRandom) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * arr.length);
        } while (arr[randomIndex] === currentValue);

        return arr[randomIndex];
    }

    return currentValue;
}


function evolveOptions(options = null) {
    if (!options) options = {};
    if (!options.seed) options.seed = EVOLVE_OPTIONS.seed.default;

    if (!options.cfg_scale) options.cfg_scale = EVOLVE_OPTIONS.cfg_scale.default;
    if (!options.clip_guidance_preset) options.clip_guidance_preset = 'FAST_BLUE'; // FAST_BLUE FAST_GREEN NONE SIMPLE SLOW SLOWER SLOWEST
    if (!options.height) options.height = 512;
    if (!options.width) options.width = 512;
    if (!options.samples) options.samples = 1;
    if (!options.sampler) options.sampler = "K_EULER"; // DDIM DDPM K_DPMPP_2M K_DPMPP_2S_ANCESTRAL K_DPM_2 K_DPM_2_ANCESTRAL K_EULER K_EULER_ANCESTRAL K_HEUN K_LMS
    if (!options.steps) options.steps = 50; // 10-150
    if (!options.style_preset) options.style_preset = "low-poly"; // 3d-model analog-film anime cinematic comic-book digital-art enhance fantasy-art isometric line-art low-poly modeling-compound neon-punk origami photographic pixel-art tile-texture
    if (!options.seed) options.seed = 0; // 0-4294967295

    // generic evolveOption
    options.cfg_scale = evolveNumber(options.cfg_scale, EVOLVE_OPTIONS.cfg_scale.min, EVOLVE_OPTIONS.cfg_scale.max);
    options.clip_guidance_preset = getRandomItem(options.clip_guidance_preset, EVOLVE_OPTIONS.clip_guidance_preset.values);
    options.sampler = getRandomItem(options.sampler, EVOLVE_OPTIONS.sampler.values);
    options.steps = evolveNumber(options.steps, EVOLVE_OPTIONS.steps.min, EVOLVE_OPTIONS.steps.max);
    options.style_preset = getRandomItem(options.style_preset, EVOLVE_OPTIONS.style_preset.values);
    options.seed = evolveNumber(options.seed, EVOLVE_OPTIONS.seed.min, EVOLVE_OPTIONS.seed.max);

    return options;
}

async function main() {
    log("starting");

    let options = { seed: 55555, steps: 100 };
    while (true) {
        options = evolveOptions(options);
        console.log(options);
        const buffer = await stability("a red rose", { stability: options });
        const filepath = bufferToFile(buffer, true);
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