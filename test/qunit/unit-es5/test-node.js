// jshint ignore: start

largeModule('Node', SetupEngine);

test('basic test', function () {
    var node = new cc.Node();
    ok(node.name, 'node has default name');
    strictEqual(new cc.Node('myNode').name, 'myNode', 'can specify node name');

    strictEqual(node.active, true, 'node is active');

    node.active = false;

    strictEqual(node.active, false, 'node is deactive');

    node._destroyImmediate();
    strictEqual(node.isValid, false, 'node can be destoryed');
});

test('test hierarchy', function () {
    var parent = new cc.Node();
    var child1 = new cc.Node();
    var child2 = new cc.Node();

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

test('test walk', function () {
    var A = new cc.Node('A');
    var B = new cc.Node('B');
    var C = new cc.Node('C');
    var D = new cc.Node('D');
    var E = new cc.Node('E');
    var F = new cc.Node('F');
    var G = new cc.Node('G');
    var H = new cc.Node('H');
    var I = new cc.Node('I');
    // A
    // |
    // B-C
    // |
    // D-E-F
    //  /  |
    // G-H I
    B.parent = A;
    C.parent = A;
    D.parent = B;
    E.parent = B;
    F.parent = B;
    G.parent = E;
    H.parent = E;
    I.parent = F;
    
    var walkHistory = '';
    A.walk(function (node) {
        walkHistory += node.name;
    }, function (node) {
        walkHistory += node.name + '*';
    });

    strictEqual(walkHistory, 'ABDD*EGG*HH*E*FII*F*B*CC*A*', 'walk history should be the same as predicted');
});

test('activeInHierarchy', function () {
    var parent = new cc.Node();
    var child = new cc.Node();
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

test('activeInHierarchy should be false after destroy', function () {
    var parent = new cc.Node();
    var child = new cc.Node();
    child.parent = parent;

    cc.director.getScene().addChild(parent);

    parent.destroy();
    cc.game.step();

    strictEqual(parent.activeInHierarchy, false, 'parent should not activeInHierarchy after destroy');
    strictEqual(child.activeInHierarchy, false, 'child should not activeInHierarchy after destroy');
});

test('nodes should be destroyed with the scene', function () {
    var child = new cc.Node();
    var scene = cc.director.getScene();
    child.parent = scene;

    cc.director.runSceneImmediate(new cc.Scene());

    strictEqual(child.activeInHierarchy, false, 'nodes should not activeInHierarchy after destroy');
    strictEqual(child.isValid, false, 'nodes should be destroyed with the scene');
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

    var obj = new cc.Node();
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

test('get self components', function () {

    var MyComponent = cc.Class({
        name: 'MyComponent',
        extends: cc.Component
    });

    var obj = new cc.Node("New Node 1");
    cc.director.getScene().addChild(obj);
    obj.addComponent(MyComponent);
    obj.addComponent(MyComponent);
    obj.addComponent(MyComponent);

    //-- layer 1
    var obj1 = new cc.Node("New Node 2");
    obj1.parent = obj;

    var obj2 = new cc.Node("New Node 3");
    var comp = obj2.addComponent(MyComponent);
    obj2.parent = obj1;

    //-- layer 2
    var obj3 = new cc.Node("New Node 4");
    obj3.parent = obj2;

    var obj4 = new cc.Node("New Node 5");
    obj4.addComponent(MyComponent);
    obj4.parent = obj3;

    ok(obj.getComponents(MyComponent).length === 3, 'getComponents: can get my component array');
    ok(obj.getComponentInChildren(MyComponent) === comp, 'getComponentInChildren: can get my component in children');
    ok(obj.getComponentsInChildren(MyComponent).length === 5, 'getComponentsInChildren: can get my components in children and self');

    cc.js.unregisterClass(MyComponent);
});


test('should not include self component', function () {
    var MyComponent = cc.Class({
        name: 'MyComponent',
        extends: cc.Component
    });

    var obj = new cc.Node("New Node");
    cc.director.getScene().addChild(obj);
    obj.addComponent(MyComponent);
    obj.addComponent(MyComponent);
    obj.addComponent(MyComponent);

    var obj1 = new cc.Node("New Node 1");
    obj1.parent = obj;

    ok(obj.getComponentInChildren(MyComponent) === null, 'getComponentInChildren should not include self component');

    cc.js.unregisterClass(MyComponent);
});

test('should include self component', function () {
    var MyComponent = cc.Class({
        name: 'MyComponent',
        extends: cc.Component
    });

    var obj = new cc.Node("New Node");
    cc.director.getScene().addChild(obj);
    obj.addComponent(MyComponent);
    obj.addComponent(MyComponent);
    obj.addComponent(MyComponent);

    var obj1 = new cc.Node("New Node 1");
    obj1.parent = obj;

    ok(obj.getComponentsInChildren(MyComponent).length === 3, 'getComponentsInChildren should include self component');

    cc.js.unregisterClass(MyComponent);
});

test('destroy', function () {
    var parent = new cc.Node();
    var child = new cc.Node();
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
    var newChildNode = new cc.Node();
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
    var ent1 = new cc.Node();
    var ent2 = new cc.Node();
    var ent3 = new cc.Node();

    ent1.addChild(ent2);
    ent2.addChild(ent3);

    strictEqual(ent1.isChildOf(ent2), false, 'not a child of its children');
    strictEqual(ent1.isChildOf(ent1), true, 'is child of itself');
    strictEqual(ent2.isChildOf(ent1), true, 'is child of its parent');
    strictEqual(ent3.isChildOf(ent1), true, 'is child of its ancestor');
});


test('attach events', function () {
    var scene = cc.director.getScene();
    var parent = new cc.Node();
    var child = new cc.Node();

    var attachedNodes = {};

    var onAttach = cc.engine.on('node-attach-to-scene', function (node) {
        if (node.uuid in attachedNodes) {
            ok(false, 'already attached!');
        }
        attachedNodes[node.uuid] = true;
    });
    var onDetach = cc.engine.on('node-detach-from-scene', function (node) {
        if (!(node.uuid in attachedNodes)) {
            ok(false, 'not yet attached!');
        }
        delete attachedNodes[node.uuid];
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

test('getBoundingBox', function () {
    var node = new cc.Node();
    node.anchorX = 0.5;
    node.anchorY = 0.5;
    node.width = 10;
    node.height = 20;

    deepEqual(node.getBoundingBox(), cc.rect(-5, -10, 10, 20), 'should compute anchor');
});
