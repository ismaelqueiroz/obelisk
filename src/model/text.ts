import {Document} from 'mongoose';

export interface Text extends Document {

    language: string;
    input: string
    type: string;

}
