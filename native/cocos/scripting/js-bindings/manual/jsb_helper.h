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

#ifndef __XMLHTTPHELPER_H__
#define __XMLHTTPHELPER_H__

#include "jsapi.h"
#include "jsfriendapi.h"

#include <typeinfo>
#include <string>
#include <memory>

//#pragma mark - Helpful Macros

#define JS_BINDED_CLASS_GLUE(klass) \
static JSClass* js_class; \
static JSObject* js_proto; \
static void _js_register(JSContext* cx, JS::HandleObject global);

#define JS_BINDED_CLASS_GLUE_IMPL(klass) \
JSClass* klass::js_class = nullptr; \
JSObject* klass::js_proto = nullptr; \

#define JS_BINDED_FUNC(klass, name) \
bool name(JSContext *cx, uint32_t argc, JS::Value *vp)

#define JS_BINDED_CONSTRUCTOR(klass) \
static bool _js_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)

#define JS_BINDED_CONSTRUCTOR_IMPL(klass) \
bool klass::_js_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)

#define JS_BINDED_FUNC_IMPL(klass, name) \
static bool klass##_func_##name(JSContext *cx, uint32_t argc, JS::Value *vp) { \
JS::CallArgs args = JS::CallArgsFromVp(argc, vp); \
JS::RootedObject thisObj(cx, args.thisv().toObjectOrNull()); \
klass* obj = (klass*)JS_GetPrivate(thisObj); \
if (obj) { \
return obj->name(cx, argc, vp); \
} \
JS_ReportErrorUTF8(cx, "Invalid object call for function %s", #name); \
return false; \
} \
bool klass::name(JSContext *cx, uint32_t argc, JS::Value *vp)

#define JS_BINDED_FUNC_FOR_DEF(klass, name) \
JS_FN(#name, klass##_func_##name, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT)

#define JS_BINDED_PROP_GET(klass, propName) \
bool _js_get_##propName(JSContext *cx, const JS::CallArgs& args)

#define JS_BINDED_PROP_GET_IMPL(klass, propName) \
static bool _js_get_##klass##_##propName(JSContext *cx, uint32_t argc, JS::Value *vp) { \
JS::CallArgs args = JS::CallArgsFromVp(argc, vp); \
JS::RootedObject obj(cx, args.thisv().toObjectOrNull()); \
klass* cobj = (klass*)JS_GetPrivate(obj); \
if (cobj) { \
return cobj->_js_get_##propName(cx, args); \
} \
JS_ReportErrorUTF8(cx, "Invalid getter call for property %s", #propName); \
return false; \
} \
bool klass::_js_get_##propName(JSContext *cx, const JS::CallArgs& args)

#define JS_BINDED_PROP_SET(klass, propName) \
bool _js_set_##propName(JSContext *cx, const JS::CallArgs& args)

#define JS_BINDED_PROP_SET_IMPL(klass, propName) \
static bool _js_set_##klass##_##propName(JSContext *cx, uint32_t argc, JS::Value *vp) { \
JS::CallArgs args = JS::CallArgsFromVp(argc, vp); \
JS::RootedObject obj(cx, args.thisv().toObjectOrNull()); \
klass* cobj = (klass*)JS_GetPrivate(obj); \
if (cobj) { \
return cobj->_js_set_##propName(cx, args); \
} \
JS_ReportErrorUTF8(cx, "Invalid setter call for property %s", #propName); \
return false; \
} \
bool klass::_js_set_##propName(JSContext *cx, const JS::CallArgs& args)

#define JS_BINDED_PROP_ACCESSOR(klass, propName) \
JS_BINDED_PROP_GET(klass, propName); \
JS_BINDED_PROP_SET(klass, propName);

#define JS_BINDED_PROP_DEF_GETTER(klass, propName) \
JS_PSG(#propName, _js_get_##klass##_##propName, JSPROP_ENUMERATE | JSPROP_PERMANENT)

#define JS_BINDED_PROP_DEF_ACCESSOR(klass, propName) \
JS_PSGS(#propName, _js_get_##klass##_##propName, _js_set_##klass##_##propName, JSPROP_ENUMERATE | JSPROP_PERMANENT)

#endif /* __XMLHTTPHELPER_H__ */
