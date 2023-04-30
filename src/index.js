require("dotenv").config();
const log = require("debug")("imagesbot:index");

const database = require("./database");
const server = require("./server");

async function main() {
    await database.initialize();
    log(`Booting ${process.env.npm_package_name} v${process.env.npm_package_version}`);
    await server.start();
}

main();