#pragma once

#include "../../config.hpp"
#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

#include "v8.h"

#include <stddef.h>

#ifdef _WIN32
# ifndef BUILDING_NODE_EXTENSION
#   define NODE_EXTERN __declspec(dllexport)
# else
#   define NODE_EXTERN __declspec(dllimport)
# endif
#else
# define NODE_EXTERN /* nothing */
#endif

#include <assert.h>
#include <stdint.h>

#ifndef NODE_STRINGIFY
#define NODE_STRINGIFY(n) NODE_STRINGIFY_HELPER(n)
#define NODE_STRINGIFY_HELPER(n) #n
#endif

// The arraysize(arr) macro returns the # of elements in an array arr.
// The expression is a compile-time constant, and therefore can be
// used in defining new arrays, for example.  If you use arraysize on
// a pointer by mistake, you will get a compile-time error.
#define arraysize(array) (sizeof(ArraySizeHelper(array)))


// This template function declaration is used in defining arraysize.
// Note that the function doesn't need an implementation, as we only
// use its type.
template <typename T, size_t N>
char (&ArraySizeHelper(T (&array)[N]))[N];


#if !V8_CC_MSVC
// That gcc wants both of these prototypes seems mysterious. VC, for
// its part, can't decide which to use (another mystery). Matching of
// template overloads: the final frontier.
template <typename T, size_t N>
char (&ArraySizeHelper(const T (&array)[N]))[N];
#endif

#ifdef __POSIX__
void RegisterSignalHandler(int signal,
                           void (*handler)(int signal),
                           bool reset_handler = false);
#endif // __POSIX__

namespace node {



NODE_EXTERN v8::Local<v8::Value> ErrnoException(v8::Isolate* isolate,
                                                int errorno,
                                                const char* syscall = NULL,
                                                const char* message = NULL,
                                                const char* path = NULL);
NODE_EXTERN v8::Local<v8::Value> UVException(v8::Isolate* isolate,
                                             int errorno,
                                             const char* syscall = NULL,
                                             const char* message = NULL,
                                             const char* path = NULL);
NODE_EXTERN v8::Local<v8::Value> UVException(v8::Isolate* isolate,
                                             int errorno,
                                             const char* syscall,
                                             const char* message,
                                             const char* path,
                                             const char* dest);


typedef double async_id;
struct async_context {
    ::node::async_id async_id;
    ::node::async_id trigger_async_id;
};

/* An API specific to emit before/after callbacks is unnecessary because
 * MakeCallback will automatically call them for you.
 *
 * These methods may create handles on their own, so run them inside a
 * HandleScope.
 *
 * `asyncId` and `triggerAsyncId` should correspond to the values returned by
 * `EmitAsyncInit()` and `AsyncHooksGetTriggerAsyncId()`, respectively, when the
 * invoking resource was created. If these values are unknown, 0 can be passed.
 * */

v8::MaybeLocal<v8::Value> MakeCallback(v8::Isolate* isolate,
                                       v8::Local<v8::Object> recv,
                                       v8::Local<v8::Function> callback,
                                       int argc,
                                       v8::Local<v8::Value>* argv,
                                       async_context asyncContext);

v8::MaybeLocal<v8::Value> MakeCallback(v8::Isolate* isolate,
                                       v8::Local<v8::Object> recv,
                                       const char* method,
                                       int argc,
                                       v8::Local<v8::Value>* argv,
                                       async_context asyncContext);

v8::MaybeLocal<v8::Value> MakeCallback(v8::Isolate* isolate,
                                       v8::Local<v8::Object> recv,
                                       v8::Local<v8::String> symbol,
                                       int argc,
                                       v8::Local<v8::Value>* argv,
                                       async_context asyncContext);

/*
 * These methods need to be called in a HandleScope.
 *
 * It is preferred that you use the `MakeCallback` overloads taking
 * `async_id` arguments.
 */

v8::Local<v8::Value> MakeCallback(
                                              v8::Isolate* isolate,
                                              v8::Local<v8::Object> recv,
                                              const char* method,
                                              int argc,
                                              v8::Local<v8::Value>* argv);
v8::Local<v8::Value> MakeCallback(
                                              v8::Isolate* isolate,
                                              v8::Local<v8::Object> recv,
                                              v8::Local<v8::String> symbol,
                                              int argc,
                                              v8::Local<v8::Value>* argv);
v8::Local<v8::Value> MakeCallback(
                                              v8::Isolate* isolate,
                                              v8::Local<v8::Object> recv,
                                              v8::Local<v8::Function> callback,
                                              int argc,
                                              v8::Local<v8::Value>* argv);

class IsolateData;
class Environment;

NODE_EXTERN IsolateData* CreateIsolateData(v8::Isolate* isolate,
                                           struct uv_loop_s* loop);
NODE_EXTERN void FreeIsolateData(IsolateData* isolate_data);

NODE_EXTERN Environment* CreateEnvironment(IsolateData* isolate_data,
                                           v8::Local<v8::Context> context,
                                           int argc,
                                           const char* const* argv,
                                           int exec_argc,
                                           const char* const* exec_argv);
NODE_EXTERN void FreeEnvironment(Environment* env);

void SetupProcessObject(Environment* env,
                        int argc,
                        const char* const* argv,
                        int exec_argc,
                        const char* const* exec_argv);

} // namespace node {

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR
