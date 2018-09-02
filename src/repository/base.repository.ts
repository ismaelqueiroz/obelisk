import {Document, Model, model, Schema} from "mongoose";
import {injectable, unmanaged} from "inversify";
import {Logger} from "../lib/logger";

@injectable()
export abstract class BaseRepository<T extends Document> {

    private _logger: Logger;

    private _model: Model<T>;

    protected static UNIQUE_NAME_VALUE = 1;

    protected static PREPOSITION_VALUE = 2;

    protected static ORIGINAL_REFERENCE_ID = -1;

    protected static TOTAL_RECORD_PER_QUERY = 4;

    constructor(@unmanaged() private _schema: Schema, @unmanaged() private _name: string) {
        this._logger = new Logger();
        this._model = model<T>(_name, _schema);
    }

    get logger(): Logger {
        return this._logger;
    }

    get model(): Model<T> {
        return this._model;
    }

}
