var proto = dragonBones.CCArmatureDisplay.prototype;

cc.js.mixin(proto, cc.EventTarget.prototype);

proto.addEvent = function(type, listener, target) {
    if (!this.hasEventCallback()) {
        var self = this;
        this.setEventCallback(function (eventObject) {
            self.emit(eventObject.type, eventObject);
        });
    }
    this.on(type, listener, target);
};

var dragonEventTypes = [
    dragonBones.EventObject.START,
    dragonBones.EventObject.LOOP_COMPLETE,
    dragonBones.EventObject.COMPLETE,
    dragonBones.EventObject.FADE_IN,
    dragonBones.EventObject.FADE_IN_COMPLETE,
    dragonBones.EventObject.FADE_OUT,
    dragonBones.EventObject.FADE_OUT_COMPLETE,
    dragonBones.EventObject.FRAME_EVENT,
    dragonBones.EventObject.SOUND_EVENT
];

proto.removeEvent = function(type, listener, target) {
    this.off(type, listener, target);

    var noListeners = true;
    for (var i = 0, n = dragonEventTypes.length; i < n; i++) {
        var checkType = dragonEventTypes[i];
        if (this.hasEventListener(checkType)) {
            noListeners = false;
            break;
        }
    }

    if (noListeners) {
        this.clearEventCallback();
    }
};

var armatureProto = dragonBones.Armature.prototype;
armatureProto.addEventListener = function (type, listener, target) {
    var display = this.display;
    jsb.registerNativeRef(this, display);
    display.addEvent(type, listener, target);
};

armatureProto.removeEventListener = function (type, listener, target) {
    var display = this.display;
    jsb.unregisterNativeRef(this, display);
    display.removeEvent(type, listener, target);
};

var transformProto = dragonBones.Transform.prototype;
cc.js.getset(transformProto, 'rotation', transformProto.getRotation, transformProto.setRotation);
