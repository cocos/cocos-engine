/*
 * Copyright (c) 2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var proto = dragonBones.CCArmatureDisplay.prototype;

proto.animation = proto.getAnimation;

proto.addEvent = function(type, listener, target) {
    this.addEventListener(type, function(event) {
        listener.call(target, { type : event.type, detail: event });
    });
};

proto.removeEvent = function(type) {
    this.removeEventListener(type);
};

var slotProto = dragonBones.Slot.prototype;
cc.defineGetterSetter(slotProto, 'childArmature', slotProto.getChildArmature, slotProto.setChildArmature);

var armatureProto = dragonBones.Armature.prototype;
cc.defineGetterSetter(armatureProto, 'animation', armatureProto.getAnimation, null);
cc.defineGetterSetter(armatureProto, 'display', armatureProto.getDisplay, null);
cc.defineGetterSetter(armatureProto, 'name', armatureProto.getName, null);

armatureProto.addEventListener = function (type, listener, target) {
    var display = this.display;
    jsb.registerNativeRef(this, display);
    display.addEvent(type, listener, target);
};

armatureProto.removeEventListener = function (type) {
    var display = this.display;
    jsb.unregisterNativeRef(this, display);
    display.removeEvent(type);
};

var animationStateProto = dragonBones.AnimationState.prototype;
cc.defineGetterSetter(animationStateProto, 'name', animationStateProto.getName);

dragonBones.EventObject.START = "start";
dragonBones.EventObject.LOOP_COMPLETE = "loopComplete";
dragonBones.EventObject.COMPLETE = "complete";
dragonBones.EventObject.FADE_IN = "fadeIn";
dragonBones.EventObject.FADE_IN_COMPLETE = "fadeInComplete";
dragonBones.EventObject.FADE_OUT = "fadeOut";
dragonBones.EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
dragonBones.EventObject.FRAME_EVENT = "frameEvent";
dragonBones.EventObject.SOUND_EVENT = "soundEvent";

dragonBones.DragonBones = {
    ANGLE_TO_RADIAN : Math.PI / 180,
    RADIAN_TO_ANGLE : 180 / Math.PI
};
