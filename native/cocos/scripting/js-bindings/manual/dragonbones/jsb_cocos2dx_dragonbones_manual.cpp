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

#include "scripting/js-bindings/manual/dragonbones/jsb_cocos2dx_dragonbones_manual.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "editor-support/dragonbones/cocos2dx/CCDragonBonesHeaders.h"

using namespace dragonBones;

bool js_cocos2dx_dragonbones_Armature_getAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getAnimation : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Animation& ret = cobj->getAnimation();
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::Animation>(cx, (dragonBones::Animation*)&ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getAnimation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_Armature_getArmatureData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getArmatureData : Invalid Native Object");
    if (argc == 0) {
        const dragonBones::ArmatureData& ret = cobj->getArmatureData();
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::ArmatureData>(cx, (dragonBones::ArmatureData*)&ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getArmatureData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_Armature_getDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getDisplay : Invalid Native Object");
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* ret = dynamic_cast<CCArmatureDisplay*>(cobj->getDisplay());
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<dragonBones::CCArmatureDisplay>(cx, ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        } else {
            jsret = JS::NullValue();
        };
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getDisplay : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getAnimation : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Animation& ret = cobj->getAnimation();
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::Animation>(cx, (dragonBones::Animation*)&ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_AnimationState_getAnimationData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getClip : Invalid Native Object");
    if (argc == 0) {
        const dragonBones::AnimationData& ret = cobj->getAnimationData();
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::AnimationData>(cx, (dragonBones::AnimationData*)&ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getClip : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_ArmatureData_get_animations(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_animations : Invalid Native Object");
    
    JS::RootedObject jsRet(cx, JS_NewPlainObject(cx));
    const std::map<std::string, dragonBones::AnimationData*>& v = cobj->animations;
    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue element(cx);
        std::string key = iter->first;
        dragonBones::AnimationData* valueObj = iter->second;
        JS::RootedObject elemObj(cx);
        js_get_or_create_jsobject<dragonBones::AnimationData>(cx, valueObj, &elemObj);
        element = JS::ObjectOrNullValue(elemObj);
        if (!key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), element);
        }
    }
    args.rval().set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool js_cocos2dx_dragonbones_ArmatureData_get_bones(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_bones : Invalid Native Object");
    
    JS::RootedObject proto(cx);
    JS::RootedObject parent(cx);
    JS::RootedObject jsRet(cx, JS_NewPlainObject(cx));
    const std::map<std::string, dragonBones::BoneData*>& v = cobj->bones;
    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue element(cx);
        std::string key = iter->first;
        dragonBones::BoneData* valueObj = iter->second;
        JS::RootedObject elemObj(cx);
        js_get_or_create_jsobject<dragonBones::BoneData>(cx, valueObj, &elemObj);
        element = JS::ObjectOrNullValue(elemObj);
        if (!key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), element);
        }
    }
    args.rval().set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool js_cocos2dx_dragonbones_ArmatureData_get_skins(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_skins : Invalid Native Object");
    
    JS::RootedObject proto(cx);
    JS::RootedObject parent(cx);
    JS::RootedObject jsRet(cx, JS_NewPlainObject(cx));
    const std::map<std::string, dragonBones::SkinData*>& v = cobj->skins;
    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue element(cx);
        std::string key = iter->first;
        dragonBones::SkinData* valueObj = iter->second;
        JS::RootedObject elemObj(cx);
        js_get_or_create_jsobject<dragonBones::SkinData>(cx, valueObj, &elemObj);
        element = JS::ObjectOrNullValue(elemObj);
        if (!key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), element);
        }
    }
    args.rval().set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool js_cocos2dx_dragonbones_ArmatureData_get_slots(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_slots : Invalid Native Object");
    
    JS::RootedObject proto(cx);
    JS::RootedObject parent(cx);
    JS::RootedObject jsRet(cx, JS_NewPlainObject(cx));
    const std::map<std::string, dragonBones::SlotData*>& v = cobj->slots;
    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue element(cx);
        std::string key = iter->first;
        dragonBones::SlotData* valueObj = iter->second;
        JS::RootedObject elemObj(cx);
        js_get_or_create_jsobject<dragonBones::SlotData>(cx, valueObj, &elemObj);
        element = JS::ObjectOrNullValue(elemObj);
        if (!key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), element);
        }
    }
    args.rval().set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames : Invalid Native Object");
    const std::vector<std::string>& ret = cobj->getArmatureNames();
    JS::RootedValue jsret(cx);
    std_vector_string_to_jsval(cx, ret, &jsret);
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_dragonbones_WorldClock_getClock(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    JS::RootedObject retObj(cx);
    js_get_or_create_jsobject<dragonBones::WorldClock>(cx, &dragonBones::WorldClock::clock, &retObj);
    JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_dragonbones_WorldClock_remove(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_WorldClock_remove : Invalid Native Object");
    if (argc == 1) {
        dragonBones::IAnimateble* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            auto armatureObj = static_cast<dragonBones::Armature*>(jsProxy ? jsProxy->ptr : NULL);
            auto clockObj = static_cast<dragonBones::WorldClock*>(jsProxy ? jsProxy->ptr : NULL);
            if (armatureObj) {
                arg0 = dynamic_cast<dragonBones::IAnimateble*>(armatureObj);
            }
            else {
                arg0 = dynamic_cast<dragonBones::IAnimateble*>(clockObj);
            }
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_WorldClock_remove : Error processing arguments");
        cobj->remove(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_WorldClock_remove : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_dragonbones_WorldClock_add(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_WorldClock_add : Invalid Native Object");
    if (argc == 1) {
        dragonBones::IAnimateble* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            auto armatureObj = static_cast<dragonBones::Armature*>(jsProxy ? jsProxy->ptr : NULL);
            auto clockObj = static_cast<dragonBones::WorldClock*>(jsProxy ? jsProxy->ptr : NULL);
            if (armatureObj) {
                arg0 = dynamic_cast<dragonBones::IAnimateble*>(armatureObj);
            }
            else {
                arg0 = dynamic_cast<dragonBones::IAnimateble*>(clockObj);
            }
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_WorldClock_add : Error processing arguments");
        cobj->add(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_WorldClock_add : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_dragonbones_CCFactory_getFactory(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        const dragonBones::CCFactory& ret = dragonBones::CCFactory::factory;
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::CCFactory>(cx, (dragonBones::CCFactory*)&ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCFactory_getFactory : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_TransformObject_getGlobal(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_getGlobal : Invalid Native Object");
    JS::RootedObject retObj(cx);
    js_get_or_create_jsobject<dragonBones::Transform>(cx, &cobj->global, &retObj);
    JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_dragonbones_TransformObject_getOrigin(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_getOrigin : Invalid Native Object");
    JS::RootedObject retObj(cx);
    js_get_or_create_jsobject<dragonBones::Transform>(cx, &cobj->origin, &retObj);
    JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_dragonbones_TransformObject_getOffset(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_getOffset : Invalid Native Object");
    JS::RootedObject retObj(cx);
    js_get_or_create_jsobject<dragonBones::Transform>(cx, &cobj->offset, &retObj);
    JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_dragonbones_Slot_getRawDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_getRawDisplay : Invalid Native Object");
    if (argc == 0) {
        dragonBones::DBCCSprite* ret = static_cast<dragonBones::DBCCSprite*>(cobj->getRawDisplay());
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::DBCCSprite>(cx, ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_getRawDisplay : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_Slot_getDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_getDisplay : Invalid Native Object");
    if (argc == 0) {
        dragonBones::DBCCSprite* ret = static_cast<dragonBones::DBCCSprite*>(cobj->getDisplay());
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::DBCCSprite>(cx, ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_getDisplay : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_Slot_getMeshDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_getMeshDisplay : Invalid Native Object");
    if (argc == 0) {
        dragonBones::DBCCSprite* ret = static_cast<dragonBones::DBCCSprite*>(cobj->getMeshDisplay());
        JS::RootedObject retObj(cx);
        js_get_or_create_jsobject<dragonBones::DBCCSprite>(cx, ret, &retObj);
        JS::RootedValue jsret(cx, JS::ObjectOrNullValue(retObj));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_getMeshDisplay : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_dragonbones_Slot_setDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_setDisplay : Invalid Native Object");
    if (argc == 2) {
        ok = true;
        js_proxy_t *jsProxy;
        JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
        jsProxy = jsb_get_js_proxy(cx, tmpObj);
        dragonBones::DBCCSprite* arg0 = (dragonBones::DBCCSprite*)(jsProxy ? jsProxy->ptr : NULL);
        dragonBones::DisplayType arg1;
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_setDisplay : Error processing arguments");
        cobj->setDisplay(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_setDisplay : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

extern JS::PersistentRootedObject *jsb_dragonBones_Armature_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_ArmatureData_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_DragonBonesData_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_CCArmatureDisplay_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_AnimationState_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_TransformObject_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_WorldClock_prototype;
extern JS::PersistentRootedObject *jsb_dragonBones_Slot_prototype;

void register_all_cocos2dx_dragonbones_manual(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject armature(cx, jsb_dragonBones_Armature_prototype->get());
    JS_DefineFunction(cx, armature, "getAnimation", js_cocos2dx_dragonbones_Armature_getAnimation, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, armature, "getArmatureData", js_cocos2dx_dragonbones_Armature_getArmatureData, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, armature, "getDisplay", js_cocos2dx_dragonbones_Armature_getDisplay, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject armatureDisplay(cx, jsb_dragonBones_CCArmatureDisplay_prototype->get());
    JS_DefineFunction(cx, armatureDisplay, "getAnimation", js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject animationState(cx, jsb_dragonBones_AnimationState_prototype->get());
    JS_DefineFunction(cx, animationState, "getAnimationData", js_cocos2dx_dragonbones_AnimationState_getAnimationData, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject armatureData(cx, jsb_dragonBones_ArmatureData_prototype->get());
    JS_DefineProperty(cx, armatureData, "animations", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_ArmatureData_get_animations);
    JS_DefineProperty(cx, armatureData, "bones", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_ArmatureData_get_bones);
    JS_DefineProperty(cx, armatureData, "skins", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_ArmatureData_get_skins);
    JS_DefineProperty(cx, armatureData, "slots", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_ArmatureData_get_slots);

    JS::RootedObject dragonBonesData(cx, jsb_dragonBones_DragonBonesData_prototype->get());
    JS_DefineProperty(cx, dragonBonesData, "armatureNames", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames);

    JS::RootedObject tmpObj(cx);
    get_or_create_js_obj(cx, global, "dragonBones", &tmpObj);
    get_or_create_js_obj(cx, tmpObj, "WorldClock", &tmpObj);
    JS_DefineProperty(cx, tmpObj, "clock", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_WorldClock_getClock);

    JS::RootedObject worldClock(cx, jsb_dragonBones_WorldClock_prototype->get());
    JS_DefineFunction(cx, worldClock, "add", js_cocos2dx_dragonbones_WorldClock_add, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, worldClock, "remove", js_cocos2dx_dragonbones_WorldClock_remove, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS::RootedObject factoryObj(cx);
    get_or_create_js_obj(cx, global, "dragonBones", &factoryObj);
    get_or_create_js_obj(cx, factoryObj, "CCFactory", &factoryObj);
    JS_DefineFunction(cx, factoryObj, "getFactory", js_cocos2dx_dragonbones_CCFactory_getFactory, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject transformObject(cx, jsb_dragonBones_TransformObject_prototype->get());
    JS_DefineProperty(cx, transformObject, "global", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_TransformObject_getGlobal);
    JS_DefineProperty(cx, transformObject, "origin", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_TransformObject_getOrigin);
    JS_DefineProperty(cx, transformObject, "offset", JS::UndefinedHandleValue, JSPROP_ENUMERATE | JSPROP_SHARED, js_cocos2dx_dragonbones_TransformObject_getOffset);
    
    JS::RootedObject slotObject(cx, jsb_dragonBones_Slot_prototype->get());
    JS_DefineFunction(cx, slotObject, "getRawDisplay", js_cocos2dx_dragonbones_Slot_getRawDisplay, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, slotObject, "getDisplay", js_cocos2dx_dragonbones_Slot_getDisplay, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, slotObject, "getMeshDisplay", js_cocos2dx_dragonbones_Slot_getMeshDisplay, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, slotObject, "setDisplay", js_cocos2dx_dragonbones_Slot_setDisplay, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}
