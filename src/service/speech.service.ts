import {BusinessErrorException} from '../errors/business-error-exception';
import {SpeechRepository} from '../repository/speech.repository';
import {SpeechQuery} from '../criteria/speech.query';
import {format, isNullOrUndefined} from 'util';
import {inject, injectable} from 'inversify';
import {TextService} from './text.service';
import {LazyPage} from '../model/lazy-page';
import {BaseService} from './base.service';
import {Payload} from '../model/payload';
import {Speech} from '../model/speech';
import {InversifyTypes} from '../types/inversify.types';
import {isEmpty} from 'lodash';

const google = require('@google-cloud/speech');
const fs = require('fs');

@injectable()
export class SpeechService extends BaseService {

    constructor(@inject(InversifyTypes.TextService) private textService: TextService,
                @inject(InversifyTypes.SpeechRepository) private speechRepository: SpeechRepository) {
        super();
    }

    async getSpeechs(query: SpeechQuery, operator: Payload): Promise<LazyPage<Speech> | void> {

        if (isNullOrUndefined(query.patientId) || isNullOrUndefined(query.archetypeId)) {
            return Promise.reject(new BusinessErrorException(''));
        }

        this.logger.log('debug', format('Counting total amount by query: \n%j', query));

        const scores = await this.speechRepository.countAllByQuery(query).catch((error: any) => {
            throw new BusinessErrorException(format('Could not process an operation: \n%s', error), 400);
        });

        this.logger.log('debug', format('Searching records by query: \n%j', query));

        const Speechs: Speech[] = await this.speechRepository.findAllByQuery(query).catch((error: any) => {
            throw new BusinessErrorException(format('Could not process an operation: \n%s', error), 400);
        });

        if (isEmpty(Speechs)) {
            return;
        }

        return {
            scores: scores,
            result: Speechs
        };

    }

    async getSpeech(speechId: string, operator: Payload): Promise<Speech | void> {

        const speech: Speech = await this.speechRepository.findSpeechById(speechId).catch((error: any) => {
            throw new BusinessErrorException(format('Could not process an operation: \n%s', error), 400);
        });

        if (isNullOrUndefined(speech)) {
            return;
        }

        this.logger.log('info', format('Operator: %s', speech.operator.surname));

        return speech;

    }

    async saveSpeech(speech: Speech, operator: Payload): Promise<Speech | void> {

        if (isNullOrUndefined(speech)) {
            throw new BusinessErrorException('speech not found!', 400);
        }

        const client = new google.SpeechClient();

        const audio = {
            content: speech.content,
        };

        const config = {
            encoding: 'LINEAR16',
            languageCode: 'pt-BR',
        };
        const request = {
            audio: audio,
            config: config,
        };

        return client.recognize(request).then((data: Array<any>) => {
            const response = data[0];
            const transcription = response.results.map((result: any) => result.alternatives[0].transcript).join('\n');
            console.log(`Transcription: ${transcription}`);
            return speech;
        }).catch((error: any) => {
            console.error('ERROR:', error);
        });

        // return this.getSpeech(speech._id.toHexString(), speech.operator);

    }

    async deleteSpeech(speechId: string, operator: Payload): Promise<void> {

        const speech: Speech = await this.speechRepository.deleteSpeechById(speechId, operator)
            .catch((error: any) => {
                throw new BusinessErrorException(format('Could not process an operation: \n %s', error), 400);
            });

        if (isNullOrUndefined(speech)) {
            throw new BusinessErrorException(format('Could not remove speech with identifier: %s', speechId), 400);
        }

    }

}
