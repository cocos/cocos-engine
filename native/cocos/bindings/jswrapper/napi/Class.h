#pragma once
#include <string>
#include "CommonHeader.h"
#include "Object.h"

namespace se {
class Class {
public:
    static Class *create(const std::string &clsName, se::Object *parent, Object *parentProto, napi_callback ctor = nullptr);
    static napi_value    _createJSObjectWithClass(Class *cls);
    void          defineProperty(const char* name, napi_callback g, napi_callback s);
    void          defineStaticProperty(const char* name, napi_callback g, napi_callback s);
    void          defineFinalizeFunction(napi_finalize func);
    napi_finalize _getFinalizeFunction() const;
    void          defineFunction(const char* name, napi_callback func);
    void          defineStaticFunction(const char* name, napi_callback func);
    Object *      getProto() const;
    void          install();
    napi_status   inherit(napi_env env, napi_value subclass, napi_value superclass);
    napi_ref      _getCtorRef() const;
    napi_value    _getCtorFunc() const;
    const char *  getName() const { return _name.c_str(); }
    static void   setExports(napi_value *expPtr) { _exports = expPtr; }
    static void cleanup();

private:
    Class();
    ~Class();
    bool              init(const std::string &clsName, Object *parent, Object *parentProto, napi_callback ctor = nullptr);
    void              destroy();
    static napi_value _defaultCtor(napi_env env, napi_callback_info info);

private:
    static napi_value *                   _exports;
    std::string                           _name;
    Object *                              _parent = nullptr;
    Object *                              _proto = nullptr;
    Object *                              _parentProto = nullptr;
    napi_callback                         _ctorFunc = Class::_defaultCtor;
    napi_ref                              _constructor = nullptr;
    std::vector<napi_property_descriptor> _properties;
    napi_finalize                         _finalizeFunc = nullptr;
};
}; // namespace se