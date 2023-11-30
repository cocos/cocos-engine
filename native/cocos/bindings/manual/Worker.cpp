/**
 * Created by ihowe@outlook.com on 2023/5/31.
 * Worker on Native
 */

#include <chrono>
#include <thread>
#include <sstream>
#include <atomic>

#include "Worker.h"
// include cocos
#include <cocos/base/Macros.h>
#include <cocos/base/Log.h>
#include <cocos/platform/FileUtils.h>
#include <cocos/bindings/jswrapper/config.h>

#define __NANOSECONDS_PER_SECOND 1000000000
#define __NANOSECONDS_60FPS      16666667L
#define __prefererredNanosecondsPerFrame    static_cast<long>(1.0 / 60 * __NANOSECONDS_PER_SECOND)

#define USE_HANDLE_SCOPE v8::HandleScope handle_scope(isolate)
#define FILE_UTILS cc::FileUtils::getInstance()

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

// include v8
#include "libplatform/libplatform.h"
#include "v8.h"

/**
 * setTimeout / clearTimeout /setInterval /clearInterval / self / window
 */
const std::string runtimejs = R"(
(function(root){root.window=root;root.self=root;let scheduleDataModel={ID:1,timeoutInfos:null}
scheduleDataModel.timeoutInfos=new Map();let TimeInfo=function(cb,delay,isRepeat,target,args){this.cb=cb;this.id=++scheduleDataModel.ID;this.start=Date.now();this.delay=delay;this.isRepeat=isRepeat;this.target=target;this.args=args;};function handlerTimerInfos(nowMilliSeconds){if(scheduleDataModel.timeoutInfos.size>0){let infos=Array.from(scheduleDataModel.timeoutInfos.values());for(let info of infos){if(nowMilliSeconds-info.start>=info.delay){if(typeof info.cb==='string'){Function(info.cb)();}else if(typeof info.cb==='function'){info.cb.apply(info.target,info.args);}
if(info.isRepeat){info.start=nowMilliSeconds;}else{info.cb=null;info.target=null;info.args=null;scheduleDataModel.timeoutInfos.delete(info.id);}}}}}
function createTimeoutInfo(prevFuncArgs,isRepeat){let cb=prevFuncArgs[0];if(!cb){console.error("createTimeoutInfo doesn't pass a callback ...");return 0;}
let delay=prevFuncArgs.length>1?prevFuncArgs[1]:0;let args;if(prevFuncArgs.length>2){args=Array.prototype.slice.call(prevFuncArgs,2);}
let info=new TimeInfo(cb,delay,isRepeat,root,args);scheduleDataModel.timeoutInfos.set(info.id,info);return info.id;}
root.setTimeout=function(cb){return createTimeoutInfo(arguments,false);};root.clearTimeout=function(id){scheduleDataModel.timeoutInfos.delete(id);};root.setInterval=function(cb){return createTimeoutInfo(arguments,true);};root.clearInterval=root.clearTimeout;root["$globalTick"]=function(nowMilliSeconds){handlerTimerInfos(nowMilliSeconds);}})(globalThis)
)";

#define CONVERT_TO_STRING(jsval, valptr)            \
    do {                                            \
        v8::String::Utf8Value utf8(isolate, jsval); \
        *valptr.assign(*utf8);                      \
    } while (0)

namespace ccex {
    namespace helper {
        std::unordered_map<uintptr_t, Worker*> workers;
        std::mutex workers_mutex;
        void g_closeAll(){
            std::lock_guard<std::mutex> lock(workers_mutex);
            for (auto it = workers.begin(); it != workers.end(); ++it) {
                it->second->setWeak();
            }
            workers.clear();
        }
        Worker* g_getWorker(v8::Isolate *isolate = nullptr){
            if (isolate == nullptr){
                isolate = v8::Isolate::GetCurrent();
            }
            if (isolate){
                std::lock_guard<std::mutex> lock(workers_mutex);
                auto ite = workers.find((uintptr_t)isolate);
                if (ite != workers.end()){
                    return ite->second;
                }
            }
            return nullptr;
        }
        void g_postEventToMainThread(v8::Isolate *isolate, int type, const std::string &message) {
            auto worker = g_getWorker(isolate);
            if (worker) {
                worker->postEventToMainThread(worker,type, message);
            }else{
                CC_LOG_ERROR("[worker thread] postEventToMainThread failed!  worker not found!\n");
            }
        }
        /**
         * 缓存Worker实例
         * @param isolate
         * @param worker
         */
        void g_setWorker(v8::Isolate *isolate,Worker* worker ){
            std::lock_guard<std::mutex> lock(workers_mutex);
            workers.emplace( (uintptr_t)isolate, worker);
        }
        void g_deleteWorker(Worker* worker){
            std::lock_guard<std::mutex> lock(workers_mutex);
            for (auto ite = workers.begin(); ite != workers.end(); ++ite) {
                if (ite->second == worker){
                    ite->second->setWeak();
                    workers.erase(ite);
                    return;
                }
            }
        }
    }

    std::string jsTo(v8::Local<v8::Value> jsval) {
        auto isolate = v8::Isolate::GetCurrent();
        USE_HANDLE_SCOPE;
        if (jsval->IsString() || jsval->IsArray() || jsval->IsFunction() ||
            jsval->IsTypedArray()) {
            v8::String::Utf8Value utf8(isolate, jsval);
            return std::string(*utf8);
        }
        if (jsval->IsArrayBuffer()) {
            return "[object ArrayBuffer]";
        }
        if (jsval->IsNumber()) {
            char tmp[50] = {0};
            snprintf(tmp, sizeof(tmp), "%.17g",
                     jsval->ToNumber(isolate->GetCurrentContext())
                             .ToLocalChecked()
                             ->Value());
            return std::string(tmp);
        }
        if (jsval->IsBigInt()) {
            std::stringstream ss;
            auto iiii = jsval->ToBigInt(isolate->GetCurrentContext())
                    .ToLocalChecked()
                    ->Int64Value();
            ss << iiii;
            return ss.str();
        }
        if (jsval->IsNull()) {
            return "null";
        }
        if (jsval->IsUndefined()) {
            return "undefined";
        }
        if (jsval->IsObject()) {
            return "[object Object]";
        }
        return "";
    }

    namespace error {
        void onFatalErrorCallback(const char* location, const char* message) {
            std::string errorStr = "[worker thread]: [FATAL ERROR] location: ";
            errorStr += location;
            errorStr += ", message: ";
            errorStr += message;
            CC_LOG_ERROR(errorStr.c_str());
            helper::g_postEventToMainThread(nullptr,1,errorStr);
        }
        void onOOMErrorCallback(const char* location, bool isHeapOom) {
            std::string errorStr = "[worker thread]: [OOM ERROR] location: ";
            errorStr += location;
            std::string message = "is heap out of memory: ";
            if (isHeapOom) {
                message += "true";
            } else {
                message += "false";
            }
            errorStr += ", " + message;
            CC_LOG_ERROR(errorStr.c_str());
            helper::g_postEventToMainThread(nullptr,1,errorStr);
        }
        std::string stackTraceToString(v8::Local<v8::StackTrace> stack) {
            std::string stackStr;
            if (stack.IsEmpty()) {
                return stackStr;
            }
            char tmp[100] = {0};
            for (int i = 0, e = stack->GetFrameCount(); i < e; ++i) {
                v8::Local<v8::StackFrame> frame =
                        stack->GetFrame(v8::Isolate::GetCurrent(), i);
                v8::Local<v8::String> script = frame->GetScriptName();
                std::string scriptName;
                if (!script.IsEmpty()) {
                    scriptName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), script);
                }
                v8::Local<v8::String> func = frame->GetFunctionName();
                std::string funcName;
                if (!func.IsEmpty()) {
                    funcName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), func);
                }
                stackStr += " - [";
                snprintf(tmp, sizeof(tmp), "%d", i);
                stackStr += tmp;
                stackStr += "]";
                stackStr += (funcName.empty() ? "anonymous" : funcName.c_str());
                stackStr += "@";
                stackStr += (scriptName.empty() ? "(no filename)" : scriptName.c_str());
                stackStr += ":";
                snprintf(tmp, sizeof(tmp), "%d", frame->GetLineNumber());
                stackStr += tmp;
                if (i < (e - 1)) {
                    stackStr += "\n";
                }
            }
            return stackStr;
        }
        void handler_MessageCallback(v8::Local<v8::Message> message, v8::Local<v8::Value> /*data*/) {
            auto isolate = message->GetIsolate();
            USE_HANDLE_SCOPE;
            std::string msg = jsTo(message->Get());
            v8::ScriptOrigin origin = message->GetScriptOrigin();

            std::string res_name = jsTo(origin.ResourceName());
            int lineoffset = origin.LineOffset();
            int coloffset = origin.ColumnOffset();
            char _location[256] = {0};
            sprintf(_location, "%s:%d:%d", res_name.c_str(), lineoffset, coloffset);
            std::string location(_location);
            std::string errorStr = "[worker thread] :" + msg + ", location: " + location;
            std::string stackStr = stackTraceToString(message->GetStackTrace());
            if (!stackStr.empty()) {
                if (lineoffset == 0) {
                    location = "(see stack)";
                }
                errorStr += "\nSTACK:\n" + stackStr;
            }
            CC_LOG_ERROR(errorStr.c_str());
            helper::g_postEventToMainThread(isolate,1,errorStr);
        }

        void onPromiseRejectCallback(v8::PromiseRejectMessage msg) {
            v8::Isolate* isolate = v8::Isolate::GetCurrent();
            v8::HandleScope scope(isolate);
            v8::TryCatch tryCatch(isolate);
            std::string value = jsTo(msg.GetValue());
            std::string promiseName = jsTo(msg.GetPromise()->GetConstructorName());
            std::string event_type;
            switch (msg.GetEvent()) {
                case v8::kPromiseRejectWithNoHandler:
                    event_type = "unhandledRejectedPromise";
                    break;
                case v8::kPromiseHandlerAddedAfterReject:
                    event_type = "handlerAddedAfterPromiseRejected";
                    break;
                case v8::kPromiseRejectAfterResolved:
                    event_type = "rejectAfterPromiseResolved";
                    break;
                case v8::kPromiseResolveAfterResolved:
                    event_type = "resolveAfterPromiseResolved";
                    break;
            }
            std::string errorStr = "[worker thread] :" +promiseName + ":" + event_type + ":" + value;
            CC_LOG_ERROR(errorStr.c_str());
            helper::g_postEventToMainThread(isolate,1,errorStr);
        }

        void handler_IsolateError(v8::Isolate* isolate) {
            // setup V8 error callback
            isolate->SetCaptureStackTraceForUncaughtExceptions(true, 15, v8::StackTrace::kOverview);
            isolate->SetFatalErrorHandler(onFatalErrorCallback);
            isolate->SetOOMErrorHandler(onOOMErrorCallback);
            isolate->AddMessageListener(handler_MessageCallback);
            isolate->SetPromiseRejectCallback(onPromiseRejectCallback);
        }
    }

    bool evalCode(v8::Isolate *isolate, const std::string& scriptStr,const std::string &sourceUrl) {
        USE_HANDLE_SCOPE;
        v8::MaybeLocal<v8::String> source = v8::String::NewFromUtf8(
                isolate, scriptStr.c_str(), v8::NewStringType::kNormal);
        if (source.IsEmpty()) {
            return false;
        }
        v8::MaybeLocal<v8::String> originStr = v8::String::NewFromUtf8(
                isolate, sourceUrl.c_str(), v8::NewStringType::kNormal);
        if (originStr.IsEmpty()) {
            return false;
        }
        v8::ScriptOrigin origin(isolate, originStr.ToLocalChecked());
        auto context = isolate->GetCurrentContext();
        auto maybeScript = v8::Script::Compile(context, source.ToLocalChecked(), &origin);
        bool success = false;
        if (!maybeScript.IsEmpty()) {
            v8::TryCatch block(isolate);
            v8::Local<v8::Script> v8Script = maybeScript.ToLocalChecked();
            v8::MaybeLocal<v8::Value> maybeResult = v8Script->Run(context);
            if (!maybeResult.IsEmpty()) {
                v8::Local<v8::Value> result = maybeResult.ToLocalChecked();
                success = true;
            }
            if (block.HasCaught()) {
                error::handler_MessageCallback(block.Message(), v8::Undefined(isolate));
            }
        }
        if (!success) {
            CC_LOG_ERROR("[worker thread] eval script %s, failed!\n", sourceUrl.c_str());
        }
        return success;
    }

    bool evalJSFile(v8::Isolate *isolate, const std::string &sourceUrl){
        std::string codeStr = FILE_UTILS->getStringFromFile(sourceUrl);
        return codeStr.size() > 0 && evalCode(isolate, codeStr, sourceUrl);
    }

    void callFunction(v8::Isolate *isolate, v8::Local<v8::Context> context,const char *funcName,std::vector<v8::Local<v8::Value>> &argv ){
        USE_HANDLE_SCOPE;
        auto winObj = context->Global();
        v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(isolate, funcName, v8::NewStringType::kNormal);
        v8::MaybeLocal<v8::Value> funcVal = winObj->Get(context, nameValue.ToLocalChecked());
        if (funcVal.IsEmpty()) {
            return;
        }
        auto ___ = funcVal.ToLocalChecked();
        if (___->IsNullOrUndefined()){
            return;
        }
        auto tickFunc = ___->ToObject(context).ToLocalChecked();
        v8::MaybeLocal<v8::Value> result = tickFunc->CallAsFunction(context, winObj, static_cast<int>(1), argv.data());
    }

    void SetMethod(v8::Isolate* isolate,
                   v8::Local<v8::Template> that,
                   const char* name,
                   v8::FunctionCallback callback) {
        v8::Local<v8::FunctionTemplate> t =v8::FunctionTemplate::New(isolate, callback);
        // kInternalized strings are created in the old space.
        const v8::NewStringType type = v8::NewStringType::kInternalized;
        v8::Local<v8::String> name_string =
                v8::String::NewFromUtf8(isolate, name, type).ToLocalChecked();
        that->Set(name_string, t);
    }

    void SetProperty(v8::Isolate* isolate,v8::Local<v8::Context> context, v8::Local<v8::Object> obj,const std::string &key, v8::Local<v8::Value> value ){
        v8::MaybeLocal<v8::String> maybeKey = v8::String::NewFromUtf8(isolate, key.c_str(), v8::NewStringType::kNormal);
        if (maybeKey.IsEmpty()) {
            return;
        }
        obj->Set(context, v8::Local<v8::Name>::Cast(maybeKey.ToLocalChecked()),value);
    }
    /***
     * postMessage To worker thread
     * @param isolate
     * @param context
     * @param message
     */
    void mainThreadMessageHandler(v8::Isolate *isolate, v8::Local<v8::Context> context, Worker * worker){
        std::string message = worker->getMessage();
        if (message.size() < 1){
            return;
        }
        USE_HANDLE_SCOPE;
        v8::Local<v8::String> json = v8::String::NewFromUtf8(isolate, message.c_str()).ToLocalChecked();
        v8::Local<v8::Value> value = v8::JSON::Parse(context, json).ToLocalChecked();
        if (value->IsObject()) {
            v8::Local<v8::Object> params = value->ToObject(context).ToLocalChecked();
            v8::Local<v8::String> lastEventId = v8::String::NewFromUtf8(isolate, worker->getEventID().c_str(),
                                                                        v8::NewStringType::kNormal).ToLocalChecked();
            SetProperty(isolate,context, params, "lastEventId",lastEventId );
            std::vector<v8::Local<v8::Value>> argv = {params};
            callFunction(isolate, context, "onmessage", argv);
        }
    }

    static void self_postMessage(const v8::FunctionCallbackInfo<v8::Value>& args) {
        v8::Isolate* isolate = args.GetIsolate();;
        auto *worker = helper::g_getWorker(isolate);
        if (worker != nullptr){
            USE_HANDLE_SCOPE;
            auto context = isolate->GetCurrentContext();
            auto params = v8::Object::New(isolate);
            auto tag_data = v8::String::NewFromUtf8(isolate, "data",v8::NewStringType::kNormal).ToLocalChecked();
            SetProperty(isolate,context, params, "data",args[0] );
            auto lastEventId = v8::String::NewFromUtf8(isolate, worker->getEventID().c_str(),
                                                                        v8::NewStringType::kNormal).ToLocalChecked();
            SetProperty(isolate,context, params, "lastEventId",lastEventId );
            std::string message;
            CONVERT_TO_STRING(v8::JSON::Stringify(context, params).ToLocalChecked(),
                              &message);
            worker->postEventToMainThread(worker,0, message);
        }
    }

    static void self_close(const v8::FunctionCallbackInfo<v8::Value>& args) {
        v8::Isolate* isolate = args.GetIsolate();
        auto worker = helper::g_getWorker(isolate);
        if (worker){
            worker->postEventToMainThread(worker,2,"");
            CC_LOG_INFO("[worker thread] #self_close");
            worker->terminate();
        }
    }
    static void self_log(const v8::FunctionCallbackInfo<v8::Value>& args) {
        v8::Isolate* isolate = args.GetIsolate();
        USE_HANDLE_SCOPE;
        std::string message;
        for (int i = 0; i < args.Length(); i++) {
            v8::String::Utf8Value str(isolate, args[i]);
            message += *str;
            if (i < args.Length() - 1) {
                message += " ";
            }
        }
        CC_LOG_INFO("[worker thread]: %s" , message.c_str());
    }
    static void self_importScripts(const v8::FunctionCallbackInfo<v8::Value>& args) {
        v8::Isolate* isolate = args.GetIsolate();
        USE_HANDLE_SCOPE;
        for (int i = 0; i < args.Length(); i++) {
            v8::String::Utf8Value str(isolate, args[i]);
            evalJSFile(isolate, std::string(*str));
        }
    }

    static void __buffer_delete(void* data, size_t length,
                                 void* deleter_data){
        uint8_t* buffer = (uint8_t*)data;
        free(buffer);
       // CC_LOG_DEBUG("[worker thread] _v8buffer_delete");
    }
    /**
     * 需要传2个参数
     * filepath
     * format： binary、utf8
     * @param args
     */
    static void self_readFileSync(const v8::FunctionCallbackInfo<v8::Value>& args) {
        v8::Isolate* isolate = args.GetIsolate();
        USE_HANDLE_SCOPE;
        std::string filepath;
        v8::String::Utf8Value cfilepath(isolate, args[0]);
        filepath.append(*cfilepath);
        if (!FILE_UTILS->isFileExist(filepath)){
            return args.GetReturnValue().Set(v8::Null(isolate));
        }
        if (args.Length() == 2){
            std::string format;
            v8::String::Utf8Value cformat(isolate, args[1]);
            format.append(*cformat);
            if (format == "utf8"){
                std::string result = FILE_UTILS->getStringFromFile(filepath);
                return args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, result.c_str()).ToLocalChecked());
            }
        }
        auto data = FILE_UTILS->getDataFromFile(filepath);
        uint32_t filesize = data.getSize();
        uint8_t* buffer = data.takeBuffer();
        // 创建一个 BackingStore 对象
        auto allocator = v8::ArrayBuffer::NewBackingStore(buffer,filesize,__buffer_delete,nullptr);
        auto jsobj = v8::ArrayBuffer::New(isolate, std::move(allocator));
        return args.GetReturnValue().Set(v8::Int8Array::New(jsobj, 0, filesize));
    }
    /**
     * 需要传2个参数
     * filepath 路径
     * data : 数据
     * @param args
     */
    static void self_writeFileSync(const v8::FunctionCallbackInfo<v8::Value>& args) {
        v8::Isolate* isolate = args.GetIsolate();
        USE_HANDLE_SCOPE;
        std::string filepath;
        v8::String::Utf8Value cfilepath(isolate, args[0]);
        filepath.append(*cfilepath);
        auto jsval = args[1];
        if (jsval->IsObject()){
            uint8_t* ptr = nullptr;
            size_t length = 0;
            if (jsval->IsTypedArray()) {
                auto arr = v8::Local<v8::TypedArray>::Cast(jsval);
                const auto& backingStore = arr->Buffer()->GetBackingStore();
                ptr = static_cast<uint8_t*>(backingStore->Data()) + arr->ByteOffset();
                length = arr->ByteLength();
            } else if (jsval->IsArrayBuffer()) {
                auto arrBuf = v8::Local<v8::ArrayBuffer>::Cast(jsval);
                const auto& backingStore = arrBuf->GetBackingStore();
                ptr = static_cast<uint8_t*>(backingStore->Data());
                length = backingStore->ByteLength();
            }
            cc::Data data;
            data.fastSet(ptr,length);
            FILE_UTILS->writeDataToFile(data, filepath);
            return;
        }
        if (jsval->IsString()){
            std::string filecontent;
            v8::String::Utf8Value cfilecontent(isolate, jsval);
            filecontent.append(*cfilecontent);
            FILE_UTILS->writeStringToFile(filecontent,filepath);
        }else{
            CC_LOG_INFO("[worker thread]: writeFileSync TypeError!");
        }
    }
    void worker_loop(Worker* _worker) {
        // Create a new Isolate and make it the current one.
        v8::Isolate::CreateParams create_params;
        create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
        auto isolate = v8::Isolate::New(create_params);
        {
            CC_LOG_INFO("[worker thread](ID#%d)start",_worker->id);
            // Create a stack-allocated handle scope.
            v8::HandleScope handle_scope(isolate);
            v8::Local<v8::FunctionTemplate> WindowClass = v8::FunctionTemplate::New(isolate);
            v8::Local<v8::String> className = v8::String::NewFromUtf8(isolate, "Window", v8::NewStringType::kNormal)
                    .ToLocalChecked();
            // Window
            WindowClass->SetClassName(className);
            v8::Local<v8::ObjectTemplate> global_template = WindowClass->InstanceTemplate();
            global_template->SetInternalFieldCount(1);
            global_template->Set(isolate, "postMessage", v8::FunctionTemplate::New(isolate, self_postMessage));
            global_template->Set(isolate, "close", v8::FunctionTemplate::New(isolate, self_close ));
            global_template->Set(isolate, "importScripts", v8::FunctionTemplate::New(isolate, self_importScripts ));
            // 扩展接口
            global_template->Set(isolate, "readFileSync", v8::FunctionTemplate::New(isolate, self_readFileSync ));
            global_template->Set(isolate, "writeFileSync", v8::FunctionTemplate::New(isolate, self_writeFileSync ));
            auto writablePath = FILE_UTILS->getWritablePath();
            global_template->Set(isolate, "writablePath",
                    v8::String::NewFromUtf8(isolate, writablePath.c_str(), v8::NewStringType::kNormal).ToLocalChecked());
            // Create v8 context.
            auto context = v8::Context::New(isolate, nullptr, global_template);
            v8::Persistent<v8::Context> persistent_context;
            persistent_context.Reset(isolate,context);
            context->Enter();
            isolate->Enter();
            helper::g_setWorker(isolate, _worker);
            error::handler_IsolateError(isolate);
            auto globalThis = context->Global();
            {
                v8::HandleScope consolehandle_scope(isolate);
                auto consoleTpl = v8::ObjectTemplate::New(isolate);
                SetMethod(isolate, consoleTpl, "log", self_log);
                SetMethod(isolate, consoleTpl, "warn", self_log);
                SetMethod(isolate, consoleTpl, "error", self_log);
                auto consoleObj = consoleTpl->NewInstance(context).ToLocalChecked();
                globalThis->Set(context,v8::String::NewFromUtf8(isolate, "console", v8::NewStringType::kNormal)
                                .ToLocalChecked(), consoleObj);
            }
            evalCode(isolate, runtimejs, "runtime.js");
            if ( evalJSFile(isolate, _worker->path)){
                while (_worker->isValid()) {
                    static std::chrono::steady_clock::time_point prevTime;
                    static std::chrono::steady_clock::time_point now;
                    static float dt = 0.F;
                    static double dtNS = __NANOSECONDS_60FPS;
                    if (dtNS < static_cast<double>(__prefererredNanosecondsPerFrame)) {
                        // 锁帧
                        std::this_thread::sleep_for(
                                std::chrono::nanoseconds(__prefererredNanosecondsPerFrame - static_cast<int64_t>(dtNS)));
                        dtNS = static_cast<double>(__prefererredNanosecondsPerFrame);
                    }
                    mainThreadMessageHandler(isolate, context, _worker);
                    auto lnow = std::chrono::system_clock::now();
                    // 将时间点转换为毫秒数
                    auto nowMilliSeconds = std::chrono::duration_cast<std::chrono::milliseconds>(lnow.time_since_epoch()).count();
                    {
                        v8::HandleScope tickhandle_scope(isolate);
                        auto timev = v8::Number::New(isolate, (double) (nowMilliSeconds));
                        std::vector<v8::Local<v8::Value>> argv = {timev};
                        callFunction(isolate, context, "$globalTick", argv);
                    }
                    now = std::chrono::steady_clock::now();
                    dtNS = dtNS * 0.1 + 0.9 * static_cast<double>(std::chrono::duration_cast<std::chrono::nanoseconds>(now - prevTime).count());
                    dt = static_cast<float>(dtNS) / __NANOSECONDS_PER_SECOND;
                }
            }else{
                CC_LOG_ERROR("[worker thread](ID#%d) cannot find %s", _worker->id, _worker->path.c_str());
                _worker->postEventToMainThread(_worker,2,"");
                _worker->terminate();
            }
            persistent_context.Reset();
        }
        CC_LOG_INFO("[worker thread](ID#%d) exit",_worker->id);
        _worker->setWeak();
        _worker = nullptr;
        auto* ptr = isolate->GetArrayBufferAllocator();
        isolate->Exit();
        isolate->Dispose();
        delete ptr;
        isolate = nullptr;
    }

    Worker::Worker(uint32_t _id, std::string _path):id(_id),path(_path),_weakCount(0),eventid(0){
        //CC_LOG_INFO("[worker] #constructor %d",id);
    }
    void Worker::start(){
        worker_thread = std::thread(worker_loop, this);
        worker_thread.detach();
    }
    Worker::~Worker(){
        CC_LOG_INFO("[worker](ID#%d) Descontructor",id);
        messageQueue.clear();
        postEventToMainThread = nullptr;
    }
    void Worker::terminate(){
        helper::g_deleteWorker(this);
    }
    void Worker::destroyAll(){
        helper::g_closeAll();
    }
}
#else
namespace ccex{
    Worker::Worker(uint32_t _id, std::string _path):id(_id),path(_path),_weakCount(0),eventid(0){
        //CC_LOG_INFO("[worker] #constructor %d",id);
    }
    void Worker::start(){
    }
    Worker::~Worker(){
        CC_LOG_INFO("[worker] descontructor (ID#%d)",id);
    }
    void Worker::terminate(){
    }
    void Worker::destroyAll(){
    }
}
#endif
