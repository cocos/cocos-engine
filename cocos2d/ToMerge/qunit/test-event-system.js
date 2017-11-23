
module('EventTarget');

test('basic test', function () {
    var target = new cc.EventTarget();
    var fireEvent = new cc.Event('fire');
    var jumpEvent = new cc.Event('jump');

    var cb1 = new Callback();
    var cb2 = new Callback();
    var cb3 = new Callback();

    target.on('fire', cb1);
    target.on('fire', cb2);
    target.on('jump', cb3);

    cb1.enable();
    cb2.enable();
    cb3.disable('should only invoke the callbacks with the same event type');
    target.dispatchEvent(fireEvent);
    cb1.once('callback1 should be invoked by fire event');
    cb2.once('callback2 should be invoked by fire event');

    cb3.enable();
    target.dispatchEvent(jumpEvent);
    cb3.once('callback3 should be invoked by jump event');

    target.dispatchEvent(fireEvent);
    cb1.once('callback1 should be invoked again');
    cb2.once('callback2 should be invoked again');

    cb1.disable('should not invoke callback1 after `off`');
    target.off('fire', cb1);
    target.dispatchEvent(fireEvent);
    cb2.once('callback2 should still be invoked after callback1 canceled');
});

test('emit', function () {
    var target = new cc.EventTarget();
    var cb1 = new Callback().enable();
    target.on('fire', cb1);
    cb1.callbackFunction(function (event) {
        strictEqual(event.detail.param, 123, 'should pass the argument to listener');
    });
    target.emit('fire', {
        param: 123
    });
    cb1.once('callback1 should be invoked by fire event');
});

test('test useCapture in on/off', function () {
    var target = new cc.EventTarget();
    var event = new cc.Event('fire');
    var cb1 = new Callback().enable();
    var cb2 = new Callback().enable();

    target.on('fire', cb1, true);
    target.on('fire', cb2, false);
    target.dispatchEvent(event);
    cb1.once('registered as capturing phase should also be invoked in target phase');
    cb2.once('registered as bubbling phase should also be invoked in target phase');

    target.off('fire', cb1, false);
    target.off('fire', cb2, false);
    cb2.disable('should not invoke callback2 after `off` with the same phase');
    target.dispatchEvent(event);
    cb1.once('should still invoke callback1 after `off` but given another phase');
});

