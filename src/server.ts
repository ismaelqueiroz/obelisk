import {environment} from "./configuration/environment";
import {format, isNullOrUndefined} from "util";
import {connect, Mongoose} from "mongoose";
import {Logger} from "./lib/logger";
import {app} from "./bootstrap";
import {Server} from "http";

const logger = new Logger({
    message: "Server initialized",
    level: environment.env === "test" ? "error" : "debug"
});

// Database connection
const connection = connect(<string>environment.mongo.host, {
    poolSize: 30
}).then((mongo: Mongoose) => {
    return mongo;
});

const server: Server = app.listen(environment.port, async () => {
    if (!isNullOrUndefined(environment.env)) {
        logger.log("info", format("Server listening on http://localhost:%d", environment.port));
    }
});

server.on("listening", function () {
    if (!isNullOrUndefined(environment.env)) {
        logger.log("info", "Application ready to serve requests.");
        logger.log("info", format("Environment: %s", environment.env || "development"));
    }
});

server.on("close", async () => {
    if (!isNullOrUndefined(connection)) {
        await connection.then((mongo: Mongoose) => {
            return mongo.disconnect().then(() => logger.log("debug", "The connection closed database!"));
        });
    }
});

export {server}
