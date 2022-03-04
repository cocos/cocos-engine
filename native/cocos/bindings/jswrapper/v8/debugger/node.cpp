#include "node.h"

#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

    #include "env.h"
    #include "http_parser.h"
    #include "util.h"

    #include <signal.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    #ifdef __POSIX__
        #include <unistd.h>
    #endif

    #define NODE_VERSION "JSB2.0" //cjh added

static inline const char *errno_string(int errorno) {
    #define ERRNO_CASE(e) \
        case e: return #e;
    switch (errorno) {
    #ifdef EACCES
        ERRNO_CASE(EACCES);
    #endif

    #ifdef EADDRINUSE
        ERRNO_CASE(EADDRINUSE);
    #endif

    #ifdef EADDRNOTAVAIL
        ERRNO_CASE(EADDRNOTAVAIL);
    #endif

    #ifdef EAFNOSUPPORT
        ERRNO_CASE(EAFNOSUPPORT);
    #endif

    #ifdef EAGAIN
        ERRNO_CASE(EAGAIN);
    #endif

    #ifdef EWOULDBLOCK
        #if EAGAIN != EWOULDBLOCK
        ERRNO_CASE(EWOULDBLOCK);
        #endif
    #endif

    #ifdef EALREADY
        ERRNO_CASE(EALREADY);
    #endif

    #ifdef EBADF
        ERRNO_CASE(EBADF);
    #endif

    #ifdef EBADMSG
        ERRNO_CASE(EBADMSG);
    #endif

    #ifdef EBUSY
        ERRNO_CASE(EBUSY);
    #endif

    #ifdef ECANCELED
        ERRNO_CASE(ECANCELED);
    #endif

    #ifdef ECHILD
        ERRNO_CASE(ECHILD);
    #endif

    #ifdef ECONNABORTED
        ERRNO_CASE(ECONNABORTED);
    #endif

    #ifdef ECONNREFUSED
        ERRNO_CASE(ECONNREFUSED);
    #endif

    #ifdef ECONNRESET
        ERRNO_CASE(ECONNRESET);
    #endif

    #ifdef EDEADLK
        ERRNO_CASE(EDEADLK);
    #endif

    #ifdef EDESTADDRREQ
        ERRNO_CASE(EDESTADDRREQ);
    #endif

    #ifdef EDOM
        ERRNO_CASE(EDOM);
    #endif

    #ifdef EDQUOT
        ERRNO_CASE(EDQUOT);
    #endif

    #ifdef EEXIST
        ERRNO_CASE(EEXIST);
    #endif

    #ifdef EFAULT
        ERRNO_CASE(EFAULT);
    #endif

    #ifdef EFBIG
        ERRNO_CASE(EFBIG);
    #endif

    #ifdef EHOSTUNREACH
        ERRNO_CASE(EHOSTUNREACH);
    #endif

    #ifdef EIDRM
        ERRNO_CASE(EIDRM);
    #endif

    #ifdef EILSEQ
        ERRNO_CASE(EILSEQ);
    #endif

    #ifdef EINPROGRESS
        ERRNO_CASE(EINPROGRESS);
    #endif

    #ifdef EINTR
        ERRNO_CASE(EINTR);
    #endif

    #ifdef EINVAL
        ERRNO_CASE(EINVAL);
    #endif

    #ifdef EIO
        ERRNO_CASE(EIO);
    #endif

    #ifdef EISCONN
        ERRNO_CASE(EISCONN);
    #endif

    #ifdef EISDIR
        ERRNO_CASE(EISDIR);
    #endif

    #ifdef ELOOP
        ERRNO_CASE(ELOOP);
    #endif

    #ifdef EMFILE
        ERRNO_CASE(EMFILE);
    #endif

    #ifdef EMLINK
        ERRNO_CASE(EMLINK);
    #endif

    #ifdef EMSGSIZE
        ERRNO_CASE(EMSGSIZE);
    #endif

    #ifdef EMULTIHOP
        ERRNO_CASE(EMULTIHOP);
    #endif

    #ifdef ENAMETOOLONG
        ERRNO_CASE(ENAMETOOLONG);
    #endif

    #ifdef ENETDOWN
        ERRNO_CASE(ENETDOWN);
    #endif

    #ifdef ENETRESET
        ERRNO_CASE(ENETRESET);
    #endif

    #ifdef ENETUNREACH
        ERRNO_CASE(ENETUNREACH);
    #endif

    #ifdef ENFILE
        ERRNO_CASE(ENFILE);
    #endif

    #ifdef ENOBUFS
        ERRNO_CASE(ENOBUFS);
    #endif

    #ifdef ENODATA
        ERRNO_CASE(ENODATA);
    #endif

    #ifdef ENODEV
        ERRNO_CASE(ENODEV);
    #endif

    #ifdef ENOENT
        ERRNO_CASE(ENOENT);
    #endif

    #ifdef ENOEXEC
        ERRNO_CASE(ENOEXEC);
    #endif

    #ifdef ENOLINK
        ERRNO_CASE(ENOLINK);
    #endif

    #ifdef ENOLCK
        #if ENOLINK != ENOLCK
        ERRNO_CASE(ENOLCK);
        #endif
    #endif

    #ifdef ENOMEM
        ERRNO_CASE(ENOMEM);
    #endif

    #ifdef ENOMSG
        ERRNO_CASE(ENOMSG);
    #endif

    #ifdef ENOPROTOOPT
        ERRNO_CASE(ENOPROTOOPT);
    #endif

    #ifdef ENOSPC
        ERRNO_CASE(ENOSPC);
    #endif

    #ifdef ENOSR
        ERRNO_CASE(ENOSR);
    #endif

    #ifdef ENOSTR
        ERRNO_CASE(ENOSTR);
    #endif

    #ifdef ENOSYS
        ERRNO_CASE(ENOSYS);
    #endif

    #ifdef ENOTCONN
        ERRNO_CASE(ENOTCONN);
    #endif

    #ifdef ENOTDIR
        ERRNO_CASE(ENOTDIR);
    #endif

    #ifdef ENOTEMPTY
        #if ENOTEMPTY != EEXIST
        ERRNO_CASE(ENOTEMPTY);
        #endif
    #endif

    #ifdef ENOTSOCK
        ERRNO_CASE(ENOTSOCK);
    #endif

    #ifdef ENOTSUP
        ERRNO_CASE(ENOTSUP);
    #else
        #ifdef EOPNOTSUPP
        ERRNO_CASE(EOPNOTSUPP);
        #endif
    #endif

    #ifdef ENOTTY
        ERRNO_CASE(ENOTTY);
    #endif

    #ifdef ENXIO
        ERRNO_CASE(ENXIO);
    #endif

    #ifdef EOVERFLOW
        ERRNO_CASE(EOVERFLOW);
    #endif

    #ifdef EPERM
        ERRNO_CASE(EPERM);
    #endif

    #ifdef EPIPE
        ERRNO_CASE(EPIPE);
    #endif

    #ifdef EPROTO
        ERRNO_CASE(EPROTO);
    #endif

    #ifdef EPROTONOSUPPORT
        ERRNO_CASE(EPROTONOSUPPORT);
    #endif

    #ifdef EPROTOTYPE
        ERRNO_CASE(EPROTOTYPE);
    #endif

    #ifdef ERANGE
        ERRNO_CASE(ERANGE);
    #endif

    #ifdef EROFS
        ERRNO_CASE(EROFS);
    #endif

    #ifdef ESPIPE
        ERRNO_CASE(ESPIPE);
    #endif

    #ifdef ESRCH
        ERRNO_CASE(ESRCH);
    #endif

    #ifdef ESTALE
        ERRNO_CASE(ESTALE);
    #endif

    #ifdef ETIME
        ERRNO_CASE(ETIME);
    #endif

    #ifdef ETIMEDOUT
        ERRNO_CASE(ETIMEDOUT);
    #endif

    #ifdef ETXTBSY
        ERRNO_CASE(ETXTBSY);
    #endif

    #ifdef EXDEV
        ERRNO_CASE(EXDEV);
    #endif

        default: return "";
    }
}

    #ifdef __POSIX__
void RegisterSignalHandler(int signal,
                           void (*handler)(int signal),
                           bool reset_handler) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handler;
        #ifndef __FreeBSD__
    // FreeBSD has a nasty bug with SA_RESETHAND reseting the SA_SIGINFO, that is
    // in turn set for a libthr wrapper. This leads to a crash.
    // Work around the issue by manually setting SIG_DFL in the signal handler
    sa.sa_flags = reset_handler ? SA_RESETHAND : 0;
        #endif
    sigfillset(&sa.sa_mask);
    CHECK_EQ(sigaction(signal, &sa, nullptr), 0);
}
    #endif // __POSIX__

using namespace v8;

namespace node {

static bool v8_is_profiling = false;

Local<Value> ErrnoException(Isolate *   isolate,
                            int         errorno,
                            const char *syscall,
                            const char *msg,
                            const char *path) {
    Environment *env = Environment::GetCurrent(isolate);

    Local<Value>  e;
    Local<String> estring = OneByteString(env->isolate(), errno_string(errorno));
    if (msg == nullptr || msg[0] == '\0') {
        msg = strerror(errorno);
    }
    Local<String> message = OneByteString(env->isolate(), msg);

    Local<String> cons =
        String::Concat(env->isolate(), estring, FIXED_ONE_BYTE_STRING(env->isolate(), ", "));
    cons = String::Concat(env->isolate(), cons, message);

    Local<String> path_string;
    if (path != nullptr) {
        // IDEA(bnoordhuis) It's questionable to interpret the file path as UTF-8.
        path_string = String::NewFromUtf8(env->isolate(), path, v8::NewStringType::kNormal).ToLocalChecked();
    }

    if (path_string.IsEmpty() == false) {
        cons = String::Concat(env->isolate(), cons, FIXED_ONE_BYTE_STRING(env->isolate(), " '"));
        cons = String::Concat(env->isolate(), cons, path_string);
        cons = String::Concat(env->isolate(), cons, FIXED_ONE_BYTE_STRING(env->isolate(), "'"));
    }
    e = Exception::Error(cons);

    Local<Object> obj = e->ToObject(env->context()).ToLocalChecked();
    obj->Set(env->context(), env->errno_string(), Integer::New(env->isolate(), errorno)).Check();
    obj->Set(env->context(), env->code_string(), estring).Check();

    if (path_string.IsEmpty() == false) {
        obj->Set(env->context(), env->path_string(), path_string).Check();
    }

    if (syscall != nullptr) {
        obj->Set(env->context(), env->syscall_string(), OneByteString(env->isolate(), syscall)).Check();
    }

    return e;
}

static Local<String> StringFromPath(Isolate *isolate, const char *path) {
    #ifdef _WIN32
    if (strncmp(path, "\\\\?\\UNC\\", 8) == 0) {
        return String::Concat(isolate, FIXED_ONE_BYTE_STRING(isolate, "\\\\"),
                              String::NewFromUtf8(isolate, path + 8).ToLocalChecked());
    } else if (strncmp(path, "\\\\?\\", 4) == 0) {
        return String::NewFromUtf8(isolate, path + 4).ToLocalChecked();
    }
    #endif

    return String::NewFromUtf8(isolate, path, v8::NewStringType::kNormal).ToLocalChecked();
}

Local<Value> UVException(Isolate *   isolate,
                         int         errorno,
                         const char *syscall,
                         const char *msg,
                         const char *path) {
    return UVException(isolate, errorno, syscall, msg, path, nullptr);
}

Local<Value> UVException(Isolate *   isolate,
                         int         errorno,
                         const char *syscall,
                         const char *msg,
                         const char *path,
                         const char *dest) {
    Environment *env = Environment::GetCurrent(isolate);

    if (!msg || !msg[0])
        msg = uv_strerror(errorno);

    Local<String> js_code    = OneByteString(isolate, uv_err_name(errorno));
    Local<String> js_syscall = OneByteString(isolate, syscall);
    Local<String> js_path;
    Local<String> js_dest;

    Local<String> js_msg = js_code;
    js_msg               = String::Concat(isolate, js_msg, FIXED_ONE_BYTE_STRING(isolate, ": "));
    js_msg               = String::Concat(isolate, js_msg, OneByteString(isolate, msg));
    js_msg               = String::Concat(isolate, js_msg, FIXED_ONE_BYTE_STRING(isolate, ", "));
    js_msg               = String::Concat(isolate, js_msg, js_syscall);

    if (path != nullptr) {
        js_path = StringFromPath(isolate, path);

        js_msg = String::Concat(isolate, js_msg, FIXED_ONE_BYTE_STRING(isolate, " '"));
        js_msg = String::Concat(isolate, js_msg, js_path);
        js_msg = String::Concat(isolate, js_msg, FIXED_ONE_BYTE_STRING(isolate, "'"));
    }

    if (dest != nullptr) {
        js_dest = StringFromPath(isolate, dest);

        js_msg = String::Concat(isolate, js_msg, FIXED_ONE_BYTE_STRING(isolate, " -> '"));
        js_msg = String::Concat(isolate, js_msg, js_dest);
        js_msg = String::Concat(isolate, js_msg, FIXED_ONE_BYTE_STRING(isolate, "'"));
    }

    Local<Object> e = Exception::Error(js_msg)->ToObject(isolate->GetCurrentContext()).ToLocalChecked();

    e->Set(isolate->GetCurrentContext(), env->errno_string(), Integer::New(isolate, errorno)).Check();
    e->Set(isolate->GetCurrentContext(), env->code_string(), js_code).Check();
    e->Set(isolate->GetCurrentContext(), env->syscall_string(), js_syscall).Check();
    if (!js_path.IsEmpty())
        e->Set(isolate->GetCurrentContext(), env->path_string(), js_path).Check();
    if (!js_dest.IsEmpty())
        e->Set(isolate->GetCurrentContext(), env->dest_string(), js_dest).Check();

    return e;
}

MaybeLocal<Value> MakeCallback(Environment *         env,
                               Local<Value>          recv,
                               const Local<Function> callback,
                               int                   argc,
                               Local<Value>          argv[],
                               async_context         asyncContext) {
    // If you hit this assertion, you forgot to enter the v8::Context first.
    CHECK_EQ(env->context(), env->isolate()->GetCurrentContext());

    Local<Object> object;

    //    Environment::AsyncCallbackScope callback_scope(env);
    //    bool disposed_domain = false;
    //
    //    if (recv->IsObject()) {
    //        object = recv.As<Object>();
    //    }
    //
    //    if (env->using_domains()) {
    //        CHECK(recv->IsObject());
    //        disposed_domain = DomainEnter(env, object);
    //        if (disposed_domain) return Undefined(env->isolate());
    //    }

    MaybeLocal<Value> ret;

    //    {
    //        AsyncHooks::ExecScope exec_scope(env, asyncContext.async_id,
    //                                         asyncContext.trigger_async_id);
    //
    //        if (asyncContext.async_id != 0) {
    //            if (!AsyncWrap::EmitBefore(env, asyncContext.async_id))
    //                return Local<Value>();
    //        }
    //
    //        ret = callback->Call(env->context(), recv, argc, argv);
    //
    //        if (ret.IsEmpty()) {
    //            // NOTE: For backwards compatibility with public API we return Undefined()
    //            // if the top level call threw.
    //            return callback_scope.in_makecallback() ?
    //            ret : Undefined(env->isolate());
    //        }
    //
    //        if (asyncContext.async_id != 0) {
    //            if (!AsyncWrap::EmitAfter(env, asyncContext.async_id))
    //                return Local<Value>();
    //        }
    //    }
    //
    //    if (env->using_domains()) {
    //        disposed_domain = DomainExit(env, object);
    //        if (disposed_domain) return Undefined(env->isolate());
    //    }
    //
    //    if (callback_scope.in_makecallback()) {
    //        return ret;
    //    }
    //
    //    Environment::TickInfo* tick_info = env->tick_info();
    //
    //    if (tick_info->length() == 0) {
    //        env->isolate()->RunMicrotasks();
    //    }
    //
    //    // Make sure the stack unwound properly. If there are nested MakeCallback's
    //    // then it should return early and not reach this code.
    //    CHECK_EQ(env->current_async_id(), asyncContext.async_id);
    //    CHECK_EQ(env->trigger_id(), asyncContext.trigger_async_id);
    //
    //    Local<Object> process = env->process_object();
    //
    //    if (tick_info->length() == 0) {
    //        tick_info->set_index(0);
    //        return ret;
    //    }
    //
    //    if (env->tick_callback_function()->Call(process, 0, nullptr).IsEmpty()) {
    //        return Undefined(env->isolate());
    //    }

    return ret;
}

// Public MakeCallback()s

MaybeLocal<Value> MakeCallback(Isolate *     isolate,
                               Local<Object> recv,
                               const char *  method,
                               int           argc,
                               Local<Value>  argv[],
                               async_context asyncContext) {
    Local<String> method_string =
        String::NewFromUtf8(isolate, method, v8::NewStringType::kNormal)
            .ToLocalChecked();
    return MakeCallback(isolate, recv, method_string, argc, argv, asyncContext);
}

MaybeLocal<Value> MakeCallback(Isolate *     isolate,
                               Local<Object> recv,
                               Local<String> symbol,
                               int           argc,
                               Local<Value>  argv[],
                               async_context asyncContext) {
    Local<Value> callback_v = recv->Get(isolate->GetCurrentContext(), symbol).ToLocalChecked();
    if (callback_v.IsEmpty()) return Local<Value>();
    if (!callback_v->IsFunction()) return Local<Value>();
    Local<Function> callback = callback_v.As<Function>();
    return MakeCallback(isolate, recv, callback, argc, argv, asyncContext);
}

MaybeLocal<Value> MakeCallback(Isolate *       isolate,
                               Local<Object>   recv,
                               Local<Function> callback,
                               int             argc,
                               Local<Value>    argv[],
                               async_context   asyncContext) {
    // Observe the following two subtleties:
    //
    // 1. The environment is retrieved from the callback function's context.
    // 2. The context to enter is retrieved from the environment.
    //
    // Because of the AssignToContext() call in src/node_contextify.cc,
    // the two contexts need not be the same.
    Environment *  env = Environment::GetCurrent(callback->GetCreationContext().ToLocalChecked());
    Context::Scope context_scope(env->context());
    return MakeCallback(env, recv.As<Value>(), callback, argc, argv,
                        asyncContext);
}

// Legacy MakeCallback()s

Local<Value> MakeCallback(Isolate *     isolate,
                          Local<Object> recv,
                          const char *  method,
                          int           argc,
                          Local<Value> *argv) {
    EscapableHandleScope handle_scope(isolate);
    return handle_scope.Escape(
        MakeCallback(isolate, recv, method, argc, argv, {0, 0})
            .FromMaybe(Local<Value>()));
}

Local<Value> MakeCallback(Isolate *     isolate,
                          Local<Object> recv,
                          Local<String> symbol,
                          int           argc,
                          Local<Value> *argv) {
    EscapableHandleScope handle_scope(isolate);
    return handle_scope.Escape(
        MakeCallback(isolate, recv, symbol, argc, argv, {0, 0})
            .FromMaybe(Local<Value>()));
}

Local<Value> MakeCallback(Isolate *       isolate,
                          Local<Object>   recv,
                          Local<Function> callback,
                          int             argc,
                          Local<Value> *  argv) {
    EscapableHandleScope handle_scope(isolate);
    return handle_scope.Escape(
        MakeCallback(isolate, recv, callback, argc, argv, {0, 0})
            .FromMaybe(Local<Value>()));
}

IsolateData *CreateIsolateData(Isolate *isolate, uv_loop_t *loop) {
    return new IsolateData(isolate, loop);
}

void FreeIsolateData(IsolateData *isolate_data) {
    delete isolate_data;
}

Environment *CreateEnvironment(IsolateData *      isolate_data,
                               Local<Context>     context,
                               int                argc,
                               const char *const *argv,
                               int                exec_argc,
                               const char *const *exec_argv) {
    Isolate *      isolate = context->GetIsolate();
    HandleScope    handle_scope(isolate);
    Context::Scope context_scope(context);
    auto           env = new Environment(isolate_data, context);
    env->Start(argc, argv, exec_argc, exec_argv, v8_is_profiling);
    return env;
}

void FreeEnvironment(Environment *env) {
    delete env;
}

NO_RETURN void Abort() {
    DumpBacktrace(stderr);
    fflush(stderr);
    ABORT_NO_BACKTRACE();
}

NO_RETURN void Assert(const char *const (*args)[4]) {
    auto filename = (*args)[0];
    auto linenum  = (*args)[1];
    auto message  = (*args)[2];
    auto function = (*args)[3];

    char   exepath[256];
    size_t exepath_size = sizeof(exepath);
    if (uv_exepath(exepath, &exepath_size))
        snprintf(exepath, sizeof(exepath), "node");

    char pid[12] = {0};
    #ifndef _WIN32
    snprintf(pid, sizeof(pid), "[%u]", getpid());
    #endif

    SE_LOGE("%s%s: %s:%s:%s%s Assertion `%s' failed.\n",
            exepath, pid, filename, linenum,
            function, *function ? ":" : "", message);

    Abort();
}

static void Abort(const FunctionCallbackInfo<Value> &args) {
    Abort();
}

    #define READONLY_PROPERTY(obj, str, var)                           \
        do {                                                           \
            obj->DefineOwnProperty(env->context(),                     \
                                   OneByteString(env->isolate(), str), \
                                   var,                                \
                                   v8::ReadOnly)                       \
                .FromJust();                                           \
        } while (0)

    #define READONLY_DONT_ENUM_PROPERTY(obj, str, var)                               \
        do {                                                                         \
            obj->DefineOwnProperty(env->context(),                                   \
                                   OneByteString(env->isolate(), str),               \
                                   var,                                              \
                                   static_cast<v8::PropertyAttribute>(v8::ReadOnly | \
                                                                      v8::DontEnum)) \
                .FromJust();                                                         \
        } while (0)

static void ProcessTitleGetter(Local<Name>                        property,
                               const PropertyCallbackInfo<Value> &info) {
    char buffer[512];
    uv_get_process_title(buffer, sizeof(buffer));
    info.GetReturnValue().Set(String::NewFromUtf8(info.GetIsolate(), buffer, v8::NewStringType::kNormal).ToLocalChecked());
}

static void ProcessTitleSetter(Local<Name>                       property,
                               Local<Value>                      value,
                               const PropertyCallbackInfo<void> &info) {
    node::Utf8Value title(info.GetIsolate(), value);
    // REFINE(piscisaureus): protect with a lock
    uv_set_process_title(*title);
}

void SetupProcessObject(Environment *      env,
                        int                argc,
                        const char *const *argv,
                        int                exec_argc,
                        const char *const *exec_argv) {
    HandleScope scope(env->isolate());

    Local<Object> process = env->process_object();

    auto title_string = FIXED_ONE_BYTE_STRING(env->isolate(), "title");
    CHECK(process->SetAccessor(env->context(),
                               title_string,
                               ProcessTitleGetter,
                               ProcessTitleSetter,
                               env->as_external())
              .FromJust());

    // process.version
    READONLY_PROPERTY(process,
                      "version",
                      FIXED_ONE_BYTE_STRING(env->isolate(), NODE_VERSION));

    // process.moduleLoadList
    READONLY_PROPERTY(process,
                      "moduleLoadList",
                      env->module_load_list_array());

    // process.versions
    Local<Object> versions = Object::New(env->isolate());
    READONLY_PROPERTY(process, "versions", versions);

    const char http_parser_version[] = NODE_STRINGIFY(HTTP_PARSER_VERSION_MAJOR) "." NODE_STRINGIFY(HTTP_PARSER_VERSION_MINOR) "." NODE_STRINGIFY(HTTP_PARSER_VERSION_PATCH);
    READONLY_PROPERTY(versions,
                      "http_parser",
                      FIXED_ONE_BYTE_STRING(env->isolate(), http_parser_version));

    // +1 to get rid of the leading 'v'
    READONLY_PROPERTY(versions,
                      "node",
                      OneByteString(env->isolate(), NODE_VERSION));
    READONLY_PROPERTY(versions,
                      "v8",
                      OneByteString(env->isolate(), V8::GetVersion()));
    READONLY_PROPERTY(versions,
                      "uv",
                      OneByteString(env->isolate(), uv_version_string()));

    SE_LOGD("libuv version: %s\n", uv_version_string());
    //    READONLY_PROPERTY(versions,
    //                      "zlib",
    //                      FIXED_ONE_BYTE_STRING(env->isolate(), ZLIB_VERSION));
    //    READONLY_PROPERTY(versions,
    //                      "ares",
    //                      FIXED_ONE_BYTE_STRING(env->isolate(), ARES_VERSION_STR));

    //    const char node_modules_version[] = NODE_STRINGIFY(NODE_MODULE_VERSION);
    //    READONLY_PROPERTY(
    //                      versions,
    //                      "modules",
    //                      FIXED_ONE_BYTE_STRING(env->isolate(), node_modules_version));

    // process._promiseRejectEvent
    Local<Object> promiseRejectEvent = Object::New(env->isolate());
    READONLY_DONT_ENUM_PROPERTY(process,
                                "_promiseRejectEvent",
                                promiseRejectEvent);
    READONLY_PROPERTY(promiseRejectEvent,
                      "unhandled",
                      Integer::New(env->isolate(),
                                   v8::kPromiseRejectWithNoHandler));
    READONLY_PROPERTY(promiseRejectEvent,
                      "handled",
                      Integer::New(env->isolate(),
                                   v8::kPromiseHandlerAddedAfterReject));

    //#if HAVE_OPENSSL
    //    // Stupid code to slice out the version string.
    //    {  // NOLINT(whitespace/braces)
    //        size_t i, j, k;
    //        int c;
    //        for (i = j = 0, k = sizeof(OPENSSL_VERSION_TEXT) - 1; i < k; ++i) {
    //            c = OPENSSL_VERSION_TEXT[i];
    //            if ('0' <= c && c <= '9') {
    //                for (j = i + 1; j < k; ++j) {
    //                    c = OPENSSL_VERSION_TEXT[j];
    //                    if (c == ' ')
    //                        break;
    //                }
    //                break;
    //            }
    //        }
    //        READONLY_PROPERTY(
    //                          versions,
    //                          "openssl",
    //                          OneByteString(env->isolate(), &OPENSSL_VERSION_TEXT[i], j - i));
    //    }
    //#endif

    // process.arch
    READONLY_PROPERTY(process, "arch", OneByteString(env->isolate(), "x64")); //IDEA: cjh

    // process.platform
    READONLY_PROPERTY(process,
                      "platform",
                      OneByteString(env->isolate(), "macOS")); //IDEA: cjh

    // process.release
    Local<Object> release = Object::New(env->isolate());
    READONLY_PROPERTY(process, "release", release);
    READONLY_PROPERTY(release, "name", OneByteString(env->isolate(), "node"));

    // if this is a release build and no explicit base has been set
    // substitute the standard release download URL
    #ifndef NODE_RELEASE_URLBASE
        #if NODE_VERSION_IS_RELEASE
            #define NODE_RELEASE_URLBASE "https://nodejs.org/download/release/"
        #endif
    #endif

    #if defined(NODE_RELEASE_URLBASE)
        #define NODE_RELEASE_URLPFX  NODE_RELEASE_URLBASE "v" NODE_VERSION_STRING "/"
        #define NODE_RELEASE_URLFPFX NODE_RELEASE_URLPFX "node-v" NODE_VERSION_STRING

    READONLY_PROPERTY(release,
                      "sourceUrl",
                      OneByteString(env->isolate(),
                                    NODE_RELEASE_URLFPFX ".tar.gz"));
    READONLY_PROPERTY(release,
                      "headersUrl",
                      OneByteString(env->isolate(),
                                    NODE_RELEASE_URLFPFX "-headers.tar.gz"));
        #ifdef _WIN32
    READONLY_PROPERTY(release,
                      "libUrl",
                      OneByteString(env->isolate(),
                                    strcmp(NODE_ARCH, "ia32") ? NODE_RELEASE_URLPFX "win-" NODE_ARCH "/node.lib"
                                                              : NODE_RELEASE_URLPFX
                                        "win-x86/node.lib"));
        #endif
    #endif

    // process.argv
    Local<Array> arguments = Array::New(env->isolate(), argc);
    for (int i = 0; i < argc; ++i) {
        arguments->Set(env->context(), i, String::NewFromUtf8(env->isolate(), argv[i], v8::NewStringType::kNormal).ToLocalChecked()).Check();
    }
    process->Set(env->context(), FIXED_ONE_BYTE_STRING(env->isolate(), "argv"), arguments).Check();

    // process.execArgv
    Local<Array> exec_arguments = Array::New(env->isolate(), exec_argc);
    for (int i = 0; i < exec_argc; ++i) {
        exec_arguments->Set(env->context(), i, String::NewFromUtf8(env->isolate(), exec_argv[i], v8::NewStringType::kNormal).ToLocalChecked()).Check();
    }
    process->Set(env->context(), FIXED_ONE_BYTE_STRING(env->isolate(), "execArgv"),
                 exec_arguments)
        .Check();

    // create process.env
    //    Local<ObjectTemplate> process_env_template =
    //    ObjectTemplate::New(env->isolate());
    //    process_env_template->SetHandler(NamedPropertyHandlerConfiguration(
    //                                                                       EnvGetter,
    //                                                                       EnvSetter,
    //                                                                       EnvQuery,
    //                                                                       EnvDeleter,
    //                                                                       EnvEnumerator,
    //                                                                       env->as_external()));
    //
    //    Local<Object> process_env =
    //    process_env_template->NewInstance(env->context()).ToLocalChecked();
    //    process->Set(FIXED_ONE_BYTE_STRING(env->isolate(), "env"), process_env);
    //
    //    READONLY_PROPERTY(process, "pid", Integer::New(env->isolate(), getpid()));
    //    READONLY_PROPERTY(process, "features", GetFeatures(env));
    //
    //    auto need_immediate_callback_string =
    //    FIXED_ONE_BYTE_STRING(env->isolate(), "_needImmediateCallback");
    //    CHECK(process->SetAccessor(env->context(), need_immediate_callback_string,
    //                               NeedImmediateCallbackGetter,
    //                               NeedImmediateCallbackSetter,
    //                               env->as_external()).FromJust());
    //
    //    // -e, --eval
    //    if (eval_string) {
    //        READONLY_PROPERTY(process,
    //                          "_eval",
    //                          String::NewFromUtf8(env->isolate(), eval_string));
    //    }
    //
    //    // -p, --print
    //    if (print_eval) {
    //        READONLY_PROPERTY(process, "_print_eval", True(env->isolate()));
    //    }
    //
    //    // -c, --check
    //    if (syntax_check_only) {
    //        READONLY_PROPERTY(process, "_syntax_check_only", True(env->isolate()));
    //    }
    //
    //    // -i, --interactive
    //    if (force_repl) {
    //        READONLY_PROPERTY(process, "_forceRepl", True(env->isolate()));
    //    }

    //    // -r, --require
    //    if (!preload_modules.empty()) {
    //        Local<Array> array = Array::New(env->isolate());
    //        for (unsigned int i = 0; i < preload_modules.size(); ++i) {
    //            Local<String> module = String::NewFromUtf8(env->isolate(),
    //                                                       preload_modules[i].c_str());
    //            array->Set(i, module);
    //        }
    //        READONLY_PROPERTY(process,
    //                          "_preload_modules",
    //                          array);
    //
    //        preload_modules.clear();
    //    }
    //
    //    // --no-deprecation
    //    if (no_deprecation) {
    //        READONLY_PROPERTY(process, "noDeprecation", True(env->isolate()));
    //    }
    //
    //    // --no-warnings
    //    if (no_process_warnings) {
    //        READONLY_PROPERTY(process, "noProcessWarnings", True(env->isolate()));
    //    }
    //
    //    // --trace-warnings
    //    if (trace_warnings) {
    //        READONLY_PROPERTY(process, "traceProcessWarnings", True(env->isolate()));
    //    }
    //
    //    // --throw-deprecation
    //    if (throw_deprecation) {
    //        READONLY_PROPERTY(process, "throwDeprecation", True(env->isolate()));
    //    }
    //
    //#ifdef NODE_NO_BROWSER_GLOBALS
    //    // configure --no-browser-globals
    //    READONLY_PROPERTY(process, "_noBrowserGlobals", True(env->isolate()));
    //#endif  // NODE_NO_BROWSER_GLOBALS
    //
    //    // --prof-process
    //    if (prof_process) {
    //        READONLY_PROPERTY(process, "profProcess", True(env->isolate()));
    //    }
    //
    //    // --trace-deprecation
    //    if (trace_deprecation) {
    //        READONLY_PROPERTY(process, "traceDeprecation", True(env->isolate()));
    //    }
    //
    //    // REFINE(refack): move the following 3 to `node_config`
    //    // --inspect-brk
    //    if (debug_options.wait_for_connect()) {
    //        READONLY_DONT_ENUM_PROPERTY(process,
    //                                    "_breakFirstLine", True(env->isolate()));
    //    }
    //
    //    // --inspect --debug-brk
    //    if (debug_options.deprecated_invocation()) {
    //        READONLY_DONT_ENUM_PROPERTY(process,
    //                                    "_deprecatedDebugBrk", True(env->isolate()));
    //    }
    //
    //    // --debug or, --debug-brk without --inspect
    //    if (debug_options.invalid_invocation()) {
    //        READONLY_DONT_ENUM_PROPERTY(process,
    //                                    "_invalidDebug", True(env->isolate()));
    //    }
    //
    //    // --security-revert flags
    //#define V(code, _, __)                                                        \
//do {                                                                        \
//if (IsReverted(REVERT_ ## code)) {                                        \
//READONLY_PROPERTY(process, "REVERT_" #code, True(env->isolate()));      \
//}                                                                         \
//} while (0);
    //    REVERSIONS(V)
    //#undef V
    //
    //    size_t exec_path_len = 2 * PATH_MAX;
    //    char* exec_path = new char[exec_path_len];
    //    Local<String> exec_path_value;
    //    if (uv_exepath(exec_path, &exec_path_len) == 0) {
    //        exec_path_value = String::NewFromUtf8(env->isolate(),
    //                                              exec_path,
    //                                              String::kNormalString,
    //                                              exec_path_len);
    //    } else {
    //        exec_path_value = String::NewFromUtf8(env->isolate(), argv[0]);
    //    }
    //    process->Set(FIXED_ONE_BYTE_STRING(env->isolate(), "execPath"),
    //                 exec_path_value);
    //    delete[] exec_path;
    //
    //    auto debug_port_string = FIXED_ONE_BYTE_STRING(env->isolate(), "debugPort");
    //    CHECK(process->SetAccessor(env->context(),
    //                               debug_port_string,
    //                               DebugPortGetter,
    //                               DebugPortSetter,
    //                               env->as_external()).FromJust());
    //
    //    // define various internal methods
    //    env->SetMethod(process,
    //                   "_startProfilerIdleNotifier",
    //                   StartProfilerIdleNotifier);
    //    env->SetMethod(process,
    //                   "_stopProfilerIdleNotifier",
    //                   StopProfilerIdleNotifier);
    //    env->SetMethod(process, "_getActiveRequests", GetActiveRequests);
    //    env->SetMethod(process, "_getActiveHandles", GetActiveHandles);
    //    env->SetMethod(process, "reallyExit", Exit);
    //    env->SetMethod(process, "abort", Abort);
    //    env->SetMethod(process, "chdir", Chdir);
    //    env->SetMethod(process, "cwd", Cwd);
    //
    //    env->SetMethod(process, "umask", Umask);
    //
    //#if defined(__POSIX__) && !defined(__ANDROID__)
    //    env->SetMethod(process, "getuid", GetUid);
    //    env->SetMethod(process, "geteuid", GetEUid);
    //    env->SetMethod(process, "setuid", SetUid);
    //    env->SetMethod(process, "seteuid", SetEUid);
    //
    //    env->SetMethod(process, "setgid", SetGid);
    //    env->SetMethod(process, "setegid", SetEGid);
    //    env->SetMethod(process, "getgid", GetGid);
    //    env->SetMethod(process, "getegid", GetEGid);
    //
    //    env->SetMethod(process, "getgroups", GetGroups);
    //    env->SetMethod(process, "setgroups", SetGroups);
    //    env->SetMethod(process, "initgroups", InitGroups);
    //#endif  // __POSIX__ && !defined(__ANDROID__)
    //
    //    env->SetMethod(process, "_kill", Kill);
    //
    //    env->SetMethod(process, "_debugProcess", DebugProcess);
    //    env->SetMethod(process, "_debugPause", DebugPause);
    //    env->SetMethod(process, "_debugEnd", DebugEnd);
    //
    //    env->SetMethod(process, "hrtime", Hrtime);
    //
    //    env->SetMethod(process, "cpuUsage", CPUUsage);
    //
    //    env->SetMethod(process, "dlopen", DLOpen);
    //
    //    env->SetMethod(process, "uptime", Uptime);
    //    env->SetMethod(process, "memoryUsage", MemoryUsage);
    //
    //    env->SetMethod(process, "binding", Binding);
    //    env->SetMethod(process, "_linkedBinding", LinkedBinding);
    //
    //    env->SetMethod(process, "_setupProcessObject", SetupProcessObject);
    //    env->SetMethod(process, "_setupNextTick", SetupNextTick);
    //    env->SetMethod(process, "_setupPromises", SetupPromises);
    //    env->SetMethod(process, "_setupDomainUse", SetupDomainUse);

    // pre-set _events object for faster emit checks
    Local<Object> events_obj = Object::New(env->isolate());
    CHECK(events_obj->SetPrototype(env->context(),
                                   Null(env->isolate()))
              .FromJust());
    process->Set(env->context(), env->events_string(), events_obj).Check();
}

    #undef READONLY_PROPERTY

} // namespace node

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR
