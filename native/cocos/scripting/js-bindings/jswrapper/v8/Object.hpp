#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_V8

#include "Base.h"
#include "../Ref.hpp"
#include "../Value.hpp"
#include "ObjectWrap.h"

namespace se {

    class Class;

    class Object : public Ref
    {
    private:
        Object();
        bool init(Class* cls, v8::Local<v8::Object> obj, bool rooted);

    public:
        virtual ~Object();

        static Object* createPlainObject(bool rooted);
//        static Object* createObject(const char* clsName, bool rooted);
        static Object* createArrayObject(size_t length, bool rooted);
        static Object* createUint8TypedArray(uint8_t* data, size_t byteLength, bool rooted);
        static Object* createArrayBufferObject(void* data, size_t byteLength, bool rooted);
        static Object* createJSONObject(const std::string& jsonStr, bool rooted);
        static Object* getObjectWithPtr(void* ptr);
//        static Object* getOrCreateObjectWithPtr(void* ptr, const char* clsName, bool rooted);
        static Object* createObjectWithClass(Class* cls, bool rooted);
        static Object* _createJSObject(Class* cls, v8::Local<v8::Object> obj, bool rooted);

        // --- Getter/Setter
        bool getProperty(const char *name, Value* data);
        void setProperty(const char *name, const Value& data);
        bool defineProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);

        // --- Function
        bool isFunction() const;
        bool _isNativeFunction() const;
        bool call(const ValueArray& args, Object* thisObject, Value* rval = nullptr);

        bool defineFunction(const char *funcName, v8::FunctionCallback func);


        // --- TypedArrays
        bool isTypedArray() const;
        bool getTypedArrayData(uint8_t** ptr, size_t* length) const;

//        void getAsFloat32Array(float **ptr, unsigned int *length);
//        void getAsUint8Array(unsigned char **ptr, unsigned int *length);
//        void getAsUint16Array(unsigned short **ptr, unsigned int *length);
//        void getAsUint32Array(unsigned int **ptr, unsigned int *length);

        // --- Arrays
        bool isArray() const;
        bool getArrayLength(uint32_t* length) const;
        bool getArrayElement(uint32_t index, Value* data) const;
        bool setArrayElement(uint32_t index, const Value& data);

        // --- ArrayBuffer
        bool isArrayBuffer() const;
        bool getArrayBufferData(uint8_t** ptr, size_t* length) const;

        bool getAllKeys(std::vector<std::string>* allKeys) const;

        // --- Private
        void setPrivateData(void* data);
        void* getPrivateData() const;
        void clearPrivateData();

        void switchToRooted();
        void switchToUnrooted();
        void setKeepRootedUntilDie(bool keepRooted);
        bool isRooted() const;

        bool isSame(Object* o) const;
        bool attachChild(Object* child);
        bool detachChild(Object* child);

        v8::Local<v8::Object> _getJSObject() const;
        ObjectWrap& _getWrap();
        Class* _getClass() const;

        void _setFinalizeCallback(V8FinalizeFunc finalizeCb);

    private:
        static void nativeObjectFinalizeHook(void* nativeObj);
        static void setIsolate(v8::Isolate* isolate);
        static void cleanup();

        Class* _cls;
        ObjectWrap _obj;
        bool _isRooted;
        bool _isKeepRootedUntilDie;
        bool _hasPrivateData;
        V8FinalizeFunc _finalizeCb;

        friend class ScriptEngine;
    };

    extern std::unordered_map<void* /*native*/, Object* /*jsobj*/> __nativePtrToObjectMap;

} // namespace se {

#endif // SCRIPT_ENGINE_V8
