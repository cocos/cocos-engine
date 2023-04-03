/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include <string>
#include "CommonHeader.h"
#include "ScriptEngine.h"
#include "Utils.h"

namespace se {

napi_value *Class::_exports = nullptr;
std::vector<Class *> __allClasses;

Class::Class() {
    __allClasses.push_back(this);
};

Class::~Class() {
}

/* static */
Class *Class::create(const std::string &clsName, se::Object *parent, Object *parentProto, napi_callback ctor) {
    Class *cls = new Class();
    if (cls != nullptr && !cls->init(clsName, parent, parentProto, ctor)) {
        delete cls;
        cls = nullptr;
    }
    return cls;
}

Class* Class::create(const std::initializer_list<const char *> &classPath, se::Object *parent, Object *parentProto, napi_callback ctor) {
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

bool Class::init(const std::string &clsName, Object *parent, Object *parentProto, napi_callback ctor) {
    _name   = clsName;
    _parent = parent;
    if (_parent != nullptr)
        _parent->incRef();
    _parentProto = parentProto;

    if (_parentProto != nullptr)
        _parentProto->incRef();
    if (ctor) {
        _ctorFunc = ctor;
    }

    return true;
}

napi_value Class::_defaultCtor(napi_env env, napi_callback_info info) {
    LOGE("check default ctor called");
    return nullptr;
}

void Class::defineProperty(const char* name, napi_callback g, napi_callback s) {
    _properties.push_back({name, nullptr, nullptr, g, s, 0, napi_default_jsproperty, 0});
}

void Class::defineProperty(const std::initializer_list<const char *> &names, napi_callback g, napi_callback s) {
    for (const auto *name : names) {
        defineProperty(name, g, s);
    }
}

void Class::defineStaticProperty(const char* name, napi_callback g, napi_callback s) {
    if(g != nullptr && s != nullptr) 
        _properties.push_back({name, nullptr, nullptr, g, s, 0, napi_static, 0});
}

bool Class::defineStaticProperty(const char *name, const Value &v, PropertyAttribute attribute /* = PropertyAttribute::NONE */) {
    // TODO(qgh): Assigning get and set to nullptr in openharmony will cause a crash
    //napi_value value;
    //internal::seToJsValue(v, &value);
    //_properties.push_back({name, nullptr, nullptr, nullptr, nullptr, value, napi_static, 0});
    return true;
}

void Class::defineFunction(const char* name, napi_callback func) {
	// When Napi defines a function, it needs to add the enum attribute, otherwise JS cannot traverse the function
    _properties.push_back({name, nullptr, func, nullptr, nullptr, nullptr, napi_default_jsproperty, nullptr});
}

void Class::defineStaticFunction(const char* name, napi_callback func) {
    _properties.push_back({name, nullptr, func, nullptr, nullptr, 0, napi_static, 0});
}

void Class::defineFinalizeFunction(napi_finalize func) {
    assert(func != nullptr);
    _finalizeFunc = func;
}

napi_finalize Class::_getFinalizeFunction() const {
    return _finalizeFunc;
}

void Class::install() {
    napi_value  cons;
    napi_status status;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_define_class(ScriptEngine::getEnv(), _name.c_str(), -1, _ctorFunc, nullptr, _properties.size(), _properties.data(), &cons));
    if (_parentProto) {
        inherit(ScriptEngine::getEnv(), cons, _parentProto->_getJSObject());
    }
    NODE_API_CALL(status, ScriptEngine::getEnv(),
                  napi_create_reference(ScriptEngine::getEnv(), cons, 1, &_constructor));

    NODE_API_CALL(status, ScriptEngine::getEnv(),
                  napi_set_named_property(ScriptEngine::getEnv(), _parent->_getJSObject(), _name.c_str(), cons));

    napi_value proto;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_named_property(ScriptEngine::getEnv(), cons, "prototype", &proto));

    if (status == napi_ok) {
        _proto = Object::_createJSObject(ScriptEngine::getEnv(), proto, nullptr);
        _proto->root();
    }
}

napi_status Class::inherit(napi_env env, napi_value subclass, napi_value superProto) {
    napi_value global, objectClass, setProto;
    napi_value argv[2];
    napi_value callbackResult = nullptr;

    napi_get_global(env, &global);
    napi_status status = napi_get_named_property(env, global, "Object", &objectClass);
    if (status != napi_ok) {
        LOGE("ace zbclog napi_get_named_property Object %{public}d", status);
        return napi_ok;
    }
    status = napi_get_named_property(env, objectClass, "setPrototypeOf", &setProto);
    if (status != napi_ok) {
        LOGE("ace zbclog napi_get_named_property setPrototypeOf %{public}d", status);
        return napi_ok;
    }

    status = napi_get_named_property(env, subclass, "prototype", &argv[0]);
    if (status != napi_ok) {
        LOGE("ace zbclog napi_get_named_property prototype arg0 %{public}d", status);
        return napi_ok;
    }
    argv[1] = superProto;
    status  = napi_call_function(env, objectClass, setProto, 2, argv, &callbackResult);
    if (status != napi_ok) {
        LOGE("ace zbclog napi_call_function setProto 1 %{public}d", status);
        return napi_ok;
    }

    return napi_ok;
}

napi_value Class::_createJSObjectWithClass(Class *cls) {
    napi_value obj = nullptr;
    napi_status status;
    assert(cls);
    napi_value clsCtor = cls->_getCtorFunc();
    if (!clsCtor) {
        LOGE("get ctor func err");
        return nullptr;
    }
    se::ScriptEngine::getInstance()->_setNeedCallConstructor(false);
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_new_instance( ScriptEngine::getEnv(), clsCtor, 0, nullptr, &obj));
    se::ScriptEngine::getInstance()->_setNeedCallConstructor(true);
    return obj;
}

Object *Class::getProto() const {
    //not impl
    return _proto;
}

napi_ref Class::_getCtorRef() const {
    return _constructor;
}

napi_value Class::_getCtorFunc() const {
    assert(_constructor);
    napi_value  result = nullptr;
    napi_status status;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_reference_value(ScriptEngine::getEnv(), _constructor, &result));
    return result;
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
}; // namespace se