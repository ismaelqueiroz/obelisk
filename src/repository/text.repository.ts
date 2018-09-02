import {BaseRepository} from './base.repository';
import {injectable} from 'inversify';
import {Text} from '../model/text';
import {Schema} from 'mongoose';
import {ObjectID} from 'bson';

@injectable()
export class TextRepository extends BaseRepository<Text> {

    private static COLLECTION_NAME = 'text';

    constructor() {
        super(new Schema({}), TextRepository.COLLECTION_NAME)
    }

    findOperationalTemplateById(archetypeId: string): Promise<Text> {
        return this.model.findOne({
            _id: new ObjectID(archetypeId)
        }).then((operational: Text | null) => {
            return <Text>operational;
        });
    }

}
