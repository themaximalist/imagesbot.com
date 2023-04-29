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
        default: "FAST_BLUE"
    },
    sampler: {
        type: "array",
        values: ["DDIM", "DDPM", "K_DPMPP_2M", "K_DPMPP_2S_ANCESTRAL", "K_DPM_2", "K_DPM_2_ANCESTRAL", "K_EULER", "K_EULER_ANCESTRAL", "K_HEUN", "K_LMS"],
        default: "K_EULER"
    },
    style_preset: {
        type: "array",
        values: ["3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"],
        default: null
    }
}

function evolveNumber(existingValue, min, max, stepRange = 4) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const step = Math.floor(Math.random() * (stepRange + 1));
    let newValue = existingValue + direction * step;

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

const blah = {
    "seed": 55555, // int 1-4294967295
    "cfg_scale": 7, // int 1-35
    "clip_guidance_preset": "FAST_BLUE", // array ["FAST_BLUE", "FAST_GREEN", "NONE", "SIMPLE", "SLOW", "SLOWER", "SLOWEST"]
    "sampler": "K_EULER", // array ["DDIM", "DDPM", "K_DPMPP_2M", "K_DPMPP_2S_ANCESTRAL", "K_DPM_2", "K_DPM_2_ANCESTRAL", "K_EULER", "K_EULER_ANCESTRAL", "K_HEUN", "K_LMS"]
    "style_preset": "digital-art", // array ["3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"]
}


function evolveOptions(options = null) {
    if (!options) options = {};
    if (!options.seed) options.seed = EVOLVE_OPTIONS.seed.default;

    if (!options.cfg_scale) options.cfg_scale = EVOLVE_OPTIONS.cfg_scale.default;
    if (!options.clip_guidance_preset) options.clip_guidance_preset = EVOLVE_OPTIONS.clip_guidance_preset.default;
    if (!options.height) options.height = 512;
    if (!options.width) options.width = 512;
    if (!options.samples) options.samples = 1;
    if (!options.sampler) options.sampler = EVOLVE_OPTIONS.sampler.default;
    if (!options.steps) options.steps = EVOLVE_OPTIONS.steps.default;
    if (!options.style_preset) options.style_preset = getRandomItem(EVOLVE_OPTIONS.style_preset.default, EVOLVE_OPTIONS.style_preset.values, 100);
    if (!options.seed) options.seed = EVOLVE_OPTIONS.seed.default;

    // generic evolveOption
    options.cfg_scale = evolveNumber(options.cfg_scale, EVOLVE_OPTIONS.cfg_scale.min, EVOLVE_OPTIONS.cfg_scale.max);
    options.clip_guidance_preset = getRandomItem(options.clip_guidance_preset, EVOLVE_OPTIONS.clip_guidance_preset.values);
    options.sampler = getRandomItem(options.sampler, EVOLVE_OPTIONS.sampler.values);
    options.steps = evolveNumber(options.steps, EVOLVE_OPTIONS.steps.min, EVOLVE_OPTIONS.steps.max);
    // don't evolve style_preset...it gets set in initial call
    // options.style_preset = getRandomItem(options.style_preset, EVOLVE_OPTIONS.style_preset.values);
    options.seed = evolveNumber(options.seed, EVOLVE_OPTIONS.seed.min, EVOLVE_OPTIONS.seed.max);

    return options;
}

module.exports = { evolveOptions };