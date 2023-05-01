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

module.exports = { bufferToFile, bufferToURL, openFile };