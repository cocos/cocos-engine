/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "ScriptEngine.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

    #include "../MappingUtils.h"
    #include "../State.h"
    #include "Class.h"
    #include "Object.h"
    #include "Utils.h"

    // for debug socket
    #ifdef _WIN32
        #include <WS2tcpip.h>
        #include <io.h>
    #else
        #include <netdb.h>
        #include <sys/socket.h>
        #include <unistd.h>
    #endif

    #include <mutex>
    #include <sstream>
    #include <thread>

    #if SE_DEBUG
        #define TRACE_DEBUGGER_SERVER(...) SE_LOGD(__VA_ARGS__)
    #else
        #define TRACE_DEBUGGER_SERVER(...)
    #endif // #if CC_DEBUG

uint32_t __jsbInvocationCount = 0;

namespace se {

Class *__jsb_CCPrivateData_class = nullptr;

namespace {

const char *BYTE_CODE_FILE_EXT = ".jsc";

ScriptEngine *__instance = nullptr;

const JSClassOps global_classOps = {
    nullptr,                   // addProperty
    nullptr,                   // delProperty
    nullptr,                   // enumerate
    nullptr,                   // newEnumerate
    nullptr,                   // resolve
    nullptr,                   // mayResolve
    nullptr,                   // finalize
    nullptr,                   // call
    nullptr,                   // hasInstance
    nullptr,                   // construct
    JS_GlobalObjectTraceHook,  // trace
};

JSClass __globalClass = {
    "global",
    JSCLASS_GLOBAL_FLAGS,
    &global_classOps};

void reportWarning(JSContext *cx, JSErrorReport *report) {
    MOZ_RELEASE_ASSERT(report);
//cjh    MOZ_RELEASE_ASSERT(JSREPORT_IS_WARNING(report->flags));

    SE_LOGE("%s:%u:%s\n", report->filename ? report->filename : "<no filename>",
            (unsigned int)report->lineno,
            report->message().c_str());
}

void SetStandardCompartmentOptions(JS::RealmOptions &options) {
    bool enableSharedMemory = true;
//cjh    options.behaviors().setVersion(JSVERSION_LATEST);
    options.creationOptions().setSharedMemoryAndAtomicsEnabled(enableSharedMemory);
}

bool __forceGC(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS_GC(cx);
    return true;
}

bool __log(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc > 0) {
        JSString *string = JS::ToString(cx, args[0]);
        if (string) {
            JS::RootedString jsstr(cx, string);
            JS::UniqueChars           buffer = JS_EncodeStringToUTF8(cx, jsstr);

            SE_LOGD("JS: %s\n", buffer.get());
        }
    }
    args.rval().setUndefined();
    return true;
}

// Private data class
bool privateDataContructor(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return true;
}

void privateDataFinalize(JSFreeOp *fop, JSObject *obj) {
    internal::PrivateData *p = (internal::PrivateData *)internal::SE_JS_GetPrivate(obj, 0);
    if (p == nullptr)
        return;

    internal::SE_JS_SetPrivate(obj, 0, p->data);
    if (p->finalizeCb != nullptr)
        p->finalizeCb(fop, obj);
    free(p);
}

// ------------------------------------------------------- ScriptEngine

void on_garbage_collect(JSContext *cx, JSGCStatus status, void *data) {
    /* We finalize any pending toggle refs before doing any garbage collection,
             * so that we can collect the JS wrapper objects, and in order to minimize
             * the chances of objects having a pending toggle up queued when they are
             * garbage collected. */
    if (status == JSGC_BEGIN) {
        ScriptEngine::getInstance()->_setGarbageCollecting(true);
        SE_LOGD("on_garbage_collect: begin, Native -> JS map count: %d, all objects: %d\n", (int)NativePtrToObjectMap::size(), (int)__objectMap.size());
    } else if (status == JSGC_END) {
        SE_LOGD("on_garbage_collect: end, Native -> JS map count: %d, all objects: %d\n", (int)NativePtrToObjectMap::size(), (int)__objectMap.size());
        ScriptEngine::getInstance()->_setGarbageCollecting(false);
    }
}

// For promise
using JobQueue = JS::GCVector<JSObject *, 0, js::SystemAllocPolicy>;

// Per-context promise state.
struct PromiseState {
    explicit PromiseState(JSContext *cx);

    JS::PersistentRooted<JobQueue> jobQueue;
    bool                           drainingJobQueue;
    bool                           quitting;
};

PromiseState::PromiseState(JSContext *cx)
: drainingJobQueue(false),
  quitting(false) {}

PromiseState *getPromiseState(JSContext *cx) {
    PromiseState *sc = static_cast<PromiseState *>(JS_GetContextPrivate(cx));
    assert(sc);
    return sc;
}

JSObject *onGetIncumbentGlobalCallback(JSContext *cx) {
    return JS::CurrentGlobalOrNull(cx);
}

bool onEnqueuePromiseJobCallback(JSContext *cx, JS::HandleObject job, JS::HandleObject allocationSite,
                                 JS::HandleObject incumbentGlobal, void *data) {
    PromiseState *sc = getPromiseState(cx);
    assert(job);
    return sc->jobQueue.append(job);
}

bool drainJobQueue() {
    JSContext *   cx = ScriptEngine::getInstance()->_getContext();
    PromiseState *sc = getPromiseState(cx);
    if (sc->quitting || sc->drainingJobQueue)
        return true;

    sc->drainingJobQueue = true;

    JS::RootedObject     job(cx);
    JS::HandleValueArray args(JS::HandleValueArray::empty());
    JS::RootedValue      rval(cx);
    // Execute jobs in a loop until we've reached the end of the queue.
    // Since executing a job can trigger enqueuing of additional jobs,
    // it's crucial to re-check the queue length during each iteration.
    for (size_t i = 0; i < sc->jobQueue.length(); i++) {
        job = sc->jobQueue[i];
//cjh        JS::AutoCompartment ac(cx, job);
        JS::Call(cx, JS::UndefinedHandleValue, job, args, &rval);
        ScriptEngine::getInstance()->clearException();
        sc->jobQueue[i].set(nullptr);
    }
    sc->jobQueue.clear();
    sc->drainingJobQueue = false;

    return true;
}

std::string removeFileExt(const std::string &filePath) {
    size_t pos = filePath.rfind('.');
    if (0 < pos) {
        return filePath.substr(0, pos);
    }
    return filePath;
}

bool getBytecodeBuildId(JS::BuildIdCharVector* buildId) {
  // The browser embeds the date into the buildid and the buildid is embedded
  // in the binary, so every 'make' necessarily builds a new firefox binary.
  // Fortunately, the actual firefox executable is tiny -- all the code is in
  // libxul.so and other shared modules -- so this isn't a big deal. Not so
  // for the statically-linked JS shell. To avoid recompiling js.cpp and
  // re-linking 'js' on every 'make', we use a constant buildid and rely on
  // the shell user to manually clear any caches between cache-breaking updates.
  const char buildid[] = "cocos_xdr";
  return buildId->append(buildid, sizeof(buildid));
}

// For console stuff
bool JSB_console_format_log(State &s, const char *prefix, int msgIndex = 0) {
    if (msgIndex < 0)
        return false;

    const auto &args = s.args();
    int         argc = (int)args.size();
    if ((argc - msgIndex) == 1) {
        std::string msg = args[msgIndex].toStringForce();
        SE_LOGD("JS: %s%s\n", prefix, msg.c_str());
    } else if (argc > 1) {
        std::string msg = args[msgIndex].toStringForce();
        size_t      pos;
        for (int i = (msgIndex + 1); i < argc; ++i) {
            pos = msg.find("%");
            if (pos != std::string::npos && pos != (msg.length() - 1) && (msg[pos + 1] == 'd' || msg[pos + 1] == 's' || msg[pos + 1] == 'f')) {
                msg.replace(pos, 2, args[i].toStringForce());
            } else {
                msg += " " + args[i].toStringForce();
            }
        }

        SE_LOGD("JS: %s%s\n", prefix, msg.c_str());
    }

    return true;
}

bool JSB_console_log(State &s) {
    JSB_console_format_log(s, "");
    return true;
}
SE_BIND_FUNC(JSB_console_log)

bool JSB_console_debug(State &s) {
    JSB_console_format_log(s, "[DEBUG]: ");
    return true;
}
SE_BIND_FUNC(JSB_console_debug)

bool JSB_console_info(State &s) {
    JSB_console_format_log(s, "[INFO]: ");
    return true;
}
SE_BIND_FUNC(JSB_console_info)

bool JSB_console_warn(State &s) {
    JSB_console_format_log(s, "[WARN]: ");
    return true;
}
SE_BIND_FUNC(JSB_console_warn)

bool JSB_console_error(State &s) {
    JSB_console_format_log(s, "[ERROR]: ");
    return true;
}
SE_BIND_FUNC(JSB_console_error)

bool JSB_console_assert(State &s) {
    const auto &args = s.args();
    if (!args.empty()) {
        if (args[0].isBoolean() && !args[0].toBoolean()) {
            JSB_console_format_log(s, "[ASSERT]: ", 1);
        }
    }
    return true;
}
SE_BIND_FUNC(JSB_console_assert)
} // namespace

AutoHandleScope::AutoHandleScope() {
}

AutoHandleScope::~AutoHandleScope() {
    drainJobQueue();
}

ScriptEngine *ScriptEngine::getInstance() {
    if (__instance == nullptr) {
        __instance = new ScriptEngine();
    }

    return __instance;
}

void ScriptEngine::destroyInstance() {
    delete __instance;
    __instance = nullptr;
}

ScriptEngine::ScriptEngine()
: _cx(nullptr),
  _globalObj(nullptr),
  _debugGlobalObj(nullptr),
  _oldCompartment(nullptr),
  _exceptionCallback(nullptr),
  _debuggerServerPort(0),
  _vmId(0),
  _isGarbageCollecting(false),
  _isValid(false),
  _isInCleanup(false),
  _isErrorHandleWorking(false) {
    bool ok = JS_Init();
    assert(ok);
}

/* static */
void ScriptEngine::onWeakPointerCompartmentCallback(JSTracer* trc, JS::Compartment *comp, void *data) {
    onWeakPointerZoneGroupCallback(trc, data);
}

/* static */
void ScriptEngine::onWeakPointerZoneGroupCallback(JSTracer* trc, void *data) {
    bool    isInCleanup   = getInstance()->isInCleanup();
    bool    isIterUpdated = false;
    Object *obj           = nullptr;
    auto    iter          = NativePtrToObjectMap::begin();
    while (iter != NativePtrToObjectMap::end()) {
        obj           = iter->second;
        isIterUpdated = false;
        if (!obj->isRooted()) {
            if (obj->updateAfterGC(trc, data)) {
                obj->decRef();
                iter          = NativePtrToObjectMap::erase(iter);
                isIterUpdated = true;
            }
        } else if (isInCleanup) // Rooted and in cleanup step
        {
            obj->unprotect();
            obj->decRef();
            iter          = NativePtrToObjectMap::erase(iter);
            isIterUpdated = true;
        }

        if (!isIterUpdated)
            ++iter;
    }
}

bool ScriptEngine::init() {
    cleanup();
    SE_LOGD("Initializing SpiderMonkey, version: %s\n", JS_GetImplementationVersion());
    ++_vmId;

    for (const auto &hook : _beforeInitHookArray) {
        hook();
    }
    _beforeInitHookArray.clear();

    _cx = JS_NewContext(JS::DefaultHeapMaxBytes);

    if (nullptr == _cx)
        return false;

    NativePtrToObjectMap::init();

    Class::setContext(_cx);
    Object::setContext(_cx);

    JS_SetGCParameter(_cx, JSGC_MAX_BYTES, 0xffffffff);
//cjh    JS_SetGCParameter(_cx, JSGC_MODE, JSGC_MODE_INCREMENTAL);
    JS_SetNativeStackQuota(_cx, 5000000);

//cjh    JS_SetGCCallback(_cx, on_garbage_collect, nullptr);

    if (!JS::InitSelfHostedCode(_cx))
        return false;

    PromiseState *sc = new (std::nothrow) PromiseState(_cx);
    if (!sc)
        return false;

    JS_SetContextPrivate(_cx, sc);

    // Waiting is allowed on the shell's main thread, for now.
    JS_SetFutexCanWait(_cx);

    JS::SetWarningReporter(_cx, reportWarning);

    #if defined(JS_GC_ZEAL) && defined(DEBUG)
    //        JS_SetGCZeal(_cx, 2, JS_DEFAULT_ZEAL_FREQ);
    #endif

//cjh    JS_SetDefaultLocale(_cx, "UTF-8");

//cjh    JS_BeginRequest(_cx);

    JS::RealmOptions options;
    SetStandardCompartmentOptions(options);

#ifdef DEBUG
    JS::ContextOptionsRef(_cx)
                // .setIon(false)
                .setExtraWarnings(true)
                .setWasmBaseline(false)
                .setAsmJS(false)
                .setWasm(false)
                .setWasmIon(false);
#else
    JS::ContextOptionsRef(_cx)
//                    .setExtraWarnings(true)
//                    .setIon(true)
//                    .setBaseline(true)
                .setAsmJS(true)
                .setWasm(true)
                .setWasmBaseline(true)
                .setWasmIon(true);
#endif

    JS::RootedObject globalObj(_cx, JS_NewGlobalObject(_cx, &__globalClass, nullptr, JS::DontFireOnNewGlobalHook, options));

    if (nullptr == globalObj)
        return false;

    _globalObj = Object::_createJSObject(nullptr, globalObj);
    _globalObj->root();

    JS::RootedObject rootedGlobalObj(_cx, _globalObj->_getJSObject());

    _oldCompartment = JS::EnterRealm(_cx, rootedGlobalObj);
    JS::InitRealmStandardClasses(_cx);

    _globalObj->setProperty("window", Value(_globalObj));

    // SpiderMonkey isn't shipped with a console variable. Make a fake one.
    Value consoleVal;
    bool  hasConsole = _globalObj->getProperty("console", &consoleVal) && consoleVal.isObject();
    assert(!hasConsole);

    HandleObject consoleObj(Object::createPlainObject());
    consoleObj->defineFunction("log", _SE(JSB_console_log));
    consoleObj->defineFunction("debug", _SE(JSB_console_debug));
    consoleObj->defineFunction("info", _SE(JSB_console_info));
    consoleObj->defineFunction("warn", _SE(JSB_console_warn));
    consoleObj->defineFunction("error", _SE(JSB_console_error));
    consoleObj->defineFunction("assert", _SE(JSB_console_assert));

    _globalObj->setProperty("console", Value(consoleObj));

    _globalObj->setProperty("scriptEngineType", Value("SpiderMonkey"));

    JS_DefineFunction(_cx, rootedGlobalObj, "log", __log, 0, JSPROP_PERMANENT);
    JS_DefineFunction(_cx, rootedGlobalObj, "forceGC", __forceGC, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    //        JS_AddWeakPointerZoneGroupCallback(_cx, ScriptEngine::onWeakPointerZoneGroupCallback, nullptr);
    JS_AddWeakPointerCompartmentCallback(_cx, ScriptEngine::onWeakPointerCompartmentCallback, nullptr);

    JS_FireOnNewGlobalObject(_cx, rootedGlobalObj);
    JS::SetProcessBuildIdOp(getBytecodeBuildId);

    sc->jobQueue.init(_cx, JobQueue(js::SystemAllocPolicy()));
//cjh    JS::SetEnqueuePromiseJobCallback(_cx, onEnqueuePromiseJobCallback);
//cjh    JS::SetGetIncumbentGlobalCallback(_cx, onGetIncumbentGlobalCallback);

    __jsb_CCPrivateData_class = Class::create("__PrivateData", _globalObj, nullptr, privateDataContructor);
    __jsb_CCPrivateData_class->defineFinalizeFunction(privateDataFinalize);
    __jsb_CCPrivateData_class->install();

    _isValid = true;

    for (const auto &hook : _afterInitHookArray) {
        hook();
    }
    _afterInitHookArray.clear();

    return true;
}

ScriptEngine::~ScriptEngine() {
    cleanup();
    JS_ShutDown();
}

void ScriptEngine::cleanup() {
    if (!_isValid)
        return;

    _isInCleanup = true;
    for (const auto &hook : _beforeCleanupHookArray) {
        hook();
    }
    _beforeCleanupHookArray.clear();

    auto sc      = getPromiseState(_cx);
    sc->quitting = true;

    SAFE_DEC_REF(_globalObj);
    Class::cleanup();
    Object::cleanup();

    // JS_RemoveWeakPointerZoneGroupCallback(_cx, ScriptEngine::onWeakPointerZoneGroupCallback);
    //        JS_RemoveWeakPointerCompartmentCallback(_cx, ScriptEngine::onWeakPointerCompartmentCallback);
    JS::LeaveRealm(_cx, _oldCompartment);

//cjh    JS::SetGetIncumbentGlobalCallback(_cx, nullptr);
//cjh    JS::SetEnqueuePromiseJobCallback(_cx, nullptr);

    sc->jobQueue.reset();

//cjh    JS_EndRequest(_cx);
    JS_DestroyContext(_cx);

    delete sc;
    _cx             = nullptr;
    _globalObj      = nullptr;
    _oldCompartment = nullptr;
    _isValid        = false;

    _registerCallbackArray.clear();

    _filenameScriptMap.clear();

    for (const auto &hook : _afterCleanupHookArray) {
        hook();
    }
    _afterCleanupHookArray.clear();
    _isInCleanup = false;

    NativePtrToObjectMap::destroy();
}

void ScriptEngine::addBeforeCleanupHook(const std::function<void()> &hook) {
    _beforeCleanupHookArray.push_back(hook);
}

void ScriptEngine::addAfterCleanupHook(const std::function<void()> &hook) {
    _afterCleanupHookArray.push_back(hook);
}

void ScriptEngine::addBeforeInitHook(const std::function<void()> &hook) {
    _beforeInitHookArray.push_back(hook);
}

void ScriptEngine::addAfterInitHook(const std::function<void()> &hook) {
    _afterInitHookArray.push_back(hook);
}

bool ScriptEngine::isGarbageCollecting() {
    return _isGarbageCollecting;
}

void ScriptEngine::_setGarbageCollecting(bool isGarbageCollecting) {
    _isGarbageCollecting = isGarbageCollecting;
}

Object *ScriptEngine::getGlobalObject() {
    return _globalObj;
}

void ScriptEngine::addRegisterCallback(RegisterCallback cb) {
    assert(std::find(_registerCallbackArray.begin(), _registerCallbackArray.end(), cb) == _registerCallbackArray.end());
    _registerCallbackArray.push_back(cb);
}

void ScriptEngine::addPermanentRegisterCallback(RegisterCallback cb) {
    if (std::find(_permRegisterCallbackArray.begin(), _permRegisterCallbackArray.end(), cb) == _permRegisterCallbackArray.end()) {
        _permRegisterCallbackArray.push_back(cb);
    }
}

    #pragma mark - Debug

static std::string              inData;
static std::string              outData;
static std::vector<std::string> g_queue;
static std::mutex               g_qMutex;
static std::mutex               g_rwMutex;
static int                      clientSocket      = -1;
static uint32_t                 s_nestedLoopLevel = 0;

static void cc_closesocket(int fd) {
    #ifdef _WIN32
    closesocket(fd);
    #else
    close(fd);
    #endif
}

void ScriptEngine::_debugProcessInput(const std::string &str) {
    JS::RootedObject debugGlobal(_cx, _debugGlobalObj->_getJSObject());
    JS::Realm *  globalCpt = JS::EnterRealm(_cx, debugGlobal);

    Value func;
    if (_debugGlobalObj->getProperty("processInput", &func) && func.isObject() && func.toObject()->isFunction()) {
        ValueArray args;
        args.push_back(Value(str));
        func.toObject()->call(args, _debugGlobalObj);
    }

    JS::LeaveRealm(_cx, globalCpt);
}

static bool NS_ProcessNextEvent() {
    std::string message;
    size_t      messageCount = 0;
    while (true) {
        g_qMutex.lock();
        messageCount = g_queue.size();
        if (messageCount > 0) {
            auto first = g_queue.begin();
            message    = *first;
            g_queue.erase(first);
            --messageCount;
        }
        g_qMutex.unlock();

        if (!message.empty()) {
            ScriptEngine::getInstance()->_debugProcessInput(message);
        }

        if (messageCount == 0)
            break;
    }
    //    std::this_thread::yield();
    std::this_thread::sleep_for(std::chrono::milliseconds(10));

    return true;
}

static bool JSBDebug_enterNestedEventLoop(State &s) {
    enum {
        NS_OK = 0,
        NS_ERROR_UNEXPECTED
    };

    #define NS_SUCCEEDED(v) ((v) == NS_OK)

    int rv = NS_OK;

    uint32_t nestLevel = ++s_nestedLoopLevel;

    while (NS_SUCCEEDED(rv) && s_nestedLoopLevel >= nestLevel) {
        drainJobQueue();
        if (!NS_ProcessNextEvent())
            rv = NS_ERROR_UNEXPECTED;
    }

    assert(s_nestedLoopLevel <= nestLevel);

    s.rval().setInt32(s_nestedLoopLevel);
    return true;
}
SE_BIND_FUNC(JSBDebug_enterNestedEventLoop)

static bool JSBDebug_exitNestedEventLoop(State &s) {
    if (s_nestedLoopLevel > 0) {
        --s_nestedLoopLevel;
    } else {
        s.rval().setInt32(0);
        return true;
    }
    return true;
}
SE_BIND_FUNC(JSBDebug_exitNestedEventLoop)

static bool JSBDebug_getEventLoopNestLevel(State &s) {
    s.rval().setInt32(s_nestedLoopLevel);
    return true;
}
SE_BIND_FUNC(JSBDebug_getEventLoopNestLevel)

static void _clientSocketWriteAndClearString(std::string &s) {
    ::send(clientSocket, s.c_str(), s.length(), 0);
    s.clear();
}

static void processInput(const std::string &data) {
    std::lock_guard<std::mutex> lk(g_qMutex);
    g_queue.push_back(data);
}

static void clearBuffers() {
    std::lock_guard<std::mutex> lk(g_rwMutex);
    // only process input if there's something and we're not locked
    if (!inData.empty()) {
        processInput(inData);
        inData.clear();
    }
    if (!outData.empty()) {
        _clientSocketWriteAndClearString(outData);
    }
}

static void serverEntryPoint(uint32_t port) {
    // start a server, accept the connection and keep reading data from it
    struct addrinfo hints, *result = nullptr, *rp = nullptr;
    int             s = 0;
    memset(&hints, 0, sizeof(struct addrinfo));
    hints.ai_family   = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM; // TCP stream sockets
    hints.ai_flags    = AI_PASSIVE;  // fill in my IP for me

    std::stringstream portstr;
    portstr << port;

    int err = 0;

    #ifdef _WIN32
    WSADATA wsaData;
    err = WSAStartup(MAKEWORD(2, 2), &wsaData);
    #endif

    if ((err = getaddrinfo(NULL, portstr.str().c_str(), &hints, &result)) != 0) {
        SE_LOGD("getaddrinfo error : %s\n", gai_strerror(err));
    }

    for (rp = result; rp != NULL; rp = rp->ai_next) {
        if ((s = socket(rp->ai_family, rp->ai_socktype, 0)) < 0) {
            continue;
        }
        int optval = 1;
        if ((setsockopt(s, SOL_SOCKET, SO_REUSEADDR, (char *)&optval, sizeof(optval))) < 0) {
            cc_closesocket(s);
            TRACE_DEBUGGER_SERVER("debug server : error setting socket option SO_REUSEADDR\n");
            return;
        }

    #ifdef __APPLE__
        if ((setsockopt(s, SOL_SOCKET, SO_NOSIGPIPE, &optval, sizeof(optval))) < 0) {
            close(s);
            TRACE_DEBUGGER_SERVER("debug server : error setting socket option SO_NOSIGPIPE\n");
            return;
        }
    #endif

        if ((::bind(s, rp->ai_addr, rp->ai_addrlen)) == 0) {
            break;
        }
        cc_closesocket(s);
        s = -1;
    }
    if (s < 0 || rp == NULL) {
        TRACE_DEBUGGER_SERVER("debug server : error creating/binding socket\n");
        return;
    }

    freeaddrinfo(result);

    listen(s, 1);

    #define MAX_RECEIVED_SIZE 1024
    #define BUF_SIZE          MAX_RECEIVED_SIZE + 1

    char buf[BUF_SIZE] = {0};
    int  readBytes     = 0;
    while (true) {
        clientSocket = accept(s, NULL, NULL);

        if (clientSocket < 0) {
            TRACE_DEBUGGER_SERVER("debug server : error on accept\n");
            return;
        } else {
            // read/write data
            TRACE_DEBUGGER_SERVER("debug server : client connected\n");

            inData = "connected";
            // process any input, send any output
            clearBuffers();

            while ((readBytes = (int)::recv(clientSocket, buf, MAX_RECEIVED_SIZE, 0)) > 0) {
                buf[readBytes] = '\0';
                // TRACE_DEBUGGER_SERVER("debug server : received command >%s", buf);

                // no other thread is using this
                inData.append(buf);
                // process any input, send any output
                clearBuffers();
            } // while(read)

            cc_closesocket(clientSocket);
        }
    } // while(true)

    #undef BUF_SIZE
    #undef MAX_RECEIVED_SIZE
}

static bool JSBDebug_require(State &s) {
    const auto &args = s.args();
    int         argc = (int)args.size();

    if (argc >= 1) {
        ScriptEngine::getInstance()->runScript(args[0].toString());
        return true;
    }

    SE_REPORT_ERROR("Wrong number of arguments: %d, expected: %d", argc, 1);
    return false;
}
SE_BIND_FUNC(JSBDebug_require)

static bool JSBDebug_BufferWrite(State &s) {
    const auto &args = s.args();
    int         argc = (int)args.size();
    if (argc == 1) {
        // this is safe because we're already inside a lock (from clearBuffers)
        outData.append(args[0].toString());
        _clientSocketWriteAndClearString(outData);
    }
    return true;
}
SE_BIND_FUNC(JSBDebug_BufferWrite)

bool ScriptEngine::start() {
    if (!init())
        return false;

    if (isDebuggerEnabled() && _debugGlobalObj == nullptr) {
        JS::RealmOptions options;
//cjh        options.behaviors().setVersion(JSVERSION_LATEST);
        options.creationOptions().setSharedMemoryAndAtomicsEnabled(true);

        JS::RootedObject debugGlobal(_cx, JS_NewGlobalObject(_cx, &__globalClass, nullptr, JS::DontFireOnNewGlobalHook, options));
        _debugGlobalObj = Object::_createJSObject(nullptr, debugGlobal);
        _debugGlobalObj->root();

        JS::Realm *globalCpt = JS::EnterRealm(_cx, debugGlobal);
        JS::InitRealmStandardClasses(_cx);
        JS_FireOnNewGlobalObject(_cx, debugGlobal);
        JS_DefineDebuggerObject(_cx, debugGlobal);

        // these are used in the debug program
        JS_DefineFunction(_cx, debugGlobal, "log", __log, 0, JSPROP_PERMANENT);
        _debugGlobalObj->defineFunction("require", _SE(JSBDebug_require));
        _debugGlobalObj->defineFunction("_bufferWrite", _SE(JSBDebug_BufferWrite));
        _debugGlobalObj->defineFunction("_enterNestedEventLoop", _SE(JSBDebug_enterNestedEventLoop));
        _debugGlobalObj->defineFunction("_exitNestedEventLoop", _SE(JSBDebug_exitNestedEventLoop));
        _debugGlobalObj->defineFunction("_getEventLoopNestLevel", _SE(JSBDebug_getEventLoopNestLevel));

        JS::RootedObject globalObj(_cx, _globalObj->_getJSObject());
        JS_WrapObject(_cx, &globalObj);

        runScript("script/jsb_debugger.js");

        // prepare the debugger
        Value prepareDebuggerFunc;
        assert(_debugGlobalObj->getProperty("_prepareDebugger", &prepareDebuggerFunc) && prepareDebuggerFunc.isObject() && prepareDebuggerFunc.toObject()->isFunction());

        ValueArray args;
        args.push_back(Value(_globalObj));
        prepareDebuggerFunc.toObject()->call(args, _debugGlobalObj);

        // start bg thread
        auto t = std::thread(&serverEntryPoint, _debuggerServerPort);
        t.detach();

        JS::LeaveRealm(_cx, globalCpt);
    }

    bool ok    = false;
    _startTime = std::chrono::steady_clock::now();

    for (auto cb : _permRegisterCallbackArray) {
        ok = cb(_globalObj);
        assert(ok);
        if (!ok) {
            break;
        }
    }

    for (auto cb : _registerCallbackArray) {
        ok = cb(_globalObj);
        assert(ok);
        if (!ok)
            break;
    }

    // After ScriptEngine is started, _registerCallbackArray isn't needed. Therefore, clear it here.
    _registerCallbackArray.clear();
    return ok;
}

bool ScriptEngine::getScript(const std::string &path, JS::MutableHandleScript script) {
    std::string fullPath = _fileOperationDelegate.onGetFullPath(path);
    auto        iter     = _filenameScriptMap.find(fullPath);
    if (iter != _filenameScriptMap.end()) {
        JS::PersistentRootedScript *rootedScript = iter->second;
        script.set(rootedScript->get());
        return true;
    }

    //        // a) check jsc file first
    //        std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
    //        if (_filenameScriptMap.find(byteCodePath) != _filenameScriptMap.end())
    //        {
    //            script.set(_filenameScriptMap[byteCodePath]->get());
    //            return true;
    //        }
    //
    //        // b) no jsc file, check js file
    //        if (_filenameScriptMap.find(path) != _filenameScriptMap.end())
    //        {
    //            script.set(_filenameScriptMap[path]->get());
    //            return true;
    //        }

    return false;
}

bool ScriptEngine::compileScript(const std::string &path, JS::MutableHandleScript script) {
    if (path.empty())
        return false;

    bool ok = getScript(path, script);
    if (ok)
        return true;

    assert(_fileOperationDelegate.isValid());

    bool compileSucceed = false;

    // Creator v1.7 supports v8, spidermonkey, javascriptcore and chakracore as its script engine,
    // jsc file isn't bytecode format anymore, it's a xxtea encrpted binary format instead.
    // Therefore, for unifying the flow, ScriptEngine class will not support spidermonkey bytecode.
    //        // a) check jsc file first
    //        std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
    //
    //        // Check whether '.jsc' files exist to avoid outputting log which says 'couldn't find .jsc file'.
    //        if (_fileOperationDelegate.onCheckFileExist(byteCodePath))
    //        {
    //            _fileOperationDelegate.onGetDataFromFile(byteCodePath, [&](const uint8_t* data, size_t dataLen) {
    //                if (data != nullptr && dataLen > 0)
    //                {
    //                    JS::TranscodeBuffer buffer;
    //                    bool appended = buffer.append(data, dataLen);
    //                    JS::TranscodeResult result = JS::DecodeScript(_cx, buffer, script);
    //                    if (appended && result == JS::TranscodeResult::TranscodeResult_Ok)
    //                    {
    //                        compileSucceed = true;
    //                        _filenameScriptMap[byteCodePath] = new (std::nothrow) JS::PersistentRootedScript(_cx, script.get());
    //                    }
    //                    assert(compileSucceed);
    //                }
    //            });
    //
    //        }

    // b) no jsc file, check js file
    if (!compileSucceed) {
        /* Clear any pending exception from previous failed decoding.  */
        clearException();

        ok                        = false;
        std::string jsFileContent = _fileOperationDelegate.onGetStringFromFile(path);
        if (!jsFileContent.empty()) {
            JS::CompileOptions op(_cx);
//cjh            op.setUTF8(true);
            op.setFileAndLine(path.c_str(), 1);

            JS::SourceText<mozilla::Utf8Unit> srcBuf;
            bool succeed = srcBuf.init(_cx, jsFileContent.c_str(), jsFileContent.length(),
                                       JS::SourceOwnership::Borrowed);

            assert(succeed);

            script.set(JS::Compile(_cx, op, srcBuf));
            if (ok) {
                compileSucceed               = true;
                std::string fullPath         = _fileOperationDelegate.onGetFullPath(path);
                _filenameScriptMap[fullPath] = new (std::nothrow) JS::PersistentRootedScript(_cx, script.get());
            }
            assert(compileSucceed);
        }
    }

    clearException();

    if (!compileSucceed) {
        SE_LOGD("ScriptEngine::compileScript fail:%s\n", path.c_str());
    }

    return compileSucceed;
}

bool ScriptEngine::evalString(const char *script, ssize_t length /* = -1 */, Value *ret /* = nullptr */, const char *fileName /* = nullptr */) {
    assert(script != nullptr);

    if (length < 0)
        length = strlen(script);

    if (fileName == nullptr)
        fileName = "(no filename)";

    JS::CompileOptions options(_cx);
    options.setFile(fileName);
//cjh        .setUTF8(true)
//cjh        .setVersion(JSVERSION_LATEST);

    JS::RootedValue rval(_cx);

    JS::SourceText<mozilla::Utf8Unit> srcBuf;
    bool succeed = srcBuf.init(_cx, script, length, JS::SourceOwnership::Borrowed);
    assert(succeed);

    bool ok = JS::Evaluate(_cx, options, srcBuf, &rval);
    if (!ok) {
        clearException();
    }
    assert(ok);

    if (ok && ret != nullptr && !rval.isNullOrUndefined()) {
        internal::jsToSeValue(_cx, rval, ret);
    }

    if (!ok) {
        SE_LOGE("ScriptEngine::evalString script %s, failed!\n", fileName);
    }
    return ok;
}

void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate &delegate) {
    _fileOperationDelegate = delegate;
}

const ScriptEngine::FileOperationDelegate &ScriptEngine::getFileOperationDelegate() const {
    return _fileOperationDelegate;
}

bool ScriptEngine::runScript(const std::string &path, Value *ret /* = nullptr */) {
    assert(_fileOperationDelegate.isValid());

    JS::RootedScript script(_cx);
    bool             ok = compileScript(path, &script);
    if (ok) {
        JS::RootedValue rval(_cx);
        ok = JS_ExecuteScript(_cx, script, &rval);
        if (!ok) {
            SE_LOGE("Evaluating %s failed (evaluatedOK == JS_FALSE)\n", path.c_str());
            clearException();
        }

        if (ok && ret != nullptr && !rval.isNullOrUndefined()) {
            internal::jsToSeValue(_cx, rval, ret);
        }
    }

    return ok;
}

void ScriptEngine::clearException() {
    if (_cx == nullptr)
        return;

    if (JS_IsExceptionPending(_cx)) {
        JS::RootedValue exceptionValue(_cx);
        JS_GetPendingException(_cx, &exceptionValue);
        JS_ClearPendingException(_cx);

        assert(exceptionValue.isObject());
        JS::RootedObject  exceptionObj(_cx, exceptionValue.toObjectOrNull());
        JSErrorReport *   report   = JS_ErrorFromException(_cx, exceptionObj);
        const char *      message  = report->message().c_str();
        const std::string filePath = report->filename != nullptr ? report->filename : "(no filename)";
        char              line[50] = {0};
        snprintf(line, sizeof(line), "%u", report->lineno);
        char column[50] = {0};
        snprintf(column, sizeof(column), "%u", report->column);
        const std::string location = filePath + ":" + line + ":" + column;

        JS::UniqueChars stack;

        JS::RootedValue stackVal(_cx);
        if (JS_GetProperty(_cx, exceptionObj, "stack", &stackVal) && stackVal.isString()) {
            JS::RootedString jsstackStr(_cx, stackVal.toString());
            stack = JS_EncodeStringToUTF8(_cx, jsstackStr);
        }

        std::string exceptionStr = message;
        exceptionStr += ", location: " + location;
        if (stack != nullptr) {
            exceptionStr += "\nSTACK:\n";
            exceptionStr += stack.get();
        }

        SE_LOGE("ERROR: %s\n", exceptionStr.c_str());
        if (_exceptionCallback != nullptr) {
            _exceptionCallback(location.c_str(), message, stack.get());
        }

        if (!_isErrorHandleWorking) {
            _isErrorHandleWorking = true;

            Value errorHandler;
            if (_globalObj->getProperty("__errorHandler", &errorHandler) && errorHandler.isObject() && errorHandler.toObject()->isFunction()) {
                ValueArray args;
                args.push_back(Value(filePath));
                args.push_back(Value(report->lineno));
                args.push_back(Value(message));
                if (stack)
                {
                    args.push_back(Value(stack.get()));
                }
                else
                {
                    args.push_back(Value(""));
                }
                errorHandler.toObject()->call(args, _globalObj);
            }

            _isErrorHandleWorking = false;
        } else {
            SE_LOGE("ERROR: __errorHandler has exception\n");
        }
    }
}

void ScriptEngine::setExceptionCallback(const ExceptionCallback &cb) {
    _exceptionCallback = cb;
}

void ScriptEngine::enableDebugger(const std::string &serverAddr, uint32_t port, bool isWait) {
    _debuggerServerAddr = serverAddr;
    _debuggerServerPort = port;
}

bool ScriptEngine::isDebuggerEnabled() const {
    return !_debuggerServerAddr.empty() && _debuggerServerPort > 0;
}

void ScriptEngine::mainLoopUpdate() {
    std::string message;
    size_t      messageCount = 0;
    while (true) {
        g_qMutex.lock();
        messageCount = g_queue.size();
        if (messageCount > 0) {
            auto first = g_queue.begin();
            message    = *first;
            g_queue.erase(first);
            --messageCount;
        }
        g_qMutex.unlock();

        if (!message.empty()) {
            _debugProcessInput(message);
        }

        if (messageCount == 0)
            break;
    }
}

bool ScriptEngine::callFunction(Object *targetObj, const char *funcName, uint32_t argc, Value *args, Value *rval /* = nullptr*/) {
    JS::RootedValueVector jsarr(_cx);
    if (!jsarr.resize(argc)) {
        SE_LOGE("ScriptEngine::callFunction out of memory!");
        return false;
    }

    for (size_t i = 0; i < argc; ++i) {
        JS::RootedValue jsval(_cx, jsarr[i]);
        internal::seToJsValue(_cx, args[i], &jsval);
    }

    JS::RootedObject contextObject(_cx);
    if (targetObj != nullptr) {
        contextObject.set(targetObj->_getJSObject());
    }

    bool found = false;
    bool ok    = JS_HasProperty(_cx, contextObject, funcName, &found);

    if (!ok || !found) {
        return false;
    }

    JS::RootedValue funcValue(_cx);
    ok = JS_GetProperty(_cx, contextObject, funcName, &funcValue);

    if (!ok) {
        return false;
    }

    JS::RootedValue rcValue(_cx);
    JSAutoRealm autoRealm(_cx, funcValue.toObjectOrNull());
    ok = JS_CallFunctionValue(_cx, contextObject, funcValue, jsarr, &rcValue);

    if (ok) {
        if (rval != nullptr)
            internal::jsToSeValue(_cx, rcValue, rval);
    } else {
        se::ScriptEngine::getInstance()->clearException();
    }

    return ok;
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
