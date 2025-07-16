
module('EventTarget');

test('once', function () {
    var target = new cc.EventTarget();
    var fireEvent = new cc.Event('fire');
    var cb1 = new Callback();

    // once
    target.once('fire', cb1.enable());
    target.dispatchEvent(fireEvent);
    cb1.once('should be invoked if registered by once')
    .disable('should only invoke once 1');
    target.dispatchEvent(fireEvent);

    // once + on
    var cb2 = new Callback().enable();

    target.once('fire', cb1.enable());
    target.on('fire', cb2);

    target.dispatchEvent(fireEvent);
    cb1.once('should be invoked if registered by once and before other callback');
    cb2.once('should still be invoked if previous event was removed');

    cb1.disable('should only invoke once 2');
    target.dispatchEvent(fireEvent);
    cb2.once('should not remove common event');

    // on + once

    target.once('fire', cb1.enable());
    target.dispatchEvent(fireEvent);
    cb2.once();
    cb1.once('should be invoked if registered by once and after other callback')
    .disable('should only invoke once 3');
    target.dispatchEvent(fireEvent);
    cb2.once();
});

test('call "once" twice', function () {
    var target = new cc.EventTarget();
    var cb1 = new Callback().enable();
    var ctx = {};

    target.once('fire', cb1, ctx, true);
    target.once('fire', cb1, ctx, true);
    target.emit('fire');
    cb1.once('should be invoked only once')
    .disable('should only invoke once');
    target.emit('fire');
});

test('call "off" without handler twice during invoking', function () {
    var target = new cc.EventTarget();
    var ctx = {};

    function handler () {
        target.off('fire');
        target.off('fire', handler, ctx);
    }
    target.on('fire', handler, ctx, true);
    target.emit('fire');

    expect(0);
});