test('test propagation', function () {
    // define hierarchy
    var node1 = new cc.EventTarget();
    var node2 = new cc.EventTarget();
    node2.parent = node1;
    node2._getCapturingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._capturingListeners && target._capturingListeners.has(type)) {
                array.push(target);
            }
        }
    };
    node2._getBubblingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._bubblingListeners && target._bubblingListeners.has(type)) {
                array.push(target);
            }
        }
    };

    var event = new cc.Event('fire', true);
    var capture1 = new Callback();
    var capture2 = new Callback();
    var bubble1 = new Callback();
    var bubble2 = new Callback();
    // capture1 -> capture2 -> bubble2 -> bubble1
    node1.on('fire', capture1, true);
    node2.on('fire', capture2, true);
    node1.on('fire', bubble1, false);
    node2.on('fire', bubble2, false);

    // dispatched by node1

    capture1.callbackFunction(function (event) {
        strictEqual(event.eventPhase, cc.FireEvent.AT_TARGET, 'event phase should be target if dispatched by self 1');
        strictEqual(bubble1.calledCount, 0, 'captures should be invoked before bubbles');
    }).enable();
    bubble1.callbackFunction(function (event) {
        strictEqual(event.eventPhase, cc.FireEvent.AT_TARGET, 'event phase should be target if dispatched by self 2');
    }).enable();
    node1.dispatchEvent(event);
    capture1.once('callback also will be invoked at target phase if registered as capturing');
    bubble1.once('callback also will be invoked at target phase if registered as bubbling');

    // dispatched by node2

    capture1.callbackFunction(function (event) {
        strictEqual(event.eventPhase, cc.FireEvent.CAPTURING_PHASE, 'event phase should be capturing if dispatched by node2');
        strictEqual(event.target, node2, 'target of capture1 should be node2');
        strictEqual(event.currentTarget, node1, 'current target of capture1 should be node1');
        strictEqual(capture2.calledCount, 0, 'captures1 -> capture2');
    }).enable();
    capture2.callbackFunction(function (event) {
        strictEqual(event.eventPhase, cc.FireEvent.AT_TARGET, 'event phase of capture2 should be at target if dispatched by node2');
        strictEqual(event.target, node2, 'target of capture2 should be node2');
        strictEqual(event.currentTarget, node2, 'current target of capture2 should be node2');
        strictEqual(bubble2.calledCount, 0, 'captures2 -> bubble2');
    }).enable();
    bubble2.callbackFunction(function (event) {
        strictEqual(event.eventPhase, cc.FireEvent.AT_TARGET, 'event phase of bubble2 should be at target if dispatched by node2');
        strictEqual(event.target, node2, 'target of bubble2 should be node2');
        strictEqual(event.currentTarget, node2, 'current target of bubble2 should be node2');
        strictEqual(bubble1.calledCount, 0, 'bubble2 -> bubble1');
    }).enable();
    bubble1.callbackFunction(function (event) {
        strictEqual(event.eventPhase, cc.FireEvent.BUBBLING_PHASE, 'event phase should be bubble if dispatched by node2');
        strictEqual(event.target, node2, 'target of bubble1 should be node2');
        strictEqual(event.currentTarget, node1, 'current target of bubble1 should be node1');
    }).enable();
    node2.dispatchEvent(event);
    capture1.once('capture1 should be invoked if dispatched by node2');
    capture2.once('capture2 should be invoked if dispatched by node2');
    bubble1.once('bubble1 should be invoked if dispatched by node2');
    bubble2.once('bubble2 should be invoked if dispatched by node2');
});

test('test stop propagation', function () {
    // define hierarchy
    var node1 = new cc.EventTarget();
    var node2 = new cc.EventTarget();
    node2.parent = node1;
    node2._getCapturingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._capturingListeners && target._capturingListeners.has(type)) {
                array.push(target);
            }
        }
    };
    node2._getBubblingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._bubblingListeners && target._bubblingListeners.has(type)) {
                array.push(target);
            }
        }
    };

    var event = new cc.Event('fire', true);
    var capture1 = new Callback().enable();
    var capture2 = new Callback().enable();
    var bubble1 = new Callback().enable();
    var bubble2 = new Callback().enable();
    node1.on('fire', capture1, true);
    node2.on('fire', capture2, true);
    node1.on('fire', bubble1, false);
    node2.on('fire', bubble2, false);

    // stop at bubble 2

    bubble2.callbackFunction(function (event) {
        event.stop();
    });
    bubble1.disable('bubble1 should not be invoked if propagation stopped');
    node2.dispatchEvent(event);
    capture1.once('capture1 should be invoked if propagation not yet stopped before');
    capture2.once('capture2 should be invoked if propagation not yet stopped before');
    bubble2.once('bubble2 should be invoked if propagation not yet stopped before');

    // stop at capture 2
    capture2.callbackFunction(function (event) {
        event.stop();
    });
    bubble2.disable('bubble2 should not be invoked if propagation stopped before');
    node2.dispatchEvent(event);
    capture1.once('capture1 should be invoked if propagation not yet stopped before');
    capture2.once('capture2 should be invoked if propagation not yet stopped before');

    // stop at capture 1
    capture1.callbackFunction(function (event) {
        event.stop();
    });
    capture2.disable('capture2 should not be invoked if propagation stopped before');
    node2.dispatchEvent(event);
    capture1.once('capture1 should be invoked if propagation not yet stopped before');
});

test('test stop propagation immediate', function () {
    // define hierarchy
    var node1 = new cc.EventTarget();
    var node2 = new cc.EventTarget();
    node2.parent = node1;
    node2._getCapturingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._capturingListeners && target._capturingListeners.has(type)) {
                array.push(target);
            }
        }
    };
    node2._getBubblingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._bubblingListeners && target._bubblingListeners.has(type)) {
                array.push(target);
            }
        }
    };

    var event = new cc.Event('fire', true);
    var capture1 = new Callback().enable();
    var capture1_2nd = new Callback().enable();
    var capture2 = new Callback().enable();
    var bubble1 = new Callback().enable();
    var bubble2 = new Callback().enable();
    var bubble2_2nd = new Callback().enable();
    node1.on('fire', capture1, true);
    node1.on('fire', capture1_2nd, true);
    node2.on('fire', capture2, true);
    node1.on('fire', bubble1, false);
    node2.on('fire', bubble2, false);
    node2.on('fire', bubble2_2nd, false);

    // stop at bubble 2

    bubble2.callbackFunction(function (event) {
        event.stop(true);
    });
    bubble2_2nd.disable('bubble2_2nd should not be invoked if propagation stopped immediate');
    bubble1.disable('bubble1 should not be invoked if propagation stopped immediate');
    node2.dispatchEvent(event);
    capture1.once('capture1 should be invoked if propagation not yet stopped before');
    capture2.once('capture2 should be invoked if propagation not yet stopped before');
    bubble2.once('bubble2 should be invoked if propagation not yet stopped before');

    // stop at capture 1
    capture1.callbackFunction(function (event) {
        event.stop(true);
    });
    capture1_2nd.disable('capture1_2nd should not be invoked if propagation stopped immediate');
    capture2.disable('capture2 should not be invoked if propagation stopped immediate');
    node2.dispatchEvent(event);
    capture1.once('capture1 should be invoked if propagation not yet stopped before');
});

test('test Event.bubbles', function () {
    // define hierarchy
    var node1 = new cc.EventTarget();
    var node2 = new cc.EventTarget();
    node2.parent = node1;
    node2._getBubblingTargets = function (type, array) {
        for (var target = this.parent; target; target = target.parent) {
            if (target._bubblingListeners && target._bubblingListeners.has(type)) {
                array.push(target);
            }
        }
    };

    var bubble1 = new Callback();
    node1.on('fire', bubble1, false);

    var event = new cc.Event('fire');
    event.bubbles = false;
    bubble1.disable('bubble1 should not be invoked if set event.bubbles to false');
    node2.dispatchEvent(event);

    event.bubbles = true;
    bubble1.enable();
    node2.dispatchEvent(event);
    bubble1.once('bubble1 should be invoked if set event.bubbles to true');
});

//test('', function () {
//    // define hierarchy
//    var node1 = new cc.EventTarget();
//    var node2 = new cc.EventTarget();
//    var node3 = new cc.EventTarget();
//    node2.parent = node1;
//    node3.parent = node2;
//    node3._getCapturingTargets = node2._getCapturingTargets = function (type, array) {
//        for (var target = this.parent; target; target = target.parent) {
//            if (target._capturingListeners && target._capturingListeners.has(type)) {
//                array.push(target);
//            }
//        }
//    };
//    node3._getBubblingTargets = node2._getBubblingTargets = function (type, array) {
//        for (var target = this.parent; target; target = target.parent) {
//            if (target._bubblingListeners && target._bubblingListeners.has(type)) {
//                array.push(target);
//            }
//        }
//    };

//    var event = new cc.Event('fire');
//    var capture1 = new Callback();
//    var capture2 = new Callback();
//    var capture3 = new Callback();
//    var bubble1 = new Callback();
//    var bubble2 = new Callback();
//    var bubble3 = new Callback();
//    node1.on('fire', capture1, true);
//    node2.on('fire', capture2, true);
//    node1.on('fire', bubble1, false);
//    node3.on('fire', capture3, true);
//    node2.on('fire', bubble2, false);
//    node3.on('fire', bubble3, false);
//});
