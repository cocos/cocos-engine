
// 1. remove eventManager add Listener;
var mouseListener1 = cc.eventManager.addListener({
    event: cc.EventListener.MOUSE,
    onMouseDown:  function(keyCode, event){ },
    onMouseUp: function(keyCode, event){ },
    onMouseMove: function () { },
    onMouseScroll: function () { }
}, node);

cc.eventManager.removeListener(mouseListener1);

// 2. remove eventListener create Listener;
var mouseListener2 = cc.EventListener.create({
    event: cc.EventListener.MOUSE,
    onMouseDown:  function(keyCode, event){ },
    onMouseUp: function(keyCode, event){ },
    onMouseMove: function () { },
    onMouseScroll: function () { }
});

cc.eventManager.removeListener(mouseListener2);
