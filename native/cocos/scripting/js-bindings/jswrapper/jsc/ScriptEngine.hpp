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

    /**
     * A stack-allocated class that governs a number of local handles.
     * It's only implemented for v8 wrapper now.
     * Other script engine wrappers have empty implementation for this class.
     * It's used at the beginning of executing any wrapper API.
     */
    class AutoHandleScope
    {
    public:
        AutoHandleScope();
        ~AutoHandleScope();
    };

    /**
     * ScriptEngine is a sington which represents a context of JavaScript VM.
     */
    class ScriptEngine final
    {
    public:
        /**
         *  @brief Gets or creates the instance of script engine.
         *  @return The script engine instance.
         */
        static ScriptEngine* getInstance();

        /**
         *  @brief Destroys the instance of script engine.
         *  @return
         */
        static void destroyInstance();

        /**
         *  @brief Gets the global object of JavaScript VM.
         *  @return The se::Object stores the global JavaScript object.
         */
        Object* getGlobalObject();

        typedef bool (*RegisterCallback)(Object*);

        /**
         *  @brief Adds a callback for registering a native binding module.
         *  @param[in] cb A callback for registering a native binding module.
         *  @note This method just add a callback to a vector, callbacks is invoked in `start` method.
         */
        void addRegisterCallback(RegisterCallback cb);

        /**
         *  @brief Starts the script engine.
         *  @return true if succeed, otherwise false.
         *  @note This method will invoke all callbacks of native binding modules by the order of registration.
         */
        bool start();

        /**
         *  @brief Initializes script engine.
         *  @return true if succeed, otherwise false.
         *  @note This method will create JavaScript context and global object.
         */
        bool init();

        /**
         *  @brief Cleanups script engine.
         *  @note This method will removes all objects in JavaScript VM even whose are rooted, then shutdown JavaScript VMf.
         */
        void cleanup();

        /**
         *  @brief Adds a hook function before cleanuping script engine.
         *  @param[in] hook A hook function to be invoked before cleanuping script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
        void addBeforeCleanupHook(const std::function<void()>& hook);

        /**
         *  @brief Adds a hook function after cleanuping script engine.
         *  @param[in] hook A hook function to be invoked after cleanuping script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
        void addAfterCleanupHook(const std::function<void()>& hook);

        /**
         *  @brief Executes a utf-8 string buffer which contains JavaScript code.
         *  @param[in] scriptStr A utf-8 string buffer, if it isn't null-terminated, parameter `length` should be assigned and > 0.
         *  @param[in] length The length of parameter `scriptStr`, it will be set to string length internally if passing < 0 and parameter `scriptStr` is null-terminated.
         *  @param[in] rval The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
         *  @param[in] fileName A string containing a URL for the script's source file. This is used by debuggers and when reporting exceptions. Pass NULL if you do not care to include source file information.
         *  @return true if succeed, otherwise false.
         */
        bool executeScriptBuffer(const char* scriptStr, ssize_t length = -1, Value* rval = nullptr, const char* fileName = nullptr);

        /**
         *  @brief Tests whether script engine is doing garbage collection.
         *  @return true if it's in garbage collection, otherwise false.
         */
        bool isInGC();

        /**
         *  @brief Performs a JavaScript garbage collection.
         */
        void gc();

        /**
         *  @brief Tests whether script engine is valid.
         *  @return true if it's valid, otherwise false.
         */
        bool isValid() { return _isValid; }

        /**
         *  @brief Clears all exceptions.
         */
        void clearException();

        // Private API used in wrapper
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
        void _clearException(JSValueRef exception);

        JSContextRef _getContext() const { return _cx; }

        void _setInGC(bool isInGC);
        //
    private:

        ScriptEngine();
        ~ScriptEngine();

        JSGlobalContextRef _cx;

        Object* _globalObj;

        bool _isInGC;
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


