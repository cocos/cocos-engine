#include "EngineModules.h"

#include "FileUtils.h"
#include "base/Scheduler.h"
#include "bindings/event/EventDispatcher.h"
#include "bindings/jswrapper/SeApi.h"
#include "core/builtin/BuiltinResMgr.h"
#include "network/HttpClient.h"
#include "platform/FileUtils.h"
#include "profiler/DebugRenderer.h"
#include "profiler/Profiler.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/core/ProgramLib.h"
#include "renderer/gfx-base/GFXDevice.h"

void registerEngineModules() {
    se::ScriptEngine::registerModule();
    cc::Scheduler::registerModule();
    cc::ProgramLib::registerModule();
    cc::BuiltinResMgr::registerModule();
    cc::EventDispatcher::registerModule(true);
#if CC_USE_DEBUG_RENDERER
    cc::DebugRenderer::registerModule(true);
#endif
#if CC_USE_PROFILER
    cc::Profiler::registerModule(true);
#endif
    cc::network::HttpClient::registerModule(true);
    cc::FileUtils::registerModule(
        +[]() {
            return cc::createFileUtils();
        },
        true);
    cc::gfx::Device::registerModule(
        +[]() {
            // should create one
            return cc::gfx::Device::getInstance();
        },
        +[](cc::gfx::Device *device) {
            CC_SAFE_DESTROY_AND_DELETE(device);
        } );
}
