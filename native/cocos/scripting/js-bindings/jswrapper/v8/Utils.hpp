#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_V8

#include "Base.h"
#include "../Value.hpp"
#include "ObjectWrap.h"

namespace se {
    
    namespace internal {

        struct PrivateData
        {
            void* data;
            Object* seObj;
        };

        void jsToSeArgs(const v8::FunctionCallbackInfo<v8::Value>& _v8args, ValueArray* outArr);
        void jsToSeValue(v8::Isolate* isolate, v8::Local<v8::Value> jsval, Value* v);
        void seToJsArgs(v8::Isolate* isolate, const ValueArray& args, std::vector<v8::Local<v8::Value>>* outArr);
        void seToJsValue(v8::Isolate* isolate, const Value& v, v8::Local<v8::Value>* outJsVal);

        void setReturnValue(const Value& data, const v8::FunctionCallbackInfo<v8::Value>& argv);
        void setReturnValue(const Value& data, const v8::PropertyCallbackInfo<v8::Value>& argv);

        bool hasPrivate(v8::Isolate* isolate, v8::Local<v8::Value> value);
        void setPrivate(v8::Isolate* isolate, ObjectWrap& wrap, void* data, PrivateData** outInternalData);
        void* getPrivate(v8::Isolate* isolate, v8::Local<v8::Value> value);
        void clearPrivate(v8::Isolate* isolate, ObjectWrap& wrap);

    } // namespace internal {
} // namespace se {

#endif // #ifdef SCRIPT_ENGINE_V8
