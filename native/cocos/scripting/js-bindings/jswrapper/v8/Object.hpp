#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_V8

#include "Base.h"
#include "../Ref.hpp"
#include "../Value.hpp"
#include "ObjectWrap.h"

namespace se {

    class Class;

    namespace internal {
        struct PrivateData;
    }

    class Object final : public Ref
    {
    public:
        static Object* createPlainObject();
        static Object* createArrayObject(size_t length);
        static Object* createUint8TypedArray(uint8_t* data, size_t byteLength);
        static Object* createArrayBufferObject(void* data, size_t byteLength);
        static Object* createJSONObject(const std::string& jsonStr);
        static Object* getObjectWithPtr(void* ptr);
        static Object* createObjectWithClass(Class* cls);


        bool getProperty(const char *name, Value* data);
        void setProperty(const char *name, const Value& data);
        bool defineProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);

        bool isFunction() const;

        bool call(const ValueArray& args, Object* thisObject, Value* rval = nullptr);

        bool defineFunction(const char *funcName, v8::FunctionCallback func);

        bool isTypedArray() const;
        bool getTypedArrayData(uint8_t** ptr, size_t* length) const;

        bool isArray() const;
        bool getArrayLength(uint32_t* length) const;
        bool getArrayElement(uint32_t index, Value* data) const;
        bool setArrayElement(uint32_t index, const Value& data);

        bool isArrayBuffer() const;
        bool getArrayBufferData(uint8_t** ptr, size_t* length) const;

        bool getAllKeys(std::vector<std::string>* allKeys) const;

        void setPrivateData(void* data);
        void* getPrivateData() const;
        void clearPrivateData();

        void root();
        void unroot();
        bool isRooted() const;

        bool isSame(Object* o) const;
        bool attachChild(Object* child);
        bool detachChild(Object* child);

        // Private API used in wrapper
        static Object* _createJSObject(Class* cls, v8::Local<v8::Object> obj);
        v8::Local<v8::Object> _getJSObject() const;
        ObjectWrap& _getWrap();
        Class* _getClass() const;

        void _setFinalizeCallback(V8FinalizeFunc finalizeCb);
        bool _isNativeFunction() const;
        //

    private:
        static void nativeObjectFinalizeHook(void* nativeObj);
        static void setIsolate(v8::Isolate* isolate);
        static void cleanup();

        Object();
        virtual ~Object();

        bool init(Class* cls, v8::Local<v8::Object> obj);

        Class* _cls;
        ObjectWrap _obj;
        uint32_t _rootCount;

        void* _privateData;
        V8FinalizeFunc _finalizeCb;
        internal::PrivateData* _internalData;

        friend class ScriptEngine;
    };

    // key: native ptr, value: se::Object
    extern std::unordered_map<void*, Object*> __nativePtrToObjectMap;
    // key: native ptr, value: non-ref object created by ctor
    extern std::unordered_map<void*, bool> __nonRefNativeObjectCreatedByCtorMap;
    extern std::unordered_map<Object*, void*> __objectMap; // Currently, the value `void*` is always nullptr

} // namespace se {

#endif // SCRIPT_ENGINE_V8
