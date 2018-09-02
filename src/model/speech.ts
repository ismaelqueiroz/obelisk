import {Payload} from './payload';
import {ObjectID} from 'bson';

export interface Speech {

    _id: ObjectID;

    created: Date;

    operator: Payload;

    allowed: boolean;

    content: any;

}
