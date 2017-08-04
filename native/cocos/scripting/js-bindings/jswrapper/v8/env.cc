#include "env.h"

namespace node {

    void Environment::Start(int argc,
               const char* const* argv,
               int exec_argc,
               const char* const* exec_argv,
               bool start_profiler_idle_notifier)
    {

    }

    void Environment::AssignToContext(v8::Local<v8::Context> context)
    {
        context->SetAlignedPointerInEmbedderData(kContextEmbedderDataIndex, this);
    }

    void Environment::CleanupHandles()
    {

    }

    void Environment::StartProfilerIdleNotifier()
    {

    }

    void Environment::StopProfilerIdleNotifier()
    {

    }

} // namespace node {
