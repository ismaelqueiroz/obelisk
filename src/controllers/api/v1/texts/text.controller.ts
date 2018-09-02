import {BaseHttpController, controller, httpPost} from 'inversify-express-utils';
import {PayloadRequest} from '../../../../http/payload.request';
import {TextService} from '../../../../service/text.service';
import {container} from '../../../../types/inversify.config';
import {MediaType} from '../../../../http/media.type';
import {LazyPage} from '../../../../model/lazy-page';
import {RequestHandler, Response} from 'express';
import {Speech} from '../../../../model/speech';
import {Logger} from '../../../../lib/logger';
import {InversifyTypes} from '../../../../types/inversify.types';
import * as passport from 'passport';
import {inject} from 'inversify';
import {format} from 'util';

@controller('/texts', passport.authenticate('bearer', {
    session: false
}))
export class TextController extends BaseHttpController {

    private _logger: Logger;

    constructor(@inject(InversifyTypes.TextService) private textService: TextService) {
        super();
        this._logger = new Logger();
    }

    @httpPost('/', container.getNamed<RequestHandler>(InversifyTypes.AcceptableRequestHandler, MediaType.APPLICATION_JSON))
    public getSpeechs(request: PayloadRequest, response: Response): Promise<LazyPage<Speech> | void> {

        this._logger.log('debug', format('HTTP %s %s %s', request.method, request.url, response.statusCode));

        response.status(200)
            .header('Content-Version', 'v2')
            .header('Content-Message', 'Speechs')
            .header('Content-Type', MediaType.APPLICATION_JSON);

        return this.textService.getSpeechs(request.body, request.user);

    }

}
