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

#pragma once

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../Define.h"
    #include "../Value.h"
    #include "Base.h"
    #include "base/std/optional.h"

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
     *  @param[in] data A data pointer attach to the function callback.
     *  @return A class instance used for creating relevant native binding objects.
     *  @note Don't need to delete the pointer return by this method, it's managed internally.
     */
    static Class *create(const ccstd::string &clsName, Object *parent, Object *parentProto, v8::FunctionCallback ctor, void *data = nullptr);

    static Class *create(const std::initializer_list<const char *> &classPath, Object *parent, Object *parentProto, v8::FunctionCallback ctor, void *data = nullptr);

    /**
     *  @brief Defines a member function with a callback. Each objects created by class will have this function property.
     *  @param[in] name A null-terminated UTF8 string containing the function name.
     *  @param[in] func A callback to invoke when the property is called as a function.
     *  @param[in] data A data pointer attach to the function callback.
     *  @return true if succeed, otherwise false.
     */
    bool defineFunction(const char *name, v8::FunctionCallback func, void *data = nullptr);

    /**
     *  @brief Defines a property with accessor callbacks. Each objects created by class will have this property.
     *  @param[in] name A null-terminated UTF8 string containing the property name.
     *  @param[in] getter A callback to invoke when the property is read.
     *  @param[in] setter A callback to invoke when the property is set.
     *  @param[in] data A data pointer attach to the property's callback
     *  @return true if succeed, otherwise false.
     */
    bool defineProperty(const char *name, v8::FunctionCallback getter, v8::FunctionCallback setter, void *data = nullptr);

    bool defineProperty(const std::initializer_list<const char *> &names, v8::FunctionCallback getter, v8::FunctionCallback setter, void *data = nullptr);

    /**
     *  @brief Defines a static function with a callback. Only JavaScript constructor object will have this function.
     *  @param[in] name A null-terminated UTF8 string containing the function name.
     *  @param[in] func A callback to invoke when the constructor's property is called as a function.
     *  @param[in] data A data pointer attach to static function callback
     *  @return true if succeed, otherwise false.
     */
    bool defineStaticFunction(const char *name, v8::FunctionCallback func, void *data = nullptr);

    /**
     *  @brief Defines a static property with accessor callbacks. Only JavaScript constructor object will have this property.
     *  @param[in] name A null-terminated UTF8 string containing the property name.
     *  @param[in] getter A callback to invoke when the constructor's property is read.
     *  @param[in] setter A callback to invoke when the constructor's property is set.
     *  @param[in] data A data pointer attach to static property callback
     *  @return true if succeed, otherwise false.
     */
    bool defineStaticProperty(const char *name, v8::FunctionCallback getter, v8::FunctionCallback setter, void *data = nullptr);

    /**
     *  @brief Defines a static property with a value. Only JavaScript constructor object will have this property.
     *  @param[in] name A null-terminated UTF8 string containing the property name.
     *  @param[in] value A value to be set on the constructor.
     *  @param[in] attribute An attribute to describe the property.
     *  @return true if succeed, otherwise false.
     */
    bool defineStaticProperty(const char *name, const Value &value, PropertyAttribute attribute = PropertyAttribute::NONE);

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
    V8FinalizeFunc _getFinalizeFunction() const;                               // NOLINT(readability-identifier-naming)
    void _setCtor(Object *obj);                                                // NOLINT(readability-identifier-naming)
    inline const ccstd::optional<Object *> &_getCtor() const { return _ctor; } // NOLINT(readability-identifier-naming)

private:
    Class();
    ~Class();

    void setCreateProto(bool createProto);

    bool init(const ccstd::string &clsName, Object *parent, Object *parentProto, v8::FunctionCallback ctor, void *data = nullptr);
    void destroy();

    static void cleanup();
    //        static v8::Local<v8::Object> _createJSObject(const ccstd::string &clsName, Class** outCls);
    static v8::Local<v8::Object> _createJSObjectWithClass(Class *cls); // NOLINT(readability-identifier-naming)
    static void setIsolate(v8::Isolate *isolate);

    ccstd::string _name;
    Object *_parent{nullptr};
    Object *_parentProto{nullptr};
    Object *_proto{nullptr};
    ccstd::optional<Object *> _ctor;

    v8::FunctionCallback _constructor{nullptr};
    v8::UniquePersistent<v8::FunctionTemplate> _constructorTemplate;
    V8FinalizeFunc _finalizeFunc{nullptr};
    bool _createProto{true};

    friend class ScriptEngine;
    friend class Object;
    friend class JSBPersistentHandleVisitor;
};

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
