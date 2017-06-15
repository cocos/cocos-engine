#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Base.h"

#include "../Value.hpp"

namespace se {

    extern const bool NEED_THIS;
    extern const bool DONT_NEED_THIS;
    
    namespace internal {

        struct PrivateData
        {
            void* data;
            JSObjectFinalizeCallback finalizeCb;
        };
        
        void setContext(JSContextRef cx);

        bool defineProperty(Object* obj, const char* name, JSObjectCallAsFunctionCallback jsGetter, JSObjectCallAsFunctionCallback jsSetter);

        void jsToSeArgs(JSContextRef cx, unsigned short argc, const JSValueRef* argv, ValueArray* outArr);
        void seToJsArgs(JSContextRef cx, const ValueArray& args, JSValueRef* outArr);
        void jsToSeValue(JSContextRef cx, JSValueRef jsval, Value* v);
        void seToJsValue(JSContextRef cx, const Value& v, JSValueRef* jsval);

        void forceConvertJsValueToStdString(JSContextRef cx, JSValueRef jsval, std::string* ret);
        void jsStringToStdString(JSContextRef cx, JSStringRef jsStr, std::string* ret);

        bool hasPrivate(JSObjectRef obj);
        void setPrivate(JSObjectRef obj, void* data, JSObjectFinalizeCallback finalizeCb);
        void* getPrivate(JSObjectRef obj);
        void clearPrivate(JSObjectRef obj);

    } // namespace internal {
} // namespace se {

#endif // #ifdef SCRIPT_ENGINE_JSC
