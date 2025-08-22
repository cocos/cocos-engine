#ifndef SRC_JS_NATIVE_API_V8_H_
#define SRC_JS_NATIVE_API_V8_H_

#include <variant>
#include <unordered_set>
#include <stack>
#include <mutex>
#include "jsvm_types.h"
#include "js_native_api_v8_internals.h"
#include "callback_queue.h"

#ifdef TARGET_OHOS
#include <unistd.h>
extern "C" void ReportData(uint32_t resType, int64_t value,
  const std::unordered_map<std::string, std::string>& mapPayLoad);
#endif

inline JSVM_Status jsvm_clear_last_error(JSVM_Env env);

namespace v8impl {

class RefTracker {
 public:
  RefTracker() {}
  virtual ~RefTracker() {}
  virtual void Finalize() {}

  typedef RefTracker RefList;

  inline void Link(RefList* list) {
    prev_ = list;
    next_ = list->next_;
    if (next_ != nullptr) {
      next_->prev_ = this;
    }
    list->next_ = this;
  }

  inline void Unlink() {
    if (prev_ != nullptr) {
      prev_->next_ = next_;
    }
    if (next_ != nullptr) {
      next_->prev_ = prev_;
    }
    prev_ = nullptr;
    next_ = nullptr;
  }

  static void FinalizeAll(RefList* list) {
    while (list->next_ != nullptr) {
      list->next_->Finalize();
    }
  }

 private:
  RefList* next_ = nullptr;
  RefList* prev_ = nullptr;
};

class Finalizer;
class Agent;
}  // end of namespace v8impl

struct JSVM_Data__ {
 public:
  using SourcePtr = std::variant<v8::Local<v8::Script>, v8::Global<v8::Script>>;
  using DataType = enum { kJsvmScript };

  template<typename T>
  JSVM_Data__(T ptr, bool retained, DataType type = kJsvmScript)
    : taggedPointer(ptr),
      isGlobal(retained),
      type(type) {}

  template<class T>
  v8::Local<T> ToV8Local(v8::Isolate *isolate) {
    if (isGlobal) {
      return v8::Local<T>::New(isolate, std::get<v8::Global<T>>(taggedPointer));
    } else {
      return std::get<v8::Local<T>>(taggedPointer);
    }
  }

  SourcePtr taggedPointer;
  bool isGlobal = false;
  DataType type;
};

struct JSVM_Env__ {
  explicit JSVM_Env__(v8::Local<v8::Context> context,
                      int32_t module_api_version)
      : isolate(context->GetIsolate()),
        context_persistent(isolate, context),
        module_api_version(module_api_version) {
    jsvm_clear_last_error(this);
  }

  // Constructor for creating partial env.
  explicit JSVM_Env__(v8::Isolate* isolate, int32_t module_api_version);

//cjh  template <typename Fn>
//  inline void RequestInterrupt(Fn&& cb) {
//    auto callback = native_immediates_interrupts_.CreateCallback(
//        std::move(cb), node::CallbackFlags::kRefed);
//    {
//      node::Mutex::ScopedLock lock(native_immediates_threadsafe_mutex_);
//      native_immediates_interrupts_.Push(std::move(callback));
//    }
//    isolate->RequestInterrupt([](v8::Isolate* isolate, void* data) {
//      static_cast<JSVM_Env__*>(data)->RunAndClearInterrupts();
//    }, this);
//  }
//
//  void RunAndClearInterrupts();
//
//  v8impl::Agent* inspector_agent() { return inspector_agent_; }

  v8::Platform* platform();

  inline v8::Local<v8::Context> context() const {
    return v8impl::PersistentToLocal::Strong(context_persistent);
  }

  inline void Ref() { refs++; }
  inline void Unref() {
    if (--refs == 0) DeleteMe();
  }

  virtual bool can_call_into_js() const { return true; }

  static inline void HandleThrow(JSVM_Env env, v8::Local<v8::Value> value) {
    if (env->terminatedOrTerminating()) {
      return;
    }
    env->isolate->ThrowException(value);
  }

  // i.e. whether v8 exited or is about to exit
  inline bool terminatedOrTerminating() {
    return this->isolate->IsExecutionTerminating() || !can_call_into_js();
  }

  // v8 uses a special exception to indicate termination, the
  // `handle_exception` callback should identify such case using
  // terminatedOrTerminating() before actually handle the exception
  template <typename T, typename U = decltype(HandleThrow)>
  inline void CallIntoModule(T&& call, U&& handle_exception = HandleThrow) {
    int open_handle_scopes_before = open_handle_scopes;
    int open_callback_scopes_before = open_callback_scopes;
    jsvm_clear_last_error(this);
    call(this);
    CHECK_EQ(open_handle_scopes, open_handle_scopes_before);
    CHECK_EQ(open_callback_scopes, open_callback_scopes_before);
    if (!last_exception.IsEmpty()) {
      handle_exception(this, last_exception.Get(this->isolate));
      last_exception.Reset();
    }
  }

  // Call finalizer immediately.
  virtual void CallFinalizer(JSVM_Finalize cb, void* data, void* hint) {
    v8::HandleScope handle_scope(isolate);
    CallIntoModule([&](JSVM_Env env) { cb(env, data, hint); });
  }

  // Invoke finalizer from V8 garbage collector.
  void InvokeFinalizerFromGC(v8impl::RefTracker* finalizer);

  // Enqueue the finalizer to the JSVM_Env's own queue of the second pass
  // weak callback.
  // Implementation should drain the queue at the time it is safe to call
  // into JavaScript.
  virtual void EnqueueFinalizer(v8impl::RefTracker* finalizer) {
    pending_finalizers.emplace(finalizer);
  }

  // Remove the finalizer from the scheduled second pass weak callback queue.
  // The finalizer can be deleted after this call.
  virtual void DequeueFinalizer(v8impl::RefTracker* finalizer) {
    pending_finalizers.erase(finalizer);
  }

  virtual void DeleteMe();

  void CheckGCAccess() {
    if (in_gc_finalizer) {
      v8impl::OnFatalError(
          nullptr,
          "Finalizer is calling a function that may affect GC state.\n"
          "The finalizers are run directly from GC and must not affect GC "
          "state.\n"
          "Use `node_api_post_finalizer` from inside of the finalizer to work "
          "around this issue.\n"
          "It schedules the call as a new task in the event loop.");
    }
  }

  template<typename T>
  JSVM_Data__ *NewJsvmData(T srcPtr, JSVM_Data__::DataType type = JSVM_Data__::kJsvmScript) {
    if (dataStack.empty() || open_handle_scopes != dataStack.top().first) {
      dataStack.emplace(open_handle_scopes, std::vector<JSVM_Data__*>());
    }
    auto newData = new JSVM_Data__(srcPtr, false, type);
    dataStack.top().second.push_back(newData);
    return newData;
  }

  void ReleaseJsvmData() {
    if (dataStack.empty() || open_handle_scopes != dataStack.top().first) {
      return;
    }
    for (auto data : dataStack.top().second) {
      if (!data->isGlobal) {
        delete data;
      }
    }
    dataStack.pop();
  }

  v8::Isolate* const isolate;  // Shortcut for context()->GetIsolate()
  v8impl::Persistent<v8::Context> context_persistent;

  v8impl::Persistent<v8::Value> last_exception;

  // We store references in two different lists, depending on whether they have
  // `JSVM_Finalizer` callbacks, because we must first finalize the ones that
  // have such a callback. See `~JSVM_Env__()` above for details.
  v8impl::RefTracker::RefList reflist;
  v8impl::RefTracker::RefList finalizing_reflist;
  // The invocation order of the finalizers is not determined.
  std::unordered_set<v8impl::RefTracker*> pending_finalizers;
  JSVM_ExtendedErrorInfo last_error;
  int open_handle_scopes = 0;
  int open_callback_scopes = 0;
  int refs = 1;
  void* instance_data = nullptr;
  int32_t module_api_version = NODE_API_DEFAULT_MODULE_API_VERSION;
  bool in_gc_finalizer = false;
  v8::Locker* locker = nullptr;
  std::stack<std::pair<int, std::vector<JSVM_Data__*>>> dataStack;

 private:
  v8impl::Agent* inspector_agent_;
  typedef node::CallbackQueue<void, JSVM_Env__*> NativeImmediateQueue;
//cjh  node::Mutex native_immediates_threadsafe_mutex_;
    std::mutex native_immediates_threadsafe_mutex_;
  NativeImmediateQueue native_immediates_interrupts_;

 protected:
  // Should not be deleted directly. Delete with `JSVM_Env__::DeleteMe()`
  // instead.
  virtual ~JSVM_Env__() = default;
};

inline JSVM_Status jsvm_clear_last_error(JSVM_Env env) {
  env->last_error.errorCode = JSVM_OK;
  env->last_error.engineErrorCode = 0;
  env->last_error.engineReserved = nullptr;
  env->last_error.errorMessage = nullptr;
  return JSVM_OK;
}

inline JSVM_Status jsvm_set_last_error(JSVM_Env env,
                                       JSVM_Status errorCode,
                                       uint32_t engineErrorCode = 0,
                                       void* engineReserved = nullptr) {
  env->last_error.errorCode = errorCode;
  env->last_error.engineErrorCode = engineErrorCode;
  env->last_error.engineReserved = engineReserved;
  return errorCode;
}

#define RETURN_STATUS_IF_FALSE(env, condition, status)                         \
  do {                                                                         \
    if (!(condition)) {                                                        \
      return jsvm_set_last_error((env), (status));                             \
    }                                                                          \
  } while (0)

#define RETURN_STATUS_IF_FALSE_WITH_PREAMBLE(env, condition, status)           \
  do {                                                                         \
    if (!(condition)) {                                                        \
      return jsvm_set_last_error(                                              \
          (env), try_catch.HasCaught() ? JSVM_PENDING_EXCEPTION : (status));   \
    }                                                                          \
  } while (0)

#define CHECK_ENV(env)                                                         \
  do {                                                                         \
    if ((env) == nullptr) {                                                    \
      return JSVM_INVALID_ARG;                                                 \
    }                                                                          \
  } while (0)

#define CHECK_ENV_NOT_IN_GC(env)                                               \
  do {                                                                         \
    CHECK_ENV((env));                                                          \
    (env)->CheckGCAccess();                                                    \
  } while (0)

#define CHECK_ARG(env, arg)                                                    \
  RETURN_STATUS_IF_FALSE((env), ((arg) != nullptr), JSVM_INVALID_ARG)

#define CHECK_ARG_NOT_ZERO(env, arg)                                                    \
  RETURN_STATUS_IF_FALSE((env), ((arg) != 0), JSVM_INVALID_ARG)

#define CHECK_ARG_WITH_PREAMBLE(env, arg)                                      \
  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE(                                        \
      (env), ((arg) != nullptr), JSVM_INVALID_ARG)

#define CHECK_MAYBE_EMPTY(env, maybe, status)                                  \
  RETURN_STATUS_IF_FALSE((env), !((maybe).IsEmpty()), (status))

#define CHECK_MAYBE_EMPTY_WITH_PREAMBLE(env, maybe, status)                    \
  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE((env), !((maybe).IsEmpty()), (status))

// JSVM_PREAMBLE is not wrapped in do..while: try_catch must have function scope
#define JSVM_PREAMBLE(env)                                                     \
  CHECK_ENV((env));                                                            \
  RETURN_STATUS_IF_FALSE(                                                      \
      (env), (env)->last_exception.IsEmpty(), JSVM_PENDING_EXCEPTION);         \
  RETURN_STATUS_IF_FALSE((env),                                                \
                         (env)->can_call_into_js(),                            \
                         (env->module_api_version == JSVM_VERSION_EXPERIMENTAL \
                              ? JSVM_CANNOT_RUN_JS                             \
                              : JSVM_PENDING_EXCEPTION));                      \
  jsvm_clear_last_error((env));                                                \
  v8impl::TryCatch try_catch((env))

#define CHECK_TO_TYPE(env, type, context, result, src, status)                 \
  do {                                                                         \
    CHECK_ARG((env), (src));                                                   \
    auto maybe = v8impl::V8LocalValueFromJsValue((src))->To##type((context));  \
    CHECK_MAYBE_EMPTY((env), maybe, (status));                                 \
    (result) = maybe.ToLocalChecked();                                         \
  } while (0)

#define CHECK_TO_TYPE_WITH_PREAMBLE(env, type, context, result, src, status)   \
  do {                                                                         \
    CHECK_ARG_WITH_PREAMBLE((env), (src));                                     \
    auto maybe = v8impl::V8LocalValueFromJsValue((src))->To##type((context));  \
    CHECK_MAYBE_EMPTY_WITH_PREAMBLE((env), maybe, (status));                   \
    (result) = maybe.ToLocalChecked();                                         \
  } while (0)

#define CHECK_TO_FUNCTION(env, result, src)                                    \
  do {                                                                         \
    CHECK_ARG((env), (src));                                                   \
    v8::Local<v8::Value> v8value = v8impl::V8LocalValueFromJsValue((src));     \
    RETURN_STATUS_IF_FALSE((env), v8value->IsFunction(), JSVM_INVALID_ARG);    \
    (result) = v8value.As<v8::Function>();                                     \
  } while (0)

#define CHECK_TO_OBJECT(env, context, result, src)                             \
  CHECK_TO_TYPE((env), Object, (context), (result), (src), JSVM_OBJECT_EXPECTED)

#define CHECK_TO_BIGINT(env, context, result, src)                             \
  CHECK_TO_TYPE((env), BigInt, (context), (result), (src), JSVM_BIGINT_EXPECTED)

#define CHECK_TO_OBJECT_WITH_PREAMBLE(env, context, result, src)               \
  CHECK_TO_TYPE_WITH_PREAMBLE(                                                 \
      (env), Object, (context), (result), (src), JSVM_OBJECT_EXPECTED)

#define CHECK_TO_STRING(env, context, result, src)                             \
  CHECK_TO_TYPE((env), String, (context), (result), (src), JSVM_STRING_EXPECTED)

#define GET_RETURN_STATUS(env)                                                 \
  (!try_catch.HasCaught()                                                      \
       ? JSVM_OK                                                               \
       : jsvm_set_last_error((env), JSVM_PENDING_EXCEPTION))

#define THROW_RANGE_ERROR_IF_FALSE(env, condition, error, message)             \
  do {                                                                         \
    if (!(condition)) {                                                        \
      OH_JSVM_ThrowRangeError((env), (error), (message));                       \
      return jsvm_set_last_error((env), JSVM_GENERIC_FAILURE);                 \
    }                                                                          \
  } while (0)

#define CHECK_MAYBE_EMPTY_WITH_PREAMBLE(env, maybe, status)                    \
  RETURN_STATUS_IF_FALSE_WITH_PREAMBLE((env), !((maybe).IsEmpty()), (status))

#define STATUS_CALL(call)                                                      \
  do {                                                                         \
    JSVM_Status status = (call);                                               \
    if (status != JSVM_OK) return status;                                      \
  } while (0)

namespace v8impl {

//=== Conversion between V8 Handles and JSVM_Value ========================

// This asserts v8::Local<> will always be implemented with a single
// pointer field so that we can pass it around as a void*.
static_assert(sizeof(v8::Local<v8::Value>) == sizeof(JSVM_Value),
              "Cannot convert between v8::Local<v8::Value> and JSVM_Value");

inline JSVM_Value JsValueFromV8LocalValue(v8::Local<v8::Value> local) {
  return reinterpret_cast<JSVM_Value>(*local);
}

inline v8::Local<v8::Value> V8LocalValueFromJsValue(JSVM_Value v) {
  v8::Local<v8::Value> local;
  memcpy(static_cast<void*>(&local), &v, sizeof(v));
  return local;
}

// Adapter for JSVM_Finalize callbacks.
class Finalizer {
 protected:
  Finalizer(JSVM_Env env,
            JSVM_Finalize finalize_callback,
            void* finalize_data,
            void* finalize_hint)
      : env_(env),
        finalize_callback_(finalize_callback),
        finalize_data_(finalize_data),
        finalize_hint_(finalize_hint) {}

  virtual ~Finalizer() = default;

 public:
  static Finalizer* New(JSVM_Env env,
                        JSVM_Finalize finalize_callback = nullptr,
                        void* finalize_data = nullptr,
                        void* finalize_hint = nullptr) {
    return new Finalizer(env, finalize_callback, finalize_data, finalize_hint);
  }

  JSVM_Finalize callback() { return finalize_callback_; }
  void* data() { return finalize_data_; }
  void* hint() { return finalize_hint_; }

  void ResetFinalizer();

 protected:
  JSVM_Env env_;
  JSVM_Finalize finalize_callback_;
  void* finalize_data_;
  void* finalize_hint_;
};

class TryCatch : public v8::TryCatch {
 public:
  explicit TryCatch(JSVM_Env env) : v8::TryCatch(env->isolate), _env(env) {}

  ~TryCatch() {
    if (HasCaught()) {
      _env->last_exception.Reset(_env->isolate, Exception());
    }
  }

 private:
  JSVM_Env _env;
};

// Ownership of a reference.
enum class Ownership {
  // The reference is owned by the runtime. No userland call is needed to
  // destruct the reference.
  kRuntime,
  // The reference is owned by the userland. User code is responsible to delete
  // the reference with appropriate node-api calls.
  kUserland,
};

// Wrapper around Finalizer that can be tracked.
class TrackedFinalizer : public Finalizer, public RefTracker {
 protected:
  TrackedFinalizer(JSVM_Env env,
                   JSVM_Finalize finalizeCallback,
                   void* finalizeData,
                   void* finalizeHint);

 public:
  static TrackedFinalizer* New(JSVM_Env env,
                               JSVM_Finalize finalizeCallback,
                               void* finalizeData,
                               void* finalizeHint);
  ~TrackedFinalizer() override;

 protected:
  void Finalize() override;
  void FinalizeCore(bool deleteMe);
};

// Wrapper around Finalizer that implements reference counting.
class RefBase : public TrackedFinalizer {
 protected:
  RefBase(JSVM_Env env,
          uint32_t initialRefcount,
          Ownership ownership,
          JSVM_Finalize finalizeCallback,
          void* finalizeData,
          void* finalizeHint);

 public:
  static RefBase* New(JSVM_Env env,
                      uint32_t initialRefcount,
                      Ownership ownership,
                      JSVM_Finalize finalizeCallback,
                      void* finalizeData,
                      void* finalizeHint);

  void* Data();
  uint32_t Ref();
  uint32_t Unref();
  uint32_t RefCount();

  Ownership ownership() { return ownership_; }

 protected:
  void Finalize() override;

 private:
  uint32_t refcount_;
  Ownership ownership_;
};

// Wrapper around v8impl::Persistent.
class Reference : public RefBase {
 protected:
  template <typename... Args>
  Reference(JSVM_Env env, v8::Local<v8::Value> value, Args&&... args);

 public:
  static Reference* New(JSVM_Env env,
                        v8::Local<v8::Value> value,
                        uint32_t initialRefcount,
                        Ownership ownership,
                        JSVM_Finalize finalizeCallback = nullptr,
                        void* finalizeData = nullptr,
                        void* finalizeHint = nullptr);

  virtual ~Reference();
  bool HasDeletedByUser() {
    return deleted_by_user;
  }
  uint32_t Ref();
  uint32_t Unref();
  v8::Local<v8::Value> Get();
  void Delete();
    
 protected:
  void Finalize() override;

 private:
  static void WeakCallback(const v8::WeakCallbackInfo<Reference>& data);

  void SetWeak();

  v8impl::Persistent<v8::Value> persistent_;
  bool can_be_weak_;
  bool deleted_by_user;
  bool wait_callback;
};

typedef JSVM_Value (* GetterCallback)(JSVM_Env, JSVM_Value, JSVM_Value, JSVM_Value);
typedef JSVM_Value (* SetterCallback)(JSVM_Env, JSVM_Value, JSVM_Value, JSVM_Value, JSVM_Value);
typedef JSVM_Value (* DeleterCallback)(JSVM_Env, JSVM_Value, JSVM_Value, JSVM_Value);
typedef JSVM_Value (* EnumeratorCallback)(JSVM_Env, JSVM_Value, JSVM_Value);

struct JSVM_PropertyHandlerCfgStruct {
  GetterCallback namedGetterCallback_;
  SetterCallback namedSetterCallback_;
  DeleterCallback nameDeleterCallback_;
  EnumeratorCallback namedEnumeratorCallback_;
  GetterCallback indexedGetterCallback_;
  SetterCallback indexedSetterCallback_;
  DeleterCallback indexedDeleterCallback_;
  EnumeratorCallback indexedEnumeratorCallback_;
  JSVM_Ref namedPropertyData_;
  JSVM_Ref indexedPropertyData_;
};

inline JSVM_PropertyHandlerCfgStruct* CreatePropertyCfg(JSVM_Env env, JSVM_PropertyHandlerCfg propertyCfg)
{
  JSVM_PropertyHandlerCfgStruct* newPropertyCfg = new JSVM_PropertyHandlerCfgStruct;
  if (newPropertyCfg != nullptr && propertyCfg != nullptr) {
    newPropertyCfg->namedGetterCallback_ = propertyCfg->genericNamedPropertyGetterCallback;
    newPropertyCfg->namedSetterCallback_ = propertyCfg->genericNamedPropertySetterCallback;
    newPropertyCfg->nameDeleterCallback_ = propertyCfg->genericNamedPropertyDeleterCallback;
    newPropertyCfg->namedEnumeratorCallback_ = propertyCfg->genericNamedPropertyEnumeratorCallback;
    newPropertyCfg->indexedGetterCallback_ = propertyCfg->genericIndexedPropertyGetterCallback;
    newPropertyCfg->indexedSetterCallback_ = propertyCfg->genericIndexedPropertySetterCallback;
    newPropertyCfg->indexedDeleterCallback_ = propertyCfg->genericIndexedPropertyDeleterCallback;
    newPropertyCfg->indexedEnumeratorCallback_ = propertyCfg->genericIndexedPropertyEnumeratorCallback;
    newPropertyCfg->namedPropertyData_ = nullptr;
    newPropertyCfg->indexedPropertyData_ = nullptr;
    if (propertyCfg->namedPropertyData != nullptr) {
      v8::Local<v8::Value> v8_value = v8impl::V8LocalValueFromJsValue(propertyCfg->namedPropertyData);
      v8impl::Reference* reference = v8impl::Reference::New(env, v8_value, 1, v8impl::Ownership::kUserland);
      newPropertyCfg->namedPropertyData_ = reinterpret_cast<JSVM_Ref>(reference);
    }

    if (propertyCfg->indexedPropertyData != nullptr) {
      v8::Local<v8::Value> v8_value = v8impl::V8LocalValueFromJsValue(propertyCfg->indexedPropertyData);
      v8impl::Reference* reference = v8impl::Reference::New(env, v8_value, 1, v8impl::Ownership::kUserland);
      newPropertyCfg->indexedPropertyData_ = reinterpret_cast<JSVM_Ref>(reference);
    }
  }

  return newPropertyCfg;
}

inline void CfgFinalizedCallback(JSVM_Env env, void* finalizeData, void* finalizeHint)
{
  auto cfg = reinterpret_cast<JSVM_PropertyHandlerCfgStruct *>(finalizeData);
  if (cfg->namedPropertyData_ != nullptr) {
    delete reinterpret_cast<v8impl::Reference*>(cfg->namedPropertyData_);
  }
  if (cfg->indexedPropertyData_ != nullptr) {
    delete reinterpret_cast<v8impl::Reference*>(cfg->indexedPropertyData_);
  }
  delete cfg;
}

#ifdef TARGET_OHOS
namespace ResourceSchedule {
namespace ResType {
enum : uint32_t {
  RES_TYPE_REPORT_KEY_THREAD = 39
};

enum ReportChangeStatus : int64_t {
  CREATE = 0,
  REMOVE = 1
};

enum ThreadRole : int64_t {
  USER_INTERACT = 0,
  NORMAL_DISPLAY = 1,
  IMPORTANT_DISPLAY = 2,
  NORMAL_AUDIO = 3,
  IMPORTANT_AUDIO = 4,
  IMAGE_DECODE = 5
};
}

static inline void ReportKeyThread(uid_t uid, pid_t pid, pid_t tid, ResType::ThreadRole role)
{
  std::unordered_map<std::string, std::string> payLoad = {
    {"uid", std::to_string(uid)},
    {"pid", std::to_string(pid)},
    {"tid", std::to_string(tid)},
    {"role", std::to_string(role)}};
  ReportData(v8impl::ResourceSchedule::ResType::RES_TYPE_REPORT_KEY_THREAD,
      v8impl::ResourceSchedule::ResType::ReportChangeStatus::CREATE, payLoad);
}
}
#endif
}  // end of namespace v8impl

#endif  // SRC_JS_NATIVE_API_V8_H_
