largeModule('Component Scheduler', {
    setup: SetupEngine.setup,
    teardown: function () {
        cc.director._scene = new cc.Scene();
        cc.director._runningScene = cc.director._scene;
        SetupEngine.teardown();
    }
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

test('disable component during onLoad', function () {
    var nodes = createNodes({
        comps: cc.Component,
        // child: {
        //     comps: cc.Component,
        // },
    });
    var parent = nodes.root;
    var parentComp = nodes.rootComps[0];
    // var child = nodes.child;
    // var childComp = nodes.childComps[0];

    parentComp.onEnable = new Callback().disable('should not enable self component if disabled in onLoad');
    // childComp.onEnable = new Callback().disable('should not enable child component if disabled in onLoad');

    parentComp.onLoad = function () {
        parentComp.enabled = false;
        // childComp.enabled = false;
    };

    nodes.attachToScene();

    // could re-enable
    parentComp.onEnable.enable();
    parentComp.enabled = true;
    parentComp.onEnable.once('could re-enable component');
});

test('disable component during onEnable', function () {
    var nodes = createNodes({
        comps: cc.Component,
        child: {
            comps: cc.Component,
        },
    });
    var parentComp = nodes.rootComps[0];
    var child = nodes.child;
    var childComp = nodes.childComps[0];

    childComp.onEnable = new Callback().disable('should not enable child component if disabled in onEnable');

    parentComp.onEnable = function () {
        childComp.enabled = false;
    };

    nodes.attachToScene();

    // could re-enable
    childComp.onEnable = new Callback().enable();
    childComp.enabled = true;
    childComp.onEnable.once('could re-enable component');
});

test('change hierarchy during own deactivation', function () {
    var vendorError = cc.errorID;
    cc.errorID = new Callback();

    var nodes1 = createNodes({
        preNode: {},
        testNode: {         
            comps: cc.Component,
        },
        testNode2: {
            comps: cc.Component,
        },
    });
    nodes1.attachToScene();

    cc.errorID.disable('Should allow change hierarchy during own deactivation');

    nodes1.testNodeComps[0].onDisable = function() {
        this.node.parent = nodes1.preNode;
    };
    nodes1.testNode.active = false;

    nodes1.testNode2Comps[0].onDisable = function() {
        this.node.parent = null;
    };
    nodes1.testNode2.active = false;

    expect(0);

    cc.errorID = vendorError;
});

test('change hierarchy during parent\'s deactivation', function () {
    var vendorError = cc.errorID;
    cc.errorID = new Callback().enable();

    var nodes = createNodes({
        parent1: {
            preNode: {},
            testNode1: {
                comps: cc.Component,
            },
        },
        parent2: {
            testNode2: {
                comps: cc.Component,
            },
        },
        parent3: {
            testNode3: {
                comps: cc.Component,
            },
        },
    });
    nodes.attachToScene();

    nodes.testNode1Comps[0].onDisable = function() {
        this.node.parent = nodes.preNode;
    };
    nodes.parent1.active = false;
    cc.errorID.once('Should report error if change child');

    nodes.testNode2Comps[0].onDisable = function() {
        this.node.parent = null;
    };
    nodes.parent2.active = false;
    cc.errorID.once('Should report error if detach child');

    nodes.testNode3Comps[0].onDisable = function() {
        this.node.parent.addChild(new cc.Node());
    };
    nodes.parent3.active = false;
    cc.errorID.once('Should report error if add child');

    cc.errorID = vendorError;
});

test('set sibling index during onDisable', function () {
    var vendorError = cc.errorID;
    cc.errorID = new Callback().enable();

    var nodes = createNodes({
        parent: {
            node1: {
                comps: cc.Component,
            },
            node: {}
        },
        node2:  {
            comps: cc.Component,
        }
    });
    var node1Comp = nodes.node1Comps[0];
    var node2Comp = nodes.node2Comps[0];
    node1Comp.onDisable = function() {
        this.node.setSiblingIndex(1);
    };
    node2Comp.onDisable = function() {
        this.node.setSiblingIndex(0);
    };
    nodes.attachToScene();

    nodes.parent.active = false;
    cc.errorID.once('Should report error when setting node\'s sibling index during its parent\'s deactivation');

    cc.errorID.disable('Should allow setting node\'s sibling index during its deactivation');
    nodes.node2.active = false;

    cc.errorID = vendorError;
});

(function () {

    // Test deactivate during activating or conversely

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
        var nodes = createNodes({
            node: {
            },
            sibling: {
                comps: cc.Component,
            }
        });

        var node = nodes.node;

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

        var siblingComp = nodes.siblingComps[0];
        siblingComp.onLoad = new Callback().enable();

        nodes.attachToScene();

        strictEqual(node.active, false, 'node should be deactivated');
        strictEqual(cc.director.getActionManager().isTargetPaused_TEST(node), true, 'action should be paused');
        previousComp.onLoad.once('onLoad of previous component should be called').disable();
        siblingComp.onLoad.once('onLoad of sibling node should still be called').disable();

        if (StillInvokeRestCompsOnSameNode) {
            compShouldBeActivated(restComp, 'rest');
        }

        cc.game.step();

        // re-active

        previousComp.onEnable.enable();
        testComp.onLoad = new Callback().disable('onLoad of testing component has already called');
        testComp.onEnable.enable();
        restComp.onLoad.enable();
        restComp.onEnable.enable();

        node.active = true;

        previousComp.onEnable.once('onEnable of previous component should be called when node re-activated');
        testComp.onEnable.once('onEnable of testing component should be called when node re-activated');
        restComp.onLoad.once('onLoad of rest component should be called when node re-activated');
        restComp.onEnable.once('onEnable of rest component should be called when node re-activated');
    });

    test('could activate next sibling node in onLoad', function () {
        var nodes = createNodes({
            test: {
                comps: cc.Component,
            },
            next: {
                comps: cc.Component,
            }
        });
        var testComp = nodes.testComps[0];
        var next = nodes.next;
        var nextComp = nodes.nextComps[0];
        next.active = false;

        testComp.onLoad = function () {
            next.active = true;
        };
        nextComp.onLoad = new Callback().enable();

        nodes.attachToScene();

        nextComp.onLoad.once('onLoad of next sibling node should be called').disable();
    });

    test('re-activate child manually in parent\'s onDisable', function () {
        var nodes = createNodes({
            comps: cc.Component,
            child: {
                comps: cc.Component,
                descendent: {
                    comps: cc.Component,
                }
            },
        });
        var parent = nodes.root;
        var child = nodes.child;
        child.active = false;
        var descendent = nodes.descendent;
        descendent.active = false;
        var childComp = nodes.childComps[0];
        var parentComp = nodes.rootComps[0];
        var descendentComp = nodes.descendentComps[0];

        childComp.onEnable = new Callback().disable('should not enable child');
        descendentComp.onEnable = new Callback().disable('should not enable descendent');
        parentComp.onDisable = function () {
            descendent.active = true;
            child.active = true;
        };

        nodes.attachToScene();

        parent.active = false;

        expect(0);
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
        var compOfChild = createDisabledComp(child, 'child');

        // ACTIVATE
        parentToDeactivate.runAction(cc.delayTime(0));
        testerNode.runAction(cc.delayTime(0));
        nodes.attachToScene();

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

        // re-active
        var compOfNextNode = nextNode.getComponent(cc.Component);
        compOfParent.onEnable.enable();
        compOfPrevNode.onEnable.enable();
        previousComp.onEnable.enable();
        compOfNextNode.onLoad.enable();
        compOfNextNode.onEnable.enable();
        testComp.onEnable.enable();
        restComp.onLoad.enable();
        restComp.onEnable.enable();
        compOfChild.onLoad.enable();
        compOfChild.onEnable.enable();

        parentToDeactivate.active = true;

        compOfParent.onEnable.once('parent component should be re-enabled');
        compOfPrevNode.onEnable.once('previous node\'s component should be re-enabled');
        previousComp.onEnable.once('previous component should be re-enabled');
        compOfNextNode.onLoad.once('next node\'s component should be loaded');
        compOfNextNode.onEnable.once('next node\'s component should be re-enabled');
        testComp.onEnable.once('testing component should be re-enabled');
        restComp.onLoad.once('rest component should be loaded');
        restComp.onEnable.once('rest component should be re-enabled');
        compOfChild.onLoad.once('child component should be loaded');
        compOfChild.onEnable.once('child component should be re-enabled');
    });

    test('component might be destroyed when destroy() called before node activating', function () {
        var node = new cc.Node();
        var comp = createDisabledComp(node, 'destroyed');
        comp.onDestroy = new Callback().disable('onDestroy should not be called');
        comp.destroy();

        cc.director.getScene().addChild(node);

        cc.game.step();
        strictEqual(comp.isValid, false, 'component should be destroyed');
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
    //     nodes.attachToScene();
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
        var node = new cc.Node('P');

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

        var child = new cc.Node('C');
        var compOfChild = createOnlyOnLoadComp(child, 'child');
        child.parent = node;

        cc.director.getScene().addChild(node);

        strictEqual(node.active, false, 'node should be deactivated');
        compShouldBeActivated(previousComp, 'previous');

        testComp.onEnable.once('onEnable of test component should be called').disable();

        if (StillInvokeRestCompsOnSameNode) {
            compShouldBeActivated(restComp, 'rest');
        }

        cc.game.step();

        // re-active

        testComp.onEnable = null;
        previousComp.onEnable.enable();

        restComp.onEnable.enable();
        compOfChild.onEnable.enable();
        node.active = true;
        restComp.onEnable.once('rest component should be re-enabled');
        compOfChild.onEnable.once('child component should be re-enabled');
    });

    function testActivateChildManually (title, childActivedByDefault) {
        test('activate ' + title + ' child manually in parent\'s onLoad', function () {
            var nodes = createNodes({
                comps: cc.Component,
                child: {
                    comps: cc.Component
                },
            });
            var parent = nodes.root;
            var child = nodes.child;
            child.active = childActivedByDefault;

            var childComp = nodes.childComps[0];
            var parentComp = nodes.rootComps[0];

            childComp.onLoad = new Callback().enable();
            parentComp.onLoad = function () {
                child.active = true;
            };

            nodes.attachToScene();

            childComp.onLoad.once('child onLoad should be called').disable();
        });
    }
    testActivateChildManually('active', true);
    testActivateChildManually('inactive', false);

    test('deactivate child manually in parent\'s onDisable', function () {
        var nodes = createNodes({
            comps: cc.Component,
            child: {
                comps: cc.Component,
                descendent: {
                    comps: cc.Component,
                }
            },
        });
        var parent = nodes.root;
        var child = nodes.child;
        var descendent = nodes.descendent;
        var childComp = nodes.childComps[0];
        var parentComp = nodes.rootComps[0];
        var descendentComp = nodes.descendentComps[0];

        childComp.onDisable = new Callback().enable();
        descendentComp.onDisable = new Callback().enable();
        parentComp.onDisable = function () {
            descendent.active = false;
            child.active = false;
        };

        nodes.attachToScene();

        parent.active = false;

        childComp.onDisable.once('child onDisable should be called').disable();
        descendentComp.onDisable.once('descendent onDisable should be called').disable();
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

test('should not cause an infinite loops if re-activated in onLoad', function () {
    var Comp = cc.Class({
        extends: cc.Component,
        onLoad: function () {
            this.node.active = false;
            this.node.active = true;
        }
    });

    var node = new cc.Node();
    cc.director.getScene().addChild(node);
    var comp = node.addComponent(Comp);
    ok('done');
});

test('start should always invoke before update', function () {
    var TestComp = cc.Class({
        extends: cc.Component,
        start: function () {
            this.inited = true;
        },
        update: function (dt) {
            strictEqual(this.inited, true, 'should always invoke before update');
            this.enable = false;
        }
    });

    var node = new cc.Node();
    var comp = node.addComponent(cc.Component);
    comp.start = function () {
        var test = new cc.Node();
        test.addComponent(TestComp);
        this.node.addChild(test);
    };
    comp.update = function () {
        var test = new cc.Node();
        test.addComponent(TestComp);
        this.node.addChild(test);
    };
    cc.director.getScene().addChild(node);
    // run comp
    cc.game.step();
    // run TestComp
    cc.game.step();

    // end test
    node.active = false;
});

test('different start executionOrder', function () {
    var invoked = false;
    var TestComp = cc.Class({
        extends: cc.Component,
        start: function () {
            invoked = true;
        },
        update: function () {
            strictEqual(invoked, true, 'should always be invoked before update');
        },
    });

    var AfterTestComp = cc.Class({
        extends: cc.Component,
        editor: {
            executionOrder: 1,
        },
        start: function () {
            // execute inside start phase dynamically
            this.node.addComponent(TestComp);
        },
    });

    var node = new cc.Node();
    node.addComponent(AfterTestComp);

    cc.director.getScene().addChild(node);
    cc.game.step();
    cc.game.step();

    strictEqual(invoked, true, 'start should be invoked on new component with lower executionOrder');
});

test('start should only called once', function () {
    var TestComp1 = cc.Class({
        extends: cc.Component,
        start: function () {
            this.target = cc.find('node2');
            this.target.active = false;
            this.target.active = true;
        }
    });

    var called = false;
    var TestComp2 = cc.Class({
        extends: cc.Component,
        start: function () {
            strictEqual(called, false, 'start should not been called');
            called = true;
        }
    });

    var node1 = new cc.Node();
    cc.director.getScene().addChild(node1);
    node1.addComponent(TestComp1);

    var node2 = new cc.Node();
    node2.name = 'node2';
    cc.director.getScene().addChild(node2);
    node2.addComponent(TestComp2);
    // run TestComp1
    cc.game.step();
    // run TestComp2
    cc.game.step();
});

test('lateUpdate', function () {
    var TestComp = cc.Class({
        extends: cc.Component,
        update: function () {
            this.updated = true;
        },
        lateUpdate: function (dt) {
            strictEqual(this.updated, true, 'should always invoke before update');
            this.enable = false;
        }
    });

    var node = new cc.Node();
    var comp = node.addComponent(cc.Component);
    comp.update = function () {
        var test = new cc.Node();
        test.addComponent(TestComp);
        this.node.addChild(test);
        this.enabled = false;
    };
    cc.director.getScene().addChild(node);
    // run comp
    cc.game.step();
    // run TestComp
    cc.game.step();
});

//test('should not call lifecycle methods if not executeInEditMode', function () {
//    var Comp = cc.Class({
//        extends: CallbackTester,
//        ctor: function () {
//            this.notExpect(CallbackTester.OnLoad, 'onLoad');
//            this.notExpect(CallbackTester.OnEnable, 'onEnable');
//        }
//    });
//
//    var parent = new cc.Node();
//    cc.director.getScene().addChild(parent);
//    var comp = parent.addComponent(Comp);
//    comp.stopTest();
//});

// Test execution order

(function () {

    function CreateClass (order) {
        return cc.Class({
            extends: cc.Component,
            editor: {
                executionOrder: order,
            }
        });
    }

    var CompOrderNeg3 = CreateClass(-3);
    var CompOrderNeg2 = CreateClass(-2);
    var CompOrderNeg1 = CreateClass(-1);
    var CompOrder0 = CreateClass(0);
    var CompOrder1 = CreateClass(1);
    var CompOrder2 = CreateClass(2);
    var CompOrder3 = CreateClass(3);

    test('execution order', function () {
        var nodes = createNodes({
            comps: [CompOrder0, cc.Component, CompOrderNeg1, CompOrder1],
            child: {
                comps: [CompOrder0, cc.Component, CompOrderNeg1, CompOrderNeg3, CompOrderNeg2, CompOrder1, CompOrder3, CompOrder2],
                descendent: {
                    comps: [CompOrder0, cc.Component, CompOrderNeg2, CompOrder2],
                }
            },
        });
        // var parent = nodes.root;
        // var child = nodes.child;
        // var descendent = nodes.descendent;

        var allComps = nodes.rootComps.concat(nodes.childComps, nodes.descendentComps);
        var orderedMethods = ['onLoad', 'onEnable', 'start', 'update', 'lateUpdate'];

        var lastExecutedOrder = -Infinity;
        var lastExecutedMethod = null;

        for (var i = 0; i < allComps.length; i++) {
            var comp = allComps[i];
            for (var j = 0; j < orderedMethods.length; j++) {
                (function (method) {
                    comp[method] = function () {
                        if (lastExecutedMethod !== method) {
                            lastExecutedOrder = -Infinity;
                            lastExecutedMethod = method;
                        }
                        var myOrder = this.constructor._executionOrder;
                        ok(myOrder >= lastExecutedOrder,
                            'component ordered ' + myOrder + ' should not execute before ' + lastExecutedOrder);
                        lastExecutedOrder = myOrder;
                    };
                })(orderedMethods[j]);
            }
        }

        nodes.attachToScene();
    });
})();
