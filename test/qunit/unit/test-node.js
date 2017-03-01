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

    var obj = new cc.Node();
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
    };
    comp.expect(CallbackTester.OnEnable, 'onEnable should be called once after entity active');
    obj.active = true;

    comp.stopTest();

    cc.js.unregisterClass(MyComponent);
});

test('activation logic for component in hierarchy', function () {
    var parent = new cc.Node();
    var child = new cc.Node();
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

    var activeParent = new cc.Node();
    activeParent.parent = cc.director.getScene();
    comp.expect(CallbackTester.OnEnable, 'should enable when add to active parent');
    child.parent = activeParent;

    var inactiveParent = new cc.Node();
    inactiveParent.active = false;
    inactiveParent.parent = cc.director.getScene();
    comp.expect(CallbackTester.OnDisable, 'should disable when add to inactive parent');
    child.parent = inactiveParent;

    comp.stopTest();
});

(function () {

    var StillInvokeRestCompsOnSameNode = false;
    var StillInvokeOnEnableOnSameComp = false;
    if (StillInvokeRestCompsOnSameNode) {
        strictEqual(StillInvokeOnEnableOnSameComp, true);
    }

    function createNormalComp (node) {
        var comp = node.addComponent(cc.Component);
        comp.onLoad = new Callback().enable();
        comp.onEnable = new Callback(function () {
            this.onDisable.enable();
        }).enable();
        comp.onDisable = new Callback().disable('onDisable should called after onEnable');
        comp.start = new Callback().disable('all start should not be called (deactivated)');
        comp.update = new Callback().disable('all update should not be called (deactivated)');
        return comp;
    }

    function createOnlyOnLoadComp (node, name) {
        var comp = node.addComponent(cc.Component);
        comp.onLoad = new Callback().enable();
        comp.onEnable = new Callback().disable('onEnable of ' + name + ' component should not be called (deactivated)');
        comp.onDisable = new Callback().disable('onDisable of ' + name + ' component should not be called (deactivated)');
        comp.start = new Callback().disable('all start should not be called (deactivated)');
        comp.update = new Callback().disable('all update should not be called (deactivated)');
        return comp;
    }

    function createDisabledComp (node, name) {
        var comp = node.addComponent(cc.Component);
        comp.onLoad = new Callback().disable('onLoad of ' + name + ' component should not be called (deactivated)');
        comp.onEnable = new Callback().disable('onEnable of ' + name + ' component should not be called (deactivated)');
        comp.start = new Callback().disable('start of ' + name + ' component should not be called (deactivated)');
        comp.update = new Callback().disable('update of ' + name + ' component should not be called (deactivated)');
        return comp;
    }

    function compShouldBeActivated (comp, name) {
        comp.onLoad.once('onLoad of ' + name + ' component should be called').disable();
        comp.onEnable.once('onEnable of ' + name + ' component should be called').disable();
        comp.onDisable.once('onDisable of ' + name + ' component should be called').disable();
    }

    test('could deactivate self node in onLoad', function () {
        var node = new cc.Node();

        var previousComp = createOnlyOnLoadComp(node, 'previous');

        var testComp = node.addComponent(cc.Component);
        testComp.onLoad = function () {
            this.node.active = false;
        };
        testComp.onEnable = new Callback().disable(
            'onEnable of testing component should not be called (deactivated)');
        testComp.onDisable = new Callback().disable(
            'onDisable of testing component should not be called (deactivated)');
        testComp.update = new Callback().disable('update of testing component should not be called (deactivated)');

        var restComp;
        if (StillInvokeRestCompsOnSameNode) {
            restComp = createNormalComp(node);
        }
        else {
            restComp = createDisabledComp(node, 'rest');
        }

        node.runAction(cc.delayTime(0));
        cc.director.getScene().addChild(node);

        strictEqual(node.active, false, 'node should be deactivated');
        strictEqual(cc.director.getActionManager().isTargetPaused_TEST(node), true, 'action should be paused');
        previousComp.onLoad.once('onLoad of previous component should be called').disable();

        if (StillInvokeRestCompsOnSameNode) {
            compShouldBeActivated(restComp, 'rest');
        }

        cc.game.step();
    });

    test('could deactivate parent in onLoad if activate from parent to child', function () {
        strictEqual(StillInvokeRestCompsOnSameNode, false, 'test cases not implemented if "StillInvokeRestCompsOnSameNode"');

        var nodes = createNodes({
            prevNode: {},
            testerNode: {
                comment: 'the node that tester component attached',
                child: {}
            },
            nextNode: {}
        });
        var parentToDeactivate = nodes.root;
        var prevNode = nodes.prevNode;
        var testerNode = nodes.testerNode;
        var nextNode = nodes.nextNode;
        var child = nodes.child;

        // init parent
        var compOfParent = createOnlyOnLoadComp(parentToDeactivate, 'parent');

        // init prevNode
        var compOfPrevNode = createOnlyOnLoadComp(prevNode, 'previous node\'s');

        // init nextNode
        createDisabledComp(nextNode, 'next node\'s');

        // init node
        var previousComp = createOnlyOnLoadComp(testerNode, 'previous');
        var testComp = testerNode.addComponent(cc.Component);
        testComp.onLoad = function () {
            // deactivate parent
            parentToDeactivate.active = false;
        };
        testComp.onEnable = new Callback().disable(
            'onEnable of testing component should not be called (deactivated)');
        testComp.onDisable = new Callback().disable(
            'onDisable of testing component should not be called (deactivated)');
        testComp.update = new Callback().disable('update of testing component should not be called (deactivated)');

        var restComp;
        if (StillInvokeRestCompsOnSameNode) {
            restComp = createNormalComp(testerNode);
        }
        else {
            restComp = createDisabledComp(testerNode, 'rest');
        }

        // init child
        createDisabledComp(child, 'child');

        // ACTIVATE
        parentToDeactivate.runAction(cc.delayTime(0));
        testerNode.runAction(cc.delayTime(0));
        cc.director.getScene().addChild(parentToDeactivate);

        // test

        strictEqual(parentToDeactivate.active, false, 'parent should be deactivated');
        strictEqual(cc.director.getActionManager().isTargetPaused_TEST(parentToDeactivate), true, 'parent\'s action should be paused');
        strictEqual(testerNode.active, true, 'node should active by self');
        strictEqual(testerNode.activeInHierarchy, false, 'node should not active in hierarchy');
        strictEqual(cc.director.getActionManager().isTargetPaused_TEST(testerNode), true, 'node\'s action should be paused');
        compOfParent.onLoad.once('onLoad of parent node\'s component should be called').disable();
        compOfPrevNode.onLoad.once('onLoad of previous node\'s component should be called').disable();
        previousComp.onLoad.once('onLoad of previous component should be called').disable();

        if (StillInvokeRestCompsOnSameNode) {
            compShouldBeActivated(restComp, 'rest');
        }

        cc.game.step();
    });

    // test('could deactivate parent in onLoad', function () {
    //     strictEqual(StillInvokeRestCompsOnSameNode, false, 'test cases not implemented if "StillInvokeRestCompsOnSameNode"');
    //     strictEqual(StillInvokeOnEnableOnSameComp, false, 'test cases not implemented if "StillInvokeOnEnableOnSameComp"');
    //
    //     var nodes = createNodes({
    //         prevNode: {},
    //         testerNode: {
    //             comment: 'the node that tester component attached',
    //             child: {}
    //         },
    //         nextNode: {}
    //     });
    //     var parentToDeactivate = nodes.root;
    //     var prevNode = nodes.prevNode;
    //     var testerNode = nodes.testerNode;
    //     var nextNode = nodes.nextNode;
    //     var child = nodes.child;
    //
    //     // init parent
    //     createDisabledComp(parentToDeactivate, 'parent component');
    //
    //     // init prevNode
    //     var compOfPrevNode = createNormalComp(prevNode);
    //
    //     // init nextNode
    //     createDisabledComp(nextNode, 'next node\'s');
    //
    //     // init node
    //     var previousComp = createNormalComp(testerNode);
    //     var testComp = testerNode.addComponent(cc.Component);
    //     testComp.onLoad = function () {
    //         // deactivate parent
    //         parentToDeactivate.active = false;
    //     };
    //     if (StillInvokeOnEnableOnSameComp) {
    //         testComp.onEnable = new Callback(function () {
    //             this.onDisable.enable();
    //         }).enable();
    //         testComp.onDisable = new Callback().disable('onDisable should called after onEnable');
    //     }
    //     else {
    //         testComp.onEnable = new Callback().disable(
    //             'onEnable of testing component should not be called (deactivated)');
    //         testComp.onDisable = new Callback().disable(
    //             'onDisable of testing component should not be called (deactivated)');
    //     }
    //     testComp.update = new Callback().disable('update of testing component should not be called (deactivated)');
    //
    //     var restComp;
    //     if (StillInvokeRestCompsOnSameNode) {
    //         restComp = createNormalComp(testerNode);
    //     }
    //     else {
    //         restComp = createDisabledComp(testerNode, 'rest');
    //     }
    //
    //     // init child
    //     var childComp = createNormalComp(child);
    //
    //     // ACTIVATE
    //     cc.director.getScene().addChild(parentToDeactivate);
    //
    //     // test
    //
    //     strictEqual(parentToDeactivate.active, false, 'parent should be deactivated');
    //     strictEqual(testerNode.active, true, 'node should be deactivated');
    //     compShouldBeActivated(childComp, 'child node\'s');
    //     compShouldBeActivated(compOfPrevNode, 'previous node\'s');
    //     compShouldBeActivated(previousComp, 'previous');
    //
    //     if (StillInvokeOnEnableOnSameComp) {
    //         testComp.onEnable.once('onEnable of test component should still be called').disable();
    //         testComp.onDisable.once('onDisable of test component should still be called').disable();
    //     }
    //
    //     if (StillInvokeRestCompsOnSameNode) {
    //         compShouldBeActivated(restComp, 'rest');
    //     }
    //
    //     cc.game.step();
    // });

    test('could deactivate self node in onEnable', function () {
        var node = new cc.Node();
        //////
        var previousComp = createNormalComp(node);

        var testComp = node.addComponent(cc.Component);
        testComp.onEnable = new Callback(function () {
            this.node.active = false;
        }).enable();

        testComp.update = new Callback().disable('update of testing component should not be called (deactivated)');

        var restComp;
        if (StillInvokeRestCompsOnSameNode) {
            restComp = createNormalComp(node);
        }
        else {
            restComp = createOnlyOnLoadComp(node, 'rest');
        }

        var child = new cc.Node();
        createOnlyOnLoadComp(child, 'child');
        child.parent = node;

        cc.director.getScene().addChild(node);

        strictEqual(node.active, false, 'node should be deactivated');
        compShouldBeActivated(previousComp, 'previous');

        testComp.onEnable.once('onEnable of test component should be called').disable();

        if (StillInvokeRestCompsOnSameNode) {
            compShouldBeActivated(restComp, 'rest');
        }

        cc.game.step();
    });
})();

test('life-cycle order between parent and children', function () {
    var parent = new cc.Node('parent');
    var child = new cc.Node('child');
    child.parent = parent;

    // init parent
    var childComp = child.addComponent(cc.Component);
    var parentComp = parent.addComponent(cc.Component);

    function assertOrder (firstComp, lastComp, method) {
        lastComp[method] = new Callback().disable(lastComp.node.name + '\'s ' + method + ' should be called after ' + firstComp.node.name + '\'s');
        firstComp[method] = new Callback(function () {
            lastComp[method].enable();
        }).enable();
    }

    assertOrder(parentComp, childComp, 'onLoad');
    assertOrder(childComp, parentComp, 'onDestroy');
    // assertOrder(parentComp, childComp, 'onDestroy');

    assertOrder(parentComp, childComp, 'onEnable');
    assertOrder(parentComp, childComp, 'onDisable');
    // assertOrder(childComp, parentComp, 'onDisable');

    assertOrder(parentComp, childComp, 'start');
    assertOrder(parentComp, childComp, 'update');

    parentComp._destruct = function () {};
    childComp._destruct = function () {};

    // ACTIVATE
    cc.director.getScene().addChild(parent);
    cc.game.step();
    parent.destroy();
    cc.game.step();

    // if (parentComp.update.calledCount === 0 || childComp.update.calledCount === 0) {
    //     ok(false, 'update should be called');
    // }
    if (parentComp.onDestroy.calledCount === 0 || childComp.onDestroy.calledCount === 0) {
        ok(false, 'onDestroy should be called');
    }

    expect(0);
});

test('The onLoad of dynamic created child component', function () {
    var node = new cc.Node();
    var child = new cc.Node();

    var onLoadCalled = false;

    var ChildComponent = cc.Class({
        extends: cc.Component,
        editor: {
            executeInEditMode: true
        },
        onLoad: function () {
            onLoadCalled = true;
        }
    });

    var testComp = node.addComponent(cc.Component);
    testComp.onLoad = function () {
        child.addComponent(ChildComponent);
        strictEqual(onLoadCalled, true, 'should be called during onLoad');
    };

    child.parent = node;
    node.parent = cc.director.getScene();
});

test('The onLoad of dynamic created parent component', function () {
    var node = new cc.Node();
    var parent = new cc.Node();

    var onLoadCalled = false;

    var ParentComponent = cc.Class({
        extends: cc.Component,
        editor: {
            executeInEditMode: true
        },
        onLoad: function () {
            onLoadCalled = true;
        }
    });

    var testComp = node.addComponent(cc.Component);
    testComp.onLoad = function () {
        parent.addComponent(ParentComponent);
        strictEqual(onLoadCalled, true, 'should be called during onLoad');
    };

    node.parent = parent;
    parent.parent = cc.director.getScene();
});

test('deactivate child directly in parent\'s onDisable', function () {
    var parent = new cc.Node();
    var child = new cc.Node();

    child.parent = parent;
    var childComp = child.addComponent(cc.Component);
    childComp.onDisable = new Callback().enable();

    var parentComp = parent.addComponent(cc.Component);
    parentComp.onDisable = function () {
        child.active = false;
    };

    parent.parent = cc.director.getScene();

    parent.active = false;

    childComp.onDisable.once('child onDisable should be called');
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

test('release sg node', function () {
    var isJSB = CC_JSB;
    CC_JSB = true;

    var parent = new cc.Node();
    var child = new cc.Node();
    child.parent = parent;

    var childReleased = false;
    var parentReleased = false;

    child._sgNode.release = function () {
        childReleased = true;
    };
    parent._sgNode.release = function () {
        parentReleased = true;
    };

    parent.destroy();
    cc.Object._deferredDestroy();

    strictEqual(parentReleased, true, 'should release parent sg node');
    strictEqual(childReleased, true, 'should release child sg node');

    CC_JSB = isJSB;
});

test('getBoundingBox', function () {
    var node = new cc.Node();
    node.anchorX = 0.5;
    node.anchorY = 0.5;
    node.width = 10;
    node.height = 20;

    deepEqual(node.getBoundingBox(), cc.rect(-5, -10, 10, 20), 'should compute anchor');
});
