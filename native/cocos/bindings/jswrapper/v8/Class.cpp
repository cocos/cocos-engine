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
#include <initializer_list>
#include "Value.h"
#include "base/Macros.h"
#include "v8/HelperMacros.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "Object.h"
    #include "ScriptEngine.h"
    #include "Utils.h"

namespace {
inline v8::Local<v8::Value> createExternal(v8::Isolate *isolate, void *data) {
    if (data) {
        return v8::External::New(isolate, data);
    }
    return {};
}
} // namespace

namespace se {
// ------------------------------------------------------- Object

namespace {
//        ccstd::unordered_map<ccstd::string, Class *> __clsMap;
v8::Isolate *__isolate = nullptr;    // NOLINT
ccstd::vector<Class *> __allClasses; // NOLINT

void invalidConstructor(const v8::FunctionCallbackInfo<v8::Value> &args) {
    v8::Local<v8::Object> thisObj = args.This();
    v8::Local<v8::String> constructorName = thisObj->GetConstructorName();
    v8::String::Utf8Value strConstructorName{args.GetIsolate(), constructorName};
    SE_ASSERT(false, "%s 's constructor is not public!", *strConstructorName); // NOLINT(misc-static-assert)
}

} // namespace

Class::Class() {
    __allClasses.push_back(this);
}

Class::~Class() = default;

/* static */
Class *Class::create(const ccstd::string &clsName, Object *parent, Object *parentProto, v8::FunctionCallback ctor, void *data) {
    auto *cls = ccnew Class();
    if (cls != nullptr && !cls->init(clsName, parent, parentProto, ctor, data)) {
        delete cls;
        cls = nullptr;
    }
    return cls;
}

Class *Class::create(const std::initializer_list<const char *> &classPath, Object *parent, Object *parentProto, v8::FunctionCallback ctor, void *data) {
    se::AutoHandleScope scope;
    se::Value currentParent{parent};
    for (auto i = 0; i < classPath.size() - 1; i++) {
        se::Value tmp;
        bool ok = currentParent.toObject()->getProperty(*(classPath.begin() + i), &tmp);
        CC_ASSERT(ok); // class or namespace in path is not defined
        currentParent = tmp;
    }
    return create(*(classPath.end() - 1), currentParent.toObject(), parentProto, ctor, data);
}

bool Class::init(const ccstd::string &clsName, Object *parent, Object *parentProto, v8::FunctionCallback ctor, void *data) {
    _name = clsName;
    _parent = parent;
    if (_parent != nullptr) {
        _parent->incRef();
    }

    _parentProto = parentProto;
    if (_parentProto != nullptr) {
        _parentProto->incRef();
    }

    _constructor = ctor;

    v8::FunctionCallback ctorToSet = _constructor != nullptr ? _constructor : invalidConstructor;

    _constructorTemplate.Reset(__isolate, v8::FunctionTemplate::New(__isolate, ctorToSet, createExternal(__isolate, data)));
    v8::MaybeLocal<v8::String> jsNameVal = v8::String::NewFromUtf8(__isolate, _name.c_str(), v8::NewStringType::kNormal);
    if (jsNameVal.IsEmpty()) {
        return false;
    }

    _constructorTemplate.Get(__isolate)->SetClassName(jsNameVal.ToLocalChecked());
    _constructorTemplate.Get(__isolate)->InstanceTemplate()->SetInternalFieldCount(1);

    return true;
}

void Class::_setCtor(Object *obj) {
    assert(!_ctor.has_value());
    _ctor = obj;
    if (obj != nullptr) {
        obj->root();
        obj->incRef();
    }
}

void Class::destroy() {
    SAFE_DEC_REF(_parent);
    SAFE_DEC_REF(_proto);
    SAFE_DEC_REF(_parentProto);
    if (_ctor.has_value()) {
        if (_ctor.value() != nullptr) {
            _ctor.value()->unroot();
            _ctor.value()->decRef();
        }
        _ctor.reset();
    }
    _constructorTemplate.Reset();
}

void Class::cleanup() {
    for (auto *cls : __allClasses) {
        cls->destroy();
    }

    se::ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        for (auto *cls : __allClasses) {
            delete cls;
        }
        __allClasses.clear();
    });
}

void Class::setCreateProto(bool createProto) {
    _createProto = createProto;
}

