(function () {

    if (!TestEditorExtends) {
        return;
    }

    var Script;

    module('test scene serialization', {
        setup: function () {
            SetupEngine.setup();

            Script = cc.Class({
                name: '97423897423',
                extends: cc.Component,
                properties: {
                    target: {
                        default: null,
                        type: cc.Node
                    }
                },
                getName: function () {
                    return this.name;
                }
            });
        },
        teardown: function () {
            cc.js.unregisterClass(Script);
            SetupEngine.teardown();
        }
    });

    test('basic test', function () {
        var newScene = new cc.Scene();
        var root1 = new cc.Node();
        root1.parent = newScene;

        var serialized = Editor.serialize(newScene, {stringify: false});
        strictEqual(serialized[0].__type__, cc.js._getClassId(cc.Scene), 'scene should be serialized');
        ok(serialized[0]._children instanceof Array, 'children should be serialized');

        var loaded = cc.deserialize(serialized);
        ok(loaded instanceof cc.Scene, 'deserialization');
        strictEqual(loaded._children.length, 1, 'children should be loaded');

        ok(cc.engine.getInstanceById(root1.uuid) == null, 'should not register uuid to engine before scene launch');

        cc.director.runSceneImmediate(newScene);
        strictEqual(cc.director.getScene(), newScene, 'could run new scene');

        ok(cc.engine.getInstanceById(root1.uuid) === root1, 'should register uuid to engine after scene launch');
    });
})();

module('load scene', SetupEngine);

test('persist node with dynamic scene', function () {
    var oldScene = new cc.Scene();
    cc.director.runSceneImmediate(oldScene);

    var globalNode = new cc.Node();
    globalNode.parent = oldScene;
    var childNode = new cc.Node();
    childNode.parent = globalNode;

    cc.game.addPersistRootNode(globalNode);

    var newScene = new cc.Scene();
    cc.director.runSceneImmediate(newScene);

    ok(globalNode.parent === newScene, 'persist node should not be destoryed automatically when loading a new scene');
});

(function () {
    if (!TestEditorExtends) {
        return;
    }
    test('persist node with loaded scene', function () {
        var oldScene = new cc.Scene();
        cc.director.runSceneImmediate(oldScene);

        var globalNode = new cc.Node();
        globalNode.parent = oldScene;
        var childNode = new cc.Node();
        childNode.parent = globalNode;

        cc.game.addPersistRootNode(globalNode);

        var newScene = cc.deserialize(Editor.serialize(new cc.Scene(), {stringify: false}));

        cc.director.runSceneImmediate(newScene);

        ok(globalNode.parent === newScene, 'persist node should not be destoryed automatically when loading a new scene');
    });
})();
