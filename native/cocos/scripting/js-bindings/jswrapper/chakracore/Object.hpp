#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_CHAKRACORE

#include "Base.h"
#include "../Value.hpp"
#include "../Ref.hpp"

namespace se {

    class Class;

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

        bool getProperty(const char* name, Value* data);
        void setProperty(const char* name, const Value& v);
        bool defineProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter);

        bool isFunction() const;
        bool call(const ValueArray& args, Object* thisObject, Value* rval = nullptr);

        bool defineFunction(const char *funcName, JsNativeFunction func);

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

        bool strictEquals(Object* obj) const;
        bool attachObject(Object* obj);
        bool detachObject(Object* obj);

        // Private API used in wrapper
        static Object* _createJSObject(Class* cls, JsValueRef obj);
        JsValueRef _getJSObject() const;
        Class* _getClass() const;
        void _cleanup(void* nativeObject = nullptr);
        void _setFinalizeCallback(JsFinalizeCallback finalizeCb);
        bool _isNativeFunction() const;
        //

    private:
        static void cleanup();

        Object();
        virtual ~Object();
        bool init(JsValueRef obj);

        Class* _cls;
        JsValueRef _obj;
        uint32_t _rootCount;
        void* _privateData;
        bool _isCleanup;
        JsFinalizeCallback _finalizeCb;

        friend class ScriptEngine;
    };

} // namespace se {

#endif // SCRIPT_ENGINE_CHAKRACORE