bool Class::install() {
    //        assert(__clsMap.find(_name) == __clsMap.end());
    //
    //        __clsMap.emplace(_name, this);

    if (_parentProto != nullptr) {
        _constructorTemplate.Get(__isolate)->Inherit(_parentProto->_getClass()->_constructorTemplate.Get(__isolate));
    }

    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
    v8::MaybeLocal<v8::Function> ctor = _constructorTemplate.Get(__isolate)->GetFunction(context);
    if (ctor.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Function> ctorChecked = ctor.ToLocalChecked();
    v8::MaybeLocal<v8::String> name = v8::String::NewFromUtf8(__isolate, _name.c_str(), v8::NewStringType::kNormal);
    if (name.IsEmpty()) {
        return false;
    }

    v8::Maybe<bool> result = _parent->_getJSObject()->Set(context, name.ToLocalChecked(), ctorChecked);
    if (result.IsNothing()) {
        return false;
    }

    v8::MaybeLocal<v8::String> prototypeName = v8::String::NewFromUtf8(__isolate, "prototype", v8::NewStringType::kNormal);
    if (prototypeName.IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::Value> prototypeObj = ctorChecked->Get(context, prototypeName.ToLocalChecked());
    if (prototypeObj.IsEmpty()) {
        return false;
    }

    if (_createProto) {
        // Proto object is released in Class::destroy.
        _proto = Object::_createJSObject(this, v8::Local<v8::Object>::Cast(prototypeObj.ToLocalChecked()));
        _proto->root();
    }
    return true;
}

bool Class::defineFunction(const char *name, v8::FunctionCallback func, void *data) {
    v8::MaybeLocal<v8::String> jsName = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (jsName.IsEmpty()) {
        return false;
    }

    _constructorTemplate.Get(__isolate)->PrototypeTemplate()->Set(jsName.ToLocalChecked(), v8::FunctionTemplate::New(__isolate, func, createExternal(__isolate, data)));
    return true;
}

bool Class::defineProperty(const char *name, v8::FunctionCallback getter, v8::FunctionCallback setter, void *data) {
    v8::MaybeLocal<v8::String> jsName = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (jsName.IsEmpty()) {
        return false;
    }

    auto prototypeTemplate = _constructorTemplate.Get(__isolate)->PrototypeTemplate();
    auto externalData = createExternal(__isolate, data);

    v8::Local<v8::FunctionTemplate> getterTemplate = v8::Local<v8::FunctionTemplate>();
    v8::Local<v8::FunctionTemplate> setterTemplate = v8::Local<v8::FunctionTemplate>();

    if (getter != nullptr) {
        getterTemplate = v8::FunctionTemplate::New(__isolate, getter, externalData);
    }

    if (setter != nullptr) {
        setterTemplate = v8::FunctionTemplate::New(__isolate, setter, externalData);
    }
    prototypeTemplate->SetAccessorProperty(jsName.ToLocalChecked(), getterTemplate, setterTemplate);
    return true;
}

bool Class::defineProperty(const std::initializer_list<const char *> &names, v8::FunctionCallback getter, v8::FunctionCallback setter, void *data) {
    bool ret = true;
    for (const auto *name : names) {
        ret &= defineProperty(name, getter, setter, data);
    }
    return ret;
}

bool Class::defineStaticFunction(const char *name, v8::FunctionCallback func, void *data) {
    v8::MaybeLocal<v8::String> jsName = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (jsName.IsEmpty()) {
        return false;
    }
    _constructorTemplate.Get(__isolate)->Set(jsName.ToLocalChecked(), v8::FunctionTemplate::New(__isolate, func, createExternal(__isolate, data)));
    return true;
}

bool Class::defineStaticProperty(const char *name, v8::FunctionCallback getter, v8::FunctionCallback setter, void *data) {
    v8::MaybeLocal<v8::String> jsName = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (jsName.IsEmpty()) {
        return false;
    }

    auto externalData = createExternal(__isolate, data);
    v8::Local<v8::FunctionTemplate> getterTemplate = v8::Local<v8::FunctionTemplate>();
    v8::Local<v8::FunctionTemplate> setterTemplate = v8::Local<v8::FunctionTemplate>();

    if (getter != nullptr) {
        getterTemplate = v8::FunctionTemplate::New(__isolate, getter, externalData);
    }

    if (setter != nullptr) {
        setterTemplate = v8::FunctionTemplate::New(__isolate, setter, externalData);
    }

    _constructorTemplate.Get(__isolate)->SetAccessorProperty(jsName.ToLocalChecked(), getterTemplate, setterTemplate);
    return true;
}

bool Class::defineStaticProperty(const char *name, const Value &value, PropertyAttribute attribute /* = PropertyAttribute::NONE */) {
    v8::MaybeLocal<v8::String> jsName = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (jsName.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Value> v8Val;
    internal::seToJsValue(__isolate, value, &v8Val);
    _constructorTemplate.Get(__isolate)->Set(jsName.ToLocalChecked(), v8Val, static_cast<v8::PropertyAttribute>(attribute));
    return true;
}

bool Class::defineFinalizeFunction(V8FinalizeFunc finalizeFunc) {
    CC_ASSERT_NOT_NULL(finalizeFunc);
    _finalizeFunc = finalizeFunc;
    return true;
}

//    v8::Local<v8::Object> Class::_createJSObject(const ccstd::string &clsName, Class** outCls)
//    {
//        auto iter = __clsMap.find(clsName);
//        if (iter == __clsMap.end())
//        {
//            *outCls = nullptr;
//            return v8::Local<v8::Object>::Cast(v8::Undefined(__isolate));
//        }
//
//        *outCls = iter->second;
//        return _createJSObjectWithClass(iter->second);
//    }

v8::Local<v8::Object> Class::_createJSObjectWithClass(Class *cls) { // NOLINT
    v8::MaybeLocal<v8::Object> ret = cls->_constructorTemplate.Get(__isolate)->InstanceTemplate()->NewInstance(__isolate->GetCurrentContext());
    CC_ASSERT(!ret.IsEmpty());
    return ret.ToLocalChecked();
}

Object *Class::getProto() const {
    return _proto;
}

V8FinalizeFunc Class::_getFinalizeFunction() const { // NOLINT
    return _finalizeFunc;
}

/* static */
void Class::setIsolate(v8::Isolate *isolate) {
    __isolate = isolate;
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
