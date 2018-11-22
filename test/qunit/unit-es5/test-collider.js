largeModule('collider');

test('collision manager', function() {
    var manager = cc.director.getCollisionManager();
    ok(manager);

    manager.enabled = true;

    cc.game.groupList = ['Default', 'Test'];
    cc.game.collisionMatrix = [[true, false], [false, true]];

    var node1 = new cc.Node();
    cc.director.getScene().addChild(node1);
    
    var box1 = node1.addComponent(cc.BoxCollider);
    strictEqual( manager._colliders.length, 1, 'collision manager should add 1 collider');

    var box2 = node1.addComponent(cc.BoxCollider);
    strictEqual( manager._colliders.length, 2, 'collision manager should add 2 colliders');

    var node2 = new cc.Node();
    cc.director.getScene().addChild(node2);
    
    var box3 = node2.addComponent(cc.BoxCollider);
    strictEqual( manager._colliders.length, 3, 'collision manager should add 3 colliders');
    strictEqual( manager._contacts.length, 2, 'collision manager should add 2 contacts');

    var box4 = node2.addComponent(cc.BoxCollider);
    
    strictEqual( manager._colliders.length, 4, 'collision manager should add 4 colliders');
    strictEqual( manager._contacts.length, 4, 'collision manager should add 4 contacts');

    node1.group = 'Test';
    strictEqual( manager._contacts.length, 0, 'collision manager should add 0 contacts');

    node2.group = 'Test';
    strictEqual( manager._contacts.length, 4, 'collision manager should add 0 contacts');

    box4.enabled = false;
    strictEqual( manager._colliders.length, 3, 'collision manager should add 3 colliders');

    node1.parent = null;
    node2.parent = null;

    strictEqual( manager._colliders.length, 0, 'collision manager should add 0 colliders');
    strictEqual( manager._contacts.length, 0, 'collision manager should add 0 contacts');

    manager.enabled = false;
});

test('collider callback', function () {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;

    var callbacks = [];

    // my component
    var MyComponent = cc.Class({
        name: 'MyComponent',
        extends: cc.Component,

        onCollisionEnter: function () {
            callbacks.push('enter');
        },

        onCollisionExit: function () {
            callbacks.push('exit');
        },

        onCollisionStay: function () {
            callbacks.push('stay');
        }
    });

    var node1 = new cc.Node();
    cc.director.getScene().addChild(node1);
    
    var box1 = node1.addComponent(cc.BoxCollider);
    node1.addComponent(MyComponent);

    var node2 = new cc.Node();
    cc.director.getScene().addChild(node2);
    
    var box2 = node2.addComponent(cc.BoxCollider);

    deepEqual(callbacks, [], 'should hove no callbacks');

    manager.update();

    deepEqual(callbacks, ['enter'], 'should call enter');

    callbacks = [];
    manager.update();
    deepEqual(callbacks, ['stay'], 'should call stay');

    callbacks = [];
    manager.update();
    deepEqual(callbacks, ['stay'], 'should call stay again');

    node2.x = 1000;

    callbacks = [];
    manager.update();
    deepEqual(callbacks, ['exit'], 'should call exit');

    node2.x = 0;

    callbacks = [];
    manager.update();
    deepEqual(callbacks, ['enter'], 'should call enter');

    callbacks = [];

    node1.parent = null;
    node2.parent = null;

    deepEqual(callbacks, ['exit'], 'should call exit');

    cc.js.unregisterClass(MyComponent);
    manager.enabled = false;
});
