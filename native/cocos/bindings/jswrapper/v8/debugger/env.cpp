#include "env.h"

#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

#include "uv.h"

using namespace v8;

namespace node {

    void Environment::Start(int argc,
               const char* const* argv,
               int exec_argc,
               const char* const* exec_argv,
               bool start_profiler_idle_notifier)
    {
        HandleScope handle_scope(isolate());
        Context::Scope context_scope(context());

//        uv_check_init(event_loop(), immediate_check_handle());
//        uv_unref(reinterpret_cast<uv_handle_t*>(immediate_check_handle()));
//
//        uv_idle_init(event_loop(), immediate_idle_handle());
//
//        // Inform V8's CPU profiler when we're idle.  The profiler is sampling-based
//        // but not all samples are created equal; mark the wall clock time spent in
//        // epoll_wait() and friends so profiling tools can filter it out.  The samples
//        // still end up in v8.log but with state=IDLE rather than state=EXTERNAL.
//        // REFINE(bnoordhuis) Depends on a libuv implementation detail that we should
//        // probably fortify in the API contract, namely that the last started prepare
//        // or check watcher runs first.  It's not 100% foolproof; if an add-on starts
//        // a prepare or check watcher after us, any samples attributed to its callback
//        // will be recorded with state=IDLE.
//        uv_prepare_init(event_loop(), &idle_prepare_handle_);
//        uv_check_init(event_loop(), &idle_check_handle_);
//        uv_unref(reinterpret_cast<uv_handle_t*>(&idle_prepare_handle_));
//        uv_unref(reinterpret_cast<uv_handle_t*>(&idle_check_handle_));
//
//        uv_timer_init(event_loop(), destroy_ids_timer_handle());
//
//        auto close_and_finish = [](Environment* env, uv_handle_t* handle, void* arg) {
//            handle->data = env;
//
//            uv_close(handle, [](uv_handle_t* handle) {
//                static_cast<Environment*>(handle->data)->FinishHandleCleanup(handle);
//            });
//        };
//
//        RegisterHandleCleanup(
//                              reinterpret_cast<uv_handle_t*>(immediate_check_handle()),
//                              close_and_finish,
//                              nullptr);
//        RegisterHandleCleanup(
//                              reinterpret_cast<uv_handle_t*>(immediate_idle_handle()),
//                              close_and_finish,
//                              nullptr);
//        RegisterHandleCleanup(
//                              reinterpret_cast<uv_handle_t*>(&idle_prepare_handle_),
//                              close_and_finish,
//                              nullptr);
//        RegisterHandleCleanup(
//                              reinterpret_cast<uv_handle_t*>(&idle_check_handle_),
//                              close_and_finish,
//                              nullptr);

        if (start_profiler_idle_notifier) {
            StartProfilerIdleNotifier();
        }
        
        auto process_template = FunctionTemplate::New(isolate());
        process_template->SetClassName(FIXED_ONE_BYTE_STRING(isolate(), "process"));
        
        auto process_object =
        process_template->GetFunction(context()).ToLocalChecked()->NewInstance(context()).ToLocalChecked();
        set_process_object(process_object);
        
        SetupProcessObject(this, argc, argv, exec_argc, exec_argv);
//        LoadAsyncWrapperInfo(this);
    }

    void Environment::AssignToContext(v8::Local<v8::Context> context)
    {
        context->SetAlignedPointerInEmbedderData(kContextEmbedderDataIndex, this);
    }

    void Environment::CleanupHandles()
    {
//        while (HandleCleanup* hc = handle_cleanup_queue_.PopFront()) {
//            handle_cleanup_waiting_++;
//            hc->cb_(this, hc->handle_, hc->arg_);
//            delete hc;
//        }
//
//        while (handle_cleanup_waiting_ != 0)
//            uv_run(event_loop(), UV_RUN_ONCE);
//
//        while (handle_cleanup_waiting_ != 0)
//            uv_run(event_loop(), UV_RUN_ONCE);
    }

    void Environment::StartProfilerIdleNotifier()
    {
//        uv_prepare_start(&idle_prepare_handle_, [](uv_prepare_t* handle) {
//            Environment* env = ContainerOf(&Environment::idle_prepare_handle_, handle);
//            env->isolate()->GetCpuProfiler()->SetIdle(true);
//        });
//
//        uv_check_start(&idle_check_handle_, [](uv_check_t* handle) {
//            Environment* env = ContainerOf(&Environment::idle_check_handle_, handle);
//            env->isolate()->GetCpuProfiler()->SetIdle(false);
//        });
    }

    void Environment::StopProfilerIdleNotifier()
    {
//        uv_prepare_stop(&idle_prepare_handle_);
//        uv_check_stop(&idle_check_handle_);
    }

} // namespace node {

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR
