#pragma once
// clang-format off
#include "../../config.h"
#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

    #include "inspector_agent.h"
    #include "v8.h"
    #include "uv.h"
    #include "util.h"
    #include "node.h"

namespace node {

// Pick an index that's hopefully out of the way when we're embedded inside
// another application. Performance-wise or memory-wise it doesn't matter:
// Context::SetAlignedPointerInEmbedderData() is backed by a FixedArray,
// worst case we pay a one-time penalty for resizing the array.
    #ifndef NODE_CONTEXT_EMBEDDER_DATA_INDEX
        #define NODE_CONTEXT_EMBEDDER_DATA_INDEX 32
    #endif

// PER_ISOLATE_* macros: We have a lot of per-isolate properties
// and adding and maintaining their getters and setters by hand would be
// difficult so let's make the preprocessor generate them for us.
//
// In each macro, `V` is expected to be the name of a macro or function which
// accepts the number of arguments provided in each tuple in the macro body,
// typically two. The named function will be invoked against each tuple.
//
// Make sure that any macro V defined for use with the PER_ISOLATE_* macros is
// undefined again after use.

// Private symbols are per-isolate primitives but Environment proxies them
// for the sake of convenience.  Strings should be ASCII-only and have a
// "node:" prefix to avoid name clashes with third-party code.
    #define PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(V)                    \
        V(alpn_buffer_private_symbol, "node:alpnBuffer")                \
        V(arrow_message_private_symbol, "node:arrowMessage")            \
        V(contextify_context_private_symbol, "node:contextify:context") \
        V(contextify_global_private_symbol, "node:contextify:global")   \
        V(inspector_delegate_private_symbol, "node:inspector:delegate") \
        V(decorated_private_symbol, "node:decorated")                   \
        V(npn_buffer_private_symbol, "node:npnBuffer")                  \
        V(processed_private_symbol, "node:processed")                   \
        V(selected_npn_buffer_private_symbol, "node:selectedNpnBuffer")

// Strings are per-isolate primitives but Environment proxies them
// for the sake of convenience.  Strings should be ASCII-only.
    #define PER_ISOLATE_STRING_PROPERTIES(V)                                      \
        V(address_string, "address")                                              \
        V(args_string, "args")                                                    \
        V(async, "async")                                                         \
        V(buffer_string, "buffer")                                                \
        V(bytes_string, "bytes")                                                  \
        V(bytes_parsed_string, "bytesParsed")                                     \
        V(bytes_read_string, "bytesRead")                                         \
        V(cached_data_string, "cachedData")                                       \
        V(cached_data_produced_string, "cachedDataProduced")                      \
        V(cached_data_rejected_string, "cachedDataRejected")                      \
        V(callback_string, "callback")                                            \
        V(change_string, "change")                                                \
        V(channel_string, "channel")                                              \
        V(oncertcb_string, "oncertcb")                                            \
        V(onclose_string, "_onclose")                                             \
        V(code_string, "code")                                                    \
        V(configurable_string, "configurable")                                    \
        V(cwd_string, "cwd")                                                      \
        V(dest_string, "dest")                                                    \
        V(detached_string, "detached")                                            \
        V(disposed_string, "_disposed")                                           \
        V(dns_a_string, "A")                                                      \
        V(dns_aaaa_string, "AAAA")                                                \
        V(dns_cname_string, "CNAME")                                              \
        V(dns_mx_string, "MX")                                                    \
        V(dns_naptr_string, "NAPTR")                                              \
        V(dns_ns_string, "NS")                                                    \
        V(dns_ptr_string, "PTR")                                                  \
        V(dns_soa_string, "SOA")                                                  \
        V(dns_srv_string, "SRV")                                                  \
        V(dns_txt_string, "TXT")                                                  \
        V(domain_string, "domain")                                                \
        V(emitting_top_level_domain_error_string, "_emittingTopLevelDomainError") \
        V(exchange_string, "exchange")                                            \
        V(enumerable_string, "enumerable")                                        \
        V(idle_string, "idle")                                                    \
        V(irq_string, "irq")                                                      \
        V(encoding_string, "encoding")                                            \
        V(enter_string, "enter")                                                  \
        V(entries_string, "entries")                                              \
        V(env_pairs_string, "envPairs")                                           \
        V(errno_string, "errno")                                                  \
        V(error_string, "error")                                                  \
        V(events_string, "_events")                                               \
        V(exiting_string, "_exiting")                                             \
        V(exit_code_string, "exitCode")                                           \
        V(exit_string, "exit")                                                    \
        V(expire_string, "expire")                                                \
        V(exponent_string, "exponent")                                            \
        V(exports_string, "exports")                                              \
        V(ext_key_usage_string, "ext_key_usage")                                  \
        V(external_stream_string, "_externalStream")                              \
        V(family_string, "family")                                                \
        V(fatal_exception_string, "_fatalException")                              \
        V(fd_string, "fd")                                                        \
        V(file_string, "file")                                                    \
        V(fingerprint_string, "fingerprint")                                      \
        V(flags_string, "flags")                                                  \
        V(get_string, "get")                                                      \
        V(get_data_clone_error_string, "_getDataCloneError")                      \
        V(get_shared_array_buffer_id_string, "_getSharedArrayBufferId")           \
        V(gid_string, "gid")                                                      \
        V(handle_string, "handle")                                                \
        V(homedir_string, "homedir")                                              \
        V(hostmaster_string, "hostmaster")                                        \
        V(ignore_string, "ignore")                                                \
        V(immediate_callback_string, "_immediateCallback")                        \
        V(infoaccess_string, "infoAccess")                                        \
        V(inherit_string, "inherit")                                              \
        V(input_string, "input")                                                  \
        V(internal_string, "internal")                                            \
        V(ipv4_string, "IPv4")                                                    \
        V(ipv6_string, "IPv6")                                                    \
        V(isalive_string, "isAlive")                                              \
        V(isclosing_string, "isClosing")                                          \
        V(issuer_string, "issuer")                                                \
        V(issuercert_string, "issuerCertificate")                                 \
        V(kill_signal_string, "killSignal")                                       \
        V(length_string, "length")                                                \
        V(mac_string, "mac")                                                      \
        V(max_buffer_string, "maxBuffer")                                         \
        V(message_string, "message")                                              \
        V(minttl_string, "minttl")                                                \
        V(model_string, "model")                                                  \
        V(modulus_string, "modulus")                                              \
        V(name_string, "name")                                                    \
        V(netmask_string, "netmask")                                              \
        V(nice_string, "nice")                                                    \
        V(nsname_string, "nsname")                                                \
        V(ocsp_request_string, "OCSPRequest")                                     \
        V(onchange_string, "onchange")                                            \
        V(onclienthello_string, "onclienthello")                                  \
        V(oncomplete_string, "oncomplete")                                        \
        V(onconnection_string, "onconnection")                                    \
        V(ondone_string, "ondone")                                                \
        V(onerror_string, "onerror")                                              \
        V(onexit_string, "onexit")                                                \
        V(onhandshakedone_string, "onhandshakedone")                              \
        V(onhandshakestart_string, "onhandshakestart")                            \
        V(onmessage_string, "onmessage")                                          \
        V(onnewsession_string, "onnewsession")                                    \
        V(onnewsessiondone_string, "onnewsessiondone")                            \
        V(onocspresponse_string, "onocspresponse")                                \
        V(onread_string, "onread")                                                \
        V(onreadstart_string, "onreadstart")                                      \
        V(onreadstop_string, "onreadstop")                                        \
        V(onselect_string, "onselect")                                            \
        V(onshutdown_string, "onshutdown")                                        \
        V(onsignal_string, "onsignal")                                            \
        V(onstop_string, "onstop")                                                \
        V(onwrite_string, "onwrite")                                              \
        V(output_string, "output")                                                \
        V(order_string, "order")                                                  \
        V(owner_string, "owner")                                                  \
        V(parse_error_string, "Parse Error")                                      \
        V(path_string, "path")                                                    \
        V(pbkdf2_error_string, "PBKDF2 Error")                                    \
        V(pid_string, "pid")                                                      \
        V(pipe_string, "pipe")                                                    \
        V(port_string, "port")                                                    \
        V(preference_string, "preference")                                        \
        V(priority_string, "priority")                                            \
        V(produce_cached_data_string, "produceCachedData")                        \
        V(raw_string, "raw")                                                      \
        V(read_host_object_string, "_readHostObject")                             \
        V(readable_string, "readable")                                            \
        V(received_shutdown_string, "receivedShutdown")                           \
        V(refresh_string, "refresh")                                              \
        V(regexp_string, "regexp")                                                \
        V(rename_string, "rename")                                                \
        V(replacement_string, "replacement")                                      \
        V(retry_string, "retry")                                                  \
        V(serial_string, "serial")                                                \
        V(scopeid_string, "scopeid")                                              \
        V(sent_shutdown_string, "sentShutdown")                                   \
        V(serial_number_string, "serialNumber")                                   \
        V(service_string, "service")                                              \
        V(servername_string, "servername")                                        \
        V(session_id_string, "sessionId")                                         \
        V(set_string, "set")                                                      \
        V(shell_string, "shell")                                                  \
        V(signal_string, "signal")                                                \
        V(size_string, "size")                                                    \
        V(sni_context_err_string, "Invalid SNI context")                          \
        V(sni_context_string, "sni_context")                                      \
        V(speed_string, "speed")                                                  \
        V(stack_string, "stack")                                                  \
        V(status_string, "status")                                                \
        V(stdio_string, "stdio")                                                  \
        V(subject_string, "subject")                                              \
        V(subjectaltname_string, "subjectaltname")                                \
        V(sys_string, "sys")                                                      \
        V(syscall_string, "syscall")                                              \
        V(tick_callback_string, "_tickCallback")                                  \
        V(tick_domain_cb_string, "_tickDomainCallback")                           \
        V(ticketkeycallback_string, "onticketkeycallback")                        \
        V(timeout_string, "timeout")                                              \
        V(times_string, "times")                                                  \
        V(tls_ticket_string, "tlsTicket")                                         \
        V(ttl_string, "ttl")                                                      \
        V(type_string, "type")                                                    \
        V(uid_string, "uid")                                                      \
        V(unknown_string, "<unknown>")                                            \
        V(user_string, "user")                                                    \
        V(username_string, "username")                                            \
        V(valid_from_string, "valid_from")                                        \
        V(valid_to_string, "valid_to")                                            \
        V(value_string, "value")                                                  \
        V(verify_error_string, "verifyError")                                     \
        V(version_string, "version")                                              \
        V(weight_string, "weight")                                                \
        V(windows_verbatim_arguments_string, "windowsVerbatimArguments")          \
        V(wrap_string, "wrap")                                                    \
        V(writable_string, "writable")                                            \
        V(write_host_object_string, "_writeHostObject")                           \
        V(write_queue_size_string, "writeQueueSize")                              \
        V(x_forwarded_string, "x-forwarded-for")                                  \
        V(zero_return_string, "ZERO_RETURN")

    #define ENVIRONMENT_STRONG_PERSISTENT_PROPERTIES(V)              \
        V(as_external, v8::External)                                 \
        V(async_hooks_destroy_function, v8::Function)                \
        V(async_hooks_init_function, v8::Function)                   \
        V(async_hooks_before_function, v8::Function)                 \
        V(async_hooks_after_function, v8::Function)                  \
        V(binding_cache_object, v8::Object)                          \
        V(buffer_constructor_function, v8::Function)                 \
        V(buffer_prototype_object, v8::Object)                       \
        V(context, v8::Context)                                      \
        V(domain_array, v8::Array)                                   \
        V(domains_stack_array, v8::Array)                            \
        V(jsstream_constructor_template, v8::FunctionTemplate)       \
        V(module_load_list_array, v8::Array)                         \
        V(pbkdf2_constructor_template, v8::ObjectTemplate)           \
        V(pipe_constructor_template, v8::FunctionTemplate)           \
        V(process_object, v8::Object)                                \
        V(promise_reject_function, v8::Function)                     \
        V(promise_wrap_template, v8::ObjectTemplate)                 \
        V(push_values_to_array_function, v8::Function)               \
        V(randombytes_constructor_template, v8::ObjectTemplate)      \
        V(script_context_constructor_template, v8::FunctionTemplate) \
        V(script_data_constructor_function, v8::Function)            \
        V(secure_context_constructor_template, v8::FunctionTemplate) \
        V(tcp_constructor_template, v8::FunctionTemplate)            \
        V(tick_callback_function, v8::Function)                      \
        V(tls_wrap_constructor_function, v8::Function)               \
        V(tls_wrap_constructor_template, v8::FunctionTemplate)       \
        V(tty_constructor_template, v8::FunctionTemplate)            \
        V(udp_constructor_function, v8::Function)                    \
        V(url_constructor_function, v8::Function)                    \
        V(write_wrap_constructor_function, v8::Function)

class IsolateData {
public:
    inline IsolateData(v8::Isolate *isolate, uv_loop_t *event_loop,
                       uint32_t *zero_fill_field = nullptr);
    inline uv_loop_t *event_loop() const;
    inline uint32_t *zero_fill_field() const;

    #define VP(PropertyName, StringValue) V(v8::Private, PropertyName)
    #define VS(PropertyName, StringValue) V(v8::String, PropertyName)
    #define V(TypeName, PropertyName) \
        inline v8::Local<TypeName> PropertyName(v8::Isolate *isolate) const;
    PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(VP)
    PER_ISOLATE_STRING_PROPERTIES(VS)
    #undef V
    #undef VS
    #undef VP

private:
    #define VP(PropertyName, StringValue) V(v8::Private, PropertyName)
    #define VS(PropertyName, StringValue) V(v8::String, PropertyName)
    #define V(TypeName, PropertyName) \
        v8::Eternal<TypeName> PropertyName##_;
    PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(VP)
    PER_ISOLATE_STRING_PROPERTIES(VS)
    #undef V
    #undef VS
    #undef VP

    uv_loop_t *const event_loop_;
    uint32_t *const zero_fill_field_;

    NODE_DISALLOW_COPY_AND_ASSIGN(IsolateData);
};

class Environment {
public:
    static const int kContextEmbedderDataIndex = NODE_CONTEXT_EMBEDDER_DATA_INDEX;

    static inline Environment *GetCurrent(v8::Isolate *isolate);
    static inline Environment *GetCurrent(v8::Local<v8::Context> context);
    static inline Environment *GetCurrent(const v8::FunctionCallbackInfo<v8::Value> &info);

    template <typename T>
    static inline Environment *GetCurrent(const v8::PropertyCallbackInfo<T> &info);

    inline Environment(IsolateData *isolate_data, v8::Local<v8::Context> context);
    inline ~Environment();

    void Start(int argc,
               const char *const *argv,
               int exec_argc,
               const char *const *exec_argv,
               bool start_profiler_idle_notifier);
    void AssignToContext(v8::Local<v8::Context> context);
    void CleanupHandles();

    void StartProfilerIdleNotifier();
    void StopProfilerIdleNotifier();

    inline v8::Isolate *isolate() const {
        return isolate_;
    }

    inline IsolateData *isolate_data() const {
        return isolate_data_;
    }

    inline uv_loop_t *event_loop() const {
        return isolate_data()->event_loop();
    }

    inline inspector::Agent *inspector_agent() {
        return &inspector_agent_;
    }

    // Strings and private symbols are shared across shared contexts
    // The getters simply proxy to the per-isolate primitive.
    #define VP(PropertyName, StringValue) V(v8::Private, PropertyName)
    #define VS(PropertyName, StringValue) V(v8::String, PropertyName)
    #define V(TypeName, PropertyName) \
        inline v8::Local<TypeName> PropertyName() const;
    PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(VP)
    PER_ISOLATE_STRING_PROPERTIES(VS)
    #undef V
    #undef VS
    #undef VP

    #define V(PropertyName, TypeName)                    \
        inline v8::Local<TypeName> PropertyName() const; \
        inline void set_##PropertyName(v8::Local<TypeName> value);
    ENVIRONMENT_STRONG_PERSISTENT_PROPERTIES(V)
    #undef V

    inline void ThrowError(const char *errmsg);
    inline void ThrowTypeError(const char *errmsg);
    inline void ThrowRangeError(const char *errmsg);
    inline void ThrowErrnoException(int errorno,
                                    const char *syscall = nullptr,
                                    const char *message = nullptr,
                                    const char *path = nullptr);
    inline void ThrowUVException(int errorno,
                                 const char *syscall = nullptr,
                                 const char *message = nullptr,
                                 const char *path = nullptr,
                                 const char *dest = nullptr);

    inline v8::Local<v8::FunctionTemplate>
    NewFunctionTemplate(v8::FunctionCallback callback,
                        v8::Local<v8::Signature> signature =
                            v8::Local<v8::Signature>());

    // Convenience methods for NewFunctionTemplate().
    inline void SetMethod(v8::Local<v8::Object> that,
                          const char *name,
                          v8::FunctionCallback callback);

    class AsyncCallbackScope {
    public:
        AsyncCallbackScope() = delete;
        explicit AsyncCallbackScope(Environment *env);
        ~AsyncCallbackScope();
        inline bool in_makecallback();

    private:
        Environment *env_;

        NODE_DISALLOW_COPY_AND_ASSIGN(AsyncCallbackScope);
    };

private:
    inline void ThrowError(v8::Local<v8::Value> (*fun)(v8::Local<v8::String>),
                           const char *errmsg);

    v8::Isolate *const isolate_;
    IsolateData *const isolate_data_;

    #define V(PropertyName, TypeName) \
        v8::Persistent<TypeName> PropertyName##_;
    ENVIRONMENT_STRONG_PERSISTENT_PROPERTIES(V)
    #undef V
    inspector::Agent inspector_agent_;
    size_t makecallback_cntr_;
};

inline IsolateData::IsolateData(v8::Isolate *isolate, uv_loop_t *event_loop,
                                uint32_t *zero_fill_field) :
    // Create string and private symbol properties as internalized one byte strings.
    //
    // Internalized because it makes property lookups a little faster and because
    // the string is created in the old space straight away.  It's going to end up
    // in the old space sooner or later anyway but now it doesn't go through
    // v8::Eternal's new space handling first.
    //
    // One byte because our strings are ASCII and we can safely skip V8's UTF-8
    // decoding step.  It's a one-time cost, but why pay it when you don't have to?
    #define V(PropertyName, StringValue)                            \
        PropertyName##_(                                            \
            isolate,                                                \
            v8::Private::New(                                       \
                isolate,                                            \
                v8::String::NewFromOneByte(                         \
                    isolate,                                        \
                    reinterpret_cast<const uint8_t *>(StringValue), \
                    v8::NewStringType::kInternalized,               \
                    sizeof(StringValue) - 1)                        \
                    .ToLocalChecked())),
                                                             PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(V)
    #undef V
    #define V(PropertyName, StringValue)                        \
        PropertyName##_(                                        \
            isolate,                                            \
            v8::String::NewFromOneByte(                         \
                isolate,                                        \
                reinterpret_cast<const uint8_t *>(StringValue), \
                v8::NewStringType::kInternalized,               \
                sizeof(StringValue) - 1)                        \
                .ToLocalChecked()),
                                                                 PER_ISOLATE_STRING_PROPERTIES(V)
    #undef V
                                                                     event_loop_(event_loop),
                                                             zero_fill_field_(zero_fill_field) {
}

inline uv_loop_t *IsolateData::event_loop() const {
    return event_loop_;
}

inline uint32_t *IsolateData::zero_fill_field() const {
    return zero_fill_field_;
}

inline Environment *Environment::GetCurrent(v8::Isolate *isolate) {
    return GetCurrent(isolate->GetCurrentContext());
}

inline Environment *Environment::GetCurrent(v8::Local<v8::Context> context) {
    return static_cast<Environment *>(
        context->GetAlignedPointerFromEmbedderData(kContextEmbedderDataIndex));
}

inline Environment *Environment::GetCurrent(
    const v8::FunctionCallbackInfo<v8::Value> &info) {
    CHECK(info.Data()->IsExternal());
    return static_cast<Environment *>(info.Data().As<v8::External>()->Value());
}

template <typename T>
inline Environment *Environment::GetCurrent(
    const v8::PropertyCallbackInfo<T> &info) {
    CHECK(info.Data()->IsExternal());
    // XXX(bnoordhuis) Work around a g++ 4.9.2 template type inferrer bug
    // when the expression is written as info.Data().As<v8::External>().
    v8::Local<v8::Value> data = info.Data();
    return static_cast<Environment *>(data.As<v8::External>()->Value());
}

inline Environment::Environment(IsolateData *isolate_data, v8::Local<v8::Context> context)
: isolate_(context->GetIsolate()),
  isolate_data_(isolate_data),
  inspector_agent_(this),
  makecallback_cntr_(0),
  context_(context->GetIsolate(), context) {
    // We'll be creating new objects so make sure we've entered the context.
    v8::HandleScope handle_scope(isolate());
    v8::Context::Scope context_scope(context);
    set_as_external(v8::External::New(isolate(), this));
    set_binding_cache_object(v8::Object::New(isolate()));
    set_module_load_list_array(v8::Array::New(isolate()));

    AssignToContext(context);

    //cjh        destroy_ids_list_.reserve(512);
}

inline Environment::~Environment() {
    v8::HandleScope handle_scope(isolate());

    context()->SetAlignedPointerInEmbedderData(kContextEmbedderDataIndex,
                                               nullptr);
    #define V(PropertyName, TypeName) PropertyName##_.Reset();
    ENVIRONMENT_STRONG_PERSISTENT_PROPERTIES(V)
    #undef V

    //        delete[] heap_statistics_buffer_;
    //        delete[] heap_space_statistics_buffer_;
    //        delete[] http_parser_buffer_;
}

inline void Environment::SetMethod(v8::Local<v8::Object> that,
                                   const char *name,
                                   v8::FunctionCallback callback) {
    v8::Local<v8::Function> function =
        NewFunctionTemplate(callback)->GetFunction(context()).ToLocalChecked();
    // kInternalized strings are created in the old space.
    const v8::NewStringType type = v8::NewStringType::kInternalized;
    v8::Local<v8::String> name_string =
        v8::String::NewFromUtf8(isolate(), name, type).ToLocalChecked();
    that->Set(isolate()->GetCurrentContext(), name_string, function).Check();
    function->SetName(name_string); // NODE_SET_METHOD() compatibility.
}

inline void Environment::ThrowError(const char *errmsg) {
    ThrowError(v8::Exception::Error, errmsg);
}

inline void Environment::ThrowTypeError(const char *errmsg) {
    ThrowError(v8::Exception::TypeError, errmsg);
}

inline void Environment::ThrowRangeError(const char *errmsg) {
    ThrowError(v8::Exception::RangeError, errmsg);
}

inline void Environment::ThrowError(
    v8::Local<v8::Value> (*fun)(v8::Local<v8::String>),
    const char *errmsg) {
    v8::HandleScope handle_scope(isolate());
    isolate()->ThrowException(fun(OneByteString(isolate(), errmsg)));
}

inline void Environment::ThrowErrnoException(int errorno,
                                             const char *syscall,
                                             const char *message,
                                             const char *path) {
    isolate()->ThrowException(
        ErrnoException(isolate(), errorno, syscall, message, path));
}

inline void Environment::ThrowUVException(int errorno,
                                          const char *syscall,
                                          const char *message,
                                          const char *path,
                                          const char *dest) {
    isolate()->ThrowException(
        UVException(isolate(), errorno, syscall, message, path, dest));
}

inline v8::Local<v8::FunctionTemplate>
Environment::NewFunctionTemplate(v8::FunctionCallback callback,
                                 v8::Local<v8::Signature> signature) {
    v8::Local<v8::External> external = as_external();
    return v8::FunctionTemplate::New(isolate(), callback, external, signature);
}

    #define VP(PropertyName, StringValue) V(v8::Private, PropertyName)
    #define VS(PropertyName, StringValue) V(v8::String, PropertyName)
    #define V(TypeName, PropertyName)                                                      \
        inline v8::Local<TypeName> IsolateData::PropertyName(v8::Isolate *isolate) const { \
            /* Strings are immutable so casting away const-ness here is okay. */           \
            return const_cast<IsolateData *>(this)->PropertyName##_.Get(isolate);          \
        }
PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(VP)
PER_ISOLATE_STRING_PROPERTIES(VS)
    #undef V
    #undef VS
    #undef VP

    #define VP(PropertyName, StringValue) V(v8::Private, PropertyName)
    #define VS(PropertyName, StringValue) V(v8::String, PropertyName)
    #define V(TypeName, PropertyName)                                  \
        inline v8::Local<TypeName> Environment::PropertyName() const { \
            return isolate_data()->PropertyName(isolate());            \
        }
PER_ISOLATE_PRIVATE_SYMBOL_PROPERTIES(VP)
PER_ISOLATE_STRING_PROPERTIES(VS)
    #undef V
    #undef VS
    #undef VP

    #define V(PropertyName, TypeName)                                            \
        inline v8::Local<TypeName> Environment::PropertyName() const {           \
            return StrongPersistentToLocal(PropertyName##_);                     \
        }                                                                        \
        inline void Environment::set_##PropertyName(v8::Local<TypeName> value) { \
            PropertyName##_.Reset(isolate(), value);                             \
        }
ENVIRONMENT_STRONG_PERSISTENT_PROPERTIES(V)
    #undef V

inline Environment::AsyncCallbackScope::AsyncCallbackScope(Environment *env)
: env_(env) {
    env_->makecallback_cntr_++;
}

inline Environment::AsyncCallbackScope::~AsyncCallbackScope() {
    env_->makecallback_cntr_--;
}

inline bool Environment::AsyncCallbackScope::in_makecallback() {
    return env_->makecallback_cntr_ > 1;
}

} // namespace node

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

// clang-format on