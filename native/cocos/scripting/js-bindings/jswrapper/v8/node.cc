#include "node.h"
#include "util.h"
#include "env.h"

#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static inline const char *errno_string(int errorno) {
#define ERRNO_CASE(e)  case e: return #e;
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
# if EAGAIN != EWOULDBLOCK
  ERRNO_CASE(EWOULDBLOCK);
# endif
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
# if ENOLINK != ENOLCK
  ERRNO_CASE(ENOLCK);
# endif
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
# if ENOTEMPTY != EEXIST
  ERRNO_CASE(ENOTEMPTY);
# endif
#endif

#ifdef ENOTSOCK
  ERRNO_CASE(ENOTSOCK);
#endif

#ifdef ENOTSUP
  ERRNO_CASE(ENOTSUP);
#else
# ifdef EOPNOTSUPP
  ERRNO_CASE(EOPNOTSUPP);
# endif
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

using namespace v8;

namespace node {

static bool v8_is_profiling = false;

Local<Value> ErrnoException(Isolate* isolate,
                            int errorno,
                            const char *syscall,
                            const char *msg,
                            const char *path) {
    Environment* env = Environment::GetCurrent(isolate);

    Local<Value> e;
    Local<String> estring = OneByteString(env->isolate(), errno_string(errorno));
    if (msg == nullptr || msg[0] == '\0') {
        msg = strerror(errorno);
    }
    Local<String> message = OneByteString(env->isolate(), msg);

    Local<String> cons =
    String::Concat(estring, FIXED_ONE_BYTE_STRING(env->isolate(), ", "));
    cons = String::Concat(cons, message);

    Local<String> path_string;
    if (path != nullptr) {
        // FIXME(bnoordhuis) It's questionable to interpret the file path as UTF-8.
        path_string = String::NewFromUtf8(env->isolate(), path);
    }

    if (path_string.IsEmpty() == false) {
        cons = String::Concat(cons, FIXED_ONE_BYTE_STRING(env->isolate(), " '"));
        cons = String::Concat(cons, path_string);
        cons = String::Concat(cons, FIXED_ONE_BYTE_STRING(env->isolate(), "'"));
    }
    e = Exception::Error(cons);

    Local<Object> obj = e->ToObject(env->isolate());
    obj->Set(env->errno_string(), Integer::New(env->isolate(), errorno));
    obj->Set(env->code_string(), estring);

    if (path_string.IsEmpty() == false) {
        obj->Set(env->path_string(), path_string);
    }

    if (syscall != nullptr) {
        obj->Set(env->syscall_string(), OneByteString(env->isolate(), syscall));
    }

    return e;
}


static Local<String> StringFromPath(Isolate* isolate, const char* path) {
#ifdef _WIN32
    if (strncmp(path, "\\\\?\\UNC\\", 8) == 0) {
        return String::Concat(FIXED_ONE_BYTE_STRING(isolate, "\\\\"),
                              String::NewFromUtf8(isolate, path + 8));
    } else if (strncmp(path, "\\\\?\\", 4) == 0) {
        return String::NewFromUtf8(isolate, path + 4);
    }
#endif

    return String::NewFromUtf8(isolate, path);
}


Local<Value> UVException(Isolate* isolate,
                         int errorno,
                         const char* syscall,
                         const char* msg,
                         const char* path) {
    return UVException(isolate, errorno, syscall, msg, path, nullptr);
}


Local<Value> UVException(Isolate* isolate,
                         int errorno,
                         const char* syscall,
                         const char* msg,
                         const char* path,
                         const char* dest) {
    Environment* env = Environment::GetCurrent(isolate);

    if (!msg || !msg[0])
        msg = uv_strerror(errorno);

    Local<String> js_code = OneByteString(isolate, uv_err_name(errorno));
    Local<String> js_syscall = OneByteString(isolate, syscall);
    Local<String> js_path;
    Local<String> js_dest;

    Local<String> js_msg = js_code;
    js_msg = String::Concat(js_msg, FIXED_ONE_BYTE_STRING(isolate, ": "));
    js_msg = String::Concat(js_msg, OneByteString(isolate, msg));
    js_msg = String::Concat(js_msg, FIXED_ONE_BYTE_STRING(isolate, ", "));
    js_msg = String::Concat(js_msg, js_syscall);

    if (path != nullptr) {
        js_path = StringFromPath(isolate, path);

        js_msg = String::Concat(js_msg, FIXED_ONE_BYTE_STRING(isolate, " '"));
        js_msg = String::Concat(js_msg, js_path);
        js_msg = String::Concat(js_msg, FIXED_ONE_BYTE_STRING(isolate, "'"));
    }

    if (dest != nullptr) {
        js_dest = StringFromPath(isolate, dest);
        
        js_msg = String::Concat(js_msg, FIXED_ONE_BYTE_STRING(isolate, " -> '"));
        js_msg = String::Concat(js_msg, js_dest);
        js_msg = String::Concat(js_msg, FIXED_ONE_BYTE_STRING(isolate, "'"));
    }
    
    Local<Object> e = Exception::Error(js_msg)->ToObject(isolate);
    
    e->Set(env->errno_string(), Integer::New(isolate, errorno));
    e->Set(env->code_string(), js_code);
    e->Set(env->syscall_string(), js_syscall);
    if (!js_path.IsEmpty())
        e->Set(env->path_string(), js_path);
    if (!js_dest.IsEmpty())
        e->Set(env->dest_string(), js_dest);
    
    return e;
}

MaybeLocal<Value> MakeCallback(Environment* env,
                                   Local<Value> recv,
                                   const Local<Function> callback,
                                   int argc,
                                   Local<Value> argv[],
                                   async_context asyncContext) {
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


MaybeLocal<Value> MakeCallback(Isolate* isolate,
                               Local<Object> recv,
                               const char* method,
                               int argc,
                               Local<Value> argv[],
                               async_context asyncContext) {
    Local<String> method_string =
    String::NewFromUtf8(isolate, method, v8::NewStringType::kNormal)
    .ToLocalChecked();
    return MakeCallback(isolate, recv, method_string, argc, argv, asyncContext);
}


MaybeLocal<Value> MakeCallback(Isolate* isolate,
                               Local<Object> recv,
                               Local<String> symbol,
                               int argc,
                               Local<Value> argv[],
                               async_context asyncContext) {
    Local<Value> callback_v = recv->Get(symbol);
    if (callback_v.IsEmpty()) return Local<Value>();
    if (!callback_v->IsFunction()) return Local<Value>();
    Local<Function> callback = callback_v.As<Function>();
    return MakeCallback(isolate, recv, callback, argc, argv, asyncContext);
}


MaybeLocal<Value> MakeCallback(Isolate* isolate,
                               Local<Object> recv,
                               Local<Function> callback,
                               int argc,
                               Local<Value> argv[],
                               async_context asyncContext) {
    // Observe the following two subtleties:
    //
    // 1. The environment is retrieved from the callback function's context.
    // 2. The context to enter is retrieved from the environment.
    //
    // Because of the AssignToContext() call in src/node_contextify.cc,
    // the two contexts need not be the same.
    Environment* env = Environment::GetCurrent(callback->CreationContext());
    Context::Scope context_scope(env->context());
    return MakeCallback(env, recv.As<Value>(), callback, argc, argv,
                        asyncContext);
}


// Legacy MakeCallback()s

Local<Value> MakeCallback(Isolate* isolate,
                          Local<Object> recv,
                          const char* method,
                          int argc,
                          Local<Value>* argv) {
    EscapableHandleScope handle_scope(isolate);
    return handle_scope.Escape(
                               MakeCallback(isolate, recv, method, argc, argv, {0, 0})
                               .FromMaybe(Local<Value>()));
}


Local<Value> MakeCallback(Isolate* isolate,
                          Local<Object> recv,
                          Local<String> symbol,
                          int argc,
                          Local<Value>* argv) {
    EscapableHandleScope handle_scope(isolate);
    return handle_scope.Escape(
                               MakeCallback(isolate, recv, symbol, argc, argv, {0, 0})
                               .FromMaybe(Local<Value>()));
}


Local<Value> MakeCallback(Isolate* isolate,
                          Local<Object> recv,
                          Local<Function> callback,
                          int argc,
                          Local<Value>* argv) {
    EscapableHandleScope handle_scope(isolate);
    return handle_scope.Escape(
                               MakeCallback(isolate, recv, callback, argc, argv, {0, 0})
                               .FromMaybe(Local<Value>()));
}

IsolateData* CreateIsolateData(Isolate* isolate, uv_loop_t* loop) {
    return new IsolateData(isolate, loop);
}


void FreeIsolateData(IsolateData* isolate_data) {
    delete isolate_data;
}


Environment* CreateEnvironment(IsolateData* isolate_data,
                               Local<Context> context,
                               int argc,
                               const char* const* argv,
                               int exec_argc,
                               const char* const* exec_argv) {
    Isolate* isolate = context->GetIsolate();
    HandleScope handle_scope(isolate);
    Context::Scope context_scope(context);
    auto env = new Environment(isolate_data, context);
    env->Start(argc, argv, exec_argc, exec_argv, v8_is_profiling);
    return env;
}


void FreeEnvironment(Environment* env) {
    delete env;
}

NO_RETURN void Abort() {
    DumpBacktrace(stderr);
    fflush(stderr);
    ABORT_NO_BACKTRACE();
}


NO_RETURN void Assert(const char* const (*args)[4]) {
    auto filename = (*args)[0];
    auto linenum = (*args)[1];
    auto message = (*args)[2];
    auto function = (*args)[3];

    char exepath[256];
    size_t exepath_size = sizeof(exepath);
    if (uv_exepath(exepath, &exepath_size))
        snprintf(exepath, sizeof(exepath), "node");

    char pid[12] = {0};
#ifndef _WIN32
    snprintf(pid, sizeof(pid), "[%u]", getpid());
#endif

    fprintf(stderr, "%s%s: %s:%s:%s%s Assertion `%s' failed.\n",
            exepath, pid, filename, linenum,
            function, *function ? ":" : "", message);
    fflush(stderr);
    
    Abort();
}


static void Abort(const FunctionCallbackInfo<Value>& args) {
    Abort();
}

} // namespace node {
