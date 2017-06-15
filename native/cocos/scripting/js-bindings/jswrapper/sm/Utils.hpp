#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_SM

#include "Base.h"

#include "../Value.hpp"

namespace se {

    extern const bool NEED_THIS;
    extern const bool DONT_NEED_THIS;

    class Class;

    namespace internal {

        struct PrivateData
        {
            void* data;
            JSFinalizeOp finalizeCb;
        };

        std::string jsToStdString(JSContext* cx, JS::HandleString jsStr);

        void jsToSeArgs(JSContext* cx, int argc, const JS::CallArgs& argv, ValueArray* outArr);
        void jsToSeValue(JSContext *cx, JS::HandleValue jsval, Value* v);
        void seToJsArgs(JSContext* cx, const ValueArray& args, JS::AutoValueVector* outArr);
        void seToJsValue(JSContext* cx, const Value& v, JS::MutableHandleValue outVal);
        
        void setReturnValue(JSContext* cx, const Value& data, const JS::CallArgs& argv);

        bool hasPrivate(JSContext* cx, JS::HandleObject obj);
        void* getPrivate(JSContext* cx, JS::HandleObject obj);
        void setPrivate(JSContext* cx, JS::HandleObject obj, void* data, JSFinalizeOp finalizeCb);
        void clearPrivate(JSContext* cx, JS::HandleObject obj);

    } // namespace internal {

} // namespace se {

#endif // #ifdef SCRIPT_ENGINE_SM
