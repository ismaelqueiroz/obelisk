import 'reflect-metadata';
import {Application, json, NextFunction, Request, Response, Router, urlencoded} from 'express';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {BusinessException} from './errors/business-exception';
import {InversifyExpressServer} from 'inversify-express-utils';
import {environment} from './configuration/environment';
import {container} from './types/inversify.config';
import {format, isNullOrUndefined} from 'util';
import * as cookieParser from 'cookie-parser';
import {publicKey} from './configuration/rsa';
import * as compress from 'compression';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import {Logger} from './lib/logger';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import {raw} from 'body-parser';

const enrouten = require('express-enrouten');
const rsa = require('./configuration/rsa')();

const logger = new Logger({
    message: 'Server initialized',
    level: environment.env === 'test' ? 'error' : 'debug'
});

// Validation keys for jwt
rsa({
    privateKey: environment.jwt.privateKey,
    publicKey: environment.jwt.publicKey
});

const inversify = new InversifyExpressServer(container, Router({
    mergeParams: true,
}), {rootPath: '/api/v1'});

inversify.setConfig((app: Application) => {

    if (!isNullOrUndefined(environment.env && environment.env !== 'development')) {
        app.use(morgan(':remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms [:user-agent]'));
    }

    //Passaport
    app.use(passport.initialize())
        .use(passport.session())
        .use((req: Request, res: Response, next: NextFunction) => {

            passport.use(new BearerStrategy(
                (token: any, done: any) => {
                    jwt.verify(token, publicKey(), (error: any, decoded: any) => {
                        return done(null, decoded || false, error || {scope: 'read'});
                    });
                }
            ));

            next();

        });

    app.use(json({
        strict: true
    })).use(urlencoded({
        extended: true
    })).use(raw({
        limit: 510262
    }));

    app.use(helmet())
        .use(compress())
        .use(cookieParser())
        .use((req: Request, res: Response, next: NextFunction) => {

            // Website you wish to allow to connect
            res.header('Access-Control-Allow-Origin', '*');

            // Request methods you wish to allow
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

            // Pass to next layer of middleware
            next();

        })
        .use(enrouten({
            directory: 'controllers'
        }));


});

inversify.setErrorConfig((app: Application) => {

    //Cusom ErrorHandler
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {

        res.status(400)
            .header('Content-Message', 'Could not process request')
            .header('Content-Version', 'v2');

        logger.log('error', format('Could not process request: %j', error));

        if (error instanceof BusinessException) {
            return next(error);
        } else {
            return next(new BusinessException('Could not process request', 500));
        }

    });

});

const app = inversify.build();

process.on('uncaughtException', function (error: any) {
    logger.log('error', format('UncaughtException: %s', error.message));
});

export {app}
