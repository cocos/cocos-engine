#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_JSC

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

    private:
        static void _unrefAllObjects();

        static void refObject(Object* obj);
        static void unrefObject(Object* obj);

        static int __scopeCount;
        static std::vector<Object*> __localObjects;

        friend class Object;
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

        void gc();

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

        std::string _formatException(JSValueRef exception);
    private:

        JSGlobalContextRef _cx;

        Object* _globalObj;

        bool _isValid;
        bool _isInCleanup;
        NodeEventListener _nodeEventListener;

        std::vector<RegisterCallback> _registerCallbackArray;
        std::chrono::steady_clock::time_point _startTime;
        std::vector<std::function<void()>> _beforeCleanupHookArray;
        std::vector<std::function<void()>> _afterCleanupHookArray;

        friend class Object;
    };

 } // namespace se {

#endif // SCRIPT_ENGINE_JSC


