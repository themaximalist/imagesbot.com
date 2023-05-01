const uuid = require("uuid").v4;
const { writeFileSync } = require("fs");
const { exec } = require("child_process");

function bufferToFile(buffer, open = false) {
    const filename = `${uuid()}.png`;
    const filepath = `./public/images/${filename}`;
    writeFileSync(filepath, buffer);
    if (open) openFile(filepath);
    return filepath;
}

function bufferToURL(buffer) {
    const filename = `${uuid()}.png`;
    const url = `/images/${filename}`;
    const filepath = `./public/images/${filename}`;
    writeFileSync(filepath, buffer);
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

module.exports = {
    bufferToFile,
    bufferToURL,
    openFile,
    shuffle,
    randomElement,
};