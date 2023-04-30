require("dotenv").config();
const log = require("debug")("imagesbot:index");

const server = require("./server");

async function main() {
    // db initialize
    log(`Booting ${process.env.npm_package_name} v${process.env.npm_package_version}`);
    await server.start();
}

main();