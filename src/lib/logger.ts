import {LoggerInstance, LoggerOptions} from "winston";
import {format, isNullOrUndefined} from "util";
import * as moment from "moment";

const winston = require("winston");

const config = winston.config;

export class Logger {

    private logger: LoggerInstance;

    constructor(partial?: Partial<LoggerOptions>) {

        const options: LoggerOptions = {
            level: "debug",
            exitOnError: false,
            colors: {
                silly: "magenta",
                verbose: "cyan",
                debug: "blue",
                error: "red",
                data: "grey",
                warn: "yellow",
                info: "green"
            },
            transports: [
                new winston.transports.Console({
                    colorize: true,
                    timestamp: true,
                    showLevel: true,
                    formatter: (options: any) => {
                        return format("%s %s %s",
                            moment(new Date()).format("YYYY-MM-DD\"T\"HH:mm:ssZZ"),
                            config.colorize(options.level, options.level.toUpperCase()),
                            options.message);
                    }
                })
            ]
        };

        if (!isNullOrUndefined(partial)) {
            Object.assign(options, partial);
        }

        this.logger = new winston.Logger(options);

    }

    log(level: string, message: string, ...meta: any[]) {
        this.logger.log(level, message, meta);
    }

}
