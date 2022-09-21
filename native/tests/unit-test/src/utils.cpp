#include "utils.h"

#ifdef CC_USE_VULKAN
    #undef CC_USE_VULKAN
#endif

#ifdef CC_USE_METAL
    #undef CC_USE_METAL
#endif

#ifdef CC_USE_GLES3
    #undef CC_USE_GLES3
#endif

#ifdef CC_USE_GLES2
    #undef CC_USE_GLES2
#endif

/*
#include "core/Director.h"
#include "core/Root.h"
#include "core/scene-graph/SceneGraphModuleHeader.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/gfx-base/GFXDef.h"

using namespace cc;
using namespace cc::gfx;

void initCocos(int width, int height) {
    // Initialize Device
    BindingMappingInfo bindingMappingInfo;
    bindingMappingInfo.bufferOffsets  = std::vector<int>{0, pipeline::globalUBOCount + pipeline::localUBOCount, pipeline::globalUBOCount};
    bindingMappingInfo.samplerOffsets = std::vector<int>{-pipeline::globalUBOCount, pipeline::globalSamplerCount + pipeline::localSamplerCount, pipeline::globalSamplerCount - pipeline::localUBOCount};
    bindingMappingInfo.flexibleSet    = 1;

    int pixelWidth  = width * 2;
    int pixelHeight = height * 2;

    DeviceInfo info;
    info.windowHandle       = 0;
    info.width              = pixelWidth;
    info.height             = pixelHeight;
    info.pixelRatio         = 2;
    info.bindingMappingInfo = bindingMappingInfo;
    auto *_device           = DeviceManager::create(info);

    // Initialize director
    auto *_director = new Director();
    _director->init();
    _director->getRoot()->resize(pixelWidth, pixelHeight);
    _director->getRoot()->setRenderPipeline(nullptr);

    BuiltinResMgr::getInstance()->initBuiltinRes(_device);

    BuiltinResMgr::getInstance()->tryCompileAllPasses();

    auto *scene = new Scene("myScene");
    Director::getInstance()->runSceneImmediate(scene, nullptr, nullptr);
}

void destroyCocos() {
    auto *director = Director::getInstance();
    auto *scene    = director->getScene();
    CC_SAFE_DELETE(scene);
    CC_SAFE_DELETE(director);
    DeviceManager::destroy();
}
*/
