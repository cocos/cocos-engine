#include <unistd.h>
#include <algorithm>
#include <atomic>
#include <climits>  // INT_MAX
#include <cmath>
#include <assert.h>

#include <execinfo.h>  // for backtrace
#include <cxxabi.h>   // for demangling

#include "v8-debug.h"
#include "v8-internal.h"
#include "v8-local-handle.h"
#include "v8-primitive.h"
#include "v8-statistics.h"
#include "v8-version-string.h"
#define JSVM_EXPERIMENTAL
// #include "env-inl.h"
#include "jsvm.h"
#include "js_native_api_v8.h"
//#include "js_native_api_v8_inspector.h"
#include "libplatform/libplatform.h"
// #include "util-inl.h"
// #include "util.h"
// #include "sourcemap.def"

#define SECARGCNT   2

#define CHECK_MAYBE_NOTHING(env, maybe, status)                                \
  RETURN_STATUS_IF_FALSE((env), !((maybe).IsNothing()), (status))

#define CHECK_MAYBE_NOTHING_WITH_PREAMBLE(env, maybe, status)                  \
  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE((env), !((maybe).IsNothing()), (status))

#define CHECK_TO_NUMBER(env, context, result, src)                             \
  CHECK_TO_TYPE((env), Number, (context), (result), (src), JSVM_NUMBER_EXPECTED)

// n-api defines JSVM_AUTO_LENGTH as the indicator that a string
// is null terminated. For V8 the equivalent is -1. The assert
// validates that our cast of JSVM_AUTO_LENGTH results in -1 as
// needed by V8.
#define CHECK_NEW_FROM_UTF8_LEN(env, result, str, len)                         \
  do {                                                                         \
    static_assert(static_cast<int>(JSVM_AUTO_LENGTH) == -1,                    \
                  "Casting JSVM_AUTO_LENGTH to int must result in -1");        \
    RETURN_STATUS_IF_FALSE(                                                    \
        (env), (len == JSVM_AUTO_LENGTH) || len <= INT_MAX, JSVM_INVALID_ARG); \
    RETURN_STATUS_IF_FALSE((env), (str) != nullptr, JSVM_INVALID_ARG);         \
    auto str_maybe = v8::String::NewFromUtf8((env)->isolate,                   \
                                             (str),                            \
                                             v8::NewStringType::kInternalized, \
                                             static_cast<int>(len));           \
    CHECK_MAYBE_EMPTY((env), str_maybe, JSVM_GENERIC_FAILURE);                 \
    (result) = str_maybe.ToLocalChecked();                                     \
  } while (0)

#define CHECK_NEW_FROM_UTF8(env, result, str)                                  \
  CHECK_NEW_FROM_UTF8_LEN((env), (result), (str), JSVM_AUTO_LENGTH)

#define CHECK_NEW_STRING_ARGS(env, str, length, result)                        \
  do {                                                                         \
    CHECK_ENV_NOT_IN_GC((env));                                                \
    if ((length) > 0) CHECK_ARG((env), (str));                                 \
    CHECK_ARG((env), (result));                                                \
    RETURN_STATUS_IF_FALSE(                                                    \
        (env),                                                                 \
        ((length) == JSVM_AUTO_LENGTH) || (length) <= INT_MAX,                 \
        JSVM_INVALID_ARG);                                                     \
  } while (0)

#define CREATE_TYPED_ARRAY(                                                    \
    env, type, size_of_element, buffer, byteOffset, length, out)              \
  do {                                                                         \
    if ((size_of_element) > 1) {                                               \
      THROW_RANGE_ERROR_IF_FALSE(                                              \
          (env),                                                               \
          (byteOffset) % (size_of_element) == 0,                              \
          "ERR_JSVM_INVALID_TYPEDARRAY_ALIGNMENT",                             \
          "start offset of " #type                                             \
          " should be a multiple of " #size_of_element);                       \
    }                                                                          \
    THROW_RANGE_ERROR_IF_FALSE(                                                \
        (env),                                                                 \
        (length) * (size_of_element) + (byteOffset) <= buffer->ByteLength(),  \
        "ERR_JSVM_INVALID_TYPEDARRAY_LENGTH",                                  \
        "Invalid typed array length");                                         \
    (out) = v8::type::New((buffer), (byteOffset), (length));                  \
  } while (0)

JSVM_Env__::JSVM_Env__(v8::Isolate* isolate, int32_t module_api_version)
    : isolate(isolate), module_api_version(module_api_version) {
//cjh  inspector_agent_ = new v8impl::Agent(this);
  jsvm_clear_last_error(this);
}

void JSVM_Env__::DeleteMe() {
   // First we must finalize those references that have `napi_finalizer`
   // callbacks. The reason is that addons might store other references which
   // they delete during their `napi_finalizer` callbacks. If we deleted such
   // references here first, they would be doubly deleted when the
   // `napi_finalizer` deleted them subsequently.
   v8impl::RefTracker::FinalizeAll(&finalizing_reflist);
   v8impl::RefTracker::FinalizeAll(&reflist);
   {
       v8::Context::Scope context_scope(context());
//cjh       if (inspector_agent_->IsActive()) {
//           inspector_agent_->WaitForDisconnect();
//       }
//       delete inspector_agent_;
   }
   delete this;
}

//cjh void JSVM_Env__::RunAndClearInterrupts() {
//  while (native_immediates_interrupts_.size() > 0) {
//    NativeImmediateQueue queue;
//    {
//      node::Mutex::ScopedLock lock(native_immediates_threadsafe_mutex_);
//      queue.ConcatMove(std::move(native_immediates_interrupts_));
//    }
//    node::DebugSealHandleScope seal_handle_scope(isolate);
//
//    while (auto head = queue.Shift())
//      head->Call(this);
//  }
//}

void JSVM_Env__::InvokeFinalizerFromGC(v8impl::RefTracker* finalizer) {
    // The experimental code calls finalizers immediately to release native
    // objects as soon as possible. In that state any code that may affect GC
    // state causes a fatal error. To work around this issue the finalizer code
    // can call node_api_post_finalizer.
    auto restore_state = node::OnScopeLeave(
        [this, saved = in_gc_finalizer] { in_gc_finalizer = saved; });
    in_gc_finalizer = true;
    finalizer->Finalize();
}

namespace v8impl {

namespace {

//cjh added begin
class BufferFinalizer : private Finalizer {
 public:
  static BufferFinalizer* New(JSVM_Env env,
                              JSVM_Finalize finalizeCallback = nullptr,
                              void* finalizeData = nullptr,
                              void* finalizeHint = nullptr) {
    return new BufferFinalizer(
        env, finalizeCallback, finalizeData, finalizeHint);
  }
  // node::Buffer::FreeCallback
  static void FinalizeBufferCallback(char* data, void* hint) {
    std::unique_ptr<BufferFinalizer, Deleter> finalizer{
        static_cast<BufferFinalizer*>(hint)};
    finalizer->finalize_data_ = data;

    // It is safe to call into JavaScript at this point.
    if (finalizer->finalize_callback_ == nullptr) return;
    finalizer->env_->CallFinalizer(finalizer->finalize_callback_,
                                   finalizer->finalize_data_,
                                   finalizer->finalize_hint_);
  }

  struct Deleter {
    void operator()(BufferFinalizer* finalizer) { delete finalizer; }
  };

 private:
  BufferFinalizer(JSVM_Env env,
                  JSVM_Finalize finalizeCallback,
                  void* finalizeData,
                  void* finalizeHint)
      : Finalizer(env, finalizeCallback, finalizeData, finalizeHint) {
    env_->Ref();
  }

  ~BufferFinalizer() { env_->Unref(); }
};
//cjh added end

enum IsolateDataSlot {
  kIsolateData = 0,
  kIsolateSnapshotCreatorSlot = 1,
};

enum ContextEmbedderIndex {
  kContextEnvIndex = 1,
};

struct IsolateData {
  IsolateData(v8::StartupData* blob) : blob(blob) {}

  ~IsolateData() {
    delete blob;
  }

  v8::StartupData* blob;
  v8::Eternal<v8::Private> jsvm_type_tag_key;
  v8::Eternal<v8::Private> jsvm_wrapper_key;
};

static void CreateIsolateData(v8::Isolate* isolate, v8::StartupData* blob) {
  auto data = new IsolateData(blob);
  v8::Isolate::Scope isolate_scope(isolate);
  v8::HandleScope handle_scope(isolate);
  if (blob) {
    // NOTE: The order of getting the data must be consistent with the order of
    // adding data in OH_JSVM_CreateSnapshot.
      auto wrapper_key = isolate->GetDataFromSnapshotOnce<v8::Private>(0);
      auto type_tag_key = isolate->GetDataFromSnapshotOnce<v8::Private>(1);
      data->jsvm_wrapper_key.Set(isolate, wrapper_key.ToLocalChecked());
      data->jsvm_type_tag_key.Set(isolate, type_tag_key.ToLocalChecked());
  } else {
      data->jsvm_wrapper_key.Set(isolate, v8::Private::New(isolate));
      data->jsvm_type_tag_key.Set(isolate, v8::Private::New(isolate));
  }
  isolate->SetData(v8impl::kIsolateData, data);
}

static IsolateData* GetIsolateData(v8::Isolate* isolate) {
  auto data = isolate->GetData(v8impl::kIsolateData);
  return reinterpret_cast<IsolateData*>(data);
}

static void SetIsolateSnapshotCreator(v8::Isolate* isolate,
                                      v8::SnapshotCreator* creator) {
  isolate->SetData(v8impl::kIsolateSnapshotCreatorSlot, creator);
}

static v8::SnapshotCreator* GetIsolateSnapshotCreator(v8::Isolate* isolate) {
  auto data = isolate->GetData(v8impl::kIsolateSnapshotCreatorSlot);
  return reinterpret_cast<v8::SnapshotCreator*>(data);
}

static void SetContextEnv(v8::Local<v8::Context> context, JSVM_Env env) {
  context->SetAlignedPointerInEmbedderData(kContextEnvIndex, env);
}

static JSVM_Env GetContextEnv(v8::Local<v8::Context> context) {
  auto data = context->GetAlignedPointerFromEmbedderData(kContextEnvIndex);
  return reinterpret_cast<JSVM_Env>(data);
}

//class OutputStream : public v8::OutputStream {
// public:
//  OutputStream(JSVM_OutputStream stream, void* data, int chunk_size = 65536)
//    : stream_(stream), stream_data_(data), chunk_size_(chunk_size) {}
//
//  int GetChunkSize() override { return chunk_size_; }
//
//  void EndOfStream() override {
//    stream_(nullptr, 0, stream_data_);
//  }
//
//  WriteResult WriteAsciiChunk(char* data, const int size) override {
//    return stream_(data, size, stream_data_) ? kContinue : kAbort;
//  }
//
// private:
//  JSVM_OutputStream stream_;
//  void* stream_data_;
//  int chunk_size_;
//};

static std::unique_ptr<v8::Platform> g_platform = v8::platform::NewDefaultPlatform();

static std::vector<intptr_t> externalReferenceRegistry;

static std::unordered_map<std::string, std::string> sourceMapUrlMap;

static std::unique_ptr<v8::ArrayBuffer::Allocator> defaultArrayBufferAllocator;

static v8::ArrayBuffer::Allocator *GetOrCreateDefaultArrayBufferAllocator() {
  if (!defaultArrayBufferAllocator) {
    defaultArrayBufferAllocator.reset(v8::ArrayBuffer::Allocator::NewDefaultAllocator());
  }
  return defaultArrayBufferAllocator.get();
}

static void SetFileToSourceMapMapping(std::string &&file, std::string &&sourceMapUrl) {
  auto it = sourceMapUrlMap.find(file);
  if (it == sourceMapUrlMap.end()) {
    sourceMapUrlMap.emplace(file, sourceMapUrl);
    return;
  }
  auto &&prevSourceMapUrl = it->second;
  CHECK(prevSourceMapUrl == sourceMapUrl);
}

static std::string GetSourceMapFromFileName(std::string &&file) {
  auto it = sourceMapUrlMap.find(file);
  if (it != sourceMapUrlMap.end()) {
    return it->second;
  }
  return "";
}

template <typename CCharType, typename StringMaker>
JSVM_Status NewString(JSVM_Env env,
                      const CCharType* str,
                      size_t length,
                      JSVM_Value* result,
                      StringMaker string_maker) {
  CHECK_NEW_STRING_ARGS(env, str, length, result);

  auto isolate = env->isolate;
  auto str_maybe = string_maker(isolate);
  CHECK_MAYBE_EMPTY(env, str_maybe, JSVM_GENERIC_FAILURE);
  *result = v8impl::JsValueFromV8LocalValue(str_maybe.ToLocalChecked());
  return jsvm_clear_last_error(env);
}

template <typename CharType, typename CreateAPI, typename StringMaker>
JSVM_Status NewExternalString(JSVM_Env env,
                              CharType* str,
                              size_t length,
                              JSVM_Finalize finalizeCallback,
                              void* finalizeHint,
                              JSVM_Value* result,
                              bool* copied,
                              CreateAPI create_api,
                              StringMaker string_maker) {
  CHECK_NEW_STRING_ARGS(env, str, length, result);
  JSVM_Status status;
#if defined(V8_ENABLE_SANDBOX)
  status = create_api(env, str, length, result);
  if (status == JSVM_OK) {
    if (copied != nullptr) {
      *copied = true;
    }
    if (finalizeCallback) {
      env->CallFinalizer(
          finalizeCallback, static_cast<CharType*>(str), finalizeHint);
    }
  }
#else
  status = NewString(env, str, length, result, string_maker);
  if (status == JSVM_OK && copied != nullptr) {
    *copied = false;
  }
#endif  // V8_ENABLE_SANDBOX
  return status;
}

class TrackedStringResource : public Finalizer, RefTracker {
 public:
  TrackedStringResource(JSVM_Env env,
                        JSVM_Finalize finalizeCallback,
                        void* data,
                        void* finalizeHint)
      : Finalizer(env, finalizeCallback, data, finalizeHint) {
    Link(finalizeCallback == nullptr ? &env->reflist
                                      : &env->finalizing_reflist);
  }

 protected:
  // The only time Finalize() gets called before Dispose() is if the
  // environment is dying. Finalize() expects that the item will be unlinked,
  // so we do it here. V8 will still call Dispose() on us later, so we don't do
  // any deleting here. We just null out env_ to avoid passing a stale pointer
  // to the user's finalizer when V8 does finally call Dispose().
  void Finalize() override {
    Unlink();
    env_ = nullptr;
  }

  ~TrackedStringResource() {
    if (finalize_callback_ == nullptr) return;
    if (env_ == nullptr) {
      // The environment is dead. Call the finalizer directly.
      finalize_callback_(nullptr, finalize_data_, finalize_hint_);
    } else {
      // The environment is still alive. Let's remove ourselves from its list
      // of references and call the user's finalizer.
      Unlink();
      env_->CallFinalizer(finalize_callback_, finalize_data_, finalize_hint_);
    }
  }
};

class ExternalOneByteStringResource
    : public v8::String::ExternalOneByteStringResource,
      TrackedStringResource {
 public:
  ExternalOneByteStringResource(JSVM_Env env,
                                char* string,
                                const size_t length,
                                JSVM_Finalize finalizeCallback,
                                void* finalizeHint)
      : TrackedStringResource(env, finalizeCallback, string, finalizeHint),
        string_(string),
        length_(length) {}

  const char* data() const override { return string_; }
  size_t length() const override { return length_; }

 private:
  const char* string_;
  const size_t length_;
};

class ExternalStringResource : public v8::String::ExternalStringResource,
                               TrackedStringResource {
 public:
  ExternalStringResource(JSVM_Env env,
                         char16_t* string,
                         const size_t length,
                         JSVM_Finalize finalizeCallback,
                         void* finalizeHint)
      : TrackedStringResource(env, finalizeCallback, string, finalizeHint),
        string_(reinterpret_cast<uint16_t*>(string)),
        length_(length) {}

  const uint16_t* data() const override { return string_; }
  size_t length() const override { return length_; }

 private:
  const uint16_t* string_;
  const size_t length_;
};

inline JSVM_Status V8NameFromPropertyDescriptor(
    JSVM_Env env,
    const JSVM_PropertyDescriptor* p,
    v8::Local<v8::Name>* result) {
  if (p->utf8name != nullptr) {
    CHECK_NEW_FROM_UTF8(env, *result, p->utf8name);
  } else {
    v8::Local<v8::Value> property_value =
        v8impl::V8LocalValueFromJsValue(p->name);

    RETURN_STATUS_IF_FALSE(env, property_value->IsName(), JSVM_NAME_EXPECTED);
    *result = property_value.As<v8::Name>();
  }

  return JSVM_OK;
}

// convert from n-api property attributes to v8::PropertyAttribute
inline v8::PropertyAttribute V8PropertyAttributesFromDescriptor(
    const JSVM_PropertyDescriptor* descriptor) {
  unsigned int attribute_flags = v8::PropertyAttribute::None;

  // The JSVM_WRITABLE attribute is ignored for accessor descriptors, but
  // V8 would throw `TypeError`s on assignment with nonexistence of a setter.
  if ((descriptor->getter == nullptr && descriptor->setter == nullptr) &&
      (descriptor->attributes & JSVM_WRITABLE) == 0) {
    attribute_flags |= v8::PropertyAttribute::ReadOnly;
  }

  if ((descriptor->attributes & JSVM_ENUMERABLE) == 0) {
    attribute_flags |= v8::PropertyAttribute::DontEnum;
  }
  if ((descriptor->attributes & JSVM_CONFIGURABLE) == 0) {
    attribute_flags |= v8::PropertyAttribute::DontDelete;
  }

  return static_cast<v8::PropertyAttribute>(attribute_flags);
}

inline JSVM_Deferred JsDeferredFromNodePersistent(
    v8impl::Persistent<v8::Value>* local) {
  return reinterpret_cast<JSVM_Deferred>(local);
}

inline v8impl::Persistent<v8::Value>* NodePersistentFromJsDeferred(
    JSVM_Deferred local) {
  return reinterpret_cast<v8impl::Persistent<v8::Value>*>(local);
}

class HandleScopeWrapper {
 public:
  explicit HandleScopeWrapper(v8::Isolate* isolate) : scope(isolate) {}

 private:
  v8::HandleScope scope;
};

// In node v0.10 version of v8, there is no EscapableHandleScope and the
// node v0.10 port use HandleScope::Close(Local<T> v) to mimic the behavior
// of a EscapableHandleScope::Escape(Local<T> v), but it is not the same
// semantics. This is an example of where the api abstraction fail to work
// across different versions.
class EscapableHandleScopeWrapper {
 public:
  explicit EscapableHandleScopeWrapper(v8::Isolate* isolate)
      : scope(isolate), escape_called_(false) {}
  bool escape_called() const { return escape_called_; }
  template <typename T>
  v8::Local<T> Escape(v8::Local<T> handle) {
    escape_called_ = true;
    return scope.Escape(handle);
  }

 private:
  v8::EscapableHandleScope scope;
  bool escape_called_;
};

inline JSVM_HandleScope JsHandleScopeFromV8HandleScope(HandleScopeWrapper* s) {
  return reinterpret_cast<JSVM_HandleScope>(s);
}

inline HandleScopeWrapper* V8HandleScopeFromJsHandleScope(JSVM_HandleScope s) {
  return reinterpret_cast<HandleScopeWrapper*>(s);
}

inline JSVM_EscapableHandleScope
JsEscapableHandleScopeFromV8EscapableHandleScope(
    EscapableHandleScopeWrapper* s) {
  return reinterpret_cast<JSVM_EscapableHandleScope>(s);
}

inline EscapableHandleScopeWrapper*
V8EscapableHandleScopeFromJsEscapableHandleScope(
    JSVM_EscapableHandleScope s) {
  return reinterpret_cast<EscapableHandleScopeWrapper*>(s);
}

inline JSVM_Status ConcludeDeferred(JSVM_Env env,
                                    JSVM_Deferred deferred,
                                    JSVM_Value result,
                                    bool is_resolved) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8impl::Persistent<v8::Value>* deferred_ref =
      NodePersistentFromJsDeferred(deferred);
  v8::Local<v8::Value> v8_deferred =
      v8::Local<v8::Value>::New(env->isolate, *deferred_ref);

  auto v8_resolver = v8_deferred.As<v8::Promise::Resolver>();

  v8::Maybe<bool> success =
      is_resolved ? v8_resolver->Resolve(
                        context, v8impl::V8LocalValueFromJsValue(result))
                  : v8_resolver->Reject(
                        context, v8impl::V8LocalValueFromJsValue(result));

  delete deferred_ref;

  RETURN_STATUS_IF_FALSE(env, success.FromMaybe(false), JSVM_GENERIC_FAILURE);

  return GET_RETURN_STATUS(env);
}

enum UnwrapAction { KeepWrap, RemoveWrap };

inline JSVM_Status Unwrap(JSVM_Env env,
                          JSVM_Value jsObject,
                          void** result,
                          UnwrapAction action) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, jsObject);
  if (action == KeepWrap) {
    CHECK_ARG(env, result);
  }

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(jsObject);
  RETURN_STATUS_IF_FALSE(env, value->IsObject(), JSVM_INVALID_ARG);
  v8::Local<v8::Object> obj = value.As<v8::Object>();

  auto val = obj->GetPrivate(context, JSVM_PRIVATE_KEY(env->isolate, wrapper))
                 .ToLocalChecked();
  RETURN_STATUS_IF_FALSE(env, val->IsExternal(), JSVM_INVALID_ARG);
  Reference* reference =
      static_cast<v8impl::Reference*>(val.As<v8::External>()->Value());

  if (result) {
    *result = reference->Data();
  }

  if (action == RemoveWrap) {
    CHECK(obj->DeletePrivate(context, JSVM_PRIVATE_KEY(env->isolate, wrapper))
              .FromJust());
    if (reference->ownership() == Ownership::kUserland) {
      // When the wrap is been removed, the finalizer should be reset.
      reference->ResetFinalizer();
    } else {
      delete reference;
    }
  }

  return GET_RETURN_STATUS(env);
}

//=== Function JSVM_Callback wrapper =================================

// Use this data structure to associate callback data with each N-API function
// exposed to JavaScript. The structure is stored in a v8::External which gets
// passed into our callback wrapper. This reduces the performance impact of
// calling through N-API.
// Ref: benchmark/misc/function_call
// Discussion (incl. perf. data): https://github.com/nodejs/node/pull/21072
class CallbackBundle {
 public:
  // Creates an object to be made available to the static function callback
  // wrapper, used to retrieve the native callback function and data pointer.
  static inline v8::Local<v8::Value> New(JSVM_Env env,
                                         JSVM_Callback cb) {
    return v8::External::New(env->isolate, cb);
  }

  static inline v8::Local<v8::Value> New(JSVM_Env env,
                                         v8impl::JSVM_PropertyHandlerCfgStruct* cb) {
    return v8::External::New(env->isolate, cb);
  }
};

// Base class extended by classes that wrap V8 function and property callback
// info.
class CallbackWrapper {
 public:
  inline CallbackWrapper(JSVM_Value thisArg, size_t args_length, void* data)
      : _this(thisArg), _args_length(args_length), _data(data) {}

  virtual JSVM_Value GetNewTarget() {};
  virtual void Args(JSVM_Value* buffer, size_t bufferlength) {};
  virtual void SetReturnValue(JSVM_Value value) = 0;

  JSVM_Value This() { return _this; }

  size_t ArgsLength() { return _args_length; }

  void* Data() { return _data; }

 protected:
  const JSVM_Value _this;
  const size_t _args_length;
  void* _data;
};

class CallbackWrapperBase : public CallbackWrapper {
 public:
  inline CallbackWrapperBase(const v8::FunctionCallbackInfo<v8::Value>& cbinfo,
                             const size_t args_length)
      : CallbackWrapper(
            JsValueFromV8LocalValue(cbinfo.This()), args_length, nullptr),
        _cbinfo(cbinfo) {
    _cb = (JSVM_Callback)cbinfo.Data().As<v8::External>()->Value();
    _data = _cb->data;
  }

 protected:
  inline void InvokeCallback() {
    JSVM_CallbackInfo cbinfo_wrapper = reinterpret_cast<JSVM_CallbackInfo>(
        static_cast<CallbackWrapper*>(this));

    // All other pointers we need are stored in `_bundle`
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto cb = _cb->callback;

    JSVM_Value result = nullptr;
    bool exceptionOccurred = false;
    env->CallIntoModule([&](JSVM_Env env) { result = cb(env, cbinfo_wrapper); },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });

    if (!exceptionOccurred && (result != nullptr)) {
      this->SetReturnValue(result);
    }
  }

  const v8::FunctionCallbackInfo<v8::Value>& _cbinfo;
  JSVM_Callback _cb;
};

class FunctionCallbackWrapper : public CallbackWrapperBase {
 public:
  static void Invoke(const v8::FunctionCallbackInfo<v8::Value>& info) {
    FunctionCallbackWrapper cbwrapper(info);
    cbwrapper.InvokeCallback();
  }

  static inline JSVM_Status NewFunction(JSVM_Env env,
                                        JSVM_Callback cb,
                                        v8::Local<v8::Function>* result) {
    v8::Local<v8::Value> cbdata = v8impl::CallbackBundle::New(env, cb);
    RETURN_STATUS_IF_FALSE(env, !cbdata.IsEmpty(), JSVM_GENERIC_FAILURE);

    v8::MaybeLocal<v8::Function> maybe_function =
        v8::Function::New(env->context(), Invoke, cbdata);
    CHECK_MAYBE_EMPTY(env, maybe_function, JSVM_GENERIC_FAILURE);

    *result = maybe_function.ToLocalChecked();
    return jsvm_clear_last_error(env);
  }

  static inline JSVM_Status NewTemplate(
      JSVM_Env env,
      JSVM_Callback cb,
      v8::Local<v8::FunctionTemplate>* result,
      v8::Local<v8::Signature> sig = v8::Local<v8::Signature>()) {
    v8::Local<v8::Value> cbdata = v8impl::CallbackBundle::New(env, cb);
    RETURN_STATUS_IF_FALSE(env, !cbdata.IsEmpty(), JSVM_GENERIC_FAILURE);

    *result = v8::FunctionTemplate::New(env->isolate, Invoke, cbdata, sig);
    return jsvm_clear_last_error(env);
  }

  explicit FunctionCallbackWrapper(
      const v8::FunctionCallbackInfo<v8::Value>& cbinfo)
      : CallbackWrapperBase(cbinfo, cbinfo.Length()) {}

  JSVM_Value GetNewTarget() override {
    if (_cbinfo.IsConstructCall()) {
      return v8impl::JsValueFromV8LocalValue(_cbinfo.NewTarget());
    } else {
      return nullptr;
    }
  }

  /*virtual*/
  void Args(JSVM_Value* buffer, size_t buffer_length) override {
    size_t i = 0;
    size_t min = std::min(buffer_length, _args_length);

    for (; i < min; i += 1) {
      buffer[i] = v8impl::JsValueFromV8LocalValue(_cbinfo[i]);
    }

    if (i < buffer_length) {
      JSVM_Value undefined =
          v8impl::JsValueFromV8LocalValue(v8::Undefined(_cbinfo.GetIsolate()));
      for (; i < buffer_length; i += 1) {
        buffer[i] = undefined;
      }
    }
  }

  /*virtual*/
  void SetReturnValue(JSVM_Value value) override {
    v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
    _cbinfo.GetReturnValue().Set(val);
  }
};

template <typename T>
class PropertyCallbackWrapperBase : public CallbackWrapper {
 public:
  inline PropertyCallbackWrapperBase(uint32_t index, v8::Local<v8::Name> property, v8::Local<v8::Value> value,
    const v8::PropertyCallbackInfo<T>& cbinfo, const size_t args_length)
      : CallbackWrapper(
            JsValueFromV8LocalValue(cbinfo.This()), args_length, nullptr),
        _cbinfo(cbinfo), _property(property), _value(value), _index(index) {
    _cb = (v8impl::JSVM_PropertyHandlerCfgStruct *)_cbinfo.Data().template As<v8::External>()->Value();
  }

 protected:
  inline void NameSetterInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto setterCb = _cb->namedSetterCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->namedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->namedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value name = JsValueFromV8LocalValue(_property);
    JSVM_Value value = JsValueFromV8LocalValue(_value);
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (setterCb) {
                            result = setterCb(env, name, value, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      this->SetReturnValue(result);
    }
  }

  inline void NameGetterInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto getterCb = _cb->namedGetterCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->namedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->namedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }
    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value name = JsValueFromV8LocalValue(_property);
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (getterCb) {
                            result = getterCb(env, name, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      this->SetReturnValue(result);
    }
  }

  inline void NameDeleterInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto deleterCb = _cb->nameDeleterCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->namedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->namedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value name = JsValueFromV8LocalValue(_property);
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (deleterCb) {
                            result = deleterCb(env, name, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      if (v8impl::V8LocalValueFromJsValue(result)->IsBoolean()) {
        this->SetReturnValue(result);
      }
    }
  }

  inline void NameEnumeratorInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto enumeratorCb = _cb->namedEnumeratorCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->namedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->namedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (enumeratorCb) {
                            result = enumeratorCb(env, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      if (v8impl::V8LocalValueFromJsValue(result)->IsArray()) {
        this->SetReturnValue(result);
      }
    }
  }

  inline void IndexSetterInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto indexSetterCb = _cb->indexedSetterCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->indexedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->indexedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value index = JsValueFromV8LocalValue(v8::Integer::NewFromUnsigned(env->isolate, _index));
    JSVM_Value value = JsValueFromV8LocalValue(_value);
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (indexSetterCb) {
                            result = indexSetterCb(env, index, value, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      this->SetReturnValue(result);
    }
  }

  inline void IndexGetterInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto indexGetterCb = _cb->indexedGetterCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->indexedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->indexedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    JSVM_Value result = nullptr;
    bool exceptionOccurred = false;
    JSVM_Value index = JsValueFromV8LocalValue(v8::Integer::NewFromUnsigned(env->isolate, _index));
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (indexGetterCb) {
                            result = indexGetterCb(env, index, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      this->SetReturnValue(result);
    }
  }

  inline void IndexDeleterInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto indexDeleterCb = _cb->indexedDeleterCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->indexedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->indexedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value index = JsValueFromV8LocalValue(v8::Integer::NewFromUnsigned(env->isolate, _index));
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (indexDeleterCb) {
                            result = indexDeleterCb(env, index, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      if (v8impl::V8LocalValueFromJsValue(result)->IsBoolean()) {
        this->SetReturnValue(result);
      }
    }
  }

  inline void IndexEnumeratorInvokeCallback() {
    auto context = _cbinfo.GetIsolate()->GetCurrentContext();
    auto env = v8impl::GetContextEnv(context);
    auto enumeratorCb = _cb->indexedEnumeratorCallback_;

    JSVM_Value innerData = nullptr;
    if (_cb->indexedPropertyData_ != nullptr) {
      v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(_cb->indexedPropertyData_);
      innerData = v8impl::JsValueFromV8LocalValue(reference->Get());
    }

    bool exceptionOccurred = false;
    JSVM_Value result = nullptr;
    JSVM_Value thisArg = this->This();
    env->CallIntoModule([&](JSVM_Env env) {
                          if (enumeratorCb) {
                            result = enumeratorCb(env, thisArg, innerData);
                          }
                        },
                        [&](JSVM_Env env, v8::Local<v8::Value> value) {
                          exceptionOccurred = true;
                          if (env->terminatedOrTerminating()) {
                            return;
                          }
                          env->isolate->ThrowException(value);
                        });
    if (!exceptionOccurred && (result != nullptr)) {
      if (v8impl::V8LocalValueFromJsValue(result)->IsArray()) {
        this->SetReturnValue(result);
      }
    }
  }

  const v8::PropertyCallbackInfo<T>& _cbinfo;
  JSVM_PropertyHandlerCfgStruct* _cb;
  v8::Local<v8::Name> _property;
  v8::Local<v8::Value> _value;
  uint32_t _index;
};

template <typename T>
class PropertyCallbackWrapper : public PropertyCallbackWrapperBase<T> {
 public:
  static void NameSetterInvoke(v8::Local<v8::Name> property, v8::Local<v8::Value> value,
    const v8::PropertyCallbackInfo<v8::Value>& info) {
    PropertyCallbackWrapper<v8::Value> propertyCbWrapper(property, value, info);
    propertyCbWrapper.NameSetterInvokeCallback();
  }

  static void NameGetterInvoke(v8::Local<v8::Name> property, const v8::PropertyCallbackInfo<v8::Value>& info) {
    PropertyCallbackWrapper<v8::Value> propertyCbWrapper(property, v8::Local<v8::Value>(), info);
    propertyCbWrapper.NameGetterInvokeCallback();
  }

  static void NameDeleterInvoke(v8::Local<v8::Name> property, const v8::PropertyCallbackInfo<v8::Boolean>& info) {
    PropertyCallbackWrapper<v8::Boolean> propertyCbWrapper(property, v8::Local<v8::Value>(), info);
    propertyCbWrapper.NameDeleterInvokeCallback();
  }

  static void NameEnumeratorInvoke(const v8::PropertyCallbackInfo<v8::Array>& info) {
    PropertyCallbackWrapper<v8::Array> propertyCbWrapper(v8::Local<v8::Name>(), v8::Local<v8::Value>(), info);
    propertyCbWrapper.NameEnumeratorInvokeCallback();
  }

  static void IndexSetterInvoke(uint32_t index, v8::Local<v8::Value> value,
    const v8::PropertyCallbackInfo<v8::Value>& info) {
    PropertyCallbackWrapper<v8::Value> propertyCbWrapper(index, value, info);
    propertyCbWrapper.IndexSetterInvokeCallback();
  }

  static void IndexGetterInvoke(uint32_t index, const v8::PropertyCallbackInfo<v8::Value>& info) {
    PropertyCallbackWrapper<v8::Value> propertyCbWrapper(index, v8::Local<v8::Value>(), info);
    propertyCbWrapper.IndexGetterInvokeCallback();
  }

  static void IndexDeleterInvoke(uint32_t index, const v8::PropertyCallbackInfo<v8::Boolean>& info) {
    PropertyCallbackWrapper<v8::Boolean> propertyCbWrapper(index, v8::Local<v8::Value>(), info);
    propertyCbWrapper.IndexDeleterInvokeCallback();
  }

  static void IndexEnumeratorInvoke(const v8::PropertyCallbackInfo<v8::Array>& info) {
    PropertyCallbackWrapper<v8::Array> propertyCbWrapper(0, v8::Local<v8::Value>(), info);
    propertyCbWrapper.IndexEnumeratorInvokeCallback();
  }

  explicit PropertyCallbackWrapper(v8::Local<v8::Name> name, v8::Local<v8::Value> value,
      const v8::PropertyCallbackInfo<T>& cbinfo)
      : PropertyCallbackWrapperBase<T>(0, name, value, cbinfo, 0), _cbInfo(cbinfo) {}

  explicit PropertyCallbackWrapper(uint32_t index, v8::Local<v8::Value> value,
      const v8::PropertyCallbackInfo<T>& cbinfo)
      : PropertyCallbackWrapperBase<T>(index, v8::Local<v8::Name>(), value, cbinfo, 0), _cbInfo(cbinfo) {}

  /*virtual*/
  void SetReturnValue(JSVM_Value value) override {
    v8::Local<T> val = v8impl::V8LocalValueFromJsValue(value).As<T>();
    _cbInfo.GetReturnValue().Set(val);
  }

protected:
  const v8::PropertyCallbackInfo<T>& _cbInfo;
};

inline JSVM_Status Wrap(JSVM_Env env,
                        JSVM_Value jsObject,
                        void* nativeObject,
                        JSVM_Finalize finalizeCb,
                        void* finalizeHint,
                        JSVM_Ref* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, jsObject);

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(jsObject);
  RETURN_STATUS_IF_FALSE(env, value->IsObject(), JSVM_INVALID_ARG);
  v8::Local<v8::Object> obj = value.As<v8::Object>();

  // If we've already wrapped this object, we error out.
  RETURN_STATUS_IF_FALSE(
      env,
      !obj->HasPrivate(context, JSVM_PRIVATE_KEY(env->isolate, wrapper)).FromJust(),
      JSVM_INVALID_ARG);

  v8impl::Reference* reference = nullptr;
  if (result != nullptr) {
    // The returned reference should be deleted via OH_JSVM_DeleteReference()
    // ONLY in response to the finalize callback invocation. (If it is deleted
    // before then, then the finalize callback will never be invoked.)
    // Therefore a finalize callback is required when returning a reference.
    CHECK_ARG(env, finalizeCb);
    reference = v8impl::Reference::New(env,
                                       obj,
                                       0,
                                       v8impl::Ownership::kUserland,
                                       finalizeCb,
                                       nativeObject,
                                       finalizeHint);
    *result = reinterpret_cast<JSVM_Ref>(reference);
  } else {
    // Create a self-deleting reference.
    reference = v8impl::Reference::New(
        env,
        obj,
        0,
        v8impl::Ownership::kRuntime,
        finalizeCb,
        nativeObject,
        finalizeCb == nullptr ? nullptr : finalizeHint);
  }

  CHECK(obj->SetPrivate(context,
                        JSVM_PRIVATE_KEY(env->isolate, wrapper),
                        v8::External::New(env->isolate, reference))
            .FromJust());

  return GET_RETURN_STATUS(env);
}

// In JavaScript, weak references can be created for object types (Object,
// Function, and external Object) and for local symbols that are created with
// the `Symbol` function call. Global symbols created with the `Symbol.for`
// method cannot be weak references because they are never collected.
//
// Currently, V8 has no API to detect if a symbol is local or global.
// Until we have a V8 API for it, we consider that all symbols can be weak.
// This matches the current Node-API behavior.
inline bool CanBeHeldWeakly(v8::Local<v8::Value> value) {
  return value->IsObject() || value->IsSymbol();
}

}  // end of anonymous namespace

void Finalizer::ResetFinalizer() {
  finalize_callback_ = nullptr;
  finalize_data_ = nullptr;
  finalize_hint_ = nullptr;
}

TrackedFinalizer::TrackedFinalizer(JSVM_Env env,
                                   JSVM_Finalize finalizeCallback,
                                   void* finalizeData,
                                   void* finalizeHint)
    : Finalizer(env, finalizeCallback, finalizeData, finalizeHint),
      RefTracker() {
  Link(finalizeCallback == nullptr ? &env->reflist : &env->finalizing_reflist);
}

TrackedFinalizer* TrackedFinalizer::New(JSVM_Env env,
                                        JSVM_Finalize finalizeCallback,
                                        void* finalizeData,
                                        void* finalizeHint) {
  return new TrackedFinalizer(
      env, finalizeCallback, finalizeData, finalizeHint);
}

// When a TrackedFinalizer is being deleted, it may have been queued to call its
// finalizer.
TrackedFinalizer::~TrackedFinalizer() {
  // Remove from the env's tracked list.
  Unlink();
  // Try to remove the finalizer from the scheduled second pass callback.
  env_->DequeueFinalizer(this);
}

void TrackedFinalizer::Finalize() {
  FinalizeCore(/*deleteMe:*/ true);
}

void TrackedFinalizer::FinalizeCore(bool deleteMe) {
  // Swap out the field finalize_callback so that it can not be accidentally
  // called more than once.
  JSVM_Finalize finalizeCallback = finalize_callback_;
  void* finalizeData = finalize_data_;
  void* finalizeHint = finalize_hint_;
  ResetFinalizer();

  // Either the RefBase is going to be deleted in the finalize_callback or not,
  // it should be removed from the tracked list.
  Unlink();
  // If the finalize_callback is present, it should either delete the
  // derived RefBase, or the RefBase ownership was set to Ownership::kRuntime
  // and the deleteMe parameter is true.
  if (finalizeCallback != nullptr) {
    env_->CallFinalizer(finalizeCallback, finalizeData, finalizeHint);
  }

  if (deleteMe) {
    delete this;
  }
}

// Wrapper around v8impl::Persistent that implements reference counting.
RefBase::RefBase(JSVM_Env env,
                 uint32_t initialRefcount,
                 Ownership ownership,
                 JSVM_Finalize finalizeCallback,
                 void* finalizeData,
                 void* finalizeHint)
    : TrackedFinalizer(env, finalizeCallback, finalizeData, finalizeHint),
      refcount_(initialRefcount),
      ownership_(ownership) {}

RefBase* RefBase::New(JSVM_Env env,
                      uint32_t initialRefcount,
                      Ownership ownership,
                      JSVM_Finalize finalizeCallback,
                      void* finalizeData,
                      void* finalizeHint) {
  return new RefBase(env,
                     initialRefcount,
                     ownership,
                     finalizeCallback,
                     finalizeData,
                     finalizeHint);
}

void* RefBase::Data() {
  return finalize_data_;
}

uint32_t RefBase::Ref() {
  return ++refcount_;
}

uint32_t RefBase::Unref() {
  if (refcount_ == 0) {
    return 0;
  }
  return --refcount_;
}

uint32_t RefBase::RefCount() {
  return refcount_;
}

void RefBase::Finalize() {
  // If the RefBase is not Ownership::kRuntime, userland code should delete it.
  // Delete it if it is Ownership::kRuntime.
  FinalizeCore(/*deleteMe:*/ ownership_ == Ownership::kRuntime);
}

template <typename... Args>
Reference::Reference(JSVM_Env env, v8::Local<v8::Value> value, Args&&... args)
    : RefBase(env, std::forward<Args>(args)...),
      persistent_(env->isolate, value),
      can_be_weak_(CanBeHeldWeakly(value)),
      deleted_by_user(false),
      wait_callback(false) {
  if (RefCount() == 0) {
    SetWeak();
  }
}

Reference::~Reference() {
  // Reset the handle. And no weak callback will be invoked.
  persistent_.Reset();
}

Reference* Reference::New(JSVM_Env env,
                          v8::Local<v8::Value> value,
                          uint32_t initialRefcount,
                          Ownership ownership,
                          JSVM_Finalize finalizeCallback,
                          void* finalizeData,
                          void* finalizeHint) {
  return new Reference(env,
                       value,
                       initialRefcount,
                       ownership,
                       finalizeCallback,
                       finalizeData,
                       finalizeHint);
}

uint32_t Reference::Ref() {
  // When the persistent_ is cleared in the WeakCallback, and a second pass
  // callback is pending, return 0 unconditionally.
  if (persistent_.IsEmpty()) {
    return 0;
  }
  uint32_t refcount = RefBase::Ref();
  if (refcount == 1 && can_be_weak_) {
    persistent_.ClearWeak();
    wait_callback = false;
  }
  return refcount;
}

uint32_t Reference::Unref() {
  // When the persistent_ is cleared in the WeakCallback, and a second pass
  // callback is pending, return 0 unconditionally.
  if (persistent_.IsEmpty()) {
    return 0;
  }
  uint32_t old_refcount = RefCount();
  uint32_t refcount = RefBase::Unref();
  if (old_refcount == 1 && refcount == 0) {
    SetWeak();
  }
  return refcount;
}

v8::Local<v8::Value> Reference::Get() {
  if (persistent_.IsEmpty()) {
    return v8::Local<v8::Value>();
  } else {
    return v8::Local<v8::Value>::New(env_->isolate, persistent_);
  }
}

void Reference::Delete() {
  assert(ownership() == Ownership::kUserland);
  if (!wait_callback) {
    delete this;
  } else {
    deleted_by_user = true;
  }
}

void Reference::Finalize() {
  // Unconditionally reset the persistent handle so that no weak callback will
  // be invoked again.
  persistent_.Reset();

  // Chain up to perform the rest of the finalization.
  RefBase::Finalize();
}

// Mark the reference as weak and eligible for collection
// by the gc.
void Reference::SetWeak() {
  if (can_be_weak_) {
    wait_callback = true;
    persistent_.SetWeak(this, WeakCallback, v8::WeakCallbackType::kParameter);
  } else {
    persistent_.Reset();
  }
}

// The N-API finalizer callback may make calls into the engine. V8's heap is
// not in a consistent state during the weak callback, and therefore it does
// not support calls back into it. Enqueue the invocation of the finalizer.
void Reference::WeakCallback(const v8::WeakCallbackInfo<Reference>& data) {
  Reference* reference = data.GetParameter();
  // The reference must be reset during the weak callback as the API protocol.
  reference->persistent_.Reset();
  assert(reference->wait_callback);

  // For owership == kRuntime, deleted_by_user is always false.
  // Due to reference may be free in InvokeFinalizerFromGC, the status of
  // reference should be set before finalize call.
  bool need_delete = reference->deleted_by_user;
  reference->wait_callback = false;
  reference->env_->InvokeFinalizerFromGC(reference);

  if (need_delete) {
    delete reference;
  }
}

}  // end of namespace v8impl

v8::Platform* JSVM_Env__::platform() {
  return v8impl::g_platform.get();
}

JSVM_Status JSVM_CDECL
OH_JSVM_Init(const JSVM_InitOptions* options) {
  static std::atomic<bool> initialized(false);
  if (initialized.load()) {
    return JSVM_GENERIC_FAILURE;
  }
  initialized.store(true);
#ifdef TARGET_OHOS
  v8impl::ResourceSchedule::ReportKeyThread(getuid(), getprocpid(), getproctid(),
    v8impl::ResourceSchedule::ResType::ThreadRole::IMPORTANT_DISPLAY);
#endif
  v8::V8::InitializePlatform(v8impl::g_platform.get());

//cjh  if (node::ReadSystemXpmState()) {
//    int secArgc = SECARGCNT;
//    char *secArgv[SECARGCNT] = {"jsvm", "--jitless"};
//    v8::V8::SetFlagsFromCommandLine(&secArgc, secArgv, false);
//  }

  if (options && options->argc && options->argv) {
    v8::V8::SetFlagsFromCommandLine(options->argc, options->argv, options->removeFlags);
  }
  v8::V8::Initialize();

  const auto cb = v8impl::FunctionCallbackWrapper::Invoke;
  v8impl::externalReferenceRegistry.push_back((intptr_t)cb);
  if (auto p = options ? options->externalReferences : nullptr) {
    for (; *p != 0; p++) {
      v8impl::externalReferenceRegistry.push_back(*p);
    }
  }
  v8impl::externalReferenceRegistry.push_back(0);
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL OH_JSVM_GetVM(JSVM_Env env,
              JSVM_VM* result) {
  *result = reinterpret_cast<JSVM_VM>(env->isolate);
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_CreateVM(const JSVM_CreateVMOptions* options, JSVM_VM* result) {
#ifdef TARGET_OHOS
  v8impl::ResourceSchedule::ReportKeyThread(getuid(), getprocpid(), getproctid(),
    v8impl::ResourceSchedule::ResType::ThreadRole::USER_INTERACT);
#endif
  v8::Isolate::CreateParams create_params;
  auto externalReferences = v8impl::externalReferenceRegistry.data();
  create_params.external_references = externalReferences;

  v8::StartupData* snapshotBlob = nullptr;
  if (options && options->snapshotBlobData) {
    snapshotBlob = new v8::StartupData();
    snapshotBlob->data = options->snapshotBlobData;
    snapshotBlob->raw_size = options->snapshotBlobSize;

    if (!snapshotBlob->IsValid()) {
      // TODO: Is VerifyCheckSum necessay if there has been a validity check?
      delete snapshotBlob;
      return JSVM_INVALID_ARG;
    }
    create_params.snapshot_blob =  snapshotBlob;
  }

  v8::Isolate* isolate;
  if (options && options->isForSnapshotting) {
    isolate = v8::Isolate::Allocate();
    auto creator = new v8::SnapshotCreator(isolate, externalReferences);
    v8impl::SetIsolateSnapshotCreator(isolate, creator);
  } else {
    create_params.array_buffer_allocator =
      v8impl::GetOrCreateDefaultArrayBufferAllocator();
    isolate = v8::Isolate::New(create_params);
  }
  v8impl::CreateIsolateData(isolate, snapshotBlob);
  *result = reinterpret_cast<JSVM_VM>(isolate);

  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_DestroyVM(JSVM_VM vm) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  auto creator = v8impl::GetIsolateSnapshotCreator(isolate);
  auto data = v8impl::GetIsolateData(isolate);

  if (creator != nullptr) {
    delete creator;
  } else {
    isolate->Dispose();
  }
  if (data != nullptr) {
      delete data;
  }

  return JSVM_OK;
}

JSVM_Status JSVM_CDECL OH_JSVM_OpenVMScope(JSVM_VM vm, JSVM_VMScope* result) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  auto scope = new v8::Isolate::Scope(isolate);
  *result = reinterpret_cast<JSVM_VMScope>(scope);
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_CloseVMScope(JSVM_VM vm, JSVM_VMScope scope) {
  auto v8scope = reinterpret_cast<v8::Isolate::Scope*>(scope);
  delete v8scope;
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_CreateEnv(JSVM_VM vm,
                size_t propertyCount,
                const JSVM_PropertyDescriptor* properties,
                JSVM_Env* result) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  auto env = new JSVM_Env__(isolate, NODE_API_DEFAULT_MODULE_API_VERSION);
  v8::HandleScope handle_scope(isolate);
  auto global_template = v8::ObjectTemplate::New(isolate);

  for (size_t i = 0; i < propertyCount; i++) {
    const JSVM_PropertyDescriptor* p = properties + i;

    if ((p->attributes & JSVM_STATIC) != 0) {
      //Ignore static properties.
      continue;
    }

    v8::Local<v8::Name> property_name =
      v8::String::NewFromUtf8(isolate, p->utf8name, v8::NewStringType::kInternalized)
      .ToLocalChecked();

    v8::PropertyAttribute attributes =
        v8impl::V8PropertyAttributesFromDescriptor(p);

    if (p->getter != nullptr || p->setter != nullptr) {
      v8::Local<v8::FunctionTemplate> getter_tpl;
      v8::Local<v8::FunctionTemplate> setter_tpl;
      if (p->getter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->getter, &getter_tpl));
      }
      if (p->setter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->setter, &setter_tpl));
      }

      global_template->SetAccessorProperty(
          property_name, getter_tpl, setter_tpl, attributes);
    } else if (p->method != nullptr) {
      v8::Local<v8::FunctionTemplate> method_tpl;
      STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
          env, p->method, &method_tpl));

      global_template->Set(property_name, method_tpl, attributes);
    } else {
      v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(p->value);
      global_template->Set(property_name, value, attributes);
    }
  }

  v8::Local<v8::Context> context = v8::Context::New(isolate, nullptr, global_template);
  env->context_persistent.Reset(isolate, context);
  v8impl::SetContextEnv(context, env);
  *result = env;
  return JSVM_OK;
}

JSVM_EXTERN JSVM_Status JSVM_CDECL
OH_JSVM_CreateEnvFromSnapshot(JSVM_VM vm, size_t index, JSVM_Env* result) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  v8::HandleScope handle_scope(isolate);
  auto maybe = v8::Context::FromSnapshot(isolate, index);

  if (maybe.IsEmpty()) {
    *result = nullptr;
    // TODO: return error message.
    return JSVM_GENERIC_FAILURE;
  }

  auto env = new JSVM_Env__(isolate, NODE_API_DEFAULT_MODULE_API_VERSION);
  auto context = maybe.ToLocalChecked();
  env->context_persistent.Reset(isolate, context);
  v8impl::SetContextEnv(context, env);
  *result = env;

  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_DestroyEnv(JSVM_Env env) {
  env->DeleteMe();
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
  OH_JSVM_OpenEnvScope(JSVM_Env env, JSVM_EnvScope* result) {
  auto v8scope = new v8::Context::Scope(env->context());
  *result = reinterpret_cast<JSVM_EnvScope>(v8scope);
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_CloseEnvScope(JSVM_Env env, JSVM_EnvScope scope) {
  auto v8scope = reinterpret_cast<v8::Context::Scope*>(scope);
  delete v8scope;
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_CompileScript(JSVM_Env env,
      JSVM_Value script,
      const uint8_t *cachedData,
      size_t cachedDataLength,
      bool eagerCompile,
      bool* cacheRejected,
      JSVM_Script* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, script);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> v8_script = v8impl::V8LocalValueFromJsValue(script);

  RETURN_STATUS_IF_FALSE(env, v8_script->IsString(), JSVM_STRING_EXPECTED);

  v8::Local<v8::Context> context = env->context();

  v8::ScriptCompiler::CachedData* cache = cachedData
    ? new v8::ScriptCompiler::CachedData(cachedData, cachedDataLength) : nullptr;
  v8::ScriptCompiler::Source scriptSource(v8_script.As<v8::String>(), cache);
  auto option = cache ? v8::ScriptCompiler::kConsumeCodeCache
    : (eagerCompile ? v8::ScriptCompiler::kEagerCompile : v8::ScriptCompiler::kNoCompileOptions);

  auto maybe_script = v8::ScriptCompiler::Compile(context, &scriptSource, option);

  if (cache && cacheRejected) {
    *cacheRejected = cache->rejected;
  }

  CHECK_MAYBE_EMPTY(env, maybe_script, JSVM_GENERIC_FAILURE);
  v8::Local<v8::Script> compiled_script = maybe_script.ToLocalChecked();
  *result = reinterpret_cast<JSVM_Script>(env->NewJsvmData(compiled_script));

  return GET_RETURN_STATUS(env);
}

v8::ScriptOrigin CreateScriptOrigin(
    v8::Isolate* isolate, v8::Local<v8::String> resource_name, v8::ScriptType type) {
  const int kOptionsLength = 2;
  const uint32_t kOptionsMagicConstant = 0xF1F2F3F0;
  auto options = v8::PrimitiveArray::New(isolate, kOptionsLength);
  options->Set(isolate, 0, v8::Uint32::New(isolate, kOptionsMagicConstant));
  options->Set(isolate, 1, resource_name);
  return v8::ScriptOrigin(isolate, resource_name, 0, 0, false, -1, v8::Local<v8::Value>(),
      false, false, type == v8::ScriptType::kModule, options);
}

v8::MaybeLocal<v8::Value> PrepareStackTraceCallback(
    v8::Local<v8::Context> context, v8::Local<v8::Value> error, v8::Local<v8::Array> trace) {
    return v8::Local<v8::Value>();
//cjh  auto *isolate = context->GetIsolate();
//  v8::TryCatch try_catch(isolate);
//  v8::Local<v8::String> moduleName =
//      v8::String::NewFromUtf8(isolate, "sourcemap").ToLocalChecked();
//  v8::Local<v8::String> moduleSourceString =
//      v8::String::NewFromUtf8(isolate, SourceMapRunner.c_str()).ToLocalChecked();
//
//  v8::ScriptOrigin moduleOrigin =
//      CreateScriptOrigin(isolate, moduleName, v8::ScriptType::kClassic);
//  v8::Local<v8::Context> moduleContext = v8::Context::New(isolate);
//  v8::ScriptCompiler::Source moduleSource(moduleSourceString, moduleOrigin);
//  auto script =
//      v8::Script::Compile(moduleContext, moduleSourceString, &moduleOrigin).ToLocalChecked();
//  auto result = script->Run(moduleContext).ToLocalChecked();
//  auto resultFunc = v8::Local<v8::Function>::Cast(result);
//
//  v8::Local<v8::Value> element = trace->Get(context, 0).ToLocalChecked();
//  std::string fileName = "";
//  if (element->IsObject()) {
//    auto obj = element->ToObject(context);
//    auto getFileName = v8::String::NewFromUtf8(isolate, "getFileName", v8::NewStringType::kNormal);
//    auto function = obj.ToLocalChecked()->Get(context, getFileName.ToLocalChecked()).ToLocalChecked();
//    auto lineNumberFunction = v8::Local<v8::Function>::Cast(function);
//    auto fileNameObj = lineNumberFunction->Call(context, obj.ToLocalChecked(), 0, {});
//    fileName = std::string(*v8::String::Utf8Value(isolate, fileNameObj.ToLocalChecked()));
//  }
//  auto &&sourceMapUrl = (!fileName.empty()) ? v8impl::GetSourceMapFromFileName(std::move(fileName)) : "";
//  std::ifstream sourceMapfile(sourceMapUrl);
//  std::string content = "";
//  if (sourceMapfile.good()) {
//    std::stringstream buffer;
//    buffer << sourceMapfile.rdbuf();
//    content = buffer.str();
//  }
//  auto sourceMapObject = v8::String::NewFromUtf8(
//      isolate, content.c_str(), v8::NewStringType::kNormal, content.length());
//  v8::Local<v8::Value> args[] = { error, trace, sourceMapObject.ToLocalChecked() };
//  return resultFunc->Call(moduleContext, v8::Undefined(isolate), node::arraysize(args), args);
}

JSVM_Status JSVM_CDECL
OH_JSVM_CompileScriptWithOrigin(JSVM_Env env,
                                JSVM_Value script,
                                const uint8_t* cachedData,
                                size_t cachedDataLength,
                                bool eagerCompile,
                                bool* cacheRejected,
                                JSVM_ScriptOrigin* origin,
                                JSVM_Script* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, script);
  CHECK_ARG(env, result);
  CHECK_NOT_NULL(origin->resourceName);

  v8::Local<v8::Value> v8_script = v8impl::V8LocalValueFromJsValue(script);

  RETURN_STATUS_IF_FALSE(env, v8_script->IsString(), JSVM_STRING_EXPECTED);

  v8::Local<v8::Context> context = env->context();
  auto *isolate = context->GetIsolate();

  if (origin->sourceMapUrl) {
    v8impl::SetFileToSourceMapMapping(origin->resourceName, origin->sourceMapUrl);
    isolate->SetPrepareStackTraceCallback(PrepareStackTraceCallback);
  }
  auto sourceMapUrl = !origin->sourceMapUrl ? v8::Local<v8::Value>() :
    v8::String::NewFromUtf8(isolate, origin->sourceMapUrl).ToLocalChecked().As<v8::Value>();
  auto resourceName =
    v8::String::NewFromUtf8(isolate, origin->resourceName).ToLocalChecked();
  v8::ScriptOrigin scriptOrigin(isolate, resourceName,
    origin->resourceLineOffset, origin->resourceColumnOffset, false, -1, sourceMapUrl);

  v8::ScriptCompiler::CachedData* cache = cachedData
    ? new v8::ScriptCompiler::CachedData(cachedData, cachedDataLength) : nullptr;
  v8::ScriptCompiler::Source scriptSource(v8_script.As<v8::String>(), scriptOrigin, cache);
  auto option = cache ? v8::ScriptCompiler::kConsumeCodeCache
    : (eagerCompile ? v8::ScriptCompiler::kEagerCompile : v8::ScriptCompiler::kNoCompileOptions);

  auto maybe_script = v8::ScriptCompiler::Compile(context, &scriptSource, option);

  if (cache && cacheRejected) {
    *cacheRejected = cache->rejected;
  }

  CHECK_MAYBE_EMPTY(env, maybe_script, JSVM_GENERIC_FAILURE);
  v8::Local<v8::Script> compiled_script = maybe_script.ToLocalChecked();
  *result = reinterpret_cast<JSVM_Script>(env->NewJsvmData(compiled_script));

  return GET_RETURN_STATUS(env);
}

class CompileOptionResolver {
 public:
  CompileOptionResolver(size_t length, JSVM_CompileOptions options[], v8::Isolate *isolate) {
    for (size_t i = 0; i < length; i++) {
      switch(options[i].id) {
        case JSVM_COMPILE_MODE: {
          v8Option = static_cast<v8::ScriptCompiler::CompileOptions>(options[i].content.num);
          break;
        }
        case JSVM_COMPILE_CODE_CACHE: {
          auto cache = static_cast<JSVM_CodeCache*>(options[i].content.ptr);
          cachedData = cache->cache ?
            new v8::ScriptCompiler::CachedData(cache->cache, cache->length) : nullptr;
          break;
        }
        case JSVM_COMPILE_SCRIPT_ORIGIN: {
          jsvmOrigin = static_cast<JSVM_ScriptOrigin*>(options[i].content.ptr);
          break;
        }
        case JSVM_COMPILE_COMPILE_PROFILE: {
          profile = static_cast<JSVM_CompileProfile*>(options[i].content.ptr);
          break;
        }
        case JSVM_COMPILE_ENABLE_SOURCE_MAP: {
          enableSourceMap = options[i].content.boolean;
          break;
        }
        default: {
          continue;
        }
      }
    }
    auto sourceString = jsvmOrigin ? jsvmOrigin->resourceName :
      "script_" + std::to_string(compileCount++);
    auto sourceMapPtr = jsvmOrigin && jsvmOrigin->sourceMapUrl ?
      jsvmOrigin->sourceMapUrl : nullptr;
    auto sourceMapUrl = (jsvmOrigin && jsvmOrigin->sourceMapUrl) ?
      v8::String::NewFromUtf8(isolate, jsvmOrigin->sourceMapUrl).ToLocalChecked().As<v8::Value>() :
      v8::Local<v8::Value>();
    auto resourceName = v8::String::NewFromUtf8(isolate, sourceString.c_str()).ToLocalChecked();
    v8Origin = new v8::ScriptOrigin(isolate, resourceName,
      jsvmOrigin ? jsvmOrigin->resourceLineOffset : 0,
      jsvmOrigin ? jsvmOrigin->resourceColumnOffset : 0,
      false, -1, sourceMapUrl);
    if (enableSourceMap && sourceMapPtr) {
      v8impl::SetFileToSourceMapMapping(jsvmOrigin->resourceName, sourceMapPtr);
      isolate->SetPrepareStackTraceCallback(PrepareStackTraceCallback);
    }
    if (v8Option == v8::ScriptCompiler::kConsumeCodeCache && !cachedData) {
      hasInvalidOption = true;
    }
  }

  ~CompileOptionResolver() {
    delete v8Origin;
    v8Origin = nullptr;
  }

  v8::ScriptCompiler::CompileOptions v8Option =
    v8::ScriptCompiler::kNoCompileOptions;
  v8::ScriptCompiler::CachedData *cachedData = nullptr;
  v8::ScriptOrigin *v8Origin = nullptr;
  JSVM_CompileProfile *profile = nullptr;
  JSVM_ScriptOrigin *jsvmOrigin = nullptr;
  bool enableSourceMap = false;
  static size_t compileCount;
  bool hasInvalidOption = false;
};

size_t CompileOptionResolver::compileCount = 0;

JSVM_Status JSVM_CDECL
OH_JSVM_CompileScriptWithOptions(JSVM_Env env,
                                 JSVM_Value script,
                                 size_t optionCount,
                                 JSVM_CompileOptions options[],
                                 JSVM_Script* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, script);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  auto *isolate = context->GetIsolate();
  CompileOptionResolver optionResolver(optionCount, options, isolate);
  RETURN_STATUS_IF_FALSE(env, !optionResolver.hasInvalidOption, JSVM_INVALID_ARG);

  v8::Local<v8::Value> v8_script = v8impl::V8LocalValueFromJsValue(script);

  RETURN_STATUS_IF_FALSE(env, v8_script->IsString(), JSVM_STRING_EXPECTED);

  v8::ScriptCompiler::Source scriptSource(v8_script.As<v8::String>(),
    *optionResolver.v8Origin, optionResolver.cachedData);
  auto maybe_script = v8::ScriptCompiler::Compile(context, &scriptSource, optionResolver.v8Option);

  CHECK_MAYBE_EMPTY(env, maybe_script, JSVM_GENERIC_FAILURE);
  v8::Local<v8::Script> compiled_script = maybe_script.ToLocalChecked();
  *result = reinterpret_cast<JSVM_Script>(env->NewJsvmData(compiled_script));

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_CreateCodeCache(JSVM_Env env,
                       JSVM_Script script,
                       const uint8_t** data,
                       size_t* length) {
  auto jsvmData = reinterpret_cast<JSVM_Data__*>(script);
  auto v8script = jsvmData->ToV8Local<v8::Script>(env->isolate);
  v8::ScriptCompiler::CachedData* cache;
  cache = v8::ScriptCompiler::CreateCodeCache(v8script->GetUnboundScript());

  if (cache == nullptr) {
    // TODO: return error
    return jsvm_set_last_error(env, JSVM_GENERIC_FAILURE);
  }

  *data = cache->data;
  *length = cache->length;
  cache->buffer_policy = v8::ScriptCompiler::CachedData::BufferNotOwned;
  delete cache;
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL
OH_JSVM_RunScript(JSVM_Env env, JSVM_Script script, JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, script);
  CHECK_ARG(env, result);

  auto jsvmData = reinterpret_cast<JSVM_Data__*>(script);
  auto v8script = jsvmData->ToV8Local<v8::Script>(env->isolate);
  auto script_result = v8script->Run(env->context());
  CHECK_MAYBE_EMPTY(env, script_result, JSVM_GENERIC_FAILURE);
  *result = v8impl::JsValueFromV8LocalValue(script_result.ToLocalChecked());

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_JsonParse(JSVM_Env env, JSVM_Value json_string, JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, json_string);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(json_string);
  RETURN_STATUS_IF_FALSE(env, val->IsString(), JSVM_STRING_EXPECTED);

  auto maybe = v8::JSON::Parse(env->context(), val.As<v8::String>());
  CHECK_MAYBE_EMPTY(env, maybe,JSVM_GENERIC_FAILURE);
  *result = v8impl::JsValueFromV8LocalValue(maybe.ToLocalChecked());

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_JsonStringify(JSVM_Env env, JSVM_Value json_object, JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, json_object);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(json_object);

  auto maybe = v8::JSON::Stringify(env->context(), val);
  CHECK_MAYBE_EMPTY(env, maybe,JSVM_GENERIC_FAILURE);
  *result = v8impl::JsValueFromV8LocalValue(maybe.ToLocalChecked());

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_CreateSnapshot(JSVM_VM vm,
        size_t contextCount,
        const JSVM_Env* contexts,
        const char** blobData,
        size_t* blobSize) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  auto creator = v8impl::GetIsolateSnapshotCreator(isolate);

  if (creator == nullptr) {
    // TODO: return specific error message.
    return JSVM_GENERIC_FAILURE;
  }
  {
    v8::HandleScope scope(isolate);
    v8::Local<v8::Context> default_context = v8::Context::New(isolate);
    creator->SetDefaultContext(default_context);
    // NOTE: The order of the added data must be consistent with the order of
    // getting data in v8impl::CreateIsolateData.
    creator->AddData(JSVM_PRIVATE_KEY(isolate, wrapper));
    creator->AddData(JSVM_PRIVATE_KEY(isolate, type_tag));

    for (size_t i = 0; i < contextCount; i++) {
      auto ctx = contexts[i]->context();
      creator->AddData(ctx, ctx);
      creator->AddContext(ctx);
    }
  }
  auto blob = creator->CreateBlob(v8::SnapshotCreator::FunctionCodeHandling::kKeep);
  *blobData = blob.data;
  *blobSize = blob.raw_size;

  return JSVM_OK;
}

JSVM_EXTERN JSVM_Status JSVM_CDECL OH_JSVM_GetVMInfo(JSVM_VMInfo* result) {
  result->apiVersion = 1;
  result->engine = "v8";
  result->version = V8_VERSION_STRING;
  result->cachedDataVersionTag = v8::ScriptCompiler::CachedDataVersionTag();
  return JSVM_OK;
}

JSVM_EXTERN JSVM_Status JSVM_CDECL
OH_JSVM_MemoryPressureNotification(JSVM_Env env,
                                  JSVM_MemoryPressureLevel level) {
  CHECK_ENV(env);
  env->isolate->MemoryPressureNotification(v8::MemoryPressureLevel(level));
  return jsvm_clear_last_error(env);
}

JSVM_EXTERN JSVM_Status JSVM_CDECL
OH_JSVM_GetHeapStatistics(JSVM_VM vm, JSVM_HeapStatistics* result) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  v8::HeapStatistics stats;
  isolate->GetHeapStatistics(&stats);
  result->totalHeapSize = stats.total_heap_size();
  result->totalHeapSizeExecutable = stats.total_heap_size_executable();
  result->totalPhysicalSize = stats.total_physical_size();
  result->totalAvailableSize = stats.total_available_size();
  result->usedHeapSize = stats.used_heap_size();
  result->heapSizeLimit = stats.heap_size_limit();
  result->mallocedMemory = stats.malloced_memory();
  result->externalMemory = stats.external_memory();
  result->peakMallocedMemory = stats.peak_malloced_memory();
  result->numberOfNativeContexts = stats.number_of_native_contexts();
  result->numberOfDetachedContexts = stats.number_of_detached_contexts();
  result->totalGlobalHandlesSize = stats.total_global_handles_size();
  result->usedGlobalHandlesSize = stats.used_global_handles_size();
  return JSVM_OK;
}

