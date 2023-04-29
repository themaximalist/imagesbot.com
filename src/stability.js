const log = require("debug")("imagesbot:stability");
const fetch = require("node-fetch");

// given an input...give an output that is close...how many parameters do we want to modify?

const BASE_URL = "https://api.stability.ai";

async function generate(prompt_text, options = null) {
    if (!options) options = {};
    if (!options.model) options.model = generate.defaultModel;

    let stability = options.stability || {};
    if (!stability.cfg_scale) stability.cfg_scale = 7; // 0-35
    if (!stability.clip_guidance_preset) stability.clip_guidance_preset = 'FAST_BLUE'; // FAST_BLUE FAST_GREEN NONE SIMPLE SLOW SLOWER SLOWEST
    if (!stability.height) stability.height = 512;
    if (!stability.width) stability.width = 512;
    if (!stability.samples) stability.samples = 1;
    if (!stability.sampler) stability.sampler = "K_EULER"; // DDIM DDPM K_DPMPP_2M K_DPMPP_2S_ANCESTRAL K_DPM_2 K_DPM_2_ANCESTRAL K_EULER K_EULER_ANCESTRAL K_HEUN K_LMS
    if (!stability.steps) stability.steps = 50; // 10-150
    if (!stability.style_preset) stability.style_preset = "low-poly"; // 3d-model analog-film anime cinematic comic-book digital-art enhance fantasy-art isometric line-art low-poly modeling-compound neon-punk origami photographic pixel-art tile-texture
    if (!stability.seed) stability.seed = 0; // 0-4294967295
    if (!stability.text_prompts) stability.text_prompts = [
        { text: prompt_text }
    ];

    try {
        if (!process.env.STABILITY_API_KEY) throw new Error("STABILITY_API_KEY is not set.");
        log(`hitting stability ${options.model} API ${JSON.stringify(stability)}`);

        const start = Date.now();

        /*
        stability = {
            seed: 12345,
            cfg_scale: 7,
            clip_guidance_preset: 'FAST_BLUE',
            sampler: 'K_EULER',
            style_preset: 'photographic',
            text_prompts: [
                { text: 'a realistic red rose', weight: 1 },
                // { text: 'vibrant colors', weight: 0.8 },
                // { text: 'nature', weight: 0.7 },
                { text: 'romantic', weight: 0.6 },
                // { text: 'digital painting', weight: 0.5 },
                { text: 'dark and moody', weight: -0.5 },
                { text: 'grunge', weight: -0.6 },
                { text: 'minimalistic', weight: -0.7 },
                { text: 'cartoonish', weight: -0.8 }
            ],
            height: 512,
            width: 512,
            samples: 1,
            steps: 50
        }
        */
        console.log(stability);

        const response = await fetch(
            `${BASE_URL}/v1/generation/${options.model}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                },
                body: JSON.stringify(stability),
            }
        )

        const end = Date.now();
        log(`stability API took ${(end - start) / 1000}s`);

        if (!response.ok) {
            throw new Error(`invalid response: ${await response.text()}`)
        }

        const data = await response.json();
        if (!data || data.artifacts.length !== 1) {
            throw new Error(`invalid response: ${data}`);
        }

        const image = data.artifacts[0];

        return Buffer.from(image.base64, 'base64')
    } catch (e) {
        log(`error running stability generate: ${e}`);
        return null;
    }
}

generate.defaultModel = "stable-diffusion-xl-beta-v2-2-2";

module.exports = generate;