import { EditorExtendable, editorExtrasTag } from "../../cocos/core/data/editor-extendable";

describe('Editor extendable', () => {
    test('Serialize', () => {
        class Foo extends EditorExtendable {

        }

        const foo = new Foo();

        foo[editorExtrasTag] = {};

        const extras = foo[editorExtrasTag];
    });
});