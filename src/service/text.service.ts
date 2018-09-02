import {BusinessErrorException} from '../errors/business-error-exception';
import {TextRepository} from '../repository/text.repository';
import {inject, injectable} from 'inversify';
import {LazyPage} from '../model/lazy-page';
import {BaseService} from './base.service';
import {Payload} from '../model/payload';
import {Speech} from '../model/speech';
import {isNullOrUndefined} from 'util';
import {InversifyTypes} from '../types/inversify.types';
import {Text} from '../model/text';
import {ObjectID} from 'bson';

const google = require('@google-cloud/text-to-speech');
const fs = require('fs');

@injectable()
export class TextService extends BaseService {

    constructor(@inject(InversifyTypes.TextRepository) private repository: TextRepository) {
        super();
    }

    async getSpeechs(text: Text, operator: Payload): Promise<LazyPage<Speech>> {

        // Creates a client
        const client = new google.TextToSpeechClient();

        // Construct the request
        const request = {
            input: {
                text: text.input
            },
            voice: {
                languageCode: text.language,
                ssmlGender: 'NEUTRAL'
            },
            audioConfig: {
                sampleRateHertz: 8000,
                audioEncoding: text.type
            },
        };

        return new Promise<LazyPage<Speech>>((resolve, reject) => {
            client.synthesizeSpeech(request, (error: any, response: any) => {
                return !isNullOrUndefined(error) ? reject(new BusinessErrorException(error.message)) : resolve({
                    scores: 1,
                    result: [{
                        _id: new ObjectID(),
                        created: new Date(),
                        operator: operator,
                        allowed: true,
                        content: response.audioContent
                    }]
                });
            });
        });

    }

}