//cjh JSVM_EXTERN JSVM_Status JSVM_CDECL
//OH_JSVM_StartCpuProfiler(JSVM_VM vm, JSVM_CpuProfiler* result) {
//  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
//  auto profiler = v8::CpuProfiler::New(isolate);
//  v8::HandleScope scope(isolate);
//  v8::CpuProfilingOptions options;
//  profiler->Start(v8::String::Empty(isolate), std::move(options));
//  *result = reinterpret_cast<JSVM_CpuProfiler>(profiler);
//  return JSVM_OK;
//}
//
//JSVM_EXTERN JSVM_Status JSVM_CDECL
//OH_JSVM_StopCpuProfiler(JSVM_VM vm, JSVM_CpuProfiler profiler,
//                        JSVM_OutputStream stream, void* streamData) {
//  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
//  auto v8profiler = reinterpret_cast<v8::CpuProfiler*>(profiler);
//  v8::HandleScope scope(isolate);
//  auto profile = v8profiler->StopProfiling(v8::String::Empty(isolate));
//  v8impl::OutputStream os(stream, streamData);
//  profile->Serialize(&os);
//  return JSVM_OK;
//}
//
//JSVM_EXTERN JSVM_Status JSVM_CDECL
//OH_JSVM_TakeHeapSnapshot(JSVM_VM vm,
//                         JSVM_OutputStream stream, void* streamData) {
//  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
//  auto profiler = isolate->GetHeapProfiler();
//  auto snapshot = profiler->TakeHeapSnapshot();
//  v8impl::OutputStream os(stream, streamData);
//  snapshot->Serialize(&os);
//  return JSVM_OK;
//}
//
//JSVM_EXTERN JSVM_Status JSVM_CDECL
//OH_JSVM_OpenInspector(JSVM_Env env, const char* host, uint16_t port) {
//  JSVM_PREAMBLE(env);
//
//  std::string inspectorPath;
//  std::string hostName(host);
//  auto hostPort =
//      std::make_shared<node::ExclusiveAccess<node::HostPort>>(hostName, port);
//  env->inspector_agent()->Start(inspectorPath, hostPort, true, false);
//
//  return GET_RETURN_STATUS(env);
//}
//
//JSVM_EXTERN JSVM_Status JSVM_CDECL OH_JSVM_CloseInspector(JSVM_Env env) {
//  JSVM_PREAMBLE(env);
//  auto agent = env->inspector_agent();
//  if (!agent->IsActive()) {
//    return JSVM_GENERIC_FAILURE;
//  }
//  agent->Stop();
//  return GET_RETURN_STATUS(env);
//}
//
//JSVM_EXTERN JSVM_Status JSVM_CDECL OH_JSVM_WaitForDebugger(JSVM_Env env, bool breakNextLine) {
//  JSVM_PREAMBLE(env);
//  auto agent = env->inspector_agent();
//  if (!agent->IsActive()) {
//    return JSVM_GENERIC_FAILURE;
//  }
//
//  agent->WaitForConnect();
//  if (breakNextLine) {
//    agent->PauseOnNextJavascriptStatement("Break on debugger attached");
//  }
//
//  return GET_RETURN_STATUS(env);
//}

JSVM_EXTERN JSVM_Status JSVM_CDECL OH_JSVM_PumpMessageLoop(JSVM_VM vm, bool* result) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  *result = v8::platform::PumpMessageLoop(v8impl::g_platform.get(), isolate);
  return JSVM_OK;
}

JSVM_EXTERN JSVM_Status JSVM_CDECL OH_JSVM_PerformMicrotaskCheckpoint(JSVM_VM vm) {
  auto isolate = reinterpret_cast<v8::Isolate*>(vm);
  isolate->PerformMicrotaskCheckpoint();
  return JSVM_OK;
}

// Warning: Keep in-sync with JSVM_Status enum
static const char* error_messages[] = {
    nullptr,
    "Invalid argument",
    "An object was expected",
    "A string was expected",
    "A string or symbol was expected",
    "A function was expected",
    "A number was expected",
    "A boolean was expected",
    "An array was expected",
    "Unknown failure",
    "An exception is pending",
    "The async work item was cancelled",
    "OH_JSVM_EscapeHandle already called on scope",
    "Invalid handle scope usage",
    "Invalid callback scope usage",
    "Thread-safe function queue is full",
    "Thread-safe function handle is closing",
    "A bigint was expected",
    "A date was expected",
    "An arraybuffer was expected",
    "A detachable arraybuffer was expected",
    "Main thread would deadlock",
    "External buffers are not allowed",
    "Cannot run JavaScript",
};

JSVM_Status JSVM_CDECL OH_JSVM_GetLastErrorInfo(
    JSVM_Env env, const JSVM_ExtendedErrorInfo** result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  // The value of the constant below must be updated to reference the last
  // message in the `JSVM_Status` enum each time a new error message is added.
  // We don't have a jsvm_status_last as this would result in an ABI
  // change each time a message was added.
  const int last_status = JSVM_CANNOT_RUN_JS;

  static_assert(JSVM_ARRAYSIZE(error_messages) == last_status + 1,
                "Count of error messages must match count of error values");
  CHECK_LE(env->last_error.errorCode, last_status);
  // Wait until someone requests the last error information to fetch the error
  // message string
  env->last_error.errorMessage = error_messages[env->last_error.errorCode];

  if (env->last_error.errorCode == JSVM_OK) {
    jsvm_clear_last_error(env);
  }
  *result = &(env->last_error);
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateFunction(JSVM_Env env,
                                            const char* utf8name,
                                            size_t length,
                                            JSVM_Callback cb,
                                            JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);
  CHECK_ARG(env, cb);

  v8::Local<v8::Function> return_value;
  v8::EscapableHandleScope scope(env->isolate);
  v8::Local<v8::Function> fn;
  STATUS_CALL(v8impl::FunctionCallbackWrapper::NewFunction(
      env, cb, &fn));
  return_value = scope.Escape(fn);

  if (utf8name != nullptr) {
    v8::Local<v8::String> name_string;
    CHECK_NEW_FROM_UTF8_LEN(env, name_string, utf8name, length);
    return_value->SetName(name_string);
  }

  *result = v8impl::JsValueFromV8LocalValue(return_value);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateFunctionWithScript(JSVM_Env env,
                                                        const char* funcName,
                                                        size_t length,
                                                        size_t argc,
                                                        const JSVM_Value* argv,
                                                        JSVM_Value script,
                                                        JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, script);
  CHECK_ARG(env, result);
  if (argc > 0) {
    CHECK_ARG(env, argv);
    for (auto i = 0; i < argc; i++) {
      RETURN_STATUS_IF_FALSE(env, v8impl::V8LocalValueFromJsValue(argv[i])->IsString(),
          JSVM_STRING_EXPECTED);
    }
  }

  v8::Local<v8::Value> v8_script = v8impl::V8LocalValueFromJsValue(script);

  RETURN_STATUS_IF_FALSE(env, v8_script->IsString(), JSVM_STRING_EXPECTED);

  v8::ScriptCompiler::Source scriptSource(v8_script.As<v8::String>());

  v8::Local<v8::Context> context = env->context();

  v8::MaybeLocal<v8::Function> maybe_fun =
    v8::ScriptCompiler::CompileFunction(context, &scriptSource, argc,
    reinterpret_cast<v8::Local<v8::String>*>(const_cast<JSVM_Value*>(argv)));

  CHECK_MAYBE_EMPTY(env, maybe_fun, JSVM_GENERIC_FAILURE);

  v8::Local<v8::Function> func = maybe_fun.ToLocalChecked();

  if (funcName != nullptr) {
    v8::Local<v8::String> funcNameString;
    CHECK_NEW_FROM_UTF8_LEN(env, funcNameString, funcName, length);
    func->SetName(funcNameString);
  }

  *result =
    v8impl::JsValueFromV8LocalValue(func);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_DefineClass(JSVM_Env env,
                  const char* utf8name,
                  size_t length,
                  JSVM_Callback constructor,
                  size_t propertyCount,
                  const JSVM_PropertyDescriptor* properties,
                  JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);
  CHECK_ARG(env, constructor);

  if (propertyCount > 0) {
    CHECK_ARG(env, properties);
  }

  v8::Isolate* isolate = env->isolate;

  v8::EscapableHandleScope scope(isolate);
  v8::Local<v8::FunctionTemplate> tpl;
  STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
      env, constructor, &tpl));

  v8::Local<v8::String> name_string;
  CHECK_NEW_FROM_UTF8_LEN(env, name_string, utf8name, length);
  tpl->SetClassName(name_string);

  size_t static_property_count = 0;
  for (size_t i = 0; i < propertyCount; i++) {
    const JSVM_PropertyDescriptor* p = properties + i;

    if ((p->attributes & JSVM_STATIC) != 0) {
      // Static properties are handled separately below.
      static_property_count++;
      continue;
    }

    v8::Local<v8::Name> property_name;
    STATUS_CALL(v8impl::V8NameFromPropertyDescriptor(env, p, &property_name));

    v8::PropertyAttribute attributes =
        v8impl::V8PropertyAttributesFromDescriptor(p);

    // This code is similar to that in OH_JSVM_DefineProperties(); the
    // difference is it applies to a template instead of an object,
    // and preferred PropertyAttribute for lack of PropertyDescriptor
    // support on ObjectTemplate.
    if (p->getter != nullptr || p->setter != nullptr) {
      v8::Local<v8::FunctionTemplate> getter_tpl;
      v8::Local<v8::FunctionTemplate> setter_tpl;
      if (p->getter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->getter, &getter_tpl));
      }
      if (p->setter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->setter, &setter_tpl));
      }

      tpl->PrototypeTemplate()->SetAccessorProperty(property_name,
                                                    getter_tpl,
                                                    setter_tpl,
                                                    attributes,
                                                    v8::AccessControl::DEFAULT);
    } else if (p->method != nullptr) {
      v8::Local<v8::FunctionTemplate> t;
      if (p->attributes & JSVM_NO_RECEIVER_CHECK) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->method, &t));
      } else {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->method, &t, v8::Signature::New(isolate, tpl)));
      }

      tpl->PrototypeTemplate()->Set(property_name, t, attributes);
    } else {
      v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(p->value);
      tpl->PrototypeTemplate()->Set(property_name, value, attributes);
    }
  }

  v8::Local<v8::Context> context = env->context();
  *result = v8impl::JsValueFromV8LocalValue(
      scope.Escape(tpl->GetFunction(context).ToLocalChecked()));

  if (static_property_count > 0) {
    std::vector<JSVM_PropertyDescriptor> static_descriptors;
    static_descriptors.reserve(static_property_count);

    for (size_t i = 0; i < propertyCount; i++) {
      const JSVM_PropertyDescriptor* p = properties + i;
      if ((p->attributes & JSVM_STATIC) != 0) {
        static_descriptors.push_back(*p);
      }
    }

    STATUS_CALL(OH_JSVM_DefineProperties(
        env, *result, static_descriptors.size(), static_descriptors.data()));
  }

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetPropertyNames(JSVM_Env env,
                                               JSVM_Value object,
                                               JSVM_Value* result) {
  return OH_JSVM_GetAllPropertyNames(
      env,
      object,
      JSVM_KEY_INCLUDE_PROTOTYPES,
      static_cast<JSVM_KeyFilter>(JSVM_KEY_ENUMERABLE | JSVM_KEY_SKIP_SYMBOLS),
      JSVM_KEY_NUMBERS_TO_STRINGS,
      result);
}

