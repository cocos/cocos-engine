#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_SM

#include "Base.h"

#include <chrono>

namespace se {

    class Object;
    class Class;
    class Value;

    extern Class* __jsb_CCPrivateData_class;
    
    class AutoHandleScope
    {
    public:
        AutoHandleScope();
        ~AutoHandleScope();
    };
    
    class ScriptEngine
    {
    private:
        ScriptEngine();
        ~ScriptEngine();

    public:
        static ScriptEngine* getInstance();
        static void destroyInstance();

        Object* getGlobalObject();

        typedef bool (*RegisterCallback)(Object*);
        void addRegisterCallback(RegisterCallback cb);
        bool start();

        bool init();
        void cleanup();
        void addBeforeCleanupHook(const std::function<void()>& hook);
        void addAfterCleanupHook(const std::function<void()>& hook);

        bool executeScriptBuffer(const char *string, Value *data = nullptr, const char *fileName = nullptr);
        bool executeScriptBuffer(const char *string, size_t length, Value *data = nullptr, const char *fileName = nullptr);

        JSContext* _getContext() { return _cx; }

        void gc() { JS_GC( _cx );  }

        bool isValid() { return _isValid; }

        void clearException();

        void _retainScriptObject(void* owner, void* target);
        void _releaseScriptObject(void* owner, void* target);

        enum class NodeEventType
        {
            ENTER,
            EXIT,
            ENTER_TRANSITION_DID_FINISH,
            EXIT_TRANSITION_DID_START,
            CLEANUP
        };
        bool _onReceiveNodeEvent(void* node, NodeEventType type);

        using NodeEventListener = bool(*)(void*/*node*/, NodeEventType);
        bool _setNodeEventListener(NodeEventListener listener);

    private:
        static void myWeakPointerCompartmentCallback(JSContext* cx, JSCompartment* comp, void* data);
        static void myWeakPointerZoneGroupCallback(JSContext* cx, void* data);

        JSContext* _cx;
        JSCompartment* _oldCompartment;

        Object* _globalObj;

        bool _isValid;
        bool _isInCleanup;
        NodeEventListener _nodeEventListener;

        std::vector<RegisterCallback> _registerCallbackArray;
        std::chrono::steady_clock::time_point _startTime;
        std::vector<std::function<void()>> _beforeCleanupHookArray;
        std::vector<std::function<void()>> _afterCleanupHookArray;
    };

 } // namespace se {

#endif // SCRIPT_ENGINE_SM


