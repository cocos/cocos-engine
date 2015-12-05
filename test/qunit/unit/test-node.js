// jshint ignore: start

largeModule('Node', SetupEngine);

test('basic test', function () {
    var node = new cc.ENode();
    ok(node.name, 'node has default name');
    strictEqual(new cc.ENode('myNode').name, 'myNode', 'can specify node name');

    strictEqual(node.active, true, 'node is active');

    node.active = false;

    strictEqual(node.active, false, 'node is deactive');

    node._destroyImmediate();
    strictEqual(node.isValid, false, 'node can be destoryed');
});

test('test hierarchy', function () {
    var parent = new cc.ENode();
    var child1 = new cc.ENode();
    var child2 = new cc.ENode();

    strictEqual(parent.parent, null, 'node\'s default parent is null');
    strictEqual(parent.childrenCount, 0, 'node\'s default child count is 0');

    child1.parent = parent;
    ok(child1.parent === parent, 'can get/set parent');
    strictEqual(parent.childrenCount, 1, 'child count increased to 1');
    ok(parent.children[0] === child1, 'can get child1');

    child2.parent = parent;
    strictEqual(parent.childrenCount, 2, 'child count increased to 2');
    ok(parent.children[1] === child2, 'can get child2');

    child1.destroy();

    FO._deferredDestroy();

    strictEqual(parent.childrenCount, 1, 'child count should return to 1');
    ok(parent.children[0] === child2, 'only child2 left');

    child2.parent = null;
    strictEqual(parent.childrenCount, 0, 'child2 detached');

    parent.addChild(child2);
    strictEqual(parent.childrenCount, 1, 'child2 attached by using addChild');
});

test('activeInHierarchy', function () {
    var parent = new cc.ENode();
    var child = new cc.ENode();
    child.parent = parent;

    strictEqual(parent.activeInHierarchy, false, 'parent should not activeInHierarchy before add to scene');
    strictEqual(child.activeInHierarchy, false, 'child should not activeInHierarchy before add to scene');

    cc.director.getScene().addChild(parent);

    strictEqual(parent.activeInHierarchy, true, 'parent should become activeInHierarchy after add to scene');
    strictEqual(child.activeInHierarchy, true, 'child should become activeInHierarchy after add to scene');

    child.active = false;

    strictEqual(parent.activeInHierarchy, true, 'parent unchanged');
    strictEqual(child.activeInHierarchy, false, 'child deactiveInHierarchy');

    parent.active = false;

    strictEqual(parent.activeInHierarchy, false, 'parent deactiveInHierarchy');
    strictEqual(child.activeInHierarchy, false, 'child still deactiveInHierarchy');

    child.active = true;

    strictEqual(parent.activeInHierarchy, false, 'parent unchanged');
    strictEqual(child.activeInHierarchy, false, 'child deactiveInHierarchy because parent deactived');

    parent.active = true;

    strictEqual(parent.activeInHierarchy, true, 'parent become activeInHierarchy');
    strictEqual(child.activeInHierarchy, true, 'child become activeInHierarchy because parent actived');

    parent.removeFromParent();

    strictEqual(parent.activeInHierarchy, false, 'parent should not activeInHierarchy after remove from scene');
    strictEqual(child.activeInHierarchy, false, 'child should not activeInHierarchy after remove from scene');
});

test('activation logic for component', function () {
    // 这里主要测试node，不是测试component

    // my component
    var MyComponentBase = cc.Class({
        name: 'MyComponentBase',
        extends: CallbackTester,
        editor: {
            executeInEditMode: true
        },
    });

    var MyComponent = cc.Class({
        name: 'MyComponent',
        extends: MyComponentBase,
        ctor: function () {
            this.expect(CallbackTester.OnLoad, 'call onLoad while attaching to node');
            this.expect(CallbackTester.OnEnable, 'then call onEnable if node active', true);
        },
        start: function () {
            this._assert(MyComponent.start);
        },
        update: null,
        lateUpdate: null
    });
    MyComponent.start = "MyCompStart";

    var obj = new cc.ENode();
    cc.director.getScene().addChild(obj);

    var comp = obj.addComponent(MyComponent); // onEnable
    comp.expect(MyComponent.start, 'call start after onEnable');
    cc.game.step();
    comp.notExpect(MyComponent.start, 'start should be called only once');
    cc.game.step();

    strictEqual(comp.node, obj, 'can get node from component');

    comp.expect(CallbackTester.OnDisable);
    obj.active = false; // onDisable

    comp.expect(CallbackTester.OnEnable);
    obj.active = true;  // onEnable

    //strictEqual(obj.getComponent(cc.Transform), obj.transform, 'getComponent: can get transform');
    ok(obj.getComponent(MyComponent) === comp, 'getComponent: can get my component');
    ok(obj.getComponent(cc.js.getClassName(MyComponent)) === comp, 'getComponent: can get my component by name');
    ok(obj.getComponent(MyComponentBase) === comp, 'getComponent: can get component by base type');
    ok(obj.getComponent(cc.js.getClassName(MyComponentBase)) === comp, 'getComponent: can get component by base name');

    comp.expect(CallbackTester.OnDisable, 'should called onDisable when destory');
    comp.destroy();     // onDisable

    strictEqual(obj.getComponent(MyComponent), comp, 'can still get component in this frame');

    comp.expect(CallbackTester.OnDestroy);
    FO._deferredDestroy();    // onDestroy

    strictEqual(obj.getComponent(MyComponent), null, 'can not get component after this frame');

    comp.stopTest();

    cc.js.unregisterClass(MyComponent, MyComponentBase);
});

test('life cycle logic for component', function () {
    // my component
    var MyComponent = cc.Class({
        name: 'MyComponent',
        extends: CallbackTester,
        editor: {
            executeInEditMode: true
        },
        ctor: function () {
            this.expect(CallbackTester.OnLoad, 'call onLoad while attaching to node');
            this.expect(CallbackTester.OnEnable, 'then call onEnable if node active', true);
        }
    });

    var obj = new cc.ENode();
    cc.director.getScene().addChild(obj);

    var comp = obj.addComponent(MyComponent); // onEnable

    comp.expect(CallbackTester.start, 'call start after onEnable');
    comp.expect(CallbackTester.update, 'first update call', true);
    comp.expect(CallbackTester.lateUpdate, 'first lateUpdate call', true);
    cc.game.step();

    comp.expect(CallbackTester.update, 'second update call');
    comp.expect(CallbackTester.lateUpdate, 'second lateUpdate call', true);
    cc.game.step();

    comp.expect(CallbackTester.update, 'third update call');
    comp.expect(CallbackTester.lateUpdate, 'third lateUpdate call', true);
    cc.game.step();

    comp.expect(CallbackTester.OnDisable, 'disabled entity');
    obj.active = false; // onDisable
    comp.notExpect(CallbackTester.update, 'inactive component shouldn\'t have update call back');
    comp.notExpect(CallbackTester.lateUpdate, 'inactive component shouldn\'t have lateUpdate call back', true);
    cc.game.step();

    comp.expect(CallbackTester.OnEnable, 're-enabled entity');
    obj.active = true;  // onEnable
    comp.expect(CallbackTester.update, 'fourth update call');
    comp.expect(CallbackTester.lateUpdate, 'fourth lateUpdate call', true);
    cc.game.step();

    comp.expect(CallbackTester.OnDisable, 'disabled entity');
    obj.active = false;
    comp.onEnable = function () {
        this._assert(CallbackTester.OnEnable);
        comp.notExpect(CallbackTester.OnEnable, 'onEnable should only be called once');
        this.enabled = true;
    }
    comp.expect(CallbackTester.OnEnable, 'onEnable should be called once after entity active');
    obj.active = true;

    comp.stopTest();

    cc.js.unregisterClass(MyComponent);
});

test('activation logic for component in hierarchy', function () {
    var parent = new cc.ENode();
    var child = new cc.ENode();
    child.parent = parent;
    parent.active = false;
    parent.parent = cc.director.getScene();

    var MyComponent = cc.Class({
        extends: CallbackTester,
        editor: {
            executeInEditMode: true
        },
        ctor: function () {
            this.notExpect(CallbackTester.OnLoad, 'should not call onLoad while node inactive');
        }
    });

    var comp = child.addComponent(MyComponent);

    comp.expect(CallbackTester.OnLoad, 'should call onLoad while node activated');
    comp.expect(CallbackTester.OnEnable, 'should enable when parent become active', true);
    parent.active = true;

    comp.expect(CallbackTester.OnDisable, 'should disable when parent become inactive');
    parent.active = false;

    comp.expect(CallbackTester.OnEnable, 'should enable when parent become active');
    parent.active = true;

    comp.expect(CallbackTester.OnDisable, 'should disable when node detached from its parent');
    child.parent = null;

    var activeParent = new cc.ENode();
    activeParent.parent = cc.director.getScene();
    comp.expect(CallbackTester.OnEnable, 'should enable when add to active parent');
    child.parent = activeParent;

    var inactiveParent = new cc.ENode();
    inactiveParent.active = false;
    inactiveParent.parent = cc.director.getScene();
    comp.expect(CallbackTester.OnDisable, 'should disable when add to inactive parent');
    child.parent = inactiveParent;

    comp.stopTest();
});

test('destroy', function () {
    var parent = new cc.ENode();
    var child = new cc.ENode();
    parent.addChild(child);
    cc.director.getScene().addChild(parent);

    // add child component
    var ChildComp = cc.Class({
        extends: CallbackTester,
        editor: {
            executeInEditMode: true
        },
        ctor: function () {
            this.expect([CallbackTester.OnLoad, CallbackTester.OnEnable]);
        }
    });
    var childComp = child.addComponent(ChildComp);

    // expect ondisable
    childComp.expect(CallbackTester.OnDisable, 'should disable while destroy parent');
    childComp.notExpect(CallbackTester.OnDestroy, 'can not destroyed before the end of this frame');

    // call destroy
    parent.destroy();

    childComp.notExpect(CallbackTester.OnDisable, 'child comp should only disabled once');
    childComp.notExpect(CallbackTester.OnEnable, 'child component should not re-enable when parent destroying');
    childComp.expect(CallbackTester.OnDestroy, 'should destroyed at the end of frame');

    // try add component after destroy

    var ChildComp_new = cc.Class({
        extends: CallbackTester,
        ctor: function () {
            this.expect(CallbackTester.OnLoad, 'new child component should onLoad even if added after destroy');
            this.expect(CallbackTester.OnEnable, 'new child component should enable even if added after destroy', true);
            this.expect(CallbackTester.OnDisable, 'new component\'s onDisable should be called before its onDestroy', true);
            this.expect(CallbackTester.OnDestroy, 'new component should also destroyed at the end of frame', true);
        }
    });
    var childComp_new = child.addComponent(ChildComp_new);

    var NewParentComp = cc.Class({
        extends: CallbackTester,
        ctor: function () {
            this.expect([CallbackTester.OnLoad,
                         CallbackTester.OnEnable,
                         CallbackTester.OnDisable,
                         CallbackTester.OnDestroy]);
        }
    });
    var newParentComp = parent.addComponent(NewParentComp);

    // try add child after destroy

    var NewChildNodeComp = cc.Class({
        extends: CallbackTester,
        ctor: function () {
            this.expect([CallbackTester.OnLoad,
                         CallbackTester.OnEnable,
                         CallbackTester.OnDisable,
                         CallbackTester.OnDestroy]);
        }
    });
    var newChildNode = new cc.ENode();
    parent.addChild(newChildNode);
    var newChildNodeComp = newChildNode.addComponent(NewChildNodeComp);

    // do destory

    FO._deferredDestroy();

    strictEqual(childComp_new.isValid, false, 'node will finally destroyed with its component which added after calling destroy');
    strictEqual(childComp.isValid, false, 'node will destroyed with its child components');
    strictEqual(child.isValid, false, 'node will destroyed with its children');
    strictEqual(newChildNode.isValid, false, 'node will destroyed with its new children');

    childComp.stopTest();
    childComp_new.stopTest();
    newParentComp.stopTest();
    newChildNodeComp.stopTest();
});

test('isChildOf', function () {
    var ent1 = new cc.ENode();
    var ent2 = new cc.ENode();
    var ent3 = new cc.ENode();

    ent1.addChild(ent2);
    ent2.addChild(ent3);

    strictEqual(ent1.isChildOf(ent2), false, 'not a child of its children');
    strictEqual(ent1.isChildOf(ent1), true, 'is child of itself');
    strictEqual(ent2.isChildOf(ent1), true, 'is child of its parent');
    strictEqual(ent3.isChildOf(ent1), true, 'is child of its ancestor');
});


test('attach events', function () {
    var scene = cc.director.getScene();
    var parent = new cc.ENode();
    var child = new cc.ENode();

    var attachedNodes = {};

    var onAttach = cc.engine.on('node-attach-to-scene', function (event) {
        if (event.detail.target.uuid in attachedNodes) {
            ok(false, 'already attached!');
        }
        attachedNodes[event.detail.target.uuid] = true;
    });
    var onDetach = cc.engine.on('node-detach-from-scene', function (event) {
        if (!(event.detail.target.uuid in attachedNodes)) {
            ok(false, 'not yet attached!');
        }
        delete attachedNodes[event.detail.target.uuid];
    });

    child.parent = parent;

    strictEqual(child.uuid in attachedNodes, false, 'child node should not attach scene if parent also detached');

    parent.parent = scene;

    strictEqual(parent.uuid in attachedNodes, true, 'parent node should attach to scene');
    strictEqual(child.uuid in attachedNodes, true, 'child node should attach to scene');

    parent.parent = null;

    strictEqual(parent.uuid in attachedNodes, false, 'child node should also detached if parent become detached');
    strictEqual(child.uuid in attachedNodes, false, 'parent node should detached');

    cc.engine.off('node-attach-to-scene', onAttach);
    cc.engine.off('node-detach-from-scene', onDetach);
});
