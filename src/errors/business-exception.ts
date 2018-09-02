export class BusinessException extends Error {

    protected _status: number;

    protected _message: string;

    constructor(message: string, status: number) {

        // Calling parent constructor of base Error class.
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BusinessException.prototype);

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;

        // `500` is the default value if not specified.
        this._status = status;

        this._message = message;

    }

    get status(): number {
        return this._status;
    }

}
