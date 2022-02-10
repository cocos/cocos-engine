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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

    #include "../RefCounter.h"
    #include "../Value.h"
    #include "Base.h"

namespace se {

class Class;

/**
     * se::Object represents JavaScript Object.
     */
class Object final : public RefCounter {
public:
    /**
         *  @brief Creates a JavaScript Object like `{} or new Object()`.
         *  @return A JavaScript Object, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createPlainObject();

    /**
         *  @brief Creates a JavaScript Array Object like `[] or new Array()`.
         *  @param[in] length The initical length of array.
         *  @return A JavaScript Array Object, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createArrayObject(size_t length);

    /**
         *  @brief Creates a JavaScript Typed Array Object with uint8 format from an existing pointer.
         *  @param[in] bytes A pointer to the byte buffer to be used as the backing store of the Typed Array object.
         *  @param[in] byteLength The number of bytes pointed to by the parameter bytes.
         *  @return A JavaScript Typed Array Object whose backing store is the same as the one pointed data, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         *  @deprecated This method is deprecated, please use `se::Object::createTypedArray` instead.
         */
    SE_DEPRECATED_ATTRIBUTE static Object *createUint8TypedArray(uint8_t *data, size_t byteLength);

    enum class TypedArrayType {
        NONE,
        INT8,
        INT16,
        INT32,
        UINT8,
        UINT8_CLAMPED,
        UINT16,
        UINT32,
        FLOAT32,
        FLOAT64
    };

    /**
         *  @brief Creates a JavaScript Typed Array Object with specified format from an existing pointer,
                   if provide a null pointer,then will create a empty JavaScript Typed Array Object.
         *  @param[in] type The format of typed array.
         *  @param[in] data A pointer to the byte buffer to be used as the backing store of the Typed Array object.
         *  @param[in] byteLength The number of bytes pointed to by the parameter bytes.
         *  @return A JavaScript Typed Array Object whose backing store is the same as the one pointed data, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createTypedArray(TypedArrayType type, const void *data, size_t byteLength);

    /**
         *  @brief Creates a JavaScript Array Buffer object from an existing pointer.
         *  @param[in] bytes A pointer to the byte buffer to be used as the backing store of the Typed Array object.
         *  @param[in] byteLength The number of bytes pointed to by the parameter bytes.
         *  @return A Array Buffer Object whose backing store is the same as the one pointed to data, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createArrayBufferObject(void *data, size_t byteLength);

    /**
         *  @brief Creates a JavaScript Object from a JSON formatted string.
         *  @param[in] jsonStr The utf-8 string containing the JSON string to be parsed.
         *  @return A JavaScript Object containing the parsed value, or nullptr if the input is invalid.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createJSONObject(const std::string &jsonStr);

    /**
         *  @brief Creates a JavaScript Native Binding Object from an existing se::Class instance.
         *  @param[in] cls The se::Class instance which stores native callback informations.
         *  @return A JavaScript Native Binding Object, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createObjectWithClass(Class *cls);

    /**
         *  @brief Gets a se::Object from an existing native object pointer.
         *  @param[in] ptr The native object pointer associated with the se::Object
         *  @return A JavaScript Native Binding Object, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *getObjectWithPtr(void *ptr);

    /**
         *  @brief Gets a property from an object.
         *  @param[in] name A utf-8 string containing the property's name.
         *  @param[out] value The property's value if object has the property, otherwise the undefined value.
         *  @return true if object has the property, otherwise false.
         */
    bool getProperty(const char *name, Value *value);

    /**
         *  @brief Sets a property to an object.
         *  @param[in] name A utf-8 string containing the property's name.
         *  @param[in] value A value to be used as the property's value.
         *  @return true if the property is set successfully, otherwise false.
         */
    bool setProperty(const char *name, const Value &value);

    /**
         *  @brief Defines a property with native accessor callbacks for an object.
         *  @param[in] name A utf-8 string containing the property's name.
         *  @param[in] getter The native callback for getter.
         *  @param[in] setter The native callback for setter.
         *  @return true if succeed, otherwise false.
         */
    bool defineProperty(const char *name, JSNative getter, JSNative setter);

    /**
         *  @brief Defines a function with a native callback for an object.
         *  @param[in] funcName A utf-8 string containing the function name.
         *  @param[in] func The native callback triggered by JavaScript code.
         *  @return true if succeed, otherwise false.
         */
    bool defineFunction(const char *funcName, JSNative func);

    /**
         *  @brief Tests whether an object can be called as a function.
         *  @return true if object can be called as a function, otherwise false.
         */
    bool isFunction() const;

    /**
         *  @brief Calls an object as a function.
         *  @param[in] args A se::Value array of arguments to pass to the function. Pass se::EmptyValueArray if argumentCount is 0.
         *  @param[in] thisObject The object to use as "this," or NULL to use the global object as "this."
         *  @param[out] rval The se::Value that results from calling object as a function, passing nullptr if return value is ignored.
         *  @return true if object is a function and there isn't any errors, otherwise false.
         */
    bool call(const ValueArray &args, Object *thisObject, Value *rval = nullptr);

    /**
         *  @brief Tests whether an object is an array.
         *  @return true if object is an array, otherwise false.
         */
    bool isArray() const;

    /**
         *  @brief Gets array length of an array object.
         *  @param[out] length The array length to be stored. It's set to 0 if there is an error.
         *  @return true if succeed, otherwise false.
         */
    bool getArrayLength(uint32_t *length) const;

    /**
         *  @brief Gets an element from an array object by numeric index.
         *  @param[in] index An integer value for index.
         *  @param[out] data The se::Value to be stored for the element in certain index.
         *  @return true if succeed, otherwise false.
         */
    bool getArrayElement(uint32_t index, Value *data) const;

    /**
         *  @brief Sets an element to an array object by numeric index.
         *  @param[in] index An integer value for index.
         *  @param[in] data The se::Value to be set to array with certain index.
         *  @return true if succeed, otherwise false.
         */
    bool setArrayElement(uint32_t index, const Value &data);

    /** @brief Tests whether an object is a typed array.
         *  @return true if object is a typed array, otherwise false.
         */
    bool isTypedArray() const;

    /**
         *  @brief Gets the type of a typed array object.
         *  @return The type of a typed array object.
         */
    TypedArrayType getTypedArrayType() const;

    /**
         *  @brief Gets backing store of a typed array object.
         *  @param[out] ptr A temporary pointer to the backing store of a JavaScript Typed Array object.
         *  @param[out] length The byte length of a JavaScript Typed Array object.
         *  @return true if succeed, otherwise false.
         */
    bool getTypedArrayData(uint8_t **ptr, size_t *length) const;

    /**
         *  @brief Tests whether an object is an array buffer object.
         *  @return true if object is an array buffer object, otherwise false.
         */
    bool isArrayBuffer() const;

    /**
         *  @brief Gets buffer data of an array buffer object.
         *  @param[out] ptr A pointer to the data buffer that serves as the backing store for a JavaScript Typed Array object.
         *  @param[out] length The number of bytes in a JavaScript data object.
         *  @return true if succeed, otherwise false.
         */
    bool getArrayBufferData(uint8_t **ptr, size_t *length) const;

    /**
         *  @brief Gets all property names of an object.
         *  @param[out] allKeys A string vector to store all property names.
         *  @return true if succeed, otherwise false.
         */
    bool getAllKeys(std::vector<std::string> *allKeys) const;

    /**
         *  @brief Sets a pointer to private data on an object.
         *  @param[in] data A void* to set as the object's private data.
         *  @note This method will associate private data with se::Object by std::unordered_map::emplace.
         *        It's used for search a se::Object via a void* private data.
         */
    void setPrivateData(void *data);

    /**
         *  @brief Gets an object's private data.
         *  @return A void* that is the object's private data, if the object has private data, otherwise nullptr.
         */
    void *getPrivateData() const;

    /**
         *  @brief Clears private data of an object.
         *  @param clearMapping Whether to clear the mapping of native object & se::Object.
         */
    void clearPrivateData(bool clearMapping = true);

    /**
         *  @brief Roots an object from garbage collection.
         *  @note Use this method when you want to store an object in a global or on the heap, where the garbage collector will not be able to discover your reference to it.
         *        An object may be rooted multiple times and must be unrooted an equal number of times before becoming eligible for garbage collection.
         */
    void root();

    /**
         *  @brief Unroots an object from garbage collection.
         *  @note An object may be rooted multiple times and must be unrooted an equal number of times before becoming eligible for garbage collection.
         */
    void unroot();

    /**
         *  @brief Tests whether an object is rooted.
         *  @return true if it has been already rooted, otherwise false.
         */
    bool isRooted() const;

    /**
         *  @brief Tests whether two objects are strict equal, as compared by the JS === operator.
         *  @param[in] o The object to be tested with this object.
         *  @return true if the two values are strict equal, otherwise false.
         */
    bool strictEquals(Object *o) const;

    /**
         *  @brief Attaches an object to current object.
         *  @param[in] obj The object to be attached.
         *  @return true if succeed, otherwise false.
         *  @note This method will set `obj` as a property of current object, therefore the lifecycle of child object will depend on current object,
         *        which means `obj` may be garbage collected only after current object is garbage collected.
         *        It's normally used in binding a native callback method. For example:

             ```javascript
                var self = this;
                someObject.setCallback(function(){}, self);
             ```

             ```c++
                static bool SomeObject_setCallback(se::State& s)
                {
                    SomeObject* cobj = (SomeObject*)s.nativeThisObject();
                    const auto& args = s.args();
                    size_t argc = args.size();
                    if (argc == 2) {
                        std::function<void()> arg0;
                        do {
                            if (args[0].isObject() && args[0].toObject()->isFunction())
                            {
                                se::Value jsThis(args[1]);
                                se::Value jsFunc(args[0]);

                                jsThis.toObject()->attachObject(jsFunc.toObject());

                                auto lambda = [=]() -> void {
                                    ...
                                    // Call jsFunc stuff...
                                    ...
                                };
                                arg0 = lambda;
                            }
                            else
                            {
                                arg0 = nullptr;
                            }
                        } while(false);
                        SE_PRECONDITION2(ok, false, "Error processing arguments");
                        cobj->setCallback(arg0);
                        return true;
                    }

                    return false;
                }
             ```
         */
    bool attachObject(Object *obj);

    /**
         *  @brief Detaches an object from current object.
         *  @param[in] obj The object to be detached.
         *  @return true if succeed, otherwise false.
         *  @note The attached object will not be released if current object is not garbage collected.
         */
    bool detachObject(Object *obj);

    /**
         *  @brief Returns the string for describing current object.
         *  @return The string for describing current object.
         */
    std::string toString() const;

    // Private API used in wrapper
    static Object *_createJSObject(Class *cls, JSObject *obj);
    void           _setFinalizeCallback(JSFinalizeOp finalizeCb);
    bool           _isNativeFunction(JSNative func) const;
    JSObject *     _getJSObject() const;
    Class *        _getClass() const { return _cls; }
    //

private:
    Object();
    bool init(Class *cls, JSObject *obj);
    virtual ~Object();

    static void setContext(JSContext *cx);
    static void cleanup();

    void trace(JSTracer *tracer, void *data);
    bool updateAfterGC(void *data);

    void protect();
    void unprotect();
    void reset();

    JS::Heap<JSObject *>        _heap; /* should be untouched if in rooted mode */
    JS::PersistentRootedObject *_root; /* should be null if not in rooted mode */

    void *_privateData;

    Class *      _cls;
    JSFinalizeOp _finalizeCb;

    uint32_t _rootCount;
    uint32_t _currentVMId;

    friend class ScriptEngine;
};

extern std::unordered_map<Object *, void *> __objectMap; // Currently, the value `void*` is always nullptr

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
