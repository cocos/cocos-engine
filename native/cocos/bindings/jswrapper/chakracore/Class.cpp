/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "Class.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

    #include "Object.h"
    #include "Utils.h"
    #include "State.h"
    #include "ScriptEngine.h"
    #include "../HandleObject.h"

namespace se {

    #define JS_FN(name, func) \
        { name, func }
    #define JS_FS_END JS_FN(0, 0)
    #define JS_PSGS(name, getter, setter) \
        { name, getter, setter }
    #define JS_PS_END JS_PSGS(0, 0, 0)

namespace {
//        std::unordered_map<std::string, Class *> __clsMap;
std::vector<Class *> __allClasses;

JsValueRef emptyContructor(JsValueRef callee, bool isConstructCall, JsValueRef *arguments, unsigned short argumentCount, void *callbackState) {
    return JS_INVALID_REFERENCE;
}

void defaultFinalizeCallback(void *nativeThisObject) {
    if (nativeThisObject != nullptr) {
        State state(nativeThisObject);
        Object *_thisObject = state.thisObject();
        if (_thisObject) _thisObject->_cleanup(nativeThisObject);
        SAFE_DEC_REF(_thisObject);
    }
}
} // namespace

Class::Class()
: _parent(nullptr),
  _proto(nullptr),
  _parentProto(nullptr),
  _ctor(nullptr),
  _finalizeOp(nullptr) {
    __allClasses.push_back(this);
}

Class::~Class() {
}

Class *Class::create(const std::string &className, Object *obj, Object *parentProto, JsNativeFunction ctor) {
    Class *cls = new Class();
    if (cls != nullptr && !cls->init(className, obj, parentProto, ctor)) {
        delete cls;
        cls = nullptr;
    }
    return cls;
}

bool Class::init(const std::string &clsName, Object *parent, Object *parentProto, JsNativeFunction ctor) {
    _name = clsName;
    _parent = parent;
    if (_parent != nullptr)
        _parent->incRef();
    _parentProto = parentProto;

    if (_parentProto != nullptr)
        _parentProto->incRef();
    _ctor = ctor;

    return true;
}

bool Class::install() {
    JsValueRef funcName;
    _CHECK(JsCreateString(_name.c_str(), _name.length(), &funcName));
    JsValueRef jsConstructor;
    if (_ctor == nullptr) {
        _ctor = emptyContructor;
    }
    _CHECK(JsCreateNamedFunction(funcName, _ctor, nullptr, &jsConstructor));

    HandleObject ctorObj(Object::_createJSObject(nullptr, jsConstructor));

    // create class's prototype and project its member functions
    JsValueRef prototype;
    _CHECK(JsCreateObject(&prototype));

    Object *prototypeObj = Object::_createJSObject(this, prototype);
    prototypeObj->root();

    for (const auto &func : _funcs) {
        prototypeObj->defineFunction(func.name, func.func);
    }

    for (const auto &property : _properties) {
        internal::defineProperty(prototype, property.name, property.getter, property.setter, true, true);
    }

    prototypeObj->setProperty("constructor", Value(ctorObj));

    ctorObj->setProperty("prototype", Value(prototypeObj));

    if (_parentProto != nullptr) {
        _CHECK(JsSetPrototype(prototype, _parentProto->_getJSObject()));
    }

    for (const auto &sfunc : _staticFuncs) {
        ctorObj->defineFunction(sfunc.name, sfunc.func);
    }

    for (const auto &property : _staticProperties) {
        internal::defineProperty(jsConstructor, property.name, property.getter, property.setter, true, true);
    }

    _proto = prototypeObj;
    _parent->setProperty(_name.c_str(), Value(ctorObj));

    return true;
}

bool Class::defineFunction(const char *name, JsNativeFunction func) {
    JSFunctionSpec cb = JS_FN(name, func);
    _funcs.push_back(cb);
    return true;
}

bool Class::defineProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter) {
    JSPropertySpec property = JS_PSGS(name, getter, setter);
    _properties.push_back(property);
    return true;
}

bool Class::defineStaticFunction(const char *name, JsNativeFunction func) {
    JSFunctionSpec cb = JS_FN(name, func);
    _staticFuncs.push_back(cb);
    return true;
}

bool Class::defineStaticProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter) {
    JSPropertySpec property = JS_PSGS(name, getter, setter);
    _staticProperties.push_back(property);
    return true;
}

bool Class::defineFinalizeFunction(JsFinalizeCallback func) {
    _finalizeOp = func;
    return true;
}

//    JsValueRef Class::_createJSObject(const std::string &clsName, Class** outCls)
//    {
//        auto iter = __clsMap.find(clsName);
//        if (iter == __clsMap.end())
//        {
//            *outCls = nullptr;
//            return nullptr;
//        }
//
//        Class* thiz = iter->second;
//        *outCls = thiz;
//        return _createJSObjectWithClass(thiz);
//    }

JsValueRef Class::_createJSObjectWithClass(Class *cls) {
    JsValueRef obj;

    JsFinalizeCallback finalizeCb = cls->_finalizeOp == nullptr ? defaultFinalizeCallback : cls->_finalizeOp;
    _CHECK(JsCreateExternalObject(nullptr, finalizeCb, &obj));

    _CHECK(JsSetPrototype(obj, cls->getProto()->_getJSObject()));
    return obj;
}

Object *Class::getProto() {
    return _proto;
}

void Class::destroy() {
    SAFE_DEC_REF(_parent);
    SAFE_DEC_REF(_proto);
    SAFE_DEC_REF(_parentProto);
}

void Class::cleanup() {
    for (auto cls : __allClasses) {
        cls->destroy();
    }

    ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        for (auto cls : __allClasses) {
            delete cls;
        }
        __allClasses.clear();
    });
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE
