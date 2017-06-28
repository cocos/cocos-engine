/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
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

#include "scripting/js-bindings/manual/js_bindings_opengl.h"

#include "base/CCDirector.h"
#include "renderer/CCRenderer.h"

JSClass *jsb_cocos2d_GLNode_class;
JS::PersistentRootedObject *jsb_cocos2d_GLNode_prototype;

NS_CC_BEGIN

void GLNode::draw(Renderer *renderer, const Mat4& transform, uint32_t flags) {
    _customCommand.init(_globalZOrder);
    _customCommand.func = CC_CALLBACK_0(GLNode::onDraw, this, transform, flags);
    renderer->addCommand(&_customCommand);
}

void GLNode::onDraw(Mat4 &transform, uint32_t flags)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();

    JS::RootedObject jsObj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_GLNode_prototype->get());
    jsb_ref_get_or_create_jsobject(cx, this, jsb_cocos2d_GLNode_class, proto, &jsObj, "cocos2d::GLNode");

    if (jsObj.get())
    {
         bool found = false;

         JS_HasProperty(cx, jsObj, "draw", &found);
         if (found) {
             auto director = Director::getInstance();
             director->pushMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
             director->loadMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW, transform);

             JS::RootedValue rval(cx);
             JS::RootedValue fval(cx);
             JS_GetProperty(cx, jsObj, "draw", &fval);

             JS_CallFunctionValue(cx, jsObj, fval, JS::HandleValueArray::empty(), &rval);

             director->popMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
        }
    }
}

NS_CC_END

bool js_cocos2dx_GLNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc == 0) {
        cocos2d::GLNode* cobj = new (std::nothrow) cocos2d::GLNode;

        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_GLNode_prototype->get());
        jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_GLNode_class, proto, &jsobj, "cocos2d::GLNode");
        
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(jsobj));
        args.rval().set(objVal);

        bool ok=false;
        if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        {
            JS::HandleValueArray argsv(args);
            ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
        }
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

static bool js_cocos2dx_GLNode_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::GLNode *nobj = new (std::nothrow) cocos2d::GLNode;
    jsb_new_proxy(cx, nobj, obj);
    jsb_ref_init(cx, obj, nobj, "cocos2d::GLNode");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
    {
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(obj));
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
    }
    args.rval().setUndefined();
    return true;
}

extern JS::PersistentRootedObject* jsb_cocos2d_Node_prototype;

void js_register_cocos2dx_GLNode(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps GLNode_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    
    static JSClass GLNode_class = {
        "GLNode",
        JSCLASS_HAS_PRIVATE,
        &GLNode_classOps
    };
    jsb_cocos2d_GLNode_class = &GLNode_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("ctor", js_cocos2dx_GLNode_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parentProto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parentProto,
        jsb_cocos2d_GLNode_class,
        js_cocos2dx_GLNode_constructor, 0, // constructor
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::GLNode>(cx, jsb_cocos2d_GLNode_class, proto);
    jsb_cocos2d_GLNode_prototype = typeClass->proto;
    
    make_class_extend(cx, proto);
}
