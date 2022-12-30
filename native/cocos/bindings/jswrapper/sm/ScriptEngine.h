/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

    #include "Base.h"

namespace se {

class Object;
class Class;
class Value;

/**
     * A stack-allocated class that governs a number of local handles.
     * It's only implemented for v8 wrapper now.
     * Other script engine wrappers have empty implementation for this class.
     * It's used at the beginning of executing any wrapper API.
     */
class AutoHandleScope {
public:
    AutoHandleScope();
    ~AutoHandleScope();
};

/**
     * ScriptEngine is a sington which represents a context of JavaScript VM.
     */
class ScriptEngine final {
public:
    /**
         *  @brief Gets or creates the instance of script engine.
         *  @return The script engine instance.
         */
    static ScriptEngine *getInstance();

    /**
         *  @brief Destroys the instance of script engine.
         */
    static void destroyInstance();

    /**
         *  @brief Gets the global object of JavaScript VM.
         *  @return The se::Object stores the global JavaScript object.
         */
    Object *getGlobalObject();

    typedef bool (*RegisterCallback)(Object *);

    /**
         *  @brief Adds a callback for registering a native binding module.
         *  @param[in] cb A callback for registering a native binding module.
         *  @note This method just add a callback to a vector, callbacks is invoked in `start` method.
         */
    void addRegisterCallback(RegisterCallback cb);

    /**
     *  @brief Adds a callback for registering a native binding module, which will not be removed by ScriptEngine::cleanup.
     *  @param[in] cb A callback for registering a native binding module.
     *  @note This method just add a callback to a vector, callbacks is invoked in `start` method.
     */
    void addPermanentRegisterCallback(RegisterCallback cb);

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
         *  @brief Adds a hook function before initializing script engine.
         *  @param[in] hook A hook function to be invoked before initializing script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
    void addBeforeInitHook(const std::function<void()> &hook);

    /**
         *  @brief Adds a hook function after initializing script engine.
         *  @param[in] hook A hook function to be invoked before initializing script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
    void addAfterInitHook(const std::function<void()> &hook);

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
    void addBeforeCleanupHook(const std::function<void()> &hook);

    /**
         *  @brief Adds a hook function after cleanuping script engine.
         *  @param[in] hook A hook function to be invoked after cleanuping script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
    void addAfterCleanupHook(const std::function<void()> &hook);

    /**
         *  @brief Executes a utf-8 string buffer which contains JavaScript code.
         *  @param[in] scriptStr A utf-8 string buffer, if it isn't null-terminated, parameter `length` should be assigned and > 0.
         *  @param[in] length The length of parameter `scriptStr`, it will be set to string length internally if passing < 0 and parameter `scriptStr` is null-terminated.
         *  @param[in] rval The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
         *  @param[in] fileName A string containing a URL for the script's source file. This is used by debuggers and when reporting exceptions. Pass NULL if you do not care to include source file information.
         *  @return true if succeed, otherwise false.
         */
    bool evalString(const char *scriptStr, ssize_t length = -1, Value *rval = nullptr, const char *fileName = nullptr);

    /**
     *  @brief Compile script file into v8::ScriptCompiler::CachedData and save to file.
     *  @param[in] path The path of script file.
     *  @param[in] pathBc The location where bytecode file should be written to. The path should be ends with ".bc", which indicates a bytecode file.
     *  @return true if succeed, otherwise false.
     */
    bool saveByteCodeToFile(const std::string &path, const std::string &pathBc) {
        assert(false);
        return false;
    } //cjh

    /**
     * @brief Grab a snapshot of the current JavaScript execution stack.
     * @return current stack trace string
     */
    std::string getCurrentStackTrace() { return ""; } //cjh

    /**
         *  Delegate class for file operation
         */
    class FileOperationDelegate {
    public:
        FileOperationDelegate()
        : onGetDataFromFile(nullptr),
          onGetStringFromFile(nullptr),
          onCheckFileExist(nullptr),
          onGetFullPath(nullptr) {}

        bool isValid() const {
            return onGetDataFromFile != nullptr && onGetStringFromFile != nullptr && onCheckFileExist != nullptr && onGetFullPath != nullptr;
        }

        // path, buffer, buffer size
        std::function<void(const std::string &, const std::function<void(const uint8_t *, size_t)> &)> onGetDataFromFile;
        // path, return file string content.
        std::function<std::string(const std::string &)> onGetStringFromFile;
        // path
        std::function<bool(const std::string &)> onCheckFileExist;
        // path, return full path
        std::function<std::string(const std::string &)> onGetFullPath;
    };

    /**
         *  @brief Sets the delegate for file operation.
         *  @param delegate[in] The delegate instance for file operation.
         */
    void setFileOperationDelegate(const FileOperationDelegate &delegate);

    /**
         *  @brief Gets the delegate for file operation.
         *  @return The delegate for file operation
         */
    const FileOperationDelegate &getFileOperationDelegate() const;

    /**
         *  @brief Executes a file which contains JavaScript code.
         *  @param[in] path Script file path.
         *  @param[in] rval The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
         *  @return true if succeed, otherwise false.
         */
    bool runScript(const std::string &path, Value *rval = nullptr);

    /**
         *  @brief Tests whether script engine is doing garbage collection.
         *  @return true if it's in garbage collection, otherwise false.
         */
    bool isGarbageCollecting();

    /**
         *  @brief Performs a JavaScript garbage collection.
         */
    void garbageCollect() { JS_GC(_cx); }

    /**
         *  @brief Tests whether script engine is being cleaned up.
         *  @return true if it's in cleaning up, otherwise false.
         */
    bool isInCleanup() { return _isInCleanup; }

    /**
         *  @brief Tests whether script engine is valid.
         *  @return true if it's valid, otherwise false.
         */
    bool isValid() { return _isValid; }

    /**
     * @brief Throw JS exception
     */
    void throwException(const std::string &errorMessage) { assert(false); } //cjh

    /**
         *  @brief Clears all exceptions.
         */
    void clearException();

    using ExceptionCallback = std::function<void(const char *, const char *, const char *)>; // location, message, stack

    /**
         *  @brief Sets the callback function while an exception is fired.
         *  @param[in] cb The callback function to notify that an exception is fired.
         */
    void setExceptionCallback(const ExceptionCallback &cb);

    /**
     *  @brief Sets the callback function while an exception is fired in JS.
     *  @param[in] cb The callback function to notify that an exception is fired.
     */
    void setJSExceptionCallback(const ExceptionCallback &cb);

    /**
         *  @brief Gets the start time of script engine.
         *  @return The start time of script engine.
         */
    const std::chrono::steady_clock::time_point &getStartTime() const { return _startTime; }

    /**
         *  @brief Enables JavaScript debugger
         *  @param[in] serverAddr The address of debugger server.
         *  @param[in] port The port of debugger server will use.
         *  @param[in] isWait Whether wait debugger attach when loading.
         */
    void enableDebugger(const std::string &serverAddr, uint32_t port, bool isWait = false);

    /**
         *  @brief Tests whether JavaScript debugger is enabled
         *  @return true if JavaScript debugger is enabled, otherwise false.
         */
    bool isDebuggerEnabled() const;

    /**
         *  @brief Main loop update trigger, it's need to invoked in main thread every frame.
         */
    void mainLoopUpdate();

    /**
         *  @brief Gets script virtual machine instance ID. Default value is 1, increase by 1 if `init` is invoked.
         */
    uint32_t getVMId() const { return _vmId; }

    /**
     * @brief Fast version of call script function, faster than Object::call
     */
    bool callFunction(Object *targetObj, const char *funcName, uint32_t argc, Value *args, Value *rval = nullptr);

    /**
     * @brief Handle all exceptions throwed by promise
     */
    void handlePromiseExceptions();

    // Private API used in wrapper
    JSContext *_getContext() { return _cx; }
    void _setGarbageCollecting(bool isGarbageCollecting);
    void _debugProcessInput(const std::string &str);
    //
private:
    ScriptEngine();
    ~ScriptEngine();

    static void onWeakPointerCompartmentCallback(JSTracer *trc, JS::Compartment *comp, void *data);
    static void onWeakPointerZoneGroupCallback(JSTracer *trc, void *data);

    bool getScript(const std::string &path, JS::MutableHandleScript script);
    bool compileScript(const std::string &path, JS::MutableHandleScript script);

    JSContext *_cx;
    JS::Realm *_oldCompartment;

    Object *_globalObj;
    Object *_debugGlobalObj;

    FileOperationDelegate _fileOperationDelegate;

    ccstd::vector<RegisterCallback> _registerCallbackArray;
    ccstd::vector<RegisterCallback> _permRegisterCallbackArray;
    std::chrono::steady_clock::time_point _startTime;

    ccstd::vector<std::function<void()>> _beforeInitHookArray;
    ccstd::vector<std::function<void()>> _afterInitHookArray;

    ccstd::vector<std::function<void()>> _beforeCleanupHookArray;
    ccstd::vector<std::function<void()>> _afterCleanupHookArray;

    ExceptionCallback _exceptionCallback;
    // name ~> JSScript map
    std::unordered_map<std::string, JS::PersistentRootedScript *> _filenameScriptMap;

    std::string _debuggerServerAddr;
    uint32_t _debuggerServerPort;

    uint32_t _vmId;

    bool _isGarbageCollecting;
    bool _isValid;
    bool _isInCleanup;
    bool _isErrorHandleWorking;
};

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
