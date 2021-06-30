import { getSerializationMetadata } from '../../cocos/core/data/serialization-metadata';
import { uniquelyReferenced } from '../../cocos/core/data/decorators/serializable';

describe(`Decorators`, () => {
    test('@uniquelyReferenced', () => {
        @uniquelyReferenced
        class Foo { }
        
        expect(getSerializationMetadata(Foo)?.uniquelyReferenced).toBe(true);
    });
});
