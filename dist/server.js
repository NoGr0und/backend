"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const port = Number(process.env.PORT) || 3333;
async function start() {
    try {
        await app_1.app.listen({ port, host: '0.0.0.0' });
        app_1.app.log.info(`Server is running on http://localhost:${port}`);
    }
    catch (err) {
        app_1.app.log.error(err);
        process.exit(1);
    }
}
start();
