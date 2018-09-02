import {SpeechQuery} from "../criteria/speech.query";
import {BaseRepository} from "./base.repository";
import {Payload} from "../model/payload";
import {Speech} from "../model/speech";
import {injectable} from "inversify";
import {Schema} from "mongoose";
import {ObjectID} from "bson";

@injectable()
export class SpeechRepository extends BaseRepository<Speech> {

    private static COLLECTION_NAME = "speechs";

    constructor() {
        super(new Schema({
            archetypeId: String,
            originalReferenceId: Schema.Types.ObjectId,
            created: Date,
            control: String,
            signature: String,
            composition: new Schema({}),
            operator: new Schema({
                id: String,
                sub: String,
                mail: String,
                name: String,
                surname: String,
                roles: [String]
            }),
            allowed: Boolean
        }), SpeechRepository.COLLECTION_NAME)
    }

    saveSpeech(Speech: Speech): Promise<Speech> {
        return this.model.create(Speech);
    }

    countAllByQuery(query: SpeechQuery): Promise<number> {
        return this.model.count({
            "archetypeId": query.archetypeId,
            "patient.originalReferenceId": new ObjectID(query.patientId)
        }).then((scores: number) => {
            return scores;
        });
    }

    findAllByQuery(query: SpeechQuery): Promise<Speech[]> {
        return this.model.find({
            "archetypeId": query.archetypeId,
            "patient.originalReferenceId": new ObjectID(query.patientId)
        }).skip((query.page || 0) * SpeechRepository.TOTAL_RECORD_PER_QUERY)
            .limit(SpeechRepository.TOTAL_RECORD_PER_QUERY)
            .then((Speechs: Speech[]) => {
                return Speechs;
            });
    }

    findSpeechById(SpeechId: string): Promise<Speech> {
        return this.model.findById(SpeechId).then((Speech: Speech | null) => {
            return <Speech>Speech;
        });
    }

    deleteSpeechById(SpeechId: string, operator: Payload): Promise<Speech> {
        return this.model.findOneAndRemove({
            _id: new ObjectID(SpeechId),
            operator: operator
        }).then((Speech: Speech | null) => {
            return <Speech>Speech;
        });
    }

}
