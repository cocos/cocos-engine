/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "Class.h"
#include "Object.h"
#include "ScriptEngine.h"
#include "Utils.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

namespace se {

// --- Global Lookup for Constructor Functions

namespace {
//        std::unordered_map<std::string, Class *> __clsMap;
JSContext *__cx = nullptr;

bool empty_constructor(JSContext *cx, uint32_t argc, JS::Value *vp) {
    assert(false);
    return true;
}

ccstd::vector<Class *> __allClasses;

} // namespace

Class::Class()
: _parent(nullptr),
  _proto(nullptr),
  _parentProto(nullptr),
  _ctor(nullptr),
  _finalizeOp(nullptr) {
    memset(&_jsCls, 0, sizeof(_jsCls));
    memset(&_classOps, 0, sizeof(_classOps));

    __allClasses.push_back(this);
}

Class::~Class() {
}

Class *Class::create(const char *className, Object *obj, Object *parentProto, JSNative ctor) {
    Class *cls = ccnew Class();
    if (cls != nullptr && !cls->init(className, obj, parentProto, ctor)) {
        delete cls;
        cls = nullptr;
    }
    return cls;
}

Class *Class::create(const std::initializer_list<const char *> &classPath, se::Object *parent, Object *parentProto, JSNative ctor) {
    se::AutoHandleScope scope;
    se::Object *currentParent = parent;
    se::Value tmp;
    for (auto i = 0; i < classPath.size() - 1; i++) {
        bool ok = currentParent->getProperty(*(classPath.begin() + i), &tmp);
        CC_ASSERT(ok); // class or namespace in path is not defined
        currentParent = tmp.toObject();
    }
    return create(*(classPath.end() - 1), currentParent, parentProto, ctor);
}

bool Class::init(const char *clsName, Object *parent, Object *parentProto, JSNative ctor) {
    _name = clsName;

    _parent = parent;
    if (_parent != nullptr)
        _parent->incRef();

    _parentProto = parentProto;
    if (_parentProto != nullptr)
        _parentProto->incRef();

    _ctor = ctor;
    if (_ctor == nullptr) {
        _ctor = empty_constructor;
    }

    //        SE_LOGD("Class init ( %s ) ...\n", clsName);
    return true;
}

void Class::destroy() {
    SAFE_DEC_REF(_parent);
    SAFE_DEC_REF(_proto);
    SAFE_DEC_REF(_parentProto);
}

/* static */
void Class::onTraceCallback(JSTracer *trc, JSObject *obj) {
    auto *seObj = reinterpret_cast<Object *>(internal::SE_JS_GetPrivate(obj, 1));
    if (seObj != nullptr) {
        JS::TraceEdge(trc, &seObj->_heap, "seObj");
    }
}

bool Class::install() {
    //        assert(__clsMap.find(_name) == __clsMap.end());
    //
    //        __clsMap.emplace(_name, this);

    _jsCls.name = _name;
    _jsCls.flags = JSCLASS_USERBIT1 | JSCLASS_HAS_RESERVED_SLOTS(2) | JSCLASS_FOREGROUND_FINALIZE; //IDEA: Use JSCLASS_BACKGROUND_FINALIZE to improve GC performance
    if (_finalizeOp != nullptr) {
        _classOps.finalize = _finalizeOp;
    } else {
        _classOps.finalize = [](JSFreeOp *fop, JSObject *obj) {};
    }

    _classOps.trace = Class::onTraceCallback;

    _jsCls.cOps = &_classOps;

    JSObject *parentObj = _parentProto != nullptr ? _parentProto->_getJSObject() : nullptr;
    JS::RootedObject parentProto(__cx, parentObj);
    JS::RootedObject parent(__cx, _parent->_getJSObject());

    _funcs.push_back(JS_FS_END);
    _properties.push_back(JS_PS_END);
    _staticFuncs.push_back(JS_FS_END);
    _staticProperties.push_back(JS_PS_END);

    JS::RootedObject jsobj(__cx, JS_InitClass(__cx, parent, parentProto, &_jsCls, _ctor, 0, _properties.data(), _funcs.data(), _staticProperties.data(), _staticFuncs.data()));
    if (jsobj != nullptr) {
        _proto = Object::_createJSObject(nullptr, jsobj);
        //            SE_LOGD("_proto: %p, name: %s\n", _proto, _name);
        _proto->root();
        return true;
    }

    return false;
}

bool Class::defineFunction(const char *name, JSNative func) {
    JSFunctionSpec cb = JS_FN(name, func, 0, JSPROP_ENUMERATE);
    _funcs.push_back(cb);
    return true;
}

bool Class::defineProperty(const char *name, JSNative getter, JSNative setter) {
    JSPropertySpec property = JS_PSGS(name, getter, setter, JSPROP_ENUMERATE);
    _properties.push_back(property);
    return true;
}

bool Class::defineProperty(const std::initializer_list<const char *> &names, JSNative getter, JSNative setter) {
    bool ret = true;
    for (const auto *name : names) {
        ret &= defineProperty(name, getter, setter);
    }
    return ret;
}

bool Class::defineStaticFunction(const char *name, JSNative func) {
    JSFunctionSpec cb = JS_FN(name, func, 0, JSPROP_ENUMERATE);
    _staticFuncs.push_back(cb);
    return true;
}

bool Class::defineStaticProperty(const char *name, JSNative getter, JSNative setter) {
    JSPropertySpec property = JS_PSGS(name, getter, setter, JSPROP_ENUMERATE);
    _staticProperties.push_back(property);
    return true;
}

bool Class::defineFinalizeFunction(JSFinalizeOp func) {
    _finalizeOp = func;
    return true;
}

//    JSObject* Class::_createJSObject(const std::string &clsName, Class** outCls)
//    {
//        auto iter = __clsMap.find(clsName);
//        if (iter == __clsMap.end())
//        {
//            *outCls = nullptr;
//            return nullptr;
//        }
//
//        Class* thiz = iter->second;
//        JS::RootedObject obj(__cx, _createJSObjectWithClass(thiz));
//        *outCls = thiz;
//        return obj;
//    }

void Class::_createJSObjectWithClass(Class *cls, JS::MutableHandleObject outObj) {
    JSObject *proto = cls->_proto != nullptr ? cls->_proto->_getJSObject() : nullptr;
    JS::RootedObject jsProto(__cx, proto);
    outObj.set(JS_NewObjectWithGivenProto(__cx, &cls->_jsCls, jsProto));
}

void Class::setContext(JSContext *cx) {
    __cx = cx;
}

Object *Class::getProto() {
    return _proto;
}

JSFinalizeOp Class::_getFinalizeCb() const {
    return _finalizeOp;
}

void Class::cleanup() {
    for (auto cls : __allClasses) {
        cls->destroy();
    }

    se::ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        for (auto cls : __allClasses) {
            delete cls;
        }
        __allClasses.clear();
    });
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
