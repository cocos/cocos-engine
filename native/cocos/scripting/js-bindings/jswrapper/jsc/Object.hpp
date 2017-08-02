#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_JSC

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
        bool defineProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter);

        bool isFunction() const;

        bool call(const ValueArray& args, Object* thisObject, Value* rval = nullptr);

        bool defineFunction(const char *funcName, JSObjectCallAsFunctionCallback func);

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
        static Object* _createJSObject(Class* cls, JSObjectRef obj);
        JSObjectRef _getJSObject() const;
        Class* _getClass() const;
        void _setFinalizeCallback(JSObjectFinalizeCallback finalizeCb);

        void _cleanup(void* nativeObject = nullptr);
        bool _isNativeFunction() const;
        //

    private:
        static void setContext(JSContextRef cx);
        static void cleanup();

        Object();
        virtual ~Object();

        bool init(JSObjectRef obj);

        Class* _cls;
        JSObjectRef _obj;
        uint32_t _rootCount;
        void* _privateData;
        bool _isCleanup;
        JSObjectFinalizeCallback _finalizeCb;

        friend class ScriptEngine;
        friend class AutoHandleScope;
    };

    extern std::unordered_map<void* /*native*/, Object* /*jsobj*/> __nativePtrToObjectMap;
    extern std::unordered_map<void* /*native*/, bool> __nonRefNativeObjectCreatedByCtorMap;

} // namespace se {

#endif // SCRIPT_ENGINE_JSC

