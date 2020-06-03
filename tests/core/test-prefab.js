(function () {

    if (!TestEditorExtends) {
        return;
    }

    //var testingCompCallback = false;

    var MyComponent = cc.Class({
        name: '45664564',
        extends: CallbackTester,
        editor: {
            executeInEditMode: true
        },
        //_assert: function (actual) {
        //    if (testingCompCallback) {
        //        this._super(actual);
        //    }
        //}
    });

    largeModule('Prefab', {
        setup: function () {
            _resetGame();
            AssetLibrary.init({libraryPath: '../assets/library'});
        },
        //teardownOnce: function () {
        //    console.log('teardownOnce');
        //    //testNode.destroy();
        //    cc.js.unregisterClass(MyComponent);
        //}
    });

    test('basic test', function() {
        var node = new cc.Node();
        ok(node.hasOwnProperty('_prefab'), '"_prefab" defines in node');
        ok(!node._prefab, "but the default value should be null");
    });

    var UUID = '19851210';
    var DEBUG_SERIALIZED_PREFAB = 0 && !isPhantomJS;

    var parent = new cc.Node('parent');
    var child = new cc.Node('child');
    var child2 = new cc.Node('child2');
    child2.addComponent(MyComponent);
    var otherNode = new cc.Node('other');

    child.parent = parent;
    child2.parent = parent;
    parent.scale = cc.v2(123, 432);
    child.scale = cc.v2(22, 11);
    var ensureIdInitialized = parent.uuid;
    var comp = parent.addComponent(TestScript);
    comp.target = child;
    comp.target2 = otherNode;

    var prefab;
    var prefabJson;

    (function savePrefab () {
        // var PrefabUtils = Editor.require('scene://utils/prefab');
        // prefab = PrefabUtils.createPrefabFrom(parent);
        // prefab._uuid = UUID;
        //PrefabUtils.setPrefabAsset(parent, prefab);

        // 重新生成已经加载好的 prefab，去除类型，去除 runtime node
        prefabJson = EditorExtends.serialize(prefab);
        if (DEBUG_SERIALIZED_PREFAB) {
            console.log(prefabJson);
        }
        prefab = cc.deserialize(prefabJson);
        prefab._uuid = UUID;
    })();

    test('prefab info', function () {
        var prefabInfo = parent._prefab;

        ok(prefab !== null, "prefab asset should be created");
        ok(prefabInfo !== null, "wrapper should preserve the prefab info");
        ok(prefabInfo.asset instanceof cc.Asset, "the prefab asset should be preserved");
        strictEqual(prefabInfo.root, parent,"the parent prefab's root should be itself");
        strictEqual(prefabInfo.asset._uuid, UUID, "the prefab asset should be preserved");
    });

    test('saved prefab node', function () {
        var nodeToSave = prefab.data;
        ok(cc.Node.isNode(nodeToSave), 'Checking prefab data');
        strictEqual(nodeToSave.scaleX, 123, 'Checking prefab data');
        strictEqual(nodeToSave.scaleY, 432, 'Checking prefab data');
        var comp = nodeToSave.getComponent(TestScript);
        ok(comp.constructor === TestScript, 'Should save component');
        ok(comp.target === nodeToSave.children[0], 'Should redirect node property when saving');
        ok(comp.target2 === null, 'Should not save other nodes in the scene');

        var childToSave = nodeToSave.children[0];
        ok(childToSave, 'Should save child');
        strictEqual(childToSave.scaleX, 22, 'Checking child wrapper');
        strictEqual(childToSave.scaleY, 11, 'Checking child wrapper');

        // change parent

        child2.parent = null;
        strictEqual(child2._prefab, null, 'Prefab info should be cleared if detached from parent');
    });

    test('asset reference in prefab info', function () {
        var node = prefab.data;
        strictEqual(node._prefab.asset, prefab, "should reference to the main asset directly");
    });

    test('instantiate prefab', function () {
        var newNode = cc.instantiate(prefab);
        var newNode2 = cc.instantiate(prefab);
        var prefabInfo = newNode._prefab;

        ok(newNode, "new node should be created");
        ok(prefabInfo, "new node should preserve the prefab info");
        ok(prefabInfo.asset === prefab, "should reference to origin prefab asset in prefab info");
        notEqual(newNode, newNode2, 'The new nodes should be different');

        ok(cc.Node.isNode(newNode), 'Checking instance');
        notEqual(newNode.uuid, newNode2.uuid, 'The id of instances should be different');
        ok(newNode.scaleX === 123, 'Checking instance');
        ok(newNode.scaleY === 432, 'Checking instance');
        ok(newNode.getComponent(TestScript).constructor === TestScript, 'Should restore component');
        ok(newNode.getComponent(TestScript).target === newNode.children[0], 'Should restore component property');

        ok(newNode.children.length === 2, 'Should load child');
        var c = newNode.children[0];
        ok(c.scaleX === 22 && c.scaleY === 11, 'Checking child');
    });

    test('re-instantiate an instantiated node', function () {
        var first = cc.instantiate(prefab);
        var second = cc.instantiate(first);
        var secondInfo = second._prefab;

        ok(second, "new node should be created");
        ok(secondInfo, "new node should preserve the prefab info");
        ok(secondInfo !== first._prefab, "prefab info should not the same");
        ok(secondInfo.asset === prefab, "should reference to origin prefab asset in prefab info");
        ok(secondInfo.root === second, "check root");
        ok(secondInfo.fileId === first._prefab.fileId, "check fileId");

        notEqual(first.uuid, second.uuid, 'The id of instances should be different');
    });

    test('apply node', function () {
        // var newNode = cc.instantiate(prefab);
        // var PrefabUtils = Editor.require('scene://utils/prefab');
        // var newPrefab = PrefabUtils.createAppliedPrefab(newNode);
        // strictEqual(newPrefab.data._prefab.fileId, prefab.data._prefab.fileId, "fileId should not changed during apply");
    });

    asyncTest('revert prefab', function () {
        // stub
        cc.loader.insertPipe({
            id : 'Prefab_Provider',
            async : false,
            handle : function (item) {
                var url = item.uuid;
                if (url === UUID) {
                    item.states[cc.Pipeline.AssetLoader.ID] = cc.Pipeline.ItemState.COMPLETE;
                    item.states[cc.Pipeline.Downloader.ID] = cc.Pipeline.ItemState.COMPLETE;
                    return JSON.stringify(prefabJson);
                }
                else {
                    return null;
                }
            }
        }, 0);

        var testNode = cc.instantiate(prefab);
        var testChild = testNode.children[0];

        testNode.x += 1;
        testNode.scale = 0;
        testNode.removeComponent(TestScript);
        testNode.children[1].parent = null;

        var originParent = testNode.parent = new cc.Node();
        var outsideComp = originParent.addComponent(TestScript);
        outsideComp.target = originParent;

        testChild.x += 1;
        testChild.scale = cc.Vec2.ZERO;
        testChild.addComponent(TestScript);

        var newNode = new cc.Node();
        newNode.parent = testChild;

        var newNode2 = new cc.Node();
        testNode.insertChild(newNode2, 0);

        // var PrefabUtils = Editor.require('scene://utils/prefab');
        // PrefabUtils.revertPrefab(testNode, function () {
        //     ok(testNode.x != prefab.data.x, 'Should not revert root position');
        //     ok(testNode.scaleX === 123 && testNode.scaleY === 432, 'Revert property of the parent node');
        //     ok(testNode.getComponent(TestScript).constructor === TestScript, 'Restore removed component');
        //     ok(testNode.parent === originParent, 'parent should not changed');
        //     ok(testNode.parent.getComponent(TestScript).target === originParent, 'component property of parent should not changed');

        //     ok(testChild.x === prefab.data.children[0].x, 'Revert child position');
        //     ok(testChild.scaleX === 22 && testChild.scaleY === 11, 'Revert child node');
        //     ok(testChild.getComponent(TestScript) == null, 'Remove added component');

        //     ok(testNode.getComponent(TestScript).target === testChild, 'Should redirect reference to scene node');

        //     strictEqual(testChild.children.length, 0, 'Should remove new node');

        //     strictEqual(testNode.childrenCount, 2, 'Should create removed node');
        //     var created = testNode.children[1];

        //     var comp = created.getComponent(MyComponent);
        //     comp.resetExpect(CallbackTester.OnLoad, 'call onLoad while attaching to node');
        //     comp.pushExpect(CallbackTester.OnEnable, 'then call onEnable if node active');

        //     cc.director.getScene().addChild(testNode.parent);

        //     comp.stopTest();

        //     strictEqual(newNode2.isValid, false, 'should remove new node which is not the last sibling');

        //     start();
        // });
    });
})();
