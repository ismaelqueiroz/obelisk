import {SpeechService} from '../../../../service/speech.service';
import {PayloadRequest} from '../../../../http/payload.request';
import {container} from '../../../../types/inversify.config';
import {MediaType} from '../../../../http/media.type';
import {LazyPage} from '../../../../model/lazy-page';
import {RequestHandler, Response} from 'express';
import {Speech} from '../../../../model/speech';
import {Logger} from '../../../../lib/logger';
import {InversifyTypes} from '../../../../types/inversify.types';
import * as passport from 'passport';
import {inject} from 'inversify';
import {ObjectID} from 'bson';
import {format} from 'util';
import {
BaseHttpController,
controller,
httpDelete,
httpGet,
httpPost,
request,
response
} from 'inversify-express-utils';

@controller('/speechs', passport.authenticate('bearer', {
    session: false
}))
export class SpeechController extends BaseHttpController {

    private _logger: Logger;

    constructor(@inject(InversifyTypes.SpeechService) private speechService: SpeechService) {
        super();
        this._logger = new Logger();
    }

    @httpGet('/', InversifyTypes.AcceptableMiddleware)
    public getSpeechs(request: PayloadRequest, response: Response): Promise<LazyPage<Speech> | void> {

        this._logger.log('debug', format('HTTP %s %s %s', request.method, request.url, response.statusCode));

        response.status(200)
            .header('Content-Version', 'v2')
            .header('Content-Message', 'Speechs')
            .header('Content-Type', MediaType.APPLICATION_JSON);

        return this.speechService.getSpeechs(request.query, request.user);

    }

    @httpGet('/:id', InversifyTypes.AcceptableMiddleware)
    public getSpeech(request: PayloadRequest, response: Response): Promise<Speech | void> {

        response.status(200)
            .header('Content-Version', 'v2')
            .header('Content-Message', 'Speechs')
            .header('Content-Type', MediaType.APPLICATION_JSON);

        return this.speechService.getSpeech(request.params.id, request.user);

    }

    @httpPost('/', container.getNamed<RequestHandler>(InversifyTypes.AcceptableRequestHandler, MediaType.APPLICATION_OCTET_STREAM))
    public setSpeech(request: PayloadRequest, response: Response): Promise<Speech | void> {

        response.status(200)
            .header('Content-Version', 'v2')
            .header('Content-Message', 'Speechs')
            .header('Content-Type', MediaType.APPLICATION_JSON);

        const speech: Speech = {
            _id: new ObjectID(),
            created: new Date(),
            operator: request.user,
            allowed: true,
            content: request.body
        };

        return this.speechService.saveSpeech(speech, request.user);

    }

    @httpDelete('/:id', InversifyTypes.AcceptableMiddleware)
    private deleteSpeech(@request() request: PayloadRequest, @response() response: Response): Promise<void> {

        response.status(200)
            .header('Content-Version', 'v2')
            .header('Content-Message', 'Speechs')
            .header('Content-Type', MediaType.APPLICATION_JSON);

        return this.speechService.deleteSpeech(request.params.id, request.user);

    }

}