JSVM_Status JSVM_CDECL
OH_JSVM_GetAllPropertyNames(JSVM_Env env,
                            JSVM_Value object,
                            JSVM_KeyCollectionMode keyMode,
                            JSVM_KeyFilter keyFilter,
                            JSVM_KeyConversion keyConversion,
                            JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT(env, context, obj, object);

  v8::PropertyFilter filter = v8::PropertyFilter::ALL_PROPERTIES;
  if (keyFilter & JSVM_KEY_WRITABLE) {
    filter = static_cast<v8::PropertyFilter>(filter |
                                             v8::PropertyFilter::ONLY_WRITABLE);
  }
  if (keyFilter & JSVM_KEY_ENUMERABLE) {
    filter = static_cast<v8::PropertyFilter>(
        filter | v8::PropertyFilter::ONLY_ENUMERABLE);
  }
  if (keyFilter & JSVM_KEY_CONFIGURABLE) {
    filter = static_cast<v8::PropertyFilter>(
        filter | v8::PropertyFilter::ONLY_CONFIGURABLE);
  }
  if (keyFilter & JSVM_KEY_SKIP_STRINGS) {
    filter = static_cast<v8::PropertyFilter>(filter |
                                             v8::PropertyFilter::SKIP_STRINGS);
  }
  if (keyFilter & JSVM_KEY_SKIP_SYMBOLS) {
    filter = static_cast<v8::PropertyFilter>(filter |
                                             v8::PropertyFilter::SKIP_SYMBOLS);
  }
  v8::KeyCollectionMode collection_mode;
  v8::KeyConversionMode conversion_mode;

  switch (keyMode) {
    case JSVM_KEY_INCLUDE_PROTOTYPES:
      collection_mode = v8::KeyCollectionMode::kIncludePrototypes;
      break;
    case JSVM_KEY_OWN_ONLY:
      collection_mode = v8::KeyCollectionMode::kOwnOnly;
      break;
    default:
      return jsvm_set_last_error(env, JSVM_INVALID_ARG);
  }

  switch (keyConversion) {
    case JSVM_KEY_KEEP_NUMBERS:
      conversion_mode = v8::KeyConversionMode::kKeepNumbers;
      break;
    case JSVM_KEY_NUMBERS_TO_STRINGS:
      conversion_mode = v8::KeyConversionMode::kConvertToString;
      break;
    default:
      return jsvm_set_last_error(env, JSVM_INVALID_ARG);
  }

  v8::MaybeLocal<v8::Array> maybe_all_propertynames =
      obj->GetPropertyNames(context,
                            collection_mode,
                            filter,
                            v8::IndexFilter::kIncludeIndices,
                            conversion_mode);

  CHECK_MAYBE_EMPTY_WITH_PREAMBLE(
      env, maybe_all_propertynames, JSVM_GENERIC_FAILURE);

  *result =
      v8impl::JsValueFromV8LocalValue(maybe_all_propertynames.ToLocalChecked());
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_SetProperty(JSVM_Env env,
                                         JSVM_Value object,
                                         JSVM_Value key,
                                         JSVM_Value value) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, key);
  CHECK_ARG(env, value);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Value> k = v8impl::V8LocalValueFromJsValue(key);
  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  v8::Maybe<bool> set_maybe = obj->Set(context, k, val);

  RETURN_STATUS_IF_FALSE(env, set_maybe.FromMaybe(false), JSVM_GENERIC_FAILURE);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_HasProperty(JSVM_Env env,
                                         JSVM_Value object,
                                         JSVM_Value key,
                                         bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);
  CHECK_ARG(env, key);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Value> k = v8impl::V8LocalValueFromJsValue(key);
  v8::Maybe<bool> has_maybe = obj->Has(context, k);

  CHECK_MAYBE_NOTHING(env, has_maybe, JSVM_GENERIC_FAILURE);

  *result = has_maybe.FromMaybe(false);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetProperty(JSVM_Env env,
                                         JSVM_Value object,
                                         JSVM_Value key,
                                         JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, key);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Value> k = v8impl::V8LocalValueFromJsValue(key);
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  auto get_maybe = obj->Get(context, k);

  CHECK_MAYBE_EMPTY(env, get_maybe, JSVM_GENERIC_FAILURE);

  v8::Local<v8::Value> val = get_maybe.ToLocalChecked();
  *result = v8impl::JsValueFromV8LocalValue(val);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_DeleteProperty(JSVM_Env env,
                                            JSVM_Value object,
                                            JSVM_Value key,
                                            bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, key);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Value> k = v8impl::V8LocalValueFromJsValue(key);
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);
  v8::Maybe<bool> delete_maybe = obj->Delete(context, k);
  CHECK_MAYBE_NOTHING(env, delete_maybe, JSVM_GENERIC_FAILURE);

  if (result != nullptr) *result = delete_maybe.FromMaybe(false);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_HasOwnProperty(JSVM_Env env,
                                             JSVM_Value object,
                                             JSVM_Value key,
                                             bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, key);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);
  v8::Local<v8::Value> k = v8impl::V8LocalValueFromJsValue(key);
  RETURN_STATUS_IF_FALSE(env, k->IsName(), JSVM_NAME_EXPECTED);
  v8::Maybe<bool> has_maybe = obj->HasOwnProperty(context, k.As<v8::Name>());
  CHECK_MAYBE_NOTHING(env, has_maybe, JSVM_GENERIC_FAILURE);
  *result = has_maybe.FromMaybe(false);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_SetNamedProperty(JSVM_Env env,
                                               JSVM_Value object,
                                               const char* utf8name,
                                               JSVM_Value value) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, value);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Name> key;
  CHECK_NEW_FROM_UTF8(env, key, utf8name);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  v8::Maybe<bool> set_maybe = obj->Set(context, key, val);

  RETURN_STATUS_IF_FALSE(env, set_maybe.FromMaybe(false), JSVM_GENERIC_FAILURE);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_HasNamedProperty(JSVM_Env env,
                                               JSVM_Value object,
                                               const char* utf8name,
                                               bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Name> key;
  CHECK_NEW_FROM_UTF8(env, key, utf8name);

  v8::Maybe<bool> has_maybe = obj->Has(context, key);

  CHECK_MAYBE_NOTHING(env, has_maybe, JSVM_GENERIC_FAILURE);

  *result = has_maybe.FromMaybe(false);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetNamedProperty(JSVM_Env env,
                                               JSVM_Value object,
                                               const char* utf8name,
                                               JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Name> key;
  CHECK_NEW_FROM_UTF8(env, key, utf8name);

  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  auto get_maybe = obj->Get(context, key);

  CHECK_MAYBE_EMPTY(env, get_maybe, JSVM_GENERIC_FAILURE);

  v8::Local<v8::Value> val = get_maybe.ToLocalChecked();
  *result = v8impl::JsValueFromV8LocalValue(val);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_SetElement(JSVM_Env env,
                                        JSVM_Value object,
                                        uint32_t index,
                                        JSVM_Value value) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, value);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  auto set_maybe = obj->Set(context, index, val);

  RETURN_STATUS_IF_FALSE(env, set_maybe.FromMaybe(false), JSVM_GENERIC_FAILURE);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_HasElement(JSVM_Env env,
                                        JSVM_Value object,
                                        uint32_t index,
                                        bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Maybe<bool> has_maybe = obj->Has(context, index);

  CHECK_MAYBE_NOTHING(env, has_maybe, JSVM_GENERIC_FAILURE);

  *result = has_maybe.FromMaybe(false);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetElement(JSVM_Env env,
                                        JSVM_Value object,
                                        uint32_t index,
                                        JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  auto get_maybe = obj->Get(context, index);

  CHECK_MAYBE_EMPTY(env, get_maybe, JSVM_GENERIC_FAILURE);

  *result = v8impl::JsValueFromV8LocalValue(get_maybe.ToLocalChecked());
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_DeleteElement(JSVM_Env env,
                                           JSVM_Value object,
                                           uint32_t index,
                                           bool* result) {
  JSVM_PREAMBLE(env);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);
  v8::Maybe<bool> delete_maybe = obj->Delete(context, index);
  CHECK_MAYBE_NOTHING(env, delete_maybe, JSVM_GENERIC_FAILURE);

  if (result != nullptr) *result = delete_maybe.FromMaybe(false);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_DefineProperties(JSVM_Env env,
                       JSVM_Value object,
                       size_t propertyCount,
                       const JSVM_PropertyDescriptor* properties) {
  JSVM_PREAMBLE(env);
  if (propertyCount > 0) {
    CHECK_ARG(env, properties);
  }

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT(env, context, obj, object);

  for (size_t i = 0; i < propertyCount; i++) {
    const JSVM_PropertyDescriptor* p = &properties[i];

    v8::Local<v8::Name> property_name;
    STATUS_CALL(v8impl::V8NameFromPropertyDescriptor(env, p, &property_name));

    if (p->getter != nullptr || p->setter != nullptr) {
      v8::Local<v8::Function> local_getter;
      v8::Local<v8::Function> local_setter;

      if (p->getter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewFunction(
            env, p->getter, &local_getter));
      }
      if (p->setter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewFunction(
            env, p->setter, &local_setter));
      }

      v8::PropertyDescriptor descriptor(local_getter, local_setter);
      descriptor.set_enumerable((p->attributes & JSVM_ENUMERABLE) != 0);
      descriptor.set_configurable((p->attributes & JSVM_CONFIGURABLE) != 0);

      auto define_maybe =
          obj->DefineProperty(context, property_name, descriptor);

      if (!define_maybe.FromMaybe(false)) {
        return jsvm_set_last_error(env, JSVM_INVALID_ARG);
      }
    } else if (p->method != nullptr) {
      v8::Local<v8::Function> method;
      STATUS_CALL(v8impl::FunctionCallbackWrapper::NewFunction(
          env, p->method, &method));
      v8::PropertyDescriptor descriptor(method,
                                        (p->attributes & JSVM_WRITABLE) != 0);
      descriptor.set_enumerable((p->attributes & JSVM_ENUMERABLE) != 0);
      descriptor.set_configurable((p->attributes & JSVM_CONFIGURABLE) != 0);

      auto define_maybe =
          obj->DefineProperty(context, property_name, descriptor);

      if (!define_maybe.FromMaybe(false)) {
        return jsvm_set_last_error(env, JSVM_GENERIC_FAILURE);
      }
    } else {
      v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(p->value);
      bool defined_successfully = false;

      if ((p->attributes & JSVM_ENUMERABLE) &&
          (p->attributes & JSVM_WRITABLE) &&
          (p->attributes & JSVM_CONFIGURABLE)) {
        // Use a fast path for this type of data property.
        auto define_maybe =
            obj->CreateDataProperty(context, property_name, value);
        defined_successfully = define_maybe.FromMaybe(false);
      } else {
        v8::PropertyDescriptor descriptor(value,
                                          (p->attributes & JSVM_WRITABLE) != 0);
        descriptor.set_enumerable((p->attributes & JSVM_ENUMERABLE) != 0);
        descriptor.set_configurable((p->attributes & JSVM_CONFIGURABLE) != 0);

        auto define_maybe =
            obj->DefineProperty(context, property_name, descriptor);
        defined_successfully = define_maybe.FromMaybe(false);
      }

      if (!defined_successfully) {
        return jsvm_set_last_error(env, JSVM_INVALID_ARG);
      }
    }
  }

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ObjectFreeze(JSVM_Env env, JSVM_Value object) {
  JSVM_PREAMBLE(env);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Maybe<bool> set_frozen =
      obj->SetIntegrityLevel(context, v8::IntegrityLevel::kFrozen);

  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE(
      env, set_frozen.FromMaybe(false), JSVM_GENERIC_FAILURE);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ObjectSeal(JSVM_Env env, JSVM_Value object) {
  JSVM_PREAMBLE(env);

  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;

  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Maybe<bool> set_sealed =
      obj->SetIntegrityLevel(context, v8::IntegrityLevel::kSealed);

  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE(
      env, set_sealed.FromMaybe(false), JSVM_GENERIC_FAILURE);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsArray(JSVM_Env env,
                                     JSVM_Value value,
                                     bool* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  *result = val->IsArray();
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsRegExp(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  *result = val->IsRegExp();
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetArrayLength(JSVM_Env env,
                                             JSVM_Value value,
                                             uint32_t* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsArray(), JSVM_ARRAY_EXPECTED);

  v8::Local<v8::Array> arr = val.As<v8::Array>();
  *result = arr->Length();

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_StrictEquals(JSVM_Env env,
                                          JSVM_Value lhs,
                                          JSVM_Value rhs,
                                          bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, lhs);
  CHECK_ARG(env, rhs);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> a = v8impl::V8LocalValueFromJsValue(lhs);
  v8::Local<v8::Value> b = v8impl::V8LocalValueFromJsValue(rhs);

  *result = a->StrictEquals(b);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_Equals(JSVM_Env env,
                                      JSVM_Value lhs,
                                      JSVM_Value rhs,
                                      bool* result)
{
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, lhs);
  CHECK_ARG(env, rhs);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> a = v8impl::V8LocalValueFromJsValue(lhs);
  v8::Local<v8::Value> b = v8impl::V8LocalValueFromJsValue(rhs);
  v8::Local<v8::Context> context = env->context();

  *result = a->Equals(context, b).FromJust();
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetPrototype(JSVM_Env env,
                                          JSVM_Value object,
                                          JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Value> val = obj->GetPrototype();
  *result = v8impl::JsValueFromV8LocalValue(val);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateObject(JSVM_Env env, JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(v8::Object::New(env->isolate));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateArray(JSVM_Env env, JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(v8::Array::New(env->isolate));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateArrayWithLength(JSVM_Env env,
                                                     size_t length,
                                                     JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result =
      v8impl::JsValueFromV8LocalValue(v8::Array::New(env->isolate, length));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateStringLatin1(JSVM_Env env,
                                                 const char* str,
                                                 size_t length,
                                                 JSVM_Value* result) {
  return v8impl::NewString(env, str, length, result, [&](v8::Isolate* isolate) {
    return v8::String::NewFromOneByte(isolate,
                                      reinterpret_cast<const uint8_t*>(str),
                                      v8::NewStringType::kNormal,
                                      length);
  });
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateStringUtf8(JSVM_Env env,
                                               const char* str,
                                               size_t length,
                                               JSVM_Value* result) {
  return v8impl::NewString(env, str, length, result, [&](v8::Isolate* isolate) {
    return v8::String::NewFromUtf8(
        isolate, str, v8::NewStringType::kNormal, static_cast<int>(length));
  });
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateStringUtf16(JSVM_Env env,
                                                const char16_t* str,
                                                size_t length,
                                                JSVM_Value* result) {
  return v8impl::NewString(env, str, length, result, [&](v8::Isolate* isolate) {
    return v8::String::NewFromTwoByte(isolate,
                                      reinterpret_cast<const uint16_t*>(str),
                                      v8::NewStringType::kNormal,
                                      length);
  });
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateDouble(JSVM_Env env,
                                          double value,
                                          JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result =
      v8impl::JsValueFromV8LocalValue(v8::Number::New(env->isolate, value));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateInt32(JSVM_Env env,
                                         int32_t value,
                                         JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result =
      v8impl::JsValueFromV8LocalValue(v8::Integer::New(env->isolate, value));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateUint32(JSVM_Env env,
                                          uint32_t value,
                                          JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(
      v8::Integer::NewFromUnsigned(env->isolate, value));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateInt64(JSVM_Env env,
                                         int64_t value,
                                         JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(
      v8::Number::New(env->isolate, static_cast<double>(value)));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateBigintInt64(JSVM_Env env,
                                                int64_t value,
                                                JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result =
      v8impl::JsValueFromV8LocalValue(v8::BigInt::New(env->isolate, value));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateBigintUint64(JSVM_Env env,
                                                 uint64_t value,
                                                 JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(
      v8::BigInt::NewFromUnsigned(env->isolate, value));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateBigintWords(JSVM_Env env,
                                                int signBit,
                                                size_t wordCount,
                                                const uint64_t* words,
                                                JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, words);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();

  RETURN_STATUS_IF_FALSE(env, wordCount <= INT_MAX, JSVM_INVALID_ARG);

  v8::MaybeLocal<v8::BigInt> b =
      v8::BigInt::NewFromWords(context, signBit, wordCount, words);

  CHECK_MAYBE_EMPTY_WITH_PREAMBLE(env, b, JSVM_GENERIC_FAILURE);

  *result = v8impl::JsValueFromV8LocalValue(b.ToLocalChecked());
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetBoolean(JSVM_Env env,
                                        bool value,
                                        JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  v8::Isolate* isolate = env->isolate;

  if (value) {
    *result = v8impl::JsValueFromV8LocalValue(v8::True(isolate));
  } else {
    *result = v8impl::JsValueFromV8LocalValue(v8::False(isolate));
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateSymbol(JSVM_Env env,
                                          JSVM_Value description,
                                          JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  v8::Isolate* isolate = env->isolate;

  if (description == nullptr) {
    *result = v8impl::JsValueFromV8LocalValue(v8::Symbol::New(isolate));
  } else {
    v8::Local<v8::Value> desc = v8impl::V8LocalValueFromJsValue(description);
    RETURN_STATUS_IF_FALSE(env, desc->IsString(), JSVM_STRING_EXPECTED);

    *result = v8impl::JsValueFromV8LocalValue(
        v8::Symbol::New(isolate, desc.As<v8::String>()));
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_SymbolFor(JSVM_Env env,
                                           const char* utf8description,
                                           size_t length,
                                           JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  JSVM_Value js_description_string;
  STATUS_CALL(OH_JSVM_CreateStringUtf8(
      env, utf8description, length, &js_description_string));
  v8::Local<v8::String> description_string =
      v8impl::V8LocalValueFromJsValue(js_description_string).As<v8::String>();

  *result = v8impl::JsValueFromV8LocalValue(
      v8::Symbol::For(env->isolate, description_string));

  return jsvm_clear_last_error(env);
}

static inline JSVM_Status set_error_code(JSVM_Env env,
                                         v8::Local<v8::Value> error,
                                         JSVM_Value code,
                                         const char* code_cstring) {
  if ((code != nullptr) || (code_cstring != nullptr)) {
    v8::Local<v8::Context> context = env->context();
    v8::Local<v8::Object> err_object = error.As<v8::Object>();

    v8::Local<v8::Value> code_value = v8impl::V8LocalValueFromJsValue(code);
    if (code != nullptr) {
      code_value = v8impl::V8LocalValueFromJsValue(code);
      RETURN_STATUS_IF_FALSE(env, code_value->IsString(), JSVM_STRING_EXPECTED);
    } else {
      CHECK_NEW_FROM_UTF8(env, code_value, code_cstring);
    }

    v8::Local<v8::Name> code_key;
    CHECK_NEW_FROM_UTF8(env, code_key, "code");

    v8::Maybe<bool> set_maybe = err_object->Set(context, code_key, code_value);
    RETURN_STATUS_IF_FALSE(
        env, set_maybe.FromMaybe(false), JSVM_GENERIC_FAILURE);
  }
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateError(JSVM_Env env,
                                         JSVM_Value code,
                                         JSVM_Value msg,
                                         JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, msg);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> message_value = v8impl::V8LocalValueFromJsValue(msg);
  RETURN_STATUS_IF_FALSE(env, message_value->IsString(), JSVM_STRING_EXPECTED);

  v8::Local<v8::Value> error_obj =
      v8::Exception::Error(message_value.As<v8::String>());
  STATUS_CALL(set_error_code(env, error_obj, code, nullptr));

  *result = v8impl::JsValueFromV8LocalValue(error_obj);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateTypeError(JSVM_Env env,
                                              JSVM_Value code,
                                              JSVM_Value msg,
                                              JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, msg);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> message_value = v8impl::V8LocalValueFromJsValue(msg);
  RETURN_STATUS_IF_FALSE(env, message_value->IsString(), JSVM_STRING_EXPECTED);

  v8::Local<v8::Value> error_obj =
      v8::Exception::TypeError(message_value.As<v8::String>());
  STATUS_CALL(set_error_code(env, error_obj, code, nullptr));

  *result = v8impl::JsValueFromV8LocalValue(error_obj);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateRangeError(JSVM_Env env,
                                               JSVM_Value code,
                                               JSVM_Value msg,
                                               JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, msg);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> message_value = v8impl::V8LocalValueFromJsValue(msg);
  RETURN_STATUS_IF_FALSE(env, message_value->IsString(), JSVM_STRING_EXPECTED);

  v8::Local<v8::Value> error_obj =
      v8::Exception::RangeError(message_value.As<v8::String>());
  STATUS_CALL(set_error_code(env, error_obj, code, nullptr));

  *result = v8impl::JsValueFromV8LocalValue(error_obj);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateSyntaxError(JSVM_Env env,
                                                    JSVM_Value code,
                                                    JSVM_Value msg,
                                                    JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, msg);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> message_value = v8impl::V8LocalValueFromJsValue(msg);
  RETURN_STATUS_IF_FALSE(env, message_value->IsString(), JSVM_STRING_EXPECTED);

  v8::Local<v8::Value> error_obj =
      v8::Exception::SyntaxError(message_value.As<v8::String>());
  STATUS_CALL(set_error_code(env, error_obj, code, nullptr));

  *result = v8impl::JsValueFromV8LocalValue(error_obj);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_Typeof(JSVM_Env env,
                                   JSVM_Value value,
                                   JSVM_ValueType* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> v = v8impl::V8LocalValueFromJsValue(value);

  if (v->IsNumber()) {
    *result = JSVM_NUMBER;
  } else if (v->IsBigInt()) {
    *result = JSVM_BIGINT;
  } else if (v->IsString()) {
    *result = JSVM_STRING;
  } else if (v->IsFunction()) {
    // This test has to come before IsObject because IsFunction
    // implies IsObject
    *result = JSVM_FUNCTION;
  } else if (v->IsExternal()) {
    // This test has to come before IsObject because IsExternal
    // implies IsObject
    *result = JSVM_EXTERNAL;
  } else if (v->IsObject()) {
    *result = JSVM_OBJECT;
  } else if (v->IsBoolean()) {
    *result = JSVM_BOOLEAN;
  } else if (v->IsUndefined()) {
    *result = JSVM_UNDEFINED;
  } else if (v->IsSymbol()) {
    *result = JSVM_SYMBOL;
  } else if (v->IsNull()) {
    *result = JSVM_NULL;
  } else {
    // Should not get here unless V8 has added some new kind of value.
    return jsvm_set_last_error(env, JSVM_INVALID_ARG);
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetUndefined(JSVM_Env env, JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(v8::Undefined(env->isolate));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetNull(JSVM_Env env, JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(v8::Null(env->isolate));

  return jsvm_clear_last_error(env);
}

// Gets all callback info in a single call. (Ugly, but faster.)
JSVM_Status JSVM_CDECL OH_JSVM_GetCbInfo(
    JSVM_Env env,               // [in] JSVM environment handle
    JSVM_CallbackInfo cbinfo,  // [in] Opaque callback-info handle
    size_t* argc,      // [in-out] Specifies the size of the provided argv array
                       // and receives the actual count of args.
    JSVM_Value* argv,  // [out] Array of values
    JSVM_Value* thisArg,  // [out] Receives the JS 'this' arg for the call
    void** data) {         // [out] Receives the data pointer for the callback.
  CHECK_ENV(env);
  CHECK_ARG(env, cbinfo);

  v8impl::CallbackWrapper* info =
      reinterpret_cast<v8impl::CallbackWrapper*>(cbinfo);

  if (argv != nullptr) {
    CHECK_ARG(env, argc);
    info->Args(argv, *argc);
  }
  if (argc != nullptr) {
    *argc = info->ArgsLength();
  }
  if (thisArg != nullptr) {
    *thisArg = info->This();
  }
  if (data != nullptr) {
    *data = info->Data();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetNewTarget(JSVM_Env env,
                                           JSVM_CallbackInfo cbinfo,
                                           JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, cbinfo);
  CHECK_ARG(env, result);

  v8impl::CallbackWrapper* info =
      reinterpret_cast<v8impl::CallbackWrapper*>(cbinfo);

  *result = info->GetNewTarget();
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CallFunction(JSVM_Env env,
                                          JSVM_Value recv,
                                          JSVM_Value func,
                                          size_t argc,
                                          const JSVM_Value* argv,
                                          JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, recv);
  if (argc > 0) {
    CHECK_ARG(env, argv);
  }

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Value> v8recv = v8impl::V8LocalValueFromJsValue(recv);

  v8::Local<v8::Function> v8func;
  CHECK_TO_FUNCTION(env, v8func, func);

  auto maybe = v8func->Call(
      context,
      v8recv,
      argc,
      reinterpret_cast<v8::Local<v8::Value>*>(const_cast<JSVM_Value*>(argv)));

  if (try_catch.HasCaught()) {
    return jsvm_set_last_error(env, JSVM_PENDING_EXCEPTION);
  } else {
    if (result != nullptr) {
      CHECK_MAYBE_EMPTY(env, maybe, JSVM_GENERIC_FAILURE);
      *result = v8impl::JsValueFromV8LocalValue(maybe.ToLocalChecked());
    }
    return jsvm_clear_last_error(env);
  }
}

JSVM_Status JSVM_CDECL OH_JSVM_GetGlobal(JSVM_Env env, JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(env->context()->Global());

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_Throw(JSVM_Env env, JSVM_Value error) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, error);

  v8::Isolate* isolate = env->isolate;

  isolate->ThrowException(v8impl::V8LocalValueFromJsValue(error));
  // any VM calls after this point and before returning
  // to the javascript invoker will fail
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ThrowError(JSVM_Env env,
                                        const char* code,
                                        const char* msg) {
  JSVM_PREAMBLE(env);

  v8::Isolate* isolate = env->isolate;
  v8::Local<v8::String> str;
  CHECK_NEW_FROM_UTF8(env, str, msg);

  v8::Local<v8::Value> error_obj = v8::Exception::Error(str);
  STATUS_CALL(set_error_code(env, error_obj, nullptr, code));

  isolate->ThrowException(error_obj);
  // any VM calls after this point and before returning
  // to the javascript invoker will fail
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ThrowTypeError(JSVM_Env env,
                                             const char* code,
                                             const char* msg) {
  JSVM_PREAMBLE(env);

  v8::Isolate* isolate = env->isolate;
  v8::Local<v8::String> str;
  CHECK_NEW_FROM_UTF8(env, str, msg);

  v8::Local<v8::Value> error_obj = v8::Exception::TypeError(str);
  STATUS_CALL(set_error_code(env, error_obj, nullptr, code));

  isolate->ThrowException(error_obj);
  // any VM calls after this point and before returning
  // to the javascript invoker will fail
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ThrowRangeError(JSVM_Env env,
                                              const char* code,
                                              const char* msg) {
  JSVM_PREAMBLE(env);

  v8::Isolate* isolate = env->isolate;
  v8::Local<v8::String> str;
  CHECK_NEW_FROM_UTF8(env, str, msg);

  v8::Local<v8::Value> error_obj = v8::Exception::RangeError(str);
  STATUS_CALL(set_error_code(env, error_obj, nullptr, code));

  isolate->ThrowException(error_obj);
  // any VM calls after this point and before returning
  // to the javascript invoker will fail
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ThrowSyntaxError(JSVM_Env env,
                                                   const char* code,
                                                   const char* msg) {
  JSVM_PREAMBLE(env);

  v8::Isolate* isolate = env->isolate;
  v8::Local<v8::String> str;
  CHECK_NEW_FROM_UTF8(env, str, msg);

  v8::Local<v8::Value> error_obj = v8::Exception::SyntaxError(str);
  STATUS_CALL(set_error_code(env, error_obj, nullptr, code));

  isolate->ThrowException(error_obj);
  // any VM calls after this point and before returning
  // to the javascript invoker will fail
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsError(JSVM_Env env,
                                     JSVM_Value value,
                                     bool* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot
  // throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *result = val->IsNativeError();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueDouble(JSVM_Env env,
                                             JSVM_Value value,
                                             double* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsNumber(), JSVM_NUMBER_EXPECTED);

  *result = val.As<v8::Number>()->Value();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueInt32(JSVM_Env env,
                                            JSVM_Value value,
                                            int32_t* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  if (val->IsInt32()) {
    *result = val.As<v8::Int32>()->Value();
  } else {
    RETURN_STATUS_IF_FALSE(env, val->IsNumber(), JSVM_NUMBER_EXPECTED);

    // Empty context: https://github.com/nodejs/node/issues/14379
    v8::Local<v8::Context> context;
    *result = val->Int32Value(context).FromJust();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueUint32(JSVM_Env env,
                                             JSVM_Value value,
                                             uint32_t* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  if (val->IsUint32()) {
    *result = val.As<v8::Uint32>()->Value();
  } else {
    RETURN_STATUS_IF_FALSE(env, val->IsNumber(), JSVM_NUMBER_EXPECTED);

    // Empty context: https://github.com/nodejs/node/issues/14379
    v8::Local<v8::Context> context;
    *result = val->Uint32Value(context).FromJust();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueInt64(JSVM_Env env,
                                            JSVM_Value value,
                                            int64_t* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  // This is still a fast path very likely to be taken.
  if (val->IsInt32()) {
    *result = val.As<v8::Int32>()->Value();
    return jsvm_clear_last_error(env);
  }

  RETURN_STATUS_IF_FALSE(env, val->IsNumber(), JSVM_NUMBER_EXPECTED);

  // v8::Value::IntegerValue() converts NaN, +Inf, and -Inf to INT64_MIN,
  // inconsistent with v8::Value::Int32Value() which converts those values to 0.
  // Special-case all non-finite values to match that behavior.
  double doubleValue = val.As<v8::Number>()->Value();
  if (std::isfinite(doubleValue)) {
    // Empty context: https://github.com/nodejs/node/issues/14379
    v8::Local<v8::Context> context;
    *result = val->IntegerValue(context).FromJust();
  } else {
    *result = 0;
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueBigintInt64(JSVM_Env env,
                                                   JSVM_Value value,
                                                   int64_t* result,
                                                   bool* lossless) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);
  CHECK_ARG(env, lossless);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  RETURN_STATUS_IF_FALSE(env, val->IsBigInt(), JSVM_BIGINT_EXPECTED);

  *result = val.As<v8::BigInt>()->Int64Value(lossless);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueBigintUint64(JSVM_Env env,
                                                    JSVM_Value value,
                                                    uint64_t* result,
                                                    bool* lossless) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);
  CHECK_ARG(env, lossless);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  RETURN_STATUS_IF_FALSE(env, val->IsBigInt(), JSVM_BIGINT_EXPECTED);

  *result = val.As<v8::BigInt>()->Uint64Value(lossless);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueBigintWords(JSVM_Env env,
                                                   JSVM_Value value,
                                                   int* signBit,
                                                   size_t* wordCount,
                                                   uint64_t* words) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, wordCount);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  RETURN_STATUS_IF_FALSE(env, val->IsBigInt(), JSVM_BIGINT_EXPECTED);

  v8::Local<v8::BigInt> big = val.As<v8::BigInt>();

  int word_count_int = *wordCount;

  if (signBit == nullptr && words == nullptr) {
    word_count_int = big->WordCount();
  } else {
    CHECK_ARG(env, signBit);
    CHECK_ARG(env, words);
    big->ToWordsArray(signBit, &word_count_int, words);
  }

  *wordCount = word_count_int;

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueBool(JSVM_Env env,
                                           JSVM_Value value,
                                           bool* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsBoolean(), JSVM_BOOLEAN_EXPECTED);

  *result = val.As<v8::Boolean>()->Value();

  return jsvm_clear_last_error(env);
}

// Copies a JavaScript string into a LATIN-1 string buffer. The result is the
// number of bytes (excluding the null terminator) copied into buf.
// A sufficient buffer size should be greater than the length of string,
// reserving space for null terminator.
// If bufsize is insufficient, the string will be truncated and null terminated.
// If buf is NULL, this method returns the length of the string (in bytes)
// via the result parameter.
// The result argument is optional unless buf is NULL.
JSVM_Status JSVM_CDECL OH_JSVM_GetValueStringLatin1(
    JSVM_Env env, JSVM_Value value, char* buf, size_t bufsize, size_t* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsString(), JSVM_STRING_EXPECTED);

  if (!buf) {
    CHECK_ARG(env, result);
    *result = val.As<v8::String>()->Length();
  } else if (bufsize != 0) {
    int copied =
        val.As<v8::String>()->WriteOneByte(env->isolate,
                                           reinterpret_cast<uint8_t*>(buf),
                                           0,
                                           bufsize - 1,
                                           v8::String::NO_NULL_TERMINATION);

    buf[copied] = '\0';
    if (result != nullptr) {
      *result = copied;
    }
  } else if (result != nullptr) {
    *result = 0;
  }

  return jsvm_clear_last_error(env);
}

// Copies a JavaScript string into a UTF-8 string buffer. The result is the
// number of bytes (excluding the null terminator) copied into buf.
// A sufficient buffer size should be greater than the length of string,
// reserving space for null terminator.
// If bufsize is insufficient, the string will be truncated and null terminated.
// If buf is NULL, this method returns the length of the string (in bytes)
// via the result parameter.
// The result argument is optional unless buf is NULL.
JSVM_Status JSVM_CDECL OH_JSVM_GetValueStringUtf8(
    JSVM_Env env, JSVM_Value value, char* buf, size_t bufsize, size_t* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsString(), JSVM_STRING_EXPECTED);

  if (!buf) {
    CHECK_ARG(env, result);
    *result = val.As<v8::String>()->Utf8Length(env->isolate);
  } else if (bufsize != 0) {
    int copied = val.As<v8::String>()->WriteUtf8(
        env->isolate,
        buf,
        bufsize - 1,
        nullptr,
        v8::String::REPLACE_INVALID_UTF8 | v8::String::NO_NULL_TERMINATION);

    buf[copied] = '\0';
    if (result != nullptr) {
      *result = copied;
    }
  } else if (result != nullptr) {
    *result = 0;
  }

  return jsvm_clear_last_error(env);
}

// Copies a JavaScript string into a UTF-16 string buffer. The result is the
// number of 2-byte code units (excluding the null terminator) copied into buf.
// A sufficient buffer size should be greater than the length of string,
// reserving space for null terminator.
// If bufsize is insufficient, the string will be truncated and null terminated.
// If buf is NULL, this method returns the length of the string (in 2-byte
// code units) via the result parameter.
// The result argument is optional unless buf is NULL.
JSVM_Status JSVM_CDECL OH_JSVM_GetValueStringUtf16(JSVM_Env env,
                                                   JSVM_Value value,
                                                   char16_t* buf,
                                                   size_t bufsize,
                                                   size_t* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsString(), JSVM_STRING_EXPECTED);

  if (!buf) {
    CHECK_ARG(env, result);
    // V8 assumes UTF-16 length is the same as the number of characters.
    *result = val.As<v8::String>()->Length();
  } else if (bufsize != 0) {
    int copied = val.As<v8::String>()->Write(env->isolate,
                                             reinterpret_cast<uint16_t*>(buf),
                                             0,
                                             bufsize - 1,
                                             v8::String::NO_NULL_TERMINATION);

    buf[copied] = '\0';
    if (result != nullptr) {
      *result = copied;
    }
  } else if (result != nullptr) {
    *result = 0;
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CoerceToBool(JSVM_Env env,
                                           JSVM_Value value,
                                           JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Isolate* isolate = env->isolate;
  v8::Local<v8::Boolean> b =
      v8impl::V8LocalValueFromJsValue(value)->ToBoolean(isolate);
  *result = v8impl::JsValueFromV8LocalValue(b);
  return GET_RETURN_STATUS(env);
}

#define GEN_COERCE_FUNCTION(UpperCaseName, MixedCaseName, LowerCaseName)       \
  JSVM_Status JSVM_CDECL OH_JSVM_CoerceTo##MixedCaseName(                       \
      JSVM_Env env, JSVM_Value value, JSVM_Value* result) {                    \
    JSVM_PREAMBLE(env);                                                        \
    CHECK_ARG(env, value);                                                     \
    CHECK_ARG(env, result);                                                    \
                                                                               \
    v8::Local<v8::Context> context = env->context();                           \
    v8::Local<v8::MixedCaseName> str;                                          \
                                                                               \
    CHECK_TO_##UpperCaseName(env, context, str, value);                        \
                                                                               \
    *result = v8impl::JsValueFromV8LocalValue(str);                            \
    return GET_RETURN_STATUS(env);                                             \
  }

GEN_COERCE_FUNCTION(NUMBER, Number, number)
GEN_COERCE_FUNCTION(OBJECT, Object, object)
GEN_COERCE_FUNCTION(STRING, String, string)
GEN_COERCE_FUNCTION(BIGINT, BigInt, bigint)

#undef GEN_COERCE_FUNCTION

JSVM_Status JSVM_CDECL OH_JSVM_Wrap(JSVM_Env env,
                                 JSVM_Value jsObject,
                                 void* nativeObject,
                                 JSVM_Finalize finalizeCb,
                                 void* finalizeHint,
                                 JSVM_Ref* result) {
  return v8impl::Wrap(
      env, jsObject, nativeObject, finalizeCb, finalizeHint, result);
}

JSVM_Status JSVM_CDECL OH_JSVM_Unwrap(JSVM_Env env,
                                   JSVM_Value obj,
                                   void** result) {
  return v8impl::Unwrap(env, obj, result, v8impl::KeepWrap);
}

JSVM_Status JSVM_CDECL OH_JSVM_RemoveWrap(JSVM_Env env,
                                        JSVM_Value obj,
                                        void** result) {
  return v8impl::Unwrap(env, obj, result, v8impl::RemoveWrap);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateExternal(JSVM_Env env,
                                            void* data,
                                            JSVM_Finalize finalizeCb,
                                            void* finalizeHint,
                                            JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Isolate* isolate = env->isolate;

  v8::Local<v8::Value> external_value = v8::External::New(isolate, data);

  if (finalizeCb) {
    // The Reference object will delete itself after invoking the finalizer
    // callback.
    v8impl::Reference::New(env,
                           external_value,
                           0,
                           v8impl::Ownership::kRuntime,
                           finalizeCb,
                           data,
                           finalizeHint);
  }

  *result = v8impl::JsValueFromV8LocalValue(external_value);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_TypeTagObject(JSVM_Env env,
                                            JSVM_Value object,
                                            const JSVM_TypeTag* typeTag) {
  JSVM_PREAMBLE(env);
  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT_WITH_PREAMBLE(env, context, obj, object);
  CHECK_ARG_WITH_PREAMBLE(env, typeTag);

  auto key = JSVM_PRIVATE_KEY(env->isolate, type_tag);
  auto maybe_has = obj->HasPrivate(context, key);
  CHECK_MAYBE_NOTHING_WITH_PREAMBLE(env, maybe_has, JSVM_GENERIC_FAILURE);
  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE(
      env, !maybe_has.FromJust(), JSVM_INVALID_ARG);

  auto tag = v8::BigInt::NewFromWords(
      context, 0, 2, reinterpret_cast<const uint64_t*>(typeTag));
  CHECK_MAYBE_EMPTY_WITH_PREAMBLE(env, tag, JSVM_GENERIC_FAILURE);

  auto maybe_set = obj->SetPrivate(context, key, tag.ToLocalChecked());
  CHECK_MAYBE_NOTHING_WITH_PREAMBLE(env, maybe_set, JSVM_GENERIC_FAILURE);
  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE(
      env, maybe_set.FromJust(), JSVM_GENERIC_FAILURE);

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CheckObjectTypeTag(JSVM_Env env,
                                                  JSVM_Value object,
                                                  const JSVM_TypeTag* typeTag,
                                                  bool* result) {
  JSVM_PREAMBLE(env);
  v8::Local<v8::Context> context = env->context();
  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT_WITH_PREAMBLE(env, context, obj, object);
  CHECK_ARG_WITH_PREAMBLE(env, typeTag);
  CHECK_ARG_WITH_PREAMBLE(env, result);

  auto maybe_value =
      obj->GetPrivate(context, JSVM_PRIVATE_KEY(env->isolate, type_tag));
  CHECK_MAYBE_EMPTY_WITH_PREAMBLE(env, maybe_value, JSVM_GENERIC_FAILURE);
  v8::Local<v8::Value> val = maybe_value.ToLocalChecked();

  // We consider the type check to have failed unless we reach the line below
  // where we set whether the type check succeeded or not based on the
  // comparison of the two type tags.
  *result = false;
  if (val->IsBigInt()) {
    int sign;
    int size = 2;
    JSVM_TypeTag tag;
    val.As<v8::BigInt>()->ToWordsArray(
        &sign, &size, reinterpret_cast<uint64_t*>(&tag));
    if (sign == 0) {
      if (size == 2) {
        *result =
            (tag.lower == typeTag->lower && tag.upper == typeTag->upper);
      } else if (size == 1) {
        *result = (tag.lower == typeTag->lower && 0 == typeTag->upper);
      } else if (size == 0) {
        *result = (0 == typeTag->lower && 0 == typeTag->upper);
      }
    }
  }

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetValueExternal(JSVM_Env env,
                                               JSVM_Value value,
                                               void** result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsExternal(), JSVM_INVALID_ARG);

  v8::Local<v8::External> external_value = val.As<v8::External>();
  *result = external_value->Value();

  return jsvm_clear_last_error(env);
}

// Set initialRefcount to 0 for a weak reference, >0 for a strong reference.
JSVM_Status JSVM_CDECL OH_JSVM_CreateReference(JSVM_Env env,
                                             JSVM_Value value,
                                             uint32_t initialRefcount,
                                             JSVM_Ref* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> v8_value = v8impl::V8LocalValueFromJsValue(value);
  v8impl::Reference* reference = v8impl::Reference::New(
      env, v8_value, initialRefcount, v8impl::Ownership::kUserland);

  *result = reinterpret_cast<JSVM_Ref>(reference);
  return jsvm_clear_last_error(env);
}

// Deletes a reference. The referenced value is released, and may be GC'd unless
// there are other references to it.
JSVM_Status JSVM_CDECL OH_JSVM_DeleteReference(JSVM_Env env, JSVM_Ref ref) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, ref);

  reinterpret_cast<v8impl::Reference*>(ref)->Delete();

  return jsvm_clear_last_error(env);
}

// Increments the reference count, optionally returning the resulting count.
// After this call the reference will be a strong reference because its
// refcount is >0, and the referenced object is effectively "pinned".
// Calling this when the refcount is 0 and the object is unavailable
// results in an error.
JSVM_Status JSVM_CDECL OH_JSVM_ReferenceRef(JSVM_Env env,
                                          JSVM_Ref ref,
                                          uint32_t* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, ref);

  v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(ref);
  if (reference->HasDeletedByUser()) {
    return jsvm_set_last_error(env, JSVM_GENERIC_FAILURE);
  }
  uint32_t count = reference->Ref();

  if (result != nullptr) {
    *result = count;
  }

  return jsvm_clear_last_error(env);
}

// Decrements the reference count, optionally returning the resulting count. If
// the result is 0 the reference is now weak and the object may be GC'd at any
// time if there are no other references. Calling this when the refcount is
// already 0 results in an error.
JSVM_Status JSVM_CDECL OH_JSVM_ReferenceUnref(JSVM_Env env,
                                            JSVM_Ref ref,
                                            uint32_t* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, ref);

  v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(ref);

  if (reference->RefCount() == 0 || reference->HasDeletedByUser()) {
    return jsvm_set_last_error(env, JSVM_GENERIC_FAILURE);
  }

  uint32_t count = reference->Unref();

  if (result != nullptr) {
    *result = count;
  }

  return jsvm_clear_last_error(env);
}

// Attempts to get a referenced value. If the reference is weak, the value might
// no longer be available, in that case the call is still successful but the
// result is NULL.
JSVM_Status JSVM_CDECL OH_JSVM_GetReferenceValue(JSVM_Env env,
                                                JSVM_Ref ref,
                                                JSVM_Value* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, ref);
  CHECK_ARG(env, result);

  v8impl::Reference* reference = reinterpret_cast<v8impl::Reference*>(ref);
  *result = v8impl::JsValueFromV8LocalValue(reference->Get());

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_OpenHandleScope(JSVM_Env env,
                                              JSVM_HandleScope* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsHandleScopeFromV8HandleScope(
      new v8impl::HandleScopeWrapper(env->isolate));
  env->open_handle_scopes++;
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CloseHandleScope(JSVM_Env env,
                                               JSVM_HandleScope scope) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, scope);
  if (env->open_handle_scopes == 0) {
    return JSVM_HANDLE_SCOPE_MISMATCH;
  }

  env->ReleaseJsvmData();
  env->open_handle_scopes--;
  delete v8impl::V8HandleScopeFromJsHandleScope(scope);
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_OpenEscapableHandleScope(
    JSVM_Env env, JSVM_EscapableHandleScope* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsEscapableHandleScopeFromV8EscapableHandleScope(
      new v8impl::EscapableHandleScopeWrapper(env->isolate));
  env->open_handle_scopes++;
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CloseEscapableHandleScope(
    JSVM_Env env, JSVM_EscapableHandleScope scope) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, scope);
  if (env->open_handle_scopes == 0) {
    return JSVM_HANDLE_SCOPE_MISMATCH;
  }

  delete v8impl::V8EscapableHandleScopeFromJsEscapableHandleScope(scope);
  env->open_handle_scopes--;
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_EscapeHandle(JSVM_Env env,
                                          JSVM_EscapableHandleScope scope,
                                          JSVM_Value escapee,
                                          JSVM_Value* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, scope);
  CHECK_ARG(env, escapee);
  CHECK_ARG(env, result);

  v8impl::EscapableHandleScopeWrapper* s =
      v8impl::V8EscapableHandleScopeFromJsEscapableHandleScope(scope);
  if (!s->escape_called()) {
    *result = v8impl::JsValueFromV8LocalValue(
        s->Escape(v8impl::V8LocalValueFromJsValue(escapee)));
    return jsvm_clear_last_error(env);
  }
  return jsvm_set_last_error(env, JSVM_ESCAPE_CALLED_TWICE);
}

JSVM_Status JSVM_CDECL OH_JSVM_NewInstance(JSVM_Env env,
                                         JSVM_Value constructor,
                                         size_t argc,
                                         const JSVM_Value* argv,
                                         JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, constructor);
  if (argc > 0) {
    CHECK_ARG(env, argv);
  }
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Function> ctor;
  CHECK_TO_FUNCTION(env, ctor, constructor);

  auto maybe = ctor->NewInstance(
      context,
      argc,
      reinterpret_cast<v8::Local<v8::Value>*>(const_cast<JSVM_Value*>(argv)));

  CHECK_MAYBE_EMPTY(env, maybe, JSVM_PENDING_EXCEPTION);

  *result = v8impl::JsValueFromV8LocalValue(maybe.ToLocalChecked());
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_Instanceof(JSVM_Env env,
                                       JSVM_Value object,
                                       JSVM_Value constructor,
                                       bool* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, object);
  CHECK_ARG(env, result);

  *result = false;

  v8::Local<v8::Object> ctor;
  v8::Local<v8::Context> context = env->context();

  CHECK_TO_OBJECT(env, context, ctor, constructor);

  if (!ctor->IsFunction()) {
    OH_JSVM_ThrowTypeError(
        env, "ERR_NAPI_CONS_FUNCTION", "Constructor must be a function");

    return jsvm_set_last_error(env, JSVM_FUNCTION_EXPECTED);
  }

  JSVM_Status status = JSVM_GENERIC_FAILURE;

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(object);
  auto maybe_result = val->InstanceOf(context, ctor);
  CHECK_MAYBE_NOTHING(env, maybe_result, status);
  *result = maybe_result.FromJust();
  return GET_RETURN_STATUS(env);
}

// Methods to support catching exceptions
JSVM_Status JSVM_CDECL OH_JSVM_IsExceptionPending(JSVM_Env env, bool* result) {
  // JSVM_PREAMBLE is not used here: this function must execute when there is a
  // pending exception.
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = !env->last_exception.IsEmpty();
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetAndClearLastException(JSVM_Env env,
                                                         JSVM_Value* result) {
  // JSVM_PREAMBLE is not used here: this function must execute when there is a
  // pending exception.
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  if (env->last_exception.IsEmpty()) {
    return OH_JSVM_GetUndefined(env, result);
  } else {
    *result = v8impl::JsValueFromV8LocalValue(
        v8::Local<v8::Value>::New(env->isolate, env->last_exception));
    env->last_exception.Reset();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsArraybuffer(JSVM_Env env,
                                           JSVM_Value value,
                                           bool* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *result = val->IsArrayBuffer();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateArraybuffer(JSVM_Env env,
                                               size_t byteLength,
                                               void** data,
                                               JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Isolate* isolate = env->isolate;
  v8::Local<v8::ArrayBuffer> buffer =
      v8::ArrayBuffer::New(isolate, byteLength);

  // Optionally return a pointer to the buffer's data, to avoid another call to
  // retrieve it.
  if (data != nullptr) {
    *data = buffer->Data();
  }

  *result = v8impl::JsValueFromV8LocalValue(buffer);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_AllocateArrayBufferBackingStoreData(size_t byteLength,
                                                                   JSVM_InitializedFlag initialized,
                                                                   void **data) {
  if (!data) {
    return JSVM_INVALID_ARG;
  }
  auto allocator = v8impl::GetOrCreateDefaultArrayBufferAllocator();
  *data = (initialized == JSVM_ZERO_INITIALIZED) ?
    allocator->Allocate(byteLength) :
    allocator->AllocateUninitialized(byteLength);
  return *data ? JSVM_OK : JSVM_GENERIC_FAILURE;
}

JSVM_Status JSVM_CDECL OH_JSVM_FreeArrayBufferBackingStoreData(void *data) {
  if (!data) {
    return JSVM_INVALID_ARG;
  }
  auto allocator = v8impl::GetOrCreateDefaultArrayBufferAllocator();
  allocator->Free(data, JSVM_AUTO_LENGTH);
  return JSVM_OK;
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateArrayBufferFromBackingStoreData(JSVM_Env env,
                                                                     void *data,
                                                                     size_t byteLength,
                                                                     size_t offset,
                                                                     size_t slicedByteLength,
                                                                     JSVM_Value *result) {
  CHECK_ENV(env);
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, data);
  CHECK_ARG(env, result);
  CHECK_ARG_NOT_ZERO(env, byteLength);
  CHECK_ARG_NOT_ZERO(env, slicedByteLength);
  void *dataPtr = static_cast<uint8_t*>(data) + offset;
  auto backingStoreSize = slicedByteLength;
  RETURN_STATUS_IF_FALSE(env, offset + slicedByteLength <= byteLength, JSVM_INVALID_ARG);
  auto backingStore = v8::ArrayBuffer::NewBackingStore(
    dataPtr, backingStoreSize, v8::BackingStore::EmptyDeleter, nullptr);
  v8::Local<v8::ArrayBuffer> arrayBuffer =
    v8::ArrayBuffer::New(env->isolate, std::move(backingStore));
  *result = v8impl::JsValueFromV8LocalValue(arrayBuffer);
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateExternal_buffer(JSVM_Env env,
                                                   size_t length,
                                                   void* data,
                                                   JSVM_Finalize finalizeCb,
                                                   void* finalizeHint,
                                                   JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

#if defined(V8_ENABLE_SANDBOX)
  return jsvm_set_last_error(env, JSVM_NO_EXTERNAL_BUFFERS_ALLOWED);
#endif

  v8::Isolate* isolate = env->isolate;

  // The finalizer object will delete itself after invoking the callback.
  v8impl::BufferFinalizer* finalizer =
      v8impl::BufferFinalizer::New(env, finalizeCb, nullptr, finalizeHint);

    std::shared_ptr<v8::BackingStore> backingStore = v8::ArrayBuffer::NewBackingStore(data, length, [](void* data, size_t length,
                                                                                                       void* deleter_data) {
        v8impl::BufferFinalizer::FinalizeBufferCallback(static_cast<char*>(data), deleter_data);
    }, finalizer);
    v8::Local<v8::ArrayBuffer> ab = v8::ArrayBuffer::New(isolate, backingStore);
    
//cjh  v8::MaybeLocal<v8::Object> maybe =
//      node::Buffer::New(isolate,
//                        static_cast<char*>(data),
//                        length,
//                        v8impl::BufferFinalizer::FinalizeBufferCallback,
//                        finalizer);
//
//  CHECK_MAYBE_EMPTY(env, maybe, JSVM_GENERIC_FAILURE);

    *result = v8impl::JsValueFromV8LocalValue(ab);//cjh maybe.ToLocalChecked());
  return GET_RETURN_STATUS(env);
  // Tell coverity that 'finalizer' should not be freed when we return
  // as it will be deleted when the buffer to which it is associated
  // is finalized.
  // coverity[leaked_storage]
}

JSVM_Status JSVM_CDECL
OH_JSVM_CreateExternalArraybuffer(JSVM_Env env,
                                 void* externalData,
                                 size_t byteLength,
                                 JSVM_Finalize finalizeCb,
                                 void* finalizeHint,
                                 JSVM_Value* result) {
  // The API contract here is that the cleanup function runs on the JS thread,
  // and is able to use JSVM_Env. Implementing that properly is hard, so use the
  // `Buffer` variant for easier implementation.
  JSVM_Value buffer;
  STATUS_CALL(OH_JSVM_CreateExternal_buffer(
      env, byteLength, externalData, finalizeCb, finalizeHint, &buffer));
  return OH_JSVM_GetTypedarrayInfo(
      env, buffer, nullptr, nullptr, nullptr, result, nullptr);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetArraybufferInfo(JSVM_Env env,
                                                 JSVM_Value arraybuffer,
                                                 void** data,
                                                 size_t* byteLength) {
  CHECK_ENV(env);
  CHECK_ARG(env, arraybuffer);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(arraybuffer);
  RETURN_STATUS_IF_FALSE(env, value->IsArrayBuffer(), JSVM_INVALID_ARG);

  v8::Local<v8::ArrayBuffer> ab = value.As<v8::ArrayBuffer>();

  if (data != nullptr) {
    *data = ab->Data();
  }

  if (byteLength != nullptr) {
    *byteLength = ab->ByteLength();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsTypedarray(JSVM_Env env,
                                          JSVM_Value value,
                                          bool* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *result = val->IsTypedArray();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateTypedarray(JSVM_Env env,
                                              JSVM_TypedarrayType type,
                                              size_t length,
                                              JSVM_Value arraybuffer,
                                              size_t byteOffset,
                                              JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, arraybuffer);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(arraybuffer);
  RETURN_STATUS_IF_FALSE(env, value->IsArrayBuffer(), JSVM_INVALID_ARG);

  v8::Local<v8::ArrayBuffer> buffer = value.As<v8::ArrayBuffer>();
  v8::Local<v8::TypedArray> typedArray;

  switch (type) {
    case JSVM_INT8_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Int8Array, 1, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_UINT8_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Uint8Array, 1, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_UINT8_CLAMPED_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Uint8ClampedArray, 1, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_INT16_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Int16Array, 2, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_UINT16_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Uint16Array, 2, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_INT32_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Int32Array, 4, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_UINT32_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Uint32Array, 4, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_FLOAT32_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Float32Array, 4, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_FLOAT64_ARRAY:
      CREATE_TYPED_ARRAY(
          env, Float64Array, 8, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_BIGINT64_ARRAY:
      CREATE_TYPED_ARRAY(
          env, BigInt64Array, 8, buffer, byteOffset, length, typedArray);
      break;
    case JSVM_BIGUINT64_ARRAY:
      CREATE_TYPED_ARRAY(
          env, BigUint64Array, 8, buffer, byteOffset, length, typedArray);
      break;
    default:
      return jsvm_set_last_error(env, JSVM_INVALID_ARG);
  }

  *result = v8impl::JsValueFromV8LocalValue(typedArray);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetTypedarrayInfo(JSVM_Env env,
                                                JSVM_Value typedarray,
                                                JSVM_TypedarrayType* type,
                                                size_t* length,
                                                void** data,
                                                JSVM_Value* arraybuffer,
                                                size_t* byteOffset) {
  CHECK_ENV(env);
  CHECK_ARG(env, typedarray);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(typedarray);
  RETURN_STATUS_IF_FALSE(env, value->IsTypedArray(), JSVM_INVALID_ARG);

  v8::Local<v8::TypedArray> array = value.As<v8::TypedArray>();

  if (type != nullptr) {
    if (value->IsInt8Array()) {
      *type = JSVM_INT8_ARRAY;
    } else if (value->IsUint8Array()) {
      *type = JSVM_UINT8_ARRAY;
    } else if (value->IsUint8ClampedArray()) {
      *type = JSVM_UINT8_CLAMPED_ARRAY;
    } else if (value->IsInt16Array()) {
      *type = JSVM_INT16_ARRAY;
    } else if (value->IsUint16Array()) {
      *type = JSVM_UINT16_ARRAY;
    } else if (value->IsInt32Array()) {
      *type = JSVM_INT32_ARRAY;
    } else if (value->IsUint32Array()) {
      *type = JSVM_UINT32_ARRAY;
    } else if (value->IsFloat32Array()) {
      *type = JSVM_FLOAT32_ARRAY;
    } else if (value->IsFloat64Array()) {
      *type = JSVM_FLOAT64_ARRAY;
    } else if (value->IsBigInt64Array()) {
      *type = JSVM_BIGINT64_ARRAY;
    } else if (value->IsBigUint64Array()) {
      *type = JSVM_BIGUINT64_ARRAY;
    }
  }

  if (length != nullptr) {
    *length = array->Length();
  }

  v8::Local<v8::ArrayBuffer> buffer;
  if (data != nullptr || arraybuffer != nullptr) {
    // Calling Buffer() may have the side effect of allocating the buffer,
    // so only do this when it’s needed.
    buffer = array->Buffer();
  }

  if (data != nullptr) {
    *data = static_cast<uint8_t*>(buffer->Data()) + array->ByteOffset();
  }

  if (arraybuffer != nullptr) {
    *arraybuffer = v8impl::JsValueFromV8LocalValue(buffer);
  }

  if (byteOffset != nullptr) {
    *byteOffset = array->ByteOffset();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateDataview(JSVM_Env env,
                                            size_t byteLength,
                                            JSVM_Value arraybuffer,
                                            size_t byteOffset,
                                            JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, arraybuffer);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(arraybuffer);
  RETURN_STATUS_IF_FALSE(env, value->IsArrayBuffer(), JSVM_INVALID_ARG);

  v8::Local<v8::ArrayBuffer> buffer = value.As<v8::ArrayBuffer>();
  if (byteLength + byteOffset > buffer->ByteLength()) {
    OH_JSVM_ThrowRangeError(env,
                           "ERR_JSVM_INVALID_DATAVIEW_ARGS",
                           "byteOffset + byteLength should be less than or "
                           "equal to the size in bytes of the array passed in");
    return jsvm_set_last_error(env, JSVM_PENDING_EXCEPTION);
  }
  v8::Local<v8::DataView> DataView =
      v8::DataView::New(buffer, byteOffset, byteLength);

  *result = v8impl::JsValueFromV8LocalValue(DataView);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsDataview(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *result = val->IsDataView();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetDataviewInfo(JSVM_Env env,
                                              JSVM_Value dataview,
                                              size_t* byteLength,
                                              void** data,
                                              JSVM_Value* arraybuffer,
                                              size_t* byteOffset) {
  CHECK_ENV(env);
  CHECK_ARG(env, dataview);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(dataview);
  RETURN_STATUS_IF_FALSE(env, value->IsDataView(), JSVM_INVALID_ARG);

  v8::Local<v8::DataView> array = value.As<v8::DataView>();

  if (byteLength != nullptr) {
    *byteLength = array->ByteLength();
  }

  v8::Local<v8::ArrayBuffer> buffer;
  if (data != nullptr || arraybuffer != nullptr) {
    // Calling Buffer() may have the side effect of allocating the buffer,
    // so only do this when it’s needed.
    buffer = array->Buffer();
  }

  if (data != nullptr) {
    *data = static_cast<uint8_t*>(buffer->Data()) + array->ByteOffset();
  }

  if (arraybuffer != nullptr) {
    *arraybuffer = v8impl::JsValueFromV8LocalValue(buffer);
  }

  if (byteOffset != nullptr) {
    *byteOffset = array->ByteOffset();
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetVersion(JSVM_Env env, uint32_t* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);
  *result = NAPI_VERSION;
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreatePromise(JSVM_Env env,
                                           JSVM_Deferred* deferred,
                                           JSVM_Value* promise) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, deferred);
  CHECK_ARG(env, promise);

  auto maybe = v8::Promise::Resolver::New(env->context());
  CHECK_MAYBE_EMPTY(env, maybe, JSVM_GENERIC_FAILURE);

  auto v8_resolver = maybe.ToLocalChecked();
  auto v8_deferred = new v8impl::Persistent<v8::Value>();
  v8_deferred->Reset(env->isolate, v8_resolver);

  *deferred = v8impl::JsDeferredFromNodePersistent(v8_deferred);
  *promise = v8impl::JsValueFromV8LocalValue(v8_resolver->GetPromise());
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ResolveDeferred(JSVM_Env env,
                                             JSVM_Deferred deferred,
                                             JSVM_Value resolution) {
  return v8impl::ConcludeDeferred(env, deferred, resolution, true);
}

JSVM_Status JSVM_CDECL OH_JSVM_RejectDeferred(JSVM_Env env,
                                            JSVM_Deferred deferred,
                                            JSVM_Value resolution) {
  return v8impl::ConcludeDeferred(env, deferred, resolution, false);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsPromise(JSVM_Env env,
                                       JSVM_Value value,
                                       bool* is_promise) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, is_promise);

  *is_promise = v8impl::V8LocalValueFromJsValue(value)->IsPromise();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateDate(JSVM_Env env,
                                        double time,
                                        JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::MaybeLocal<v8::Value> maybe_date = v8::Date::New(env->context(), time);
  CHECK_MAYBE_EMPTY(env, maybe_date, JSVM_GENERIC_FAILURE);

  *result = v8impl::JsValueFromV8LocalValue(maybe_date.ToLocalChecked());

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsDate(JSVM_Env env,
                                    JSVM_Value value,
                                    bool* isDate) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isDate);

  *isDate = v8impl::V8LocalValueFromJsValue(value)->IsDate();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetDateValue(JSVM_Env env,
                                           JSVM_Value value,
                                           double* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  RETURN_STATUS_IF_FALSE(env, val->IsDate(), JSVM_DATE_EXPECTED);

  v8::Local<v8::Date> date = val.As<v8::Date>();
  *result = date->ValueOf();

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_AddFinalizer(JSVM_Env env,
                                          JSVM_Value jsObject,
                                          void* finalizeData,
                                          JSVM_Finalize finalizeCb,
                                          void* finalizeHint,
                                          JSVM_Ref* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8 calls here cannot throw
  // JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, jsObject);
  CHECK_ARG(env, finalizeCb);

  v8::Local<v8::Value> v8_value = v8impl::V8LocalValueFromJsValue(jsObject);
  RETURN_STATUS_IF_FALSE(env, v8_value->IsObject(), JSVM_INVALID_ARG);

  // Create a self-deleting reference if the optional out-param result is not
  // set.
  v8impl::Ownership ownership = result == nullptr
                                    ? v8impl::Ownership::kRuntime
                                    : v8impl::Ownership::kUserland;
  v8impl::Reference* reference = v8impl::Reference::New(
      env, v8_value, 0, ownership, finalizeCb, finalizeData, finalizeHint);

  if (result != nullptr) {
    *result = reinterpret_cast<JSVM_Ref>(reference);
  }
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_AdjustExternalMemory(JSVM_Env env,
                                                   int64_t changeInBytes,
                                                   int64_t* adjustedValue) {
  CHECK_ENV(env);
  CHECK_ARG(env, adjustedValue);

  *adjustedValue =
      env->isolate->AdjustAmountOfExternalAllocatedMemory(changeInBytes);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_SetInstanceData(JSVM_Env env,
                                              void* data,
                                              JSVM_Finalize finalizeCb,
                                              void* finalizeHint) {
  CHECK_ENV(env);

  v8impl::RefBase* old_data = static_cast<v8impl::RefBase*>(env->instance_data);
  if (old_data != nullptr) {
    // Our contract so far has been to not finalize any old data there may be.
    // So we simply delete it.
    delete old_data;
  }

  env->instance_data = v8impl::RefBase::New(
      env, 0, v8impl::Ownership::kRuntime, finalizeCb, data, finalizeHint);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_GetInstanceData(JSVM_Env env, void** data) {
  CHECK_ENV(env);
  CHECK_ARG(env, data);

  v8impl::RefBase* idata = static_cast<v8impl::RefBase*>(env->instance_data);

  *data = (idata == nullptr ? nullptr : idata->Data());

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_DetachArraybuffer(JSVM_Env env,
                                                 JSVM_Value arraybuffer) {
  CHECK_ENV(env);
  CHECK_ARG(env, arraybuffer);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(arraybuffer);
  RETURN_STATUS_IF_FALSE(
      env, value->IsArrayBuffer() || value->IsSharedArrayBuffer(), JSVM_ARRAYBUFFER_EXPECTED);

  v8::Local<v8::ArrayBuffer> it = value.As<v8::ArrayBuffer>();
  RETURN_STATUS_IF_FALSE(
      env, it->IsDetachable(), JSVM_DETACHABLE_ARRAYBUFFER_EXPECTED);

  it->Detach();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsDetachedArraybuffer(JSVM_Env env,
                                                    JSVM_Value arraybuffer,
                                                    bool* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, arraybuffer);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(arraybuffer);

  *result =
      value->IsArrayBuffer() && value.As<v8::ArrayBuffer>()->WasDetached();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL
OH_JSVM_DefineClassWithPropertyHandler(JSVM_Env env,
                                       const char* utf8name,
                                       size_t length,
                                       JSVM_Callback constructor,
                                       size_t propertyCount,
                                       const JSVM_PropertyDescriptor* properties,
                                       JSVM_PropertyHandlerCfg propertyHandlerCfg,
                                       JSVM_Callback callAsFunctionCallback,
                                       JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);
  CHECK_ARG(env, constructor);
  CHECK_ARG(env, constructor->callback);
  CHECK_ARG(env, propertyHandlerCfg);

  if (propertyCount > 0) {
    CHECK_ARG(env, properties);
  }

  v8::Isolate* isolate = env->isolate;
  v8::EscapableHandleScope scope(isolate);
  v8::Local<v8::FunctionTemplate> tpl;
  STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
      env, constructor, &tpl));

  v8::Local<v8::String> name_string;
  CHECK_NEW_FROM_UTF8_LEN(env, name_string, utf8name, length);
  tpl->SetClassName(name_string);

  size_t static_property_count = 0;
  for (size_t i = 0; i < propertyCount; i++) {
    const JSVM_PropertyDescriptor* p = properties + i;

    if ((p->attributes & JSVM_STATIC) != 0) { // attributes
      // Static properties are handled separately below.
      static_property_count++;
      continue;
    }

    v8::Local<v8::Name> property_name;
    STATUS_CALL(v8impl::V8NameFromPropertyDescriptor(env, p, &property_name));
    v8::PropertyAttribute attributes = v8impl::V8PropertyAttributesFromDescriptor(p);

    // This code is similar to that in OH_JSVM_DefineProperties(); the
    // difference is it applies to a template instead of an object,
    // and preferred PropertyAttribute for lack of PropertyDescriptor
    // support on ObjectTemplate.
    if (p->getter != nullptr || p->setter != nullptr) {
      v8::Local<v8::FunctionTemplate> getter_tpl;
      v8::Local<v8::FunctionTemplate> setter_tpl;
      if (p->getter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->getter, &getter_tpl));
      }
      if (p->setter != nullptr) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->setter, &setter_tpl));
      }

      tpl->PrototypeTemplate()->SetAccessorProperty(property_name,
                                                    getter_tpl,
                                                    setter_tpl,
                                                    attributes,
                                                    v8::AccessControl::DEFAULT);
    } else if (p->method != nullptr) {
      v8::Local<v8::FunctionTemplate> t;
      if (p->attributes & JSVM_NO_RECEIVER_CHECK) {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->method, &t));
      } else {
        STATUS_CALL(v8impl::FunctionCallbackWrapper::NewTemplate(
            env, p->method, &t, v8::Signature::New(isolate, tpl)));
      }

      tpl->PrototypeTemplate()->Set(property_name, t, attributes);
    } else {
      v8::Local<v8::Value> value = v8impl::V8LocalValueFromJsValue(p->value);
      tpl->PrototypeTemplate()->Set(property_name, value, attributes);
    }
  }

  /* register property handler for instance object */
  v8impl::JSVM_PropertyHandlerCfgStruct* propertyHandleCfg = v8impl::CreatePropertyCfg(env, propertyHandlerCfg);
  if (propertyHandleCfg == nullptr) {
    return JSVM_Status::JSVM_GENERIC_FAILURE;
  }
  v8::Local<v8::Value> cbdata = v8impl::CallbackBundle::New(env, propertyHandleCfg);

  // register named property handler
  v8::NamedPropertyHandlerConfiguration namedPropertyHandler;
  if (propertyHandlerCfg->genericNamedPropertyGetterCallback) {
    namedPropertyHandler.getter = v8impl::PropertyCallbackWrapper<v8::Value>::NameGetterInvoke;
  }
  if (propertyHandlerCfg->genericNamedPropertySetterCallback) {
    namedPropertyHandler.setter = v8impl::PropertyCallbackWrapper<v8::Value>::NameSetterInvoke;
  }
  if (propertyHandlerCfg->genericNamedPropertyDeleterCallback) {
    namedPropertyHandler.deleter = v8impl::PropertyCallbackWrapper<v8::Boolean>::NameDeleterInvoke;
  }
  if (propertyHandlerCfg->genericNamedPropertyEnumeratorCallback) {
    namedPropertyHandler.enumerator = v8impl::PropertyCallbackWrapper<v8::Array>::NameEnumeratorInvoke;
  }
  namedPropertyHandler.data = cbdata;
  tpl->InstanceTemplate()->SetHandler(namedPropertyHandler);

  // register indexed property handle
  v8::IndexedPropertyHandlerConfiguration indexPropertyHandler;
  if (propertyHandlerCfg->genericIndexedPropertyGetterCallback) {
    indexPropertyHandler.getter = v8impl::PropertyCallbackWrapper<v8::Value>::IndexGetterInvoke;
  }
  if (propertyHandlerCfg->genericIndexedPropertySetterCallback) {
    indexPropertyHandler.setter = v8impl::PropertyCallbackWrapper<v8::Value>::IndexSetterInvoke;
  }
  if (propertyHandlerCfg->genericIndexedPropertyDeleterCallback) {
    indexPropertyHandler.deleter = v8impl::PropertyCallbackWrapper<v8::Boolean>::IndexDeleterInvoke;
  }
  if (propertyHandlerCfg->genericIndexedPropertyEnumeratorCallback) {
    indexPropertyHandler.enumerator = v8impl::PropertyCallbackWrapper<v8::Array>::IndexEnumeratorInvoke;
  }
  indexPropertyHandler.data = cbdata;
  tpl->InstanceTemplate()->SetHandler(indexPropertyHandler);

  // register call as function
  if (callAsFunctionCallback && callAsFunctionCallback->callback) {
    v8::Local<v8::Value> funcCbdata = v8impl::CallbackBundle::New(env, callAsFunctionCallback);
    tpl->InstanceTemplate()->SetCallAsFunctionHandler(v8impl::FunctionCallbackWrapper::Invoke, funcCbdata);
  }

  v8::Local<v8::Context> context = env->context();
  *result = v8impl::JsValueFromV8LocalValue(
      scope.Escape(tpl->GetFunction(context).ToLocalChecked()));

  v8impl::Reference::New(env, v8impl::V8LocalValueFromJsValue(*result), 0, v8impl::Ownership::kRuntime,
    v8impl::CfgFinalizedCallback, propertyHandleCfg, nullptr);

  if (static_property_count > 0) {
    std::vector<JSVM_PropertyDescriptor> static_descriptors;
    static_descriptors.reserve(static_property_count);

    for (size_t i = 0; i < propertyCount; i++) {
      const JSVM_PropertyDescriptor* p = properties + i;
      if ((p->attributes & JSVM_STATIC) != 0) {
        static_descriptors.push_back(*p);
      }
    }

    STATUS_CALL(OH_JSVM_DefineProperties(
        env, *result, static_descriptors.size(), static_descriptors.data()));
  }

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsLocked(JSVM_Env env,
                                        bool* isLocked) {
  CHECK_ENV(env);
  CHECK_ARG(env, isLocked);

  *isLocked = v8::Locker::IsLocked(env->isolate);

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_AcquireLock(JSVM_Env env) {
  CHECK_ENV(env);

  bool isLocked = v8::Locker::IsLocked(env->isolate);
  if (!isLocked) {
    env->locker = new v8::Locker(env->isolate);
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ReleaseLock(JSVM_Env env) {
  CHECK_ENV(env);

  bool isLocked = v8::Locker::IsLocked(env->isolate);
  if (isLocked && env->locker != nullptr) {
    delete env->locker;
    env->locker = nullptr;
  }

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsCallable(JSVM_Env env,
                                          JSVM_Value value,
                                          bool* isCallable) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isCallable);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

  *isCallable = val->IsFunction();
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsUndefined(JSVM_Env env,
                                           JSVM_Value value,
                                           bool* isUndefined) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isUndefined);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isUndefined = val->IsUndefined();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsNull(JSVM_Env env,
                                      JSVM_Value value,
                                      bool* isNull) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isNull);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isNull = val->IsNull();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsNullOrUndefined(JSVM_Env env,
                                                 JSVM_Value value,
                                                 bool* isNullOrUndefined) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isNullOrUndefined);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isNullOrUndefined = val->IsNullOrUndefined();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsBoolean(JSVM_Env env,
                                         JSVM_Value value,
                                         bool* isBoolean) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isBoolean);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isBoolean = val->IsBoolean();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsNumber(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* isNumber) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isNumber);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isNumber = val->IsNumber();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsString(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* isString) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isString);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isString = val->IsString();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsSymbol(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* isSymbol) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isSymbol);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isSymbol = val->IsSymbol();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsFunction(JSVM_Env env,
                                          JSVM_Value value,
                                          bool* isFunction) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isFunction);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isFunction = val->IsFunction();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsObject(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* isObject) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isObject);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isObject = val->IsObject();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsBigInt(JSVM_Env env,
                                        JSVM_Value value,
                                        bool* isBigInt) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isBigInt);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isBigInt = val->IsBigInt();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsConstructor(JSVM_Env env,
                                             JSVM_Value value,
                                             bool* isConstructor)
{
    CHECK_ENV(env);
    CHECK_ARG(env, value);
    CHECK_ARG(env, isConstructor);

    v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
    if (!val->IsObject()) {
        *isConstructor = false;
        return jsvm_clear_last_error(env);
    }
    v8::Local<v8::Object> obj = val.As<v8::Object>();
    *isConstructor = obj->IsConstructor();

    return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateRegExp(JSVM_Env env,
                                            JSVM_Value value,
                                            JSVM_RegExpFlags flags,
                                            JSVM_Value* result)
{
    JSVM_PREAMBLE(env);
    CHECK_ARG(env, value);
    CHECK_ARG(env, result);

    v8::Local<v8::Value> pattern = v8impl::V8LocalValueFromJsValue(value);
    RETURN_STATUS_IF_FALSE(env, pattern->IsString(), JSVM_STRING_EXPECTED);
    v8::Local<v8::Context> context = env->context();
    v8::MaybeLocal<v8::RegExp> regExp = v8::RegExp::New(context, pattern.As<v8::String>(),
                                                        static_cast<v8::RegExp::Flags>(flags));
    CHECK_MAYBE_EMPTY(env, regExp, JSVM_GENERIC_FAILURE);
    *result = v8impl::JsValueFromV8LocalValue(regExp.ToLocalChecked());

    return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateMap(JSVM_Env env, JSVM_Value* result)
{
    CHECK_ENV(env);
    CHECK_ARG(env, result);

    *result = v8impl::JsValueFromV8LocalValue(v8::Map::New(env->isolate));

    return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsMap(JSVM_Env env,
                                     JSVM_Value value,
                                     bool* isMap)
{
    CHECK_ENV(env);
    CHECK_ARG(env, value);
    CHECK_ARG(env, isMap);

    v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);

    *isMap = val->IsMap();
    return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_RetainScript(JSVM_Env env, JSVM_Script script) {
  CHECK_ENV(env);
  auto jsvmData = reinterpret_cast<JSVM_Data__ *>(script);

  RETURN_STATUS_IF_FALSE(env, jsvmData && !jsvmData->isGlobal, JSVM_INVALID_ARG);

  jsvmData->taggedPointer = v8::Global<v8::Script>(
    env->isolate, jsvmData->ToV8Local<v8::Script>(env->isolate));

  jsvmData->isGlobal = true;
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ReleaseScript(JSVM_Env env, JSVM_Script script) {
  CHECK_ENV(env);
  auto jsvmData = reinterpret_cast<JSVM_Data__ *>(script);

  RETURN_STATUS_IF_FALSE(env, jsvmData && jsvmData->isGlobal, JSVM_INVALID_ARG);

  std::get<v8::Global<v8::Script>>(jsvmData->taggedPointer).Reset();
  delete jsvmData;
  return jsvm_clear_last_error(env);
}

//cjh int FindAvailablePort() {
//  constexpr int startPort = 9229;
//  constexpr int endPort = 9999;
//  constexpr int invalidPort = -1;
//  int sockfd = -1;
//
//  for (auto port = startPort; port <= endPort; ++port) {
//    sockfd = socket(AF_INET, SOCK_STREAM, 0);
//    if (sockfd < 0) {
//      continue;
//    }
//    struct sockaddr_in addr;
//    addr.sin_family = AF_INET;
//    addr.sin_addr.s_addr = htonl(INADDR_ANY);
//    addr.sin_port = htons(port);
//
//    if (bind(sockfd, reinterpret_cast<struct sockaddr*>(&addr), sizeof(addr)) < 0) {
//      close(sockfd);
//      if (errno == EADDRINUSE) {
//        continue;
//      } else {
//        break;
//      }
//    }
//    close(sockfd);
//    return port;
//  }
//  return invalidPort;
//}
//
//JSVM_Status JSVM_CDECL OH_JSVM_OpenInspectorWithName(JSVM_Env env,
//                                                     int pid,
//                                                     const char* name) {
//  JSVM_PREAMBLE(env);
//  RETURN_STATUS_IF_FALSE(env, !name || strlen(name) < SIZE_MAX, JSVM_INVALID_ARG);
//  RETURN_STATUS_IF_FALSE(env, pid >= 0, JSVM_INVALID_ARG);
//  std::string path(name ? name : "jsvm");
//  auto port = FindAvailablePort();
//  auto hostPort =
//    std::make_shared<node::ExclusiveAccess<node::HostPort>>("localhost", port, pid);
//  env->inspector_agent()->Start(path, hostPort, true, false);
//  return GET_RETURN_STATUS(env);
//}

JSVM_Status JSVM_CDECL OH_JSVM_CreateSet(JSVM_Env env,
                                         JSVM_Value* result) {
  CHECK_ENV(env);
  CHECK_ARG(env, result);

  *result = v8impl::JsValueFromV8LocalValue(v8::Set::New(env->isolate));

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsSet(JSVM_Env env,
                                     JSVM_Value value,
                                     bool* isSet) {
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, isSet);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *isSet = val->IsSet();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ObjectGetPrototypeOf(JSVM_Env env,
                                                    JSVM_Value object,
                                                    JSVM_Value* result) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, result);

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Value> val = obj->GetPrototype();
  *result = v8impl::JsValueFromV8LocalValue(val);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ObjectSetPrototypeOf(JSVM_Env env,
                                                    JSVM_Value object,
                                                    JSVM_Value prototype) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, prototype);

  v8::Local<v8::Context> context = env->context();

  v8::Local<v8::Object> obj;
  CHECK_TO_OBJECT(env, context, obj, object);

  v8::Local<v8::Value> type = v8impl::V8LocalValueFromJsValue(prototype);
  RETURN_STATUS_IF_FALSE(env, type->IsObject(), JSVM_INVALID_ARG);
  v8::Maybe<bool> set_maybe = obj->SetPrototype(context, type);

  RETURN_STATUS_IF_FALSE(env, set_maybe.FromMaybe(false), JSVM_GENERIC_FAILURE);
  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CompileWasmModule(JSVM_Env env,
                                                 const uint8_t *wasmBytecode,
                                                 size_t wasmBytecodeLength,
                                                 const uint8_t *cacheData,
                                                 size_t cacheDataLength,
                                                 bool *cacheRejected,
                                                 JSVM_Value *wasmModule) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, wasmBytecode);
  RETURN_STATUS_IF_FALSE(env, wasmBytecodeLength > 0, JSVM_INVALID_ARG);
  v8::MaybeLocal<v8::WasmModuleObject> maybe_module;
  if (cacheData == nullptr) {
    maybe_module = v8::WasmModuleObject::Compile(env->isolate, {wasmBytecode, wasmBytecodeLength});
  } else {
      assert(false);//cjh
    RETURN_STATUS_IF_FALSE(env, cacheDataLength > 0, JSVM_INVALID_ARG);
    bool rejected;
//cjh    maybe_module = v8::WasmModuleObject::DeserializeOrCompile(
//      env->isolate, {wasmBytecode, wasmBytecodeLength}, {cacheData, cacheDataLength}, rejected);
    if (cacheRejected != nullptr) {
      *cacheRejected = rejected;
    }
  }
  // To avoid the status code caused by exception being override, check exception once v8 API finished
  if (try_catch.HasCaught()) {
    return jsvm_set_last_error(env, JSVM_PENDING_EXCEPTION);
  }
  CHECK_MAYBE_EMPTY(env, maybe_module, JSVM_GENERIC_FAILURE);
  *wasmModule = v8impl::JsValueFromV8LocalValue(maybe_module.ToLocalChecked());
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CompileWasmFunction(JSVM_Env env,
                                                   JSVM_Value wasmModule,
                                                   uint32_t functionIndex,
                                                   JSVM_WasmOptLevel optLevel) {
    assert(false);//cjh
//cjh  JSVM_PREAMBLE(env);
//  CHECK_ARG(env, wasmModule);
//  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(wasmModule);
//  RETURN_STATUS_IF_FALSE(env, val->IsWasmModuleObject(), JSVM_INVALID_ARG);
//
//  v8::Local<v8::WasmModuleObject> v8WasmModule = val.As<v8::WasmModuleObject>();
//  v8::WasmExecutionTier tier = v8::WasmExecutionTier::kNone;
//  if (optLevel == JSVM_WASM_OPT_BASELINE) {
//    // v8 liftoff has bug, keep BASELINE same as HIGH.
//    tier = v8::WasmExecutionTier::kTurbofan;
//  } else if (optLevel == JSVM_WASM_OPT_HIGH) {
//    tier = v8::WasmExecutionTier::kTurbofan;
//  } else {
//    // Unsupported optLevel
//    return jsvm_set_last_error(env, JSVM_INVALID_ARG);
//  }
//  bool compileSuccess = v8WasmModule->CompileFunction(env->isolate, functionIndex, tier);
//  // To avoid the status code caused by exception being override, check exception once v8 API finished
//  if (try_catch.HasCaught()) {
//    return jsvm_set_last_error(env, JSVM_PENDING_EXCEPTION);
//  }
//  RETURN_STATUS_IF_FALSE(env, compileSuccess, JSVM_GENERIC_FAILURE);
  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_IsWasmModuleObject(JSVM_Env env,
                                                  JSVM_Value value,
                                                  bool* result) {
  // Omit JSVM_PREAMBLE and GET_RETURN_STATUS because V8
  // calls here cannot throw JS exceptions.
  CHECK_ENV(env);
  CHECK_ARG(env, value);
  CHECK_ARG(env, result);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(value);
  *result = val->IsWasmModuleObject();

  return jsvm_clear_last_error(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_CreateWasmCache(JSVM_Env env,
                                               JSVM_Value wasmModule,
                                               const uint8_t** data,
                                               size_t* length) {
  JSVM_PREAMBLE(env);
  CHECK_ARG(env, wasmModule);
  CHECK_ARG(env, data);
  CHECK_ARG(env, length);

  v8::Local<v8::Value> val = v8impl::V8LocalValueFromJsValue(wasmModule);
  RETURN_STATUS_IF_FALSE(env, val->IsWasmModuleObject(), JSVM_INVALID_ARG);

  v8::Local<v8::WasmModuleObject> v8WasmModule = val.As<v8::WasmModuleObject>();
  v8::CompiledWasmModule compiledWasmModule = v8WasmModule->GetCompiledModule();
  v8::OwnedBuffer serialized_bytes = compiledWasmModule.Serialize();
  // To avoid the status code caused by exception being override, check exception once v8 API finished
  if (try_catch.HasCaught()) {
    return jsvm_set_last_error(env, JSVM_PENDING_EXCEPTION);
  }
  // If buffer size is 0, create wasm cache failed.
  RETURN_STATUS_IF_FALSE(env, serialized_bytes.size > 0, JSVM_GENERIC_FAILURE);
  *data = serialized_bytes.buffer.get();
  *length = serialized_bytes.size;
  // Release the ownership of buffer, OH_JSVM_ReleaseCache must be called explicitly to release the buffer
  serialized_bytes.buffer.release();

  return GET_RETURN_STATUS(env);
}

JSVM_Status JSVM_CDECL OH_JSVM_ReleaseCache(JSVM_Env env,
                                            const uint8_t* cacheData,
                                            JSVM_CacheType cacheType) {
  CHECK_ENV(env);
  CHECK_ARG(env, cacheData);
  if (cacheType == JSVM_CACHE_TYPE_JS) {
    // The release behavior MUST match the memory allocation of OH_JSVM_CreateCodeCache.
    delete[] cacheData;
  } else if (cacheType == JSVM_CACHE_TYPE_WASM) {
    // The release behavior MUST match the memory allocation of OH_JSVM_CreateWasmCache.
    delete[] cacheData;
  } else {
    // Unsupported cacheType
    return jsvm_set_last_error(env, JSVM_INVALID_ARG);
  }
  return jsvm_clear_last_error(env);
}
