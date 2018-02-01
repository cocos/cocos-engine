/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
#include "Class.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC

#include "Object.hpp"
#include "Utils.hpp"
#include "ScriptEngine.hpp"
#include "State.hpp"

namespace se {

#define JS_FN(name, func, attr) {name, func, attr}
#define JS_FS_END JS_FN(0, 0, 0)
#define JS_PSGS(name, getter, setter, attr) {name, getter, setter, attr}
#define JS_PS_END JS_PSGS(0, 0, 0, 0)

    namespace {
//        std::unordered_map<std::string, Class *> __clsMap;
        JSContextRef __cx = nullptr;
        std::vector<Class*> __allClasses;

        void defaultFinalizeCallback(JSObjectRef _obj)
        {
            void* nativeThisObject = JSObjectGetPrivate(_obj);
            if (nativeThisObject != nullptr)
            {
                State state(nativeThisObject);
                Object* _thisObject = state.thisObject();
                if (_thisObject) _thisObject->_cleanup(nativeThisObject);
                JSObjectSetPrivate(_obj, nullptr);
                SAFE_DEC_REF(_thisObject);
            }
        }
    }

    Class::Class()
    : _parent(nullptr)
    , _proto(nullptr)
    , _parentProto(nullptr)
    , _ctor(nullptr)
    , _jsCls(nullptr)
    , _finalizeOp(nullptr)
    {
        _jsClsDef = kJSClassDefinitionEmpty;
        __allClasses.push_back(this);
    }

    Class::~Class()
    {
    }

    Class* Class::create(const std::string& className, Object* obj, Object* parentProto, JSObjectCallAsConstructorCallback ctor)
    {
        Class* cls = new Class();
        if (cls != nullptr && !cls->init(className, obj, parentProto, ctor))
        {
            delete cls;
            cls = nullptr;
        }
        return cls;
    }

    bool Class::init(const std::string &clsName, Object* parent, Object *parentProto, JSObjectCallAsConstructorCallback ctor)
    {
        _name = clsName;
        _parent = parent;
        SAFE_INC_REF(_parent);
        _parentProto = parentProto;
        SAFE_INC_REF(_parentProto);
        _ctor = ctor;
        return true;
    }

    bool Class::install()
    {
//        assert(__clsMap.find(_name) == __clsMap.end());
//
//        __clsMap.emplace(_name, this);

        _jsClsDef.version = 0;
        _jsClsDef.attributes = kJSClassAttributeNone;
        _jsClsDef.className = _name.c_str();
        if (_parentProto != nullptr)
        {
            _jsClsDef.parentClass = _parentProto->_getClass()->_jsCls;
        }

        _funcs.push_back(JS_FS_END);
//        _properties.push_back(JS_PS_END);

//        _jsClsDef.staticValues = _properties.data();
        _jsClsDef.staticFunctions = _funcs.data();

//        _jsClsDef.getProperty = _getPropertyCallback;
//        _jsClsDef.setProperty = _setPropertyCallback;
//        _jsClsDef.hasProperty = _hasPropertyCallback;

        if (_finalizeOp != nullptr)
            _jsClsDef.finalize = _finalizeOp;
        else
            _jsClsDef.finalize = defaultFinalizeCallback;

        _jsCls = JSClassCreate(&_jsClsDef);

        JSObjectRef jsCtor = JSObjectMakeConstructor(__cx, _jsCls, _ctor);
        HandleObject ctorObj(Object::_createJSObject(nullptr, jsCtor));

        Value functionCtor;
        ScriptEngine::getInstance()->getGlobalObject()->getProperty("Function", &functionCtor);
        ctorObj->setProperty("constructor", functionCtor);

        JSValueRef exception = nullptr;
        for (const auto& staticfunc : _staticFuncs)
        {
            JSStringRef name = JSStringCreateWithUTF8CString(staticfunc.name);
            JSObjectRef func = JSObjectMakeFunctionWithCallback(__cx, nullptr, staticfunc.callAsFunction);

            exception = nullptr;
            JSObjectSetProperty(__cx, jsCtor, name, func, kJSPropertyAttributeNone, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
            }
            JSStringRelease(name);
        }

        JSValueRef prototypeObj = nullptr;
        JSStringRef prototypeName = JSStringCreateWithUTF8CString("prototype");
        bool exist = JSObjectHasProperty(__cx, jsCtor, prototypeName);
        if (exist)
        {
            exception = nullptr;
            prototypeObj = JSObjectGetProperty(__cx, jsCtor, prototypeName, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
            }
        }
        JSStringRelease(prototypeName);
        assert(prototypeObj != nullptr);

        exception = nullptr;
        JSObjectRef protoJSObj = JSValueToObject(__cx, prototypeObj, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
        }

        //NOTE: I's weird that proto object has a private data which is an invalid adress.
        // We have to reset its private data to the max value of unsigned long.
        // Therefore, in SE_BIND_FUNC of HelperMacro.h, we could distinguish whether it's a
        // proto object. Don't set it to nullptr since static method will get private data
        // with nullptr. This line is needed by Web Inspector because it needs to extend
        // all global JS values including global proto object. However, proto objects will
        // not have a private data which will cause crash while debugging in Safari since
        // se::State::nativeThisObject() will return nullptr.
        JSObjectSetPrivate(protoJSObj, (void*)std::numeric_limits<unsigned long>::max());

        _proto = Object::_createJSObject(this, protoJSObj);
        _proto->root();

        // reset constructor
        _proto->setProperty("constructor", Value(ctorObj));

        // Set instance properties
        for (const auto& property : _properties)
        {
            internal::defineProperty(_proto, property.name, property.getter, property.setter);
        }

        // Set class properties
        for (const auto& property : _staticProperties)
        {
            internal::defineProperty(ctorObj.get(), property.name, property.getter, property.setter);
        }

        _parent->setProperty(_name.c_str(), Value(ctorObj));

        return true;
    }

    bool Class::defineFunction(const char *name, JSObjectCallAsFunctionCallback func)
    {
        JSStaticFunction cb = JS_FN(name, func, kJSPropertyAttributeNone);
        _funcs.push_back(cb);
        return true;
    }

    bool Class::defineProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter)
    {
        JSPropertySpec property = JS_PSGS(name, getter, setter, kJSPropertyAttributeNone);
        _properties.push_back(property);
        return true;
    }

    bool Class::defineStaticFunction(const char *name, JSObjectCallAsFunctionCallback func)
    {
        JSStaticFunction cb = JS_FN(name, func, kJSPropertyAttributeNone);
        _staticFuncs.push_back(cb);
        return true;
    }

    bool Class::defineStaticProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter)
    {
        JSPropertySpec property = JS_PSGS(name, getter, setter, kJSPropertyAttributeNone);
        _staticProperties.push_back(property);
        return true;
    }

    bool Class::defineFinalizeFunction(JSObjectFinalizeCallback func)
    {
        _finalizeOp = func;
        return true;
    }

    JSObjectRef Class::_createJSObjectWithClass(Class* cls)
    {
        return JSObjectMake(__cx, cls->_jsCls, nullptr);
    }

    void Class::setContext(JSContextRef cx)
    {
        __cx = cx;
    }

    Object *Class::getProto()
    {
        return _proto;
    }

    void Class::destroy()
    {
        SAFE_DEC_REF(_parent);
        SAFE_DEC_REF(_proto);
        SAFE_DEC_REF(_parentProto);

        JSClassRelease(_jsCls);
    }

    void Class::cleanup()
    {
        for (auto cls : __allClasses)
        {
            cls->destroy();
        }

        ScriptEngine::getInstance()->addAfterCleanupHook([](){
            for (auto cls : __allClasses)
            {
                delete cls;
            }
            __allClasses.clear();
        });
    }

} // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC
