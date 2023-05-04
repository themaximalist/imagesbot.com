const uuid = require("uuid").v4;
const { exec } = require("child_process");
const { join } = require("path");
const sharp = require("sharp");

async function saveBufferToImage(buffer, size = 512) {
    const filename = `${uuid()}-${size}x${size}.png`;
    const url = `/images/${filename}`;
    const filepath = join(process.env.ASSET_DIR, "images", filename);
    await sharp(buffer).resize(size, size).png().toFile(filepath);
    return url;
}

function openFile(filepath) {
    exec(`open ${filepath}`);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function randomElement(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non-empty array');
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function render(renderer, template, context = null) {
    return new Promise((resolve, reject) => {
        renderer(template, context, (err, html) => {
            if (err) reject(err)
            else resolve(html.replace(/\n/g, ""));
        });
    });
}

module.exports = {
    saveBufferToImage,
    openFile,
    shuffle,
    randomElement,
    render,
};