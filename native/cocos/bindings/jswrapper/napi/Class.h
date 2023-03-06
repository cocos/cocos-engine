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

#pragma once
#include <string>
#include "CommonHeader.h"
#include "Object.h"
#include "../Define.h"
#include "base/std/optional.h"

namespace se {
class Class {
public:
    static Class *create(const std::string &clsName, se::Object *parent, Object *parentProto, napi_callback ctor = nullptr);
    static Class *create(const std::initializer_list<const char *> &classPath, se::Object *parent, Object *parentProto, napi_callback ctor = nullptr);

    void          defineFunction(const char* name, napi_callback func);
    void          defineProperty(const char* name, napi_callback g, napi_callback s);
    void          defineProperty(const std::initializer_list<const char *> &names, napi_callback g, napi_callback s);

    void          defineStaticFunction(const char* name, napi_callback func);
    void          defineStaticProperty(const char* name, napi_callback g, napi_callback s);
    bool          defineStaticProperty(const char *name, const Value &value, PropertyAttribute attribute = PropertyAttribute::NONE);

    static napi_value    _createJSObjectWithClass(Class *cls);
    
    void          defineFinalizeFunction(napi_finalize func);
    napi_finalize _getFinalizeFunction() const;
    
    
    Object *      getProto() const;
    void          install();
    napi_status   inherit(napi_env env, napi_value subclass, napi_value superclass);
    napi_ref      _getCtorRef() const;
    napi_value    _getCtorFunc() const;
    const char *  getName() const { return _name.c_str(); }
    static void   setExports(napi_value *expPtr) { _exports = expPtr; }
    static void cleanup();
    // Private API used in wrapper
    void _setCtor(Object *obj);                                                // NOLINT(readability-identifier-naming)
    inline const ccstd::optional<Object *> &_getCtor() const { return _ctor; } // NOLINT(readability-identifier-naming)
private:
    Class();
    ~Class();
    bool              init(const std::string &clsName, Object *parent, Object *parentProto, napi_callback ctor = nullptr);
    void              destroy();
    static napi_value _defaultCtor(napi_env env, napi_callback_info info);

private:
    ccstd::optional<Object *>             _ctor;
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