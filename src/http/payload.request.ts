import {Request} from 'express';
import {Payload} from "../model/payload";

export interface PayloadRequest extends Request {

    user: Payload;

}
