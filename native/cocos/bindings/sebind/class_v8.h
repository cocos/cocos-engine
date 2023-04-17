/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include "class.inl"
#include "cocos/bindings/jswrapper/ValueArrayPool.h"

namespace sebind {
// finalizer callback
template <typename T>
void genericFinalizer(se::Object *obj) {
    se::PrivateObjectBase *privateObject = obj->getPrivateObject();
    using context_type = typename class_<T>::Context;
    if (privateObject == nullptr) {
        return;
    }
    auto *scriptEngine = se::ScriptEngine::getInstance();
    scriptEngine->_setGarbageCollecting(true);
    auto *self = reinterpret_cast<context_type *>(privateObject->finalizerData);
    auto *thisPtr = privateObject->get<T>();
    for (auto &fin : self->finalizeCallbacks) {
        fin->finalize(thisPtr);
    }
    scriptEngine->_setGarbageCollecting(false);
}

// function wrappers for v8
template <typename T>
void genericConstructor(const v8::FunctionCallbackInfo<v8::Value> &v8args) {
    using context_type = typename class_<T>::Context;
    v8::Isolate *isolate = v8args.GetIsolate();
    v8::HandleScope handleScope(isolate);
    int ctorInvokeTimes{0};
    bool constructed{false};
    bool needDeleteValueArray{false};
    se::ValueArray &args = se::gValueArrayPool.get(v8args.Length(), needDeleteValueArray);
    se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth, needDeleteValueArray};
    se::internal::jsToSeArgs(v8args, args);
    auto *self = reinterpret_cast<context_type *>(v8args.Data().IsEmpty() ? nullptr : v8args.Data().As<v8::External>()->Value());
    se::Object *thisObject = se::Object::_createJSObject(self->kls, v8args.This());
    if (!self->finalizeCallbacks.empty()) {
        auto *finalizer = &genericFinalizer<T>;
        thisObject->_setFinalizeCallback(finalizer);
    }
    se::State state(thisObject, args);

    assert(!self->constructors.empty());
    for (auto &ctor : self->constructors) {
        if (ctor->argCount == -1 || ctor->argCount == args.size()) {
            ctorInvokeTimes++;
            constructed = ctor->construct(state);
            if (constructed) break;
        }
    }

    if (ctorInvokeTimes == 0) {
        SE_LOGE("[ERROR] Failed match constructor for class %s, %d args, location: %s:%d\n", self->className.c_str(),
                static_cast<int>(args.size()), __FILE__, __LINE__);
    }

    if (!constructed) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", "constructor", __FILE__, __LINE__);
    }

    assert(constructed); // construction failure is not allowed.

    if (!self->finalizeCallbacks.empty()) {
        state.thisObject()->getPrivateObject()->finalizerData = self;
    }

    se::Value propertyVal;
    if (thisObject->getProperty("_ctor", &propertyVal, true)) {
        propertyVal.toObject()->call(args, thisObject);
    }
}
// v8 property callback
template <typename ContextType>
void genericAccessorSet(const v8::FunctionCallbackInfo<v8::Value> &v8args) {
    auto *attr = reinterpret_cast<ContextType *>(v8args.Data().IsEmpty() ? nullptr : v8args.Data().As<v8::External>()->Value());
    assert(attr);
    v8::Isolate *isolate = v8args.GetIsolate();
    v8::HandleScope handleScope(isolate);
    bool ret = true;
    auto *thisObject = reinterpret_cast<se::Object *>(se::internal::getPrivate(isolate, v8args.This()));
    bool needDeleteValueArray{false};
    se::ValueArray &args = se::gValueArrayPool.get(1, needDeleteValueArray);
    se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth, needDeleteValueArray};
    se::Value &data{args[0]};
    se::internal::jsToSeValue(isolate, v8args[0], &data);
    se::State state(thisObject, args);
    ret = attr->set(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke set %s, location: %s:%d\n", attr->attrName.c_str(), __FILE__, __LINE__);
    }
}
template <typename ContextType>
void genericAccessorGet(const v8::FunctionCallbackInfo<v8::Value> &v8args) {
    auto *attr = reinterpret_cast<ContextType *>(v8args.Data().IsEmpty() ? nullptr : v8args.Data().As<v8::External>()->Value());
    assert(attr);
    v8::Isolate *isolate = v8args.GetIsolate();
    v8::HandleScope handleScope(isolate);
    bool ret = true;
    auto *thisObject = reinterpret_cast<se::Object *>(se::internal::getPrivate(isolate, v8args.This()));
    se::State state(thisObject);
    ret = attr->get(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", attr->attrName.c_str(), __FILE__, __LINE__);
    }
    se::internal::setReturnValue(state.rval(), v8args);
}

void genericFunction(const v8::FunctionCallbackInfo<v8::Value> &v8args);

template <typename T>
bool class_<T>::install(se::Object *nsObject) {
    constexpr auto *cstp = &genericConstructor<T>;
    assert(nsObject);
    _installed = true;

    if (_ctx->constructors.empty()) {
        if constexpr (std::is_default_constructible<T>::value) {
            constructor(); // add default constructor
        }
    }
    _ctx->kls = se::Class::create(_ctx->className, nsObject, _ctx->parentProto, cstp, _ctx);

    auto *getter = &genericAccessorGet<intl::InstanceAttributeBase>;
    auto *setter = &genericAccessorSet<intl::InstanceAttributeBase>;
    for (auto &attr : _ctx->properties) {
        _ctx->kls->defineProperty(std::get<0>(attr).c_str(), getter, setter, std::get<1>(attr).get());
    }
    auto *fieldGetter = &genericAccessorGet<intl::InstanceFieldBase>;
    auto *fieldSetter = &genericAccessorSet<intl::InstanceFieldBase>;
    for (auto &field : _ctx->fields) {
        _ctx->kls->defineProperty(std::get<0>(field).c_str(), fieldGetter, fieldSetter, std::get<1>(field).get());
    }
    // defineFunctions
    {
        ccstd::unordered_map<ccstd::string, ccstd::vector<intl::InstanceMethodBase *>> multimap;
        for (auto &method : _ctx->functions) {
            multimap[std::get<0>(method)].emplace_back(std::get<1>(method).get());
        }
        for (auto &method : multimap) {
            if (method.second.size() > 1) {
                auto *overloaded = ccnew intl::InstanceMethodOverloaded;
                overloaded->className = _ctx->className;
                overloaded->methodName = method.first;
                for (auto *method : method.second) {
                    overloaded->functions.push_back(method);
                }
                _ctx->kls->defineFunction(method.first.c_str(), &genericFunction, overloaded);
            } else {
                _ctx->kls->defineFunction(method.first.c_str(), &genericFunction, method.second[0]);
            }
        }
    }
    // define static functions
    {
        ccstd::unordered_map<ccstd::string, ccstd::vector<intl::StaticMethodBase *>> multimap;
        for (auto &method : _ctx->staticFunctions) {
            multimap[std::get<0>(method)].emplace_back(std::get<1>(method).get());
        }
        for (auto &method : multimap) {
            if (method.second.size() > 1) {
                auto *overloaded = ccnew intl::StaticMethodOverloaded;
                overloaded->className = _ctx->className;
                overloaded->methodName = method.first;
                for (auto *method : method.second) {
                    overloaded->functions.push_back(method);
                }
                _ctx->kls->defineStaticFunction(method.first.c_str(), &genericFunction, overloaded);
            } else {
                _ctx->kls->defineStaticFunction(method.first.c_str(), &genericFunction, method.second[0]);
            }
        }
    }
    for (auto &prop : _ctx->staticProperties) {
        _ctx->kls->defineStaticProperty(std::get<0>(prop).c_str(), fieldGetter, fieldSetter, std::get<1>(prop).get());
    }
    _ctx->kls->install();
    JSBClassType::registerClass<T>(_ctx->kls);

    return true;
}
} // namespace sebind
