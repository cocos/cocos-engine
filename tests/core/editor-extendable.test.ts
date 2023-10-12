import { editorExtrasTag } from '@base/object';
import { EditorExtendable } from '../../cocos/core/data/editor-extendable';

describe('Editor extendable', () => {
    test('Serialize', () => {
        class Foo extends EditorExtendable {

        }

        const foo = new Foo();

        foo[editorExtrasTag] = {};

        const extras = foo[editorExtrasTag];
    });
});