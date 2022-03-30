/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS

    #include "../MappingUtils.h"
    #include "../State.h"
    #include "Class.h"
    #include "Object.h"
    #include "Utils.h"

namespace se {

namespace {

const char *BYTE_CODE_FILE_EXT = ".jsc";

    #define countof(x) (sizeof(x) / sizeof((x)[0]))

ScriptEngine *__instance = nullptr;

JSValue __forceGC(JSContext *ctx, JSValueConst thisVal, int argc, JSValueConst *argv) {
    JS_RunGC(JS_GetRuntime(ctx));
    return JS_UNDEFINED;
}

JSValue __log(JSContext *ctx, JSValueConst thisVal, int argc, JSValueConst *argv) {
    if (argc > 0) {
        const char *string = JS_ToCString(ctx, argv[0]);
        if (string != nullptr) {
            SE_LOGD("JS: %s\n", string);
            JS_FreeCString(ctx, string);
        }
    }
    return JS_UNDEFINED;
}

void js_dump_obj(JSContext *ctx, JSValueConst val) {
    const char *str = JS_ToCString(ctx, val);
    if (str) {
        SE_LOGE(">> %s\n", str);
        JS_FreeCString(ctx, str);
    } else {
        SE_LOGE("[exception]\n");
    }
}

// ------------------------------------------------------- ScriptEngine

// For console stuff
bool JSB_console_format_log(State &s, const char *prefix, int msgIndex = 0) {
    if (msgIndex < 0)
        return false;

    const auto &args = s.args();
    int         argc = (int)args.size();
    if ((argc - msgIndex) == 1) {
        std::string msg = args[msgIndex].toStringForce();
        if (msg.find("TypeError") != std::string::npos) {
            int a = 0;
            a++;

            se::ScriptEngine::getInstance()->getCurrentStackTrace();
        }
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
        if (msg.find("TypeError") != std::string::npos) {
            int a = 0;
            a++;
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

bool JSB_console_time(State &s) {
    JSB_console_format_log(s, "[TIME BEGIN]: ");
    return true; //TODO(cjh)
}
SE_BIND_FUNC(JSB_console_time)

bool JSB_console_timeEnd(State &s) {
    JSB_console_format_log(s, "[TIME END]: ");
    return true; //TODO(cjh)
}
SE_BIND_FUNC(JSB_console_timeEnd)

bool jsb_executePendingJobs(State &s) {
    js_std_loop(se::ScriptEngine::getInstance()->_getContext());
    return true;
}
SE_BIND_FUNC(jsb_executePendingJobs)

} // namespace

AutoHandleScope::AutoHandleScope() {
}

AutoHandleScope::~AutoHandleScope() {
    js_std_loop(se::ScriptEngine::getInstance()->_getContext());
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

ScriptEngine::ScriptEngine() {
}

bool ScriptEngine::init() {
    cleanup();
    SE_LOGD("Initializing QuickJS, version: %s\n", "2021-03-27");
    ++_vmId;

    for (const auto &hook : _beforeInitHookArray) {
        hook();
    }
    _beforeInitHookArray.clear();

    _rt = JS_NewRuntime();
    if (nullptr == _rt)
        return false;

    _cx = JS_NewContext(_rt);
    if (nullptr == _cx) {
        JS_FreeRuntime(_rt);
        return false;
    }

    JS_SetMaxStackSize(_rt, 0);

    JS_AddIntrinsicBigFloat(_cx);
    JS_AddIntrinsicBigDecimal(_cx);
    JS_AddIntrinsicOperators(_cx);
    JS_EnableBignumExt(_cx, 1);

    NativePtrToObjectMap::init();
    NonRefNativePtrCreatedByCtorMap::init();

    Class::setContext(_cx);
    Object::setContext(_cx);

    JSValue globalObj = JS_GetGlobalObject(_cx);
    _globalObj        = Object::_createJSObject(nullptr, globalObj);
    _globalObj->root();

    _globalObj->setProperty("window", Value(_globalObj));

    // QuickJS isn't shipped with a console variable. Make a fake one.
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
    consoleObj->defineFunction("time", _SE(JSB_console_info));    //TODO(cjh)
    consoleObj->defineFunction("timeEnd", _SE(JSB_console_info)); //TODO(cjh)

    _globalObj->setProperty("console", Value(consoleObj));

    _globalObj->setProperty("scriptEngineType", Value("quickjs"));

    _globalObj->defineFunction("_executePendingJobs", _SE(jsb_executePendingJobs));

    static const JSCFunctionListEntry funcs[] = {
        JS_CFUNC_DEF("log", 0, __log),
        JS_CFUNC_DEF("forceGC", 0, __forceGC),
    };
    JS_SetPropertyFunctionList(_cx, globalObj, funcs, countof(funcs));

    JS_FreeValue(_cx, globalObj);

    _isValid = true;

    for (const auto &hook : _afterInitHookArray) {
        hook();
    }
    _afterInitHookArray.clear();

    return true;
}

ScriptEngine::~ScriptEngine() {
    cleanup();
}

void ScriptEngine::cleanup() {
    if (!_isValid)
        return;

    _isInCleanup = true;
    for (const auto &hook : _beforeCleanupHookArray) {
        hook();
    }
    _beforeCleanupHookArray.clear();

    SAFE_DEC_REF(_globalObj);
    Class::cleanup();
    Object::cleanup();

    JS_FreeContext(_cx);
    JS_FreeRuntime(_rt);

    _rt        = nullptr;
    _cx        = nullptr;
    _globalObj = nullptr;
    _isValid   = false;

    _registerCallbackArray.clear();

    for (const auto &hook : _afterCleanupHookArray) {
        hook();
    }
    _afterCleanupHookArray.clear();
    _isInCleanup = false;

    NativePtrToObjectMap::destroy();
    NonRefNativePtrCreatedByCtorMap::destroy();
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

bool ScriptEngine::start() {
    if (!init())
        return false;

    if (isDebuggerEnabled() && _debugGlobalObj == nullptr) {
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

bool ScriptEngine::evalString(const char *script, ssize_t length /* = -1 */, Value *ret /* = nullptr */, const char *fileName /* = nullptr */) {
    assert(script != nullptr);

    if (length < 0)
        length = strlen(script);

    if (fileName == nullptr)
        fileName = "(no filename)";

    JSValue jsRet = JS_Eval(_cx, script, length, fileName, JS_EVAL_TYPE_GLOBAL);
    if (JS_IsException(jsRet)) {
        clearException();
        return false;
    }

    if (ret != nullptr) {
        internal::jsToSeValue(_cx, jsRet, ret);
    }
    return true;
}

void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate &delegate) {
    _fileOperationDelegate = delegate;
}

const ScriptEngine::FileOperationDelegate &ScriptEngine::getFileOperationDelegate() const {
    return _fileOperationDelegate;
}

bool ScriptEngine::runScript(const std::string &path, Value *ret /* = nullptr */) {
    assert(_fileOperationDelegate.isValid());

    std::string scriptBuffer = _fileOperationDelegate.onGetStringFromFile(path);
    if (!scriptBuffer.empty()) {
        return evalString(scriptBuffer.c_str(), static_cast<ssize_t>(scriptBuffer.length()), ret, path.c_str());
    }

    SE_LOGE("ScriptEngine::runScript script %s, buffer is empty!\n", path.c_str());
    return false;
}

void ScriptEngine::clearException() {
    if (_cx == nullptr)
        return;

    JSValue exception_val = JS_GetException(_cx);
    if (JS_IsUndefined(exception_val) || JS_IsNull(exception_val) || JS_IsUninitialized(exception_val)) {
        return;
    }

    JSValue val      = JS_UNDEFINED;
    int     is_error = JS_IsError(_cx, exception_val);
    js_dump_obj(_cx, exception_val);
    if (is_error) {
        val = JS_GetPropertyStr(_cx, exception_val, "stack");
        if (!JS_IsUndefined(val)) {
            js_dump_obj(_cx, val);
        }
        JS_FreeValue(_cx, val);
    }

    JS_FreeValue(_cx, exception_val);
}

void ScriptEngine::setExceptionCallback(const ExceptionCallback &cb) {
    _exceptionCallback = cb;
}

void ScriptEngine::setJSExceptionCallback(const ExceptionCallback &cb) { //TODO(cjh)
}

void ScriptEngine::enableDebugger(const std::string &serverAddr, uint32_t port, bool isWait) {
}

bool ScriptEngine::isDebuggerEnabled() const {
    return false;
}

void ScriptEngine::mainLoopUpdate() {
    js_std_loop(_cx);
}

bool ScriptEngine::callFunction(Object *targetObj, const char *funcName, uint32_t argc, Value *args, Value *rval /* = nullptr*/) {
    se::Value funcVal;
    targetObj->getProperty(funcName, &funcVal);
    if (!funcVal.isObject() || !funcVal.toObject()->isFunction()) {
        return false;
    }

    JSValue funcJSVal = funcVal.toObject()->_getJSObject();

    JSValue jsRet = JS_UNDEFINED;
    if (argc > 0) {
        size_t   argsBytes = argc * sizeof(JSValue);
        JSValue *jsArgs    = reinterpret_cast<JSValue *>(alloca(argsBytes));
        memset(jsArgs, 0x00, argsBytes);
        internal::seToJsArgs(_cx, argc, args, jsArgs);
        jsRet = JS_Call(_cx, funcJSVal, targetObj->_getJSObject(), argc, jsArgs);
    } else {
        jsRet = JS_Call(_cx, funcJSVal, targetObj->_getJSObject(), 0, nullptr);
    }

    if (!JS_IsException(jsRet)) {
        if (rval != nullptr) {
            internal::jsToSeValue(_cx, jsRet, rval);
        }
        clearException();
        return true;
    }

    clearException();
    return false;
}

void ScriptEngine::handlePromiseExceptions() {
    clearException();
} //TODO(cjh)

std::string ScriptEngine::getCurrentStackTrace() {
    return "";
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS
