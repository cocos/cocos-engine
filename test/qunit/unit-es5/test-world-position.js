module('world-position-changed');

test('world-position-changed should be emitted by parent', function () {

    var grandParent = new cc.Node('grandParent');
    cc.director.getScene().addChild(grandParent);

    var parent = new cc.Node('parent');
    parent.parent = grandParent;

    var child = new cc.Node('child');
    child.parent = parent;

    var _onWPosChangedCb = new Callback().enable();
    parent.on('world-position-changed', _onWPosChangedCb);

    grandParent.position = cc.p(100, 100);

    _onWPosChangedCb.once('world-position-changed emitted by which parent when position changed');

    grandParent.scale = 0.5;

    _onWPosChangedCb.once('world-position-changed emitted by which parent when scale changed');

    grandParent.rotation = 180;

    _onWPosChangedCb.once('world-position-changed emitted by which parent when rotation changed');

    _onWPosChangedCb.disable('should not triggered when child position changed');
    child.position = cc.p(10, 10);
});

test('world position changed should be emitted by self', function () {

    var self = new cc.Node('self');
    cc.director.getScene().addChild(self);

    var _onWPosChangedCb = new Callback().enable();
    self.on('world-position-changed', _onWPosChangedCb);

    self.position = cc.p(100, 100);

    _onWPosChangedCb.once('world-position-changed emitted by which self when position changed');
});

test('world position changed for off event', function () {

    var grandParent = new cc.Node('grandParent');
    cc.director.getScene().addChild(grandParent);

    var parent = new cc.Node('parent');
    parent.parent = grandParent;

    var child = new cc.Node('child');
    child.parent = parent;

    var _onWPosChangedCbToParent = new Callback().enable();
    var _onWPosChangedCbToChild = new Callback().enable();

    parent.on('world-position-changed', _onWPosChangedCbToParent);
    child.on('world-position-changed', _onWPosChangedCbToChild);

    child.off('world-position-changed', _onWPosChangedCbToChild);

    _onWPosChangedCbToChild.disable('should not triggered on child node');

    grandParent.position = cc.p(100, 100);

    _onWPosChangedCbToParent.once('world-position-changed emitted by which parent when position changed');

    parent.off('world-position-changed', _onWPosChangedCbToParent);

    _onWPosChangedCbToParent.disable('should not triggered on parent node');
    _onWPosChangedCbToChild.disable('should not triggered on child node');
    grandParent.position = cc.p(100, 100);

});

test('world position changed for destroy node', function () {

    var grandParent = new cc.Node('grandParent');
    cc.director.getScene().addChild(grandParent);

    var parent = new cc.Node('parent');
    parent.parent = grandParent;

    var child = new cc.Node('child');
    child.parent = parent;

    var _onWPosChangedCb = new Callback().enable();

    child.on('world-position-changed', _onWPosChangedCb);

    child.destroy();
    cc.Object._deferredDestroy();

    _onWPosChangedCb.disable('The child node did not trigger an event');
    grandParent.position = cc.p(100, 100);

    expect(0);
});

test('world position changed for remove node', function () {

    var grandParent = new cc.Node('grandParent');
    cc.director.getScene().addChild(grandParent);

    var parent = new cc.Node('parent');
    parent.parent = grandParent;

    var child = new cc.Node('child');
    child.parent = parent;

    var _onWPosChangedCb = new Callback().enable();

    child.on('world-position-changed', _onWPosChangedCb);

    child.parent = null;

    _onWPosChangedCb.disable('should not triggered on child node');
    grandParent.position = cc.p(100, 100);

    expect(0);
});


test('world position changed for changed parent ', function () {

    var grandParent = new cc.Node('grandParent');
    cc.director.getScene().addChild(grandParent);

    var parent = new cc.Node('parent');

    var child = new cc.Node('child');
    child.parent = grandParent;

    var _onWPosChangedCb = new Callback().enable();

    child.on('world-position-changed', _onWPosChangedCb);

    child.parent = parent;

    _onWPosChangedCb.once('world-position-changed emitted by which parent when parent changed');

    parent.position = cc.p(100, 100);

    _onWPosChangedCb.once('world-position-changed emitted by which parent when position changed');

    parent.scale = 10;

    _onWPosChangedCb.once('world-position-changed emitted by which parent when scale changed');

    parent.rotation = 180;

    _onWPosChangedCb.once('world-position-changed emitted by which parent when rotation changed');

    _onWPosChangedCb.disable('should not triggered when grandParent position changed');
    grandParent.position = cc.p(100, 100);

    _onWPosChangedCb.disable('should not triggered when grandParent scale changed');
    grandParent.scale = 10;

    _onWPosChangedCb.disable('should not triggered when grandParent rotation changed');
    grandParent.rotation = 180;

});