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
#include "bindings/jswrapper/PrivateObject.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../RefCounter.h"
    #include "../Value.h"
    #include "Base.h"
    #include "ObjectWrap.h"
    #include "base/HasMemberFunction.h"

    #include <memory>

    // DEBUG ONLY:
    // Set `__object_id__` && `__native_class_name__` for js object
    #ifndef CC_DEBUG_JS_OBJECT_ID
        #define CC_DEBUG_JS_OBJECT_ID 0
    #endif

    #define JSB_TRACK_OBJECT_CREATION 0

namespace se {

class Class;
class ScriptEngine;

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
     *  @brief Creates a ES6 Map Object like `new Map()` in JS.
     *  @return A JavaScript Object, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createMapObject();

    /**
     *  @brief Creates a ES6 Set Object like `new Set()` in JS.
     *  @return A JavaScript Object, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createSetObject();

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
    SE_DEPRECATED_ATTRIBUTE static Object *createUint8TypedArray(uint8_t *bytes, size_t byteLength);

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
         *  @brief Creates a JavaScript Typed Array Object with a se::Object, which is a ArrayBuffer,
                   if provide a null pointer,then will create a empty JavaScript Typed Array Object.
         *  @param[in] type The format of typed array.
         *  @param[in] obj A ArrayBuffer to TypedArray.
         *  @param[in] offset Offset of ArrayBuffer to create with.
         *  @param[in] byteLength The number of bytes pointed to by the parameter bytes.
         *  @return A JavaScript Typed Array Object which refers to the ArrayBuffer Object, or nullptr if there is an error.
         *  @note The return value (non-null) has to be released manually.
         */
    static Object *createTypedArrayWithBuffer(TypedArrayType type, const Object *obj);
    static Object *createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset);
    static Object *createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset, size_t byteLength);

    /**
     *  @brief Creates a JavaScript Array Buffer object from an existing pointer.
     *  @param[in] bytes A pointer to the byte buffer to be used as the backing store of the Typed Array object.
     *  @param[in] byteLength The number of bytes pointed to by the parameter bytes.
     *  @return A Array Buffer Object whose backing store is the same as the one pointed to data, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createArrayBufferObject(const void *data, size_t byteLength);

    using BufferContentsFreeFunc = void (*)(void *contents, size_t byteLength, void *userData);
    static Object *createExternalArrayBufferObject(void *contents, size_t byteLength, BufferContentsFreeFunc freeFunc, void *freeUserData = nullptr);

    /**
     *  @brief Creates a JavaScript Object from a JSON formatted string.
     *  @param[in] jsonStr The utf-8 string containing the JSON string to be parsed.
     *  @return A JavaScript Object containing the parsed value, or nullptr if the input is invalid.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createJSONObject(const ccstd::string &jsonStr);

    /**
     *  @brief Creates a JavaScript Native Binding Object from an existing se::Class instance.
     *  @param[in] cls The se::Class instance which stores native callback informations.
     *  @return A JavaScript Native Binding Object, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createObjectWithClass(Class *cls);

    /**
     *  @brief Creates a JavaScript Native Binding Object from an JS constructor with no arguments, which behaves as `new MyClass();` in JS.
     *  @param[in] constructor The JS constructor
     *  @return A JavaScript object, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createObjectWithConstructor(se::Object *constructor);

    /**
     *  @brief Creates a JavaScript Native Binding Object from an JS constructor with arguments, which behaves as `new MyClass(arg0, arg1, arg2, ...);` in JS.
     *  @param[in] constructor The JS constructor
     *  @param[in] args The arguments passed to the JS constructor
     *  @return A JavaScript object, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     */
    static Object *createObjectWithConstructor(se::Object *constructor, const ValueArray &args);

    /**
     * Gets the Proxy Target object
     * @param proxy The JavaScript Proxy object.
     * @return The target JavaScript object of the parameter.
     */
    static Object *createProxyTarget(se::Object *proxy);

    /**
     *  @brief Gets a se::Object from an existing native object pointer.
     *  @param[in] ptr The native object pointer associated with the se::Object
     *  @return A JavaScript Native Binding Object, or nullptr if there is an error.
     *  @note The return value (non-null) has to be released manually.
     *  @deprecated Use NativePtrToObjectMap to query the native object.
     */
    CC_DEPRECATED(3.7)
    static Object *getObjectWithPtr(void *ptr);

    /**
     *  @brief Gets a property from an object.
     *  @param[in] name A utf-8 string containing the property's name.
     *  @param[out] value The property's value if object has the property, otherwise the undefined value.
     *  @return true if object has the property, otherwise false.
     */
    inline bool getProperty(const char *name, Value *data) {
        return getProperty(name, data, false);
    }

    bool getProperty(const char *name, Value *data, bool cachePropertyName);

    inline bool getProperty(const ccstd::string &name, Value *value) {
        return getProperty(name.c_str(), value);
    }

    /**
     *  @brief Sets a property to an object.
     *  @param[in] name A utf-8 string containing the property's name.
     *  @param[in] value A value to be used as the property's value.
     *  @return true if the property is set successfully, otherwise false.
     */
    bool setProperty(const char *name, const Value &data);

    inline bool setProperty(const ccstd::string &name, const Value &value) {
        return setProperty(name.c_str(), value);
    }

    /**
     *  @brief Delete a property of an object.
     *  @param[in] name A utf-8 string containing the property's name.
     *  @return true if the property is deleted successfully, otherwise false.
     */
    bool deleteProperty(const char *name);

    /**
     *  @brief Defines a property with native accessor callbacks for an object.
     *  @param[in] name A utf-8 string containing the property's name.
     *  @param[in] getter The native callback for getter.
     *  @param[in] setter The native callback for setter.
     *  @return true if succeed, otherwise false.
     */
    bool defineProperty(const char *name, v8::FunctionCallback getter, v8::FunctionCallback setter);

    bool defineOwnProperty(const char *name, const se::Value &value, bool writable = true, bool enumerable = true, bool configurable = true);

    /**
     *  @brief Defines a function with a native callback for an object.
     *  @param[in] funcName A utf-8 string containing the function name.
     *  @param[in] func The native callback triggered by JavaScript code.
     *  @return true if succeed, otherwise false.
     */
    bool defineFunction(const char *funcName, v8::FunctionCallback func);

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
     *  @brief Tests whether an object is a ES6 Map.
     *  @return true if object is a Map, otherwise false.
     */
    bool isMap() const;

    /**
     *  @brief Tests whether an object is a ES6 WeakMap.
     *  @return true if object is a WeakMap, otherwise false.
     */
    bool isWeakMap() const;

    /**
     *  @brief Tests whether an object is a ES6 Set.
     *  @return true if object is a Set, otherwise false.
     */
    bool isSet() const;

    /**
     *  @brief Tests whether an object is a ES6 WeakSet.
     *  @return true if object is a WeakSet, otherwise false.
     */
    bool isWeakSet() const;

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

    /** @brief Tests whether an object is a proxy object.
     *  @return true if object is a proxy object, otherwise false.
     */
    bool isProxy() const;

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
    bool getAllKeys(ccstd::vector<ccstd::string> *allKeys) const;

    // ES6 Map operations

    /**
     *  @brief Clear all elements in a ES6 map object.
     */
    void clearMap();

    /**
     *  @brief Remove an element in a ES6 map by a key.
     *  @param[in] key The key of the element to remove, it could be any type that se::Value supports.
     *  @return true if succeed, otherwise false.
     */
    bool removeMapElement(const Value &key);

    /**
     *  @brief Get an element in a ES6 map by a key.
     *  @param[in] key Key of the element to get, it could be any type that se::Value supports.
     *  @param[out] outValue Out parameter, On success, *outValue receives the current value of the map element, or nullptr if no such element is found
     *  @return true if succeed, otherwise false.
     */
    bool getMapElement(const Value &key, Value *outValue) const;

    /**
     *  @brief Set an element in a ES6 map by a key.
     *  @param[in] key Key of the element to get, it could be any type that se::Value supports.
     *  @param[in] value The value to set the map.
     *  @return true if succeed, otherwise false.
     */
    bool setMapElement(const Value &key, const Value &value);

    /**
     *  @brief Get the size of a ES6 map
     *  @return The size of a ES6 map
     */
    uint32_t getMapSize() const;

    /**
     *  @brief Get all elements in a ES6 map
     *  @return All elements in a ES6 map, they're stored in a std::vector instead of `std::map/unordered_map` since we don't know how to compare or make a hash for `se::Value`s.
     */
    ccstd::vector<std::pair<Value, Value>> getAllElementsInMap() const;

    // ES6 Set operations

    /**
     *  @brief Clear all elements in a ES6 set object.
     */
    void clearSet();

    /**
     *  @brief Remove an element in a ES6 set.
     *  @param[in] value The value to remove.
     *  @return true if succeed, otherwise false.
     */
    bool removeSetElement(const Value &value);

    /**
     *  @brief Add an element to a ES6 set.
     *  @param[in] value The value to set the set.
     *  @return true if succeed, otherwise false.
     */
    bool addSetElement(const Value &value);

    /**
     *  @brief Check whether the value is in a ES6 set.
     *  @return true if the value is in the ES6 set, otherwise false.
     */
    bool isElementInSet(const Value &value) const;

    /**
     *  @brief Get the size of a ES6 set.
     *  @return The size of a ES6 set.
     */
    uint32_t getSetSize() const;

    /**
     *  @brief Get all elements in a ES6 set.
     *  @return All elements in a ES6 set.
     */
    ValueArray getAllElementsInSet() const;

    void setPrivateObject(PrivateObjectBase *data);

    template <typename T>
    inline void setPrivateObject(TypedPrivateObject<T> *data) {
        setPrivateObject(static_cast<PrivateObjectBase *>(data));
        if constexpr (cc::has_setScriptObject<T, void(Object *)>::value) {
            data->template get<T>()->setScriptObject(this);
        }
    }

    PrivateObjectBase *getPrivateObject() const;

    /*
     *  @brief Gets an object's private data.
     *  @return A void* that is the object's private data, if the object has private data, otherwise nullptr.
     */
    inline void *getPrivateData() const {
        return _privateData;
    }

    /**
     *  @brief Sets a pointer to private data on an object and use smart pointer to hold it.
     *
     *  If the pointer is an instance of `cc::RefCounted`, an `cc::IntrusivePtr` will be created to hold
     *  the reference to the object, otherwise a `std::shared_ptr` object will be used.
     *  When the JS object is freed by GC, the corresponding smart pointer `IntrusivePtr/shared_ptr` will also be destroyed.
     *
     *  If you do not want the pointer to be released by GC, you can call `setRawPrivateData`.
     *
     *  @param[in] data A void* to set as the object's private data.
     *  @note This method will associate private data with se::Object by ccstd::unordered_map::emplace.
     *        It's used for search a se::Object via a void* private data.
     */
    template <typename T>
    inline void setPrivateData(T *data) {
        static_assert(!std::is_void<T>::value, "void * is not allowed for private data");
        setPrivateObject(se::make_shared_private_object(data));
    }

    /**
     * @brief Use a InstrusivePtr to hold private data on the se::Object.
     *
     * @tparam T
     * @param data A intrusive pointer object
     */
    template <typename T>
    inline void setPrivateData(const cc::IntrusivePtr<T> &data) {
        setPrivateObject(se::ccintrusive_ptr_private_object(data));
    }

    /**
     * @brief Use a std::shared_ptr to hold private data on the se::Object.
     *
     * @tparam T
     * @param data A shared_ptr object
     */
    template <typename T>
    inline void setPrivateData(const std::shared_ptr<T> &data) {
        setPrivateObject(se::shared_ptr_private_object(data));
    }

    /**
     * @brief Set pointer to the private data on an object and will not use smart pointer to hold it.
     *
     * @tparam T
     * @param data
     * @param tryDestroyInGC When GCing the JS object, whether to `delete` the `data` pointer.
     */
    template <typename T>
    inline void setRawPrivateData(T *data, bool tryDestroyInGC = false) {
        static_assert(!std::is_void<T>::value, "void * is not allowed for private data");
        auto *privateObject = se::rawref_private_object(data);
        if (tryDestroyInGC) {
            privateObject->tryAllowDestroyInGC();
        }
        setPrivateObject(privateObject);
    }

    /**
     * @brief Get the underlying private data as std::shared_ptr
     *
     * @tparam T
     * @return std::shared_ptr<T>
     */
    template <typename T>
    inline std::shared_ptr<T> getPrivateSharedPtr() const {
        assert(_privateObject->isSharedPtr());
        return static_cast<se::SharedPtrPrivateObject<T> *>(_privateObject)->getData();
    }

    /**
     * @brief Get the underlying private data as InstrusivePtr
     *
     * @tparam T
     * @return cc::IntrusivePtr<T>
     */
    template <typename T>
    inline cc::IntrusivePtr<T> getPrivateInstrusivePtr() const {
        assert(_privateObject->isCCIntrusivePtr());
        return static_cast<se::CCIntrusivePtrPrivateObject<T> *>(_privateObject)->getData();
    }

    template <typename T>
    inline T *getTypedPrivateData() const {
        return reinterpret_cast<T *>(getPrivateData());
    }

    /**
     *  @brief Clears private data of an object.
     *  @param clearMapping Whether to clear the mapping of native object & se::Object.
     */
    void clearPrivateData(bool clearMapping = true);

    /**
     * @brief Sets whether to clear the mapping of native object & se::Object in finalizer
     */
    void setClearMappingInFinalizer(bool v) { _clearMappingInFinalizer = v; }

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
    ccstd::string toString() const;

    ccstd::string toStringExt() const;

    // Private API used in wrapper
    static Object *_createJSObject(Class *cls, v8::Local<v8::Object> obj); // NOLINT(readability-identifier-naming)
    v8::Local<v8::Object> _getJSObject() const;                            // NOLINT(readability-identifier-naming)
    ObjectWrap &_getWrap();                                                // NOLINT(readability-identifier-naming)
    Class *_getClass() const;                                              // NOLINT(readability-identifier-naming)

    void _setFinalizeCallback(V8FinalizeFunc finalizeCb); // NOLINT(readability-identifier-naming)
    bool _isNativeFunction() const;                       // NOLINT(readability-identifier-naming)
    //

    #if CC_DEBUG && CC_DEBUG_JS_OBJECT_ID
    uint32_t getObjectId() const { return _objectId; }
    #endif

private:
    static void nativeObjectFinalizeHook(Object *seObj);
    static void setIsolate(v8::Isolate *isolate);
    static void cleanup();

    Object();
    ~Object() override;

    bool init(Class *cls, v8::Local<v8::Object> obj);
    v8::Local<v8::Value> getProxyTarget() const;

    Class *_cls{nullptr};
    ObjectWrap _obj;
    uint32_t _rootCount{0};

    PrivateObjectBase *_privateObject{nullptr};
    void *_privateData{nullptr};
    V8FinalizeFunc _finalizeCb{nullptr};

    bool _clearMappingInFinalizer{true};

    #if CC_DEBUG && CC_DEBUG_JS_OBJECT_ID
    uint32_t _objectId = 0;
    #endif
    #if JSB_TRACK_OBJECT_CREATION
    ccstd::string _objectCreationStackFrame;
    #endif

    friend class ScriptEngine;
    friend class JSBPersistentHandleVisitor;
};

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
