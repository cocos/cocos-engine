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

bool js_cocos2dx_dragonbones_Armature_getAnimation(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getAnimation : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Animation& ret = cobj->getAnimation();
        jsval jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<dragonBones::Animation>(cx, (dragonBones::Animation*)&ret));
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_cocos2dx_dragonbones_Armature_getAnimation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JSObject *jsb_dragonBones_Armature_prototype;

void register_all_cocos2dx_dragonbones_manual(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject armature(cx, jsb_dragonBones_Armature_prototype);
    JS_DefineFunction(cx, armature, "getAnimation", js_cocos2dx_dragonbones_Armature_getAnimation, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}
