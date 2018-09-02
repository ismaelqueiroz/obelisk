import {BusinessException} from "../errors/business-exception";
import {NextFunction, Request, Response} from "express";
import {BaseMiddleware} from "inversify-express-utils";
import {injectable} from "inversify";
import {indexOf} from "lodash"

@injectable()
export class AcceptableMiddleware extends BaseMiddleware {

    constructor(private _contentTypes: Array<string>) {
        super();
    }

    public handler(request: Request, response: Response, next: NextFunction) {
        return AcceptableMiddleware.accepts(this._contentTypes, request, next);
    }

    static accepts(contentTypes: Array<string>, request: Request, next: NextFunction): void {
        return next(indexOf(contentTypes, request.headers["content-type"]) === -1 ?
            new BusinessException("Not Acceptable", 406) : null);
    }

}
