import {environment} from "../../../../../src/configuration/environment";
import {Constants} from "../../../../../src/model/constants";
import {Security} from "../../../../../src/model/security";
import {Logger} from "../../../../../src/lib/logger";
import {app} from "../../../../../src/bootstrap";
import {connect, Mongoose} from "mongoose";
import * as request from "supertest";
import {ObjectID} from "bson";
import {join} from "lodash";
import {v4} from "uuid";

describe("speechs /api/v1/speechs", function () {

    const logger = new Logger({
        message: "Server initialized",
        level: "error"
    });

    let token: string;

    let connection: Promise<Mongoose>;

    beforeEach(() => {

        token = join(["Bearer", Security.generate({
            sub: v4(),
        })], Constants.EMPTY_STRING);

        // Database connection
        return connection = connect(<string>environment.mongo.host, {
            poolSize: 30
        }).then((mongo: Mongoose) => {
            return mongo;
        });

    });

    afterEach(() => {
        return connection.then((mongo: Mongoose) => {
            return mongo.disconnect().then(() => {
                return logger.log("debug", "The connection closed database!")
            });
        });
    });

    it("get a encounter by identifier (v1)", (done) => {
        request.agent(app).get("/api/v1/speechs/5a58eabfd4c8d60cf87a68f9")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Authorization", token)
            .expect(200)
            .end((error: any) => {
                done(error);
            })
    });

    it("get unregistered encounter service (v1)", (done) => {
        request.agent(app).get("/api/v1/speechs/".concat(new ObjectID().toHexString()))
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Authorization", token)
            .expect(204)
            .end((error: any) => {
                done(error);
            })
    });

    it("get unregistered encounter service, bad request (v1)", (done) => {
        request.agent(app).get("/api/v1/speechs/".concat(v4()))
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Authorization", token)
            .expect(400)
            .end((error: any) => {
                done(error);
            })
    });

    it("get unregistered encounter service, not acceptable (v1)", (done) => {
        request.agent(app).get("/api/v1/speechs/".concat(v4()))
            .set("Content-Type", "application/json")
            .set("Authorization", token)
            .expect(406)
            .end((error: any) => {
                done(error);
            })
    });

});
