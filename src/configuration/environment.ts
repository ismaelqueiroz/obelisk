import * as dotenv from "dotenv";
import * as Joi from "joi";
import {format} from "util";

// require and configure dotenv, will load vars in .env in PROCESS.ENV
dotenv.config();

// define validation for all the env vars
const schema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
        .default("development")
        .allow([
            "development",
            "production",
            "test",
            "uat"]),
    PORT: Joi.number()
        .default(8000),
    ENCRYPT_DOCUMENT: Joi.boolean().default(false),
    RSA_PUBLIC_KEY: Joi.string().required()
        .description("JWT public key required to sign"),
    RSA_RIVATE_KEY: Joi.string().required()
        .description("JWT private key required to sign"),
    DATABASE_URL: Joi.string().required()
        .description("Mongo DB host url"),
    DATABASE_DATASOURCE: Joi.string().required()
        .description("Mongo datasource name "),
    DATABASE_PORT: Joi.number().default(27017)
}).unknown().required();

const {error, value: env} = Joi.validate(process.env, schema);

if (error) {
    throw new Error(format("Config validation error: %s", error.message));
}

export const environment = {
    env: env.NODE_ENV,
    port: env.PORT,
    jwt: {
        publicKey: env.RSA_PUBLIC_KEY,
        privateKey: env.RSA_RIVATE_KEY
    },
    mongo: {
        host: env.DATABASE_URL,
        port: env.DATABASE_PORT,
        datasource: env.DATABASE_DATASOURCE
    },
    encrypt: env.ENCRYPT_DOCUMENT
};
