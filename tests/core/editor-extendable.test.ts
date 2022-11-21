import { EditorExtendable } from "../../cocos/core/data/editor-extendable";
import { editorExtrasTag } from "../../cocos/core/data/editor-extras-tag";

describe('Editor extendable', () => {
    test('Serialize', () => {
        class Foo extends EditorExtendable {

        }

        const foo = new Foo();

        foo[editorExtrasTag] = {};

        const extras = foo[editorExtrasTag];
    });
});