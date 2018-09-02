import {Logger} from "../lib/logger";
import {injectable} from "inversify";

@injectable()
export abstract class BaseService {

    private _logger: Logger;

    constructor() {
        this._logger = new Logger();
    }

    get logger(): Logger {
        return this._logger;
    }

}
