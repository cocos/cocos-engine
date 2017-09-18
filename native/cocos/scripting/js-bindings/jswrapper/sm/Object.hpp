#pragma once

#include "../config.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

#include "Base.h"
#include "../Value.hpp"
#include "../RefCounter.hpp"

namespace se {

    class Class;

    class Object final : public RefCounter
    {
    public:
        static Object* createPlainObject();
        static Object* createObjectWithClass(Class* cls);
        static Object* createArrayObject(size_t length);
        static Object* createUint8TypedArray(uint8_t* data, size_t byteLength);
        static Object* createArrayBufferObject(void* data, size_t byteLength);
        static Object* createJSONObject(const std::string& jsonStr);
        static Object* getObjectWithPtr(void* ptr);

        bool getProperty(const char* name, Value* data);
        void setProperty(const char* name, const Value& v);
        bool defineProperty(const char *name, JSNative getter, JSNative setter);

        bool isFunction() const;
        bool call(const ValueArray& args, Object* thisObject, Value* rval = nullptr);

        bool defineFunction(const char *funcName, JSNative func, int minArgs = 0);

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

        bool strictEquals(Object* o) const;
        bool attachObject(Object* obj);
        bool detachObject(Object* obj);

        // Private API used in wrapper
        static Object* _createJSObject(Class* cls, JSObject* obj);
        void _setFinalizeCallback(JSFinalizeOp finalizeCb);
        bool _isNativeFunction(JSNative func) const;
        JSObject* _getJSObject() const;
        Class* _getClass() const { return _cls; }
        //

    private:
        Object();
        bool init(Class* cls, JSObject* obj);
        virtual ~Object();

        static void setContext(JSContext* cx);
        static void cleanup();

        void trace(JSTracer* tracer, void* data);
        bool updateAfterGC(void* data);

        void protect();
        void unprotect();
        void reset();

        uint32_t _rootCount;

        JS::Heap<JSObject*> _heap;  /* should be untouched if in rooted mode */
        JS::PersistentRootedObject* _root;  /* should be null if not in rooted mode */

        void* _privateData;

        Class* _cls;
        JSFinalizeOp _finalizeCb;

        friend class ScriptEngine;
    };

    extern std::unordered_map<Object*, void*> __objectMap; // Currently, the value `void*` is always nullptr

} // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

