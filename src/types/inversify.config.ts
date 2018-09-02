import {AcceptableMiddleware} from '../middleware/acceptable.middleware';
import {NextFunction, Request, RequestHandler, Response} from 'express';
import {SpeechRepository} from '../repository/speech.repository';
import {TextRepository} from '../repository/text.repository';
import {SpeechService} from '../service/speech.service';
import {TextService} from '../service/text.service';
import {InversifyTypes} from './inversify.types';
import {MediaType} from '../http/media.type';
import {Container} from 'inversify';

const container = new Container();

container.bind<SpeechRepository>(InversifyTypes.SpeechRepository)
    .to(SpeechRepository).inSingletonScope();
container.bind<TextRepository>(InversifyTypes.TextRepository)
    .to(TextRepository).inSingletonScope();

container.bind<SpeechService>(InversifyTypes.SpeechService).to(SpeechService);
container.bind<TextService>(InversifyTypes.TextService).to(TextService);

container.bind<AcceptableMiddleware>(InversifyTypes.AcceptableMiddleware)
    .toConstantValue(new AcceptableMiddleware([MediaType.APPLICATION_FORM_URLENCODED]));

container.bind<RequestHandler>(InversifyTypes.AcceptableRequestHandler).toConstantValue(
    (request: Request, response: Response, next: NextFunction) => {
        return AcceptableMiddleware.accepts([MediaType.APPLICATION_FORM_URLENCODED], request, next);
    }).whenTargetNamed(MediaType.APPLICATION_FORM_URLENCODED);

container.bind<RequestHandler>(InversifyTypes.AcceptableRequestHandler).toConstantValue(
    (request: Request, response: Response, next: NextFunction) => {
        return AcceptableMiddleware.accepts([MediaType.APPLICATION_JSON], request, next);
    }).whenTargetNamed(MediaType.APPLICATION_JSON);

container.bind<RequestHandler>(InversifyTypes.AcceptableRequestHandler).toConstantValue(
    (request: Request, response: Response, next: NextFunction) => {
        return AcceptableMiddleware.accepts([MediaType.APPLICATION_OCTET_STREAM], request, next);
    }).whenTargetNamed(MediaType.APPLICATION_OCTET_STREAM);

export {container};
