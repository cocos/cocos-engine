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

var _proto = dragonBones.CCArmatureDisplay.prototype;
_proto.animation = _proto.getAnimation;

var slotProto = dragonBones.Slot.prototype;
cc.defineGetterSetter(slotProto, 'childArmature', slotProto.getChildArmature, slotProto.setChildArmature);

var armatureProto = dragonBones.Armature.prototype;
cc.defineGetterSetter(armatureProto, 'animation', armatureProto.getAnimation, null);
cc.defineGetterSetter(armatureProto, 'display', armatureProto.getDisplay, null);
cc.defineGetterSetter(armatureProto, 'name', armatureProto.getName, null);

var animationStateProto = dragonBones.AnimationState.prototype;
cc.defineGetterSetter(animationStateProto, 'name', animationStateProto.getName);

var slotProto = dragonBones.Slot.prototype;
cc.defineGetterSetter(slotProto, 'display', slotProto.getDisplay);

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
