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

#ifndef __jsb_cocos2dx_dragonbones_manual__
#define __jsb_cocos2dx_dragonbones_manual__

#include "jsapi.h"

void register_all_cocos2dx_dragonbones_manual(JSContext* cx, JS::HandleObject global);

bool js_cocos2dx_dragonbones_Armature_getAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getArmatureData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getAnimationData(JSContext *cx, uint32_t argc, JS::Value *vp);

bool js_cocos2dx_dragonbones_ArmatureData_get_animations(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_get_bones(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_get_skins(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_get_slots(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames(JSContext *cx, unsigned argc, JS::Value *vp);

bool js_cocos2dx_dragonbones_WorldClock_getClock(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_WorldClock_add(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_WorldClock_remove(JSContext *cx, uint32_t argc, JS::Value *vp);

bool js_cocos2dx_dragonbones_CCFactory_getFactory(JSContext *cx, unsigned argc, JS::Value *vp);

bool js_cocos2dx_dragonbones_TransformObject_getGlobal(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TransformObject_getOrigin(JSContext *cx, unsigned argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TransformObject_getOffset(JSContext *cx, unsigned argc, JS::Value *vp);

bool js_cocos2dx_dragonbones_Slot_getRawDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_getDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_getMeshDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_setDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);

#endif /* defined(__jsb_cocos2dx_dragonbones_manual__) */
