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

#pragma once

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include <vector>
    #include "Base.h"

namespace se {

class Object;

/**
     * se::Class represents a definition of how to create a native binding object.
     */
class Class final {
public:
    /**
         *  @brief Creates a class used for creating relevant native binding objects.
         *  @param[in] className A null-terminated UTF8 string containing the class's name.
         *  @param[in] obj The object that current class proto object attaches to. Should not be nullptr.
         *  @param[in] parentProto The parent proto object that current class inherits from. Passing nullptr means a new class has no parent.
         *  @param[in] ctor A callback to invoke when your constructor is used in a 'new' expression. Pass nullptr to use the default object constructor.
         *  @return A class instance used for creating relevant native binding objects.
         *  @note Don't need to delete the pointer return by this method, it's managed internally.
         */
    static Class *create(const std::string &clsName, se::Object *parent, Object *parentProto, v8::FunctionCallback ctor);

    static Class *create(const std::initializer_list<const char *> &classPath, se::Object *parent, Object *parentProto, v8::FunctionCallback ctor);

    /**
         *  @brief Defines a member function with a callback. Each objects created by class will have this function property.
         *  @param[in] name A null-terminated UTF8 string containing the function name.
         *  @param[in] func A callback to invoke when the property is called as a function.
         *  @return true if succeed, otherwise false.
         */
    bool defineFunction(const char *name, v8::FunctionCallback func);

    /**
         *  @brief Defines a property with accessor callbacks. Each objects created by class will have this property.
         *  @param[in] name A null-terminated UTF8 string containing the property name.
         *  @param[in] getter A callback to invoke when the property is read.
         *  @param[in] setter A callback to invoke when the property is set.
         *  @return true if succeed, otherwise false.
         */
    bool defineProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);

    bool defineProperty(const std::initializer_list<const char *> &names, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);

    /**
         *  @brief Defines a static function with a callback. Only JavaScript constructor object will have this function.
         *  @param[in] name A null-terminated UTF8 string containing the function name.
         *  @param[in] func A callback to invoke when the constructor's property is called as a function.
         *  @return true if succeed, otherwise false.
         */
    bool defineStaticFunction(const char *name, v8::FunctionCallback func);

    /**
         *  @brief Defines a static property with accessor callbacks. Only JavaScript constructor object will have this property.
         *  @param[in] name A null-terminated UTF8 string containing the property name.
         *  @param[in] getter A callback to invoke when the constructor's property is read.
         *  @param[in] setter A callback to invoke when the constructor's property is set.
         *  @return true if succeed, otherwise false.
         */
    bool defineStaticProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);

    /**
         *  @brief Defines the finalize function with a callback.
         *  @param[in] func The callback to invoke when a JavaScript object is garbage collected.
         *  @return true if succeed, otherwise false.
         */
    bool defineFinalizeFunction(V8FinalizeFunc func);

    /**
         *  @brief Installs class to JavaScript VM.
         *  @return true if succeed, otherwise false.
         *  @note After this method, an object could be created by `var foo = new Foo();`.
         */
    bool install();

    /**
         *  @brief Gets the proto object of this class.
         *  @return The proto object of this class.
         *  @note Don't need to be released in user code.
         */
    Object *getProto() const;

    /**
         *  @brief Gets the class name.
         *  @return The class name.
         */
    const char *getName() const { return _name.c_str(); }

    // Private API used in wrapper
    V8FinalizeFunc _getFinalizeFunction() const; // NOLINT(readability-identifier-naming)

private:
    Class();
    ~Class();

    void setCreateProto(bool createProto);

    bool init(const std::string &clsName, Object *parent, Object *parentProto, v8::FunctionCallback ctor);
    void destroy();

    static void cleanup();
    //        static v8::Local<v8::Object> _createJSObject(const std::string &clsName, Class** outCls);
    static v8::Local<v8::Object> _createJSObjectWithClass(Class *cls); // NOLINT(readability-identifier-naming)
    static void                  setIsolate(v8::Isolate *isolate);

    std::string _name;
    Object *    _parent;
    Object *    _parentProto;
    Object *    _proto;

    v8::FunctionCallback                       _ctor;
    v8::UniquePersistent<v8::FunctionTemplate> _ctorTemplate;
    V8FinalizeFunc                             _finalizeFunc;
    bool                                       _createProto;

    friend class ScriptEngine;
    friend class Object;
};

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
