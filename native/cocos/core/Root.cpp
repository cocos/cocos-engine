/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "core/Root.h"
#include "2d/renderer/Batcher2d.h"
#include "application/ApplicationManager.h"
#include "bindings/event/EventDispatcher.h"
#include "pipeline/custom/RenderingModule.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "platform/interfaces/modules/IXRInterface.h"
#if CC_USE_DEBUG_RENDERER
    #include "profiler/DebugRenderer.h"
#endif
#include "engine/EngineEvents.h"
#include "profiler/Profiler.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXSwapchain.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/GeometryRenderer.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/NativePipelineTypes.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "renderer/pipeline/deferred/DeferredPipeline.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/SpotLight.h"
#include "scene/Skybox.h"

namespace cc {

namespace {
Root *instance = nullptr;
}

Root *Root::getInstance() {
    return instance;
}

Root::Root(gfx::Device *device)
: _device(device) {
    instance = this;
    // TODO(minggo):
    //    this._dataPoolMgr = legacyCC.internal.DataPoolManager && new legacyCC.internal.DataPoolManager(device) as DataPoolManager;

    _cameraList.reserve(6);
    _swapchains.reserve(2);
}

Root::~Root() {
    destroy();
    instance = nullptr;
}

void Root::initialize(gfx::Swapchain * /*swapchain*/) {
    auto *windowMgr = CC_GET_PLATFORM_INTERFACE(ISystemWindowManager);
    const auto &windows = windowMgr->getWindows();
    for (const auto &pair : windows) {
        auto *window = pair.second.get();
        scene::RenderWindow *renderWindow = createRenderWindowFromSystemWindow(window);
        if (!_mainRenderWindow && (window->getWindowId() == ISystemWindow::mainWindowId)) {
            _mainRenderWindow = renderWindow;
        }
    }
    _curRenderWindow = _mainRenderWindow;
    _xr = CC_GET_XR_INTERFACE();
    addWindowEventListener();
    // TODO(minggo):
    // return Promise.resolve(builtinResMgr.initBuiltinRes(this._device));
    const uint32_t usedUBOVectorCount = (pipeline::UBOGlobal::COUNT + pipeline::UBOCamera::COUNT + pipeline::UBOShadow::COUNT + pipeline::UBOLocal::COUNT + pipeline::UBOWorldBound::COUNT) / 4;
    uint32_t maxJoints = (_device->getCapabilities().maxVertexUniformVectors - usedUBOVectorCount) / 3;
    maxJoints = maxJoints < 256 ? maxJoints : 256;
    pipeline::localDescriptorSetLayoutResizeMaxJoints(maxJoints);

    _debugView = std::make_unique<pipeline::DebugView>();
}

render::Pipeline *Root::getCustomPipeline() const {
    return dynamic_cast<render::Pipeline *>(_pipelineRuntime.get());
}

scene::RenderWindow *Root::createRenderWindowFromSystemWindow(ISystemWindow *window) {
    if (!window) {
        return nullptr;
    }

    uint32_t windowId = window->getWindowId();
    auto handle = window->getWindowHandle();
    const auto &size = window->getViewSize();

    gfx::SwapchainInfo info;
    info.width = static_cast<uint32_t>(size.width);
    info.height = static_cast<uint32_t>(size.height);
    info.windowHandle = reinterpret_cast<void *>(handle); // NOLINT
    info.windowId = window->getWindowId();

    gfx::Swapchain *swapchain = gfx::Device::getInstance()->createSwapchain(info);
    _swapchains.emplace_back(swapchain);

    gfx::RenderPassInfo renderPassInfo;

    gfx::ColorAttachment colorAttachment;
    colorAttachment.format = swapchain->getColorTexture()->getFormat();
    renderPassInfo.colorAttachments.emplace_back(colorAttachment);

    auto &depthStencilAttachment = renderPassInfo.depthStencilAttachment;
    depthStencilAttachment.format = swapchain->getDepthStencilTexture()->getFormat();
    depthStencilAttachment.depthStoreOp = gfx::StoreOp::DISCARD;
    depthStencilAttachment.stencilStoreOp = gfx::StoreOp::DISCARD;

    scene::IRenderWindowInfo windowInfo;
    windowInfo.title = StringUtil::format("renderWindow_%d", windowId);
    windowInfo.width = swapchain->getWidth();
    windowInfo.height = swapchain->getHeight();
    windowInfo.renderPassInfo = renderPassInfo;
    windowInfo.swapchain = swapchain;

    return createWindow(windowInfo);
}

cc::scene::RenderWindow *Root::createRenderWindowFromSystemWindow(uint32_t windowId) {
    if (windowId == 0) {
        return nullptr;
    }
    return createRenderWindowFromSystemWindow(CC_GET_SYSTEM_WINDOW(windowId));
}

void Root::destroy() {
    destroyScenes();
    removeWindowEventListener();
    if (_pipelineRuntime) {
        _pipelineRuntime->destroy();
    }
    _pipelineRuntime.reset();

    CC_SAFE_DESTROY_NULL(_pipeline);

    CC_SAFE_DELETE(_batcher);

    for (auto *swapchain : _swapchains) {
        CC_SAFE_DELETE(swapchain);
    }
    _swapchains.clear();

    _debugView.reset();

    // TODO(minggo):
    //    this.dataPoolManager.clear();
}

void Root::resize(uint32_t width, uint32_t height, uint32_t windowId) { // NOLINT
    for (const auto &window : _renderWindows) {
        auto *swapchain = window->getSwapchain();
        if (swapchain && (swapchain->getWindowId() == windowId)) {
            if (_xr) {
                // xr, window's width and height should not change by device
                width = window->getWidth();
                height = window->getHeight();
            }
            window->resize(width, height);
        }
    }
}

namespace {

class RenderPipelineBridge final : public render::PipelineRuntime {
public:
    explicit RenderPipelineBridge(pipeline::RenderPipeline *pipelineIn)
    : pipeline(pipelineIn) {}

    bool activate(gfx::Swapchain *swapchain) override {
        return pipeline->activate(swapchain);
    }
    bool destroy() noexcept override {
        return pipeline->destroy();
    }
    void render(const ccstd::vector<scene::Camera *> &cameras) override {
        pipeline->render(cameras);
    }
    gfx::Device *getDevice() const override {
        return pipeline->getDevice();
    }
    const MacroRecord &getMacros() const override {
        return pipeline->getMacros();
    }
    pipeline::GlobalDSManager *getGlobalDSManager() const override {
        return pipeline->getGlobalDSManager();
    }
    gfx::DescriptorSetLayout *getDescriptorSetLayout() const override {
        return pipeline->getDescriptorSetLayout();
    }
    gfx::DescriptorSet *getDescriptorSet() const override {
        return pipeline->getDescriptorSet();
    }
    const ccstd::vector<gfx::CommandBuffer *> &getCommandBuffers() const override {
        return pipeline->getCommandBuffers();
    }
    pipeline::PipelineSceneData *getPipelineSceneData() const override {
        return pipeline->getPipelineSceneData();
    }
    const ccstd::string &getConstantMacros() const override {
        return pipeline->getConstantMacros();
    }
    scene::Model *getProfiler() const override {
        return pipeline->getProfiler();
    }
    void setProfiler(scene::Model *profiler) override {
        pipeline->setProfiler(profiler);
    }
    pipeline::GeometryRenderer *getGeometryRenderer() const override {
        return pipeline->getGeometryRenderer();
    }
    float getShadingScale() const override {
        return pipeline->getShadingScale();
    }
    void setShadingScale(float scale) override {
        pipeline->setShadingScale(scale);
    }
    const ccstd::string &getMacroString(const ccstd::string &name) const override {
        static const ccstd::string EMPTY_STRING;
        const auto &macros = pipeline->getMacros();
        auto iter = macros.find(name);
        if (iter == macros.end()) {
            return EMPTY_STRING;
        }
        return ccstd::get<ccstd::string>(iter->second);
    }
    int32_t getMacroInt(const ccstd::string &name) const override {
        const auto &macros = pipeline->getMacros();
        auto iter = macros.find(name);
        if (iter == macros.end()) {
            return 0;
        }
        return ccstd::get<int32_t>(iter->second);
    }
    bool getMacroBool(const ccstd::string &name) const override {
        const auto &macros = pipeline->getMacros();
        auto iter = macros.find(name);
        if (iter == macros.end()) {
            return false;
        }
        return ccstd::get<bool>(iter->second);
    }
    void setMacroString(const ccstd::string &name, const ccstd::string &value) override {
        pipeline->setValue(name, value);
    }
    void setMacroInt(const ccstd::string &name, int32_t value) override {
        pipeline->setValue(name, value);
    }
    void setMacroBool(const ccstd::string &name, bool value) override {
        pipeline->setValue(name, value);
    }
    void onGlobalPipelineStateChanged() override {
        pipeline->onGlobalPipelineStateChanged();
    }
    void setValue(const ccstd::string &name, int32_t value) override {
        pipeline->setValue(name, value);
    }
    void setValue(const ccstd::string &name, bool value) override {
        pipeline->setValue(name, value);
    }
    bool isOcclusionQueryEnabled() const override {
        return pipeline->isOcclusionQueryEnabled();
    }

    void resetRenderQueue(bool reset) override {
        pipeline->resetRenderQueue(reset);
    }

    bool isRenderQueueReset() const override {
        return pipeline->isRenderQueueReset();
    }

    pipeline::RenderPipeline *pipeline = nullptr;
};

} // namespace

bool Root::setRenderPipeline(pipeline::RenderPipeline *rppl /* = nullptr*/) {
    if (rppl) {
        if (dynamic_cast<pipeline::DeferredPipeline *>(rppl) != nullptr) {
            _useDeferredPipeline = true;
        }

        _pipeline = rppl;
        _pipelineRuntime = std::make_unique<RenderPipelineBridge>(rppl);
        rppl->setPipelineRuntime(_pipelineRuntime.get());

        // now cluster just enabled in deferred pipeline
        if (!_useDeferredPipeline || !_device->hasFeature(gfx::Feature::COMPUTE_SHADER)) {
            // disable cluster
            _pipeline->setClusterEnabled(false);
        }
        _pipeline->setBloomEnabled(false);

        if (!_pipeline->activate(_mainRenderWindow->getSwapchain())) {
            _pipeline = nullptr;
            return false;
        }
    } else {
        CC_ASSERT(!_pipelineRuntime);
        _pipelineRuntime.reset(render::Factory::createPipeline());
        if (!_pipelineRuntime->activate(_mainRenderWindow->getSwapchain())) {
            _pipelineRuntime->destroy();
            _pipelineRuntime.reset();
            return false;
        }
    }

    // TODO(minggo):
    //    auto *scene = Director::getInstance()->getScene();
    //    if (scene) {
    //        scene->getSceneGlobals()->activate();
    //    }

#if CC_EDITOR
    emit<PipelineChanged>();
#endif

    onGlobalPipelineStateChanged();

    if (_batcher == nullptr) {
        _batcher = ccnew Batcher2d(this);
        if (!_batcher->initialize()) {
            destroy();
            return false;
        }
    }

    return true;
}

void Root::onGlobalPipelineStateChanged() {
    for (const auto &scene : _scenes) {
        scene->onGlobalPipelineStateChanged();
    }

    if (_pipelineRuntime->getPipelineSceneData()->getSkybox()->isEnabled())
    {
        _pipelineRuntime->getPipelineSceneData()->getSkybox()->getModel()->onGlobalPipelineStateChanged();
    }

    _pipelineRuntime->onGlobalPipelineStateChanged();
}

void Root::activeWindow(scene::RenderWindow *window) {
    _curRenderWindow = window;
}

void Root::resetCumulativeTime() {
    _cumulativeTime = 0;
}

void Root::frameSync() {
    if (_device) {
        _device->frameSync();
    }
}

void Root::frameMoveBegin() {
    for (const auto &scene : _scenes) {
        scene->removeBatches();
    }

    if (_batcher != nullptr) {
        _batcher->update();
    }

    //
    _cameraList.clear();
}

void Root::frameMoveProcess(bool isNeedUpdateScene, int32_t totalFrames) {
    for (const auto &window : _renderWindows) {
        window->extractRenderCameras(_cameraList);
    }

    if (_pipelineRuntime != nullptr && !_cameraList.empty()) {
        _device->acquire(_swapchains);

        // NOTE: c++ doesn't have a Director, so totalFrames need to be set from JS
        uint32_t stamp = totalFrames;

        if (_batcher != nullptr) {
            _batcher->uploadBuffers();
        }

        if (isNeedUpdateScene) {
            for (const auto &scene : _scenes) {
                scene->update(stamp);
            }
        }

        CC_PROFILER_UPDATE;
    }
}

void Root::frameMoveEnd() {
    if (_pipelineRuntime != nullptr && !_cameraList.empty()) {
        emit<BeforeCommit>();
        std::stable_sort(_cameraList.begin(), _cameraList.end(), [](const auto *a, const auto *b) {
            return a->getPriority() < b->getPriority();
        });
#if !defined(CC_SERVER_MODE)

    #if CC_USE_GEOMETRY_RENDERER
        for (auto *camera : _cameraList) {
            if (camera->getGeometryRenderer()) {
                camera->getGeometryRenderer()->update();
            }
        }
    #endif
    #if CC_USE_DEBUG_RENDERER
        CC_DEBUG_RENDERER->update();
    #endif

        emit<BeforeRender>();
        _pipelineRuntime->render(_cameraList);
        emit<AfterRender>();
#endif
        _device->present();
    }

    if (_batcher != nullptr) {
        _batcher->reset();
    }
}

void Root::frameMove(float deltaTime, int32_t totalFrames) { // NOLINT
    CCObject::deferredDestroy();

    _frameTime = deltaTime;

    ++_frameCount;
    _cumulativeTime += deltaTime;
    _fpsTime += deltaTime;
    if (_fpsTime > 1.0F) {
        _fps = _frameCount;
        _frameCount = 0;
        _fpsTime = 0.0;
    }

    if (_xr) {
        doXRFrameMove(totalFrames);
    } else {
        frameMoveBegin();
        frameMoveProcess(true, totalFrames);
        frameMoveEnd();
    }
}

scene::RenderWindow *Root::createWindow(scene::IRenderWindowInfo &info) {
    IntrusivePtr<scene::RenderWindow> window = ccnew scene::RenderWindow();

    window->initialize(_device, info);
    _renderWindows.emplace_back(window);
    return window;
}

void Root::destroyWindow(scene::RenderWindow *window) {
    auto it = std::find(_renderWindows.begin(), _renderWindows.end(), window);
    if (it != _renderWindows.end()) {
        CC_SAFE_DESTROY(*it);
        _renderWindows.erase(it);
    }
}

void Root::destroyWindows() {
    for (const auto &window : _renderWindows) {
        CC_SAFE_DESTROY(window);
    }
    _renderWindows.clear();
}

uint32_t Root::createSystemWindow(const ISystemWindowInfo &info) {
    auto *windowMgr = CC_GET_PLATFORM_INTERFACE(ISystemWindowManager);
    ISystemWindow *window = windowMgr->createWindow(info);
    if (!window) {
        return 0;
    }
    return window->getWindowId();
}

scene::RenderScene *Root::createScene(const scene::IRenderSceneInfo &info) {
    IntrusivePtr<scene::RenderScene> scene = ccnew scene::RenderScene();
    scene->initialize(info);
    _scenes.emplace_back(scene);
    return scene.get();
}

void Root::destroyScene(scene::RenderScene *scene) {
    auto it = std::find(_scenes.begin(), _scenes.end(), scene);
    if (it != _scenes.end()) {
        CC_SAFE_DESTROY(*it);
        _scenes.erase(it);
    }
}

void Root::destroyModel(scene::Model *model) { // NOLINT(readability-convert-member-functions-to-static)
    if (model == nullptr) {
        return;
    }

    if (model->getScene() != nullptr) {
        model->getScene()->removeModel(model);
    }
    model->destroy();
}

void Root::destroyLight(scene::Light *light) { // NOLINT(readability-convert-member-functions-to-static)
    if (light == nullptr) {
        return;
    }

    if (light->getScene() != nullptr) {
        if (light->getType() == scene::LightType::DIRECTIONAL) {
            light->getScene()->removeDirectionalLight(static_cast<scene::DirectionalLight *>(light));
        } else if (light->getType() == scene::LightType::SPHERE) {
            light->getScene()->removeSphereLight(static_cast<scene::SphereLight *>(light));
        } else if (light->getType() == scene::LightType::SPOT) {
            light->getScene()->removeSpotLight(static_cast<scene::SpotLight *>(light));
        } else if (light->getType() == scene::LightType::POINT) {
            light->getScene()->removePointLight(static_cast<scene::PointLight *>(light));
        } else if (light->getType() == scene::LightType::RANGED_DIRECTIONAL) {
            light->getScene()->removeRangedDirLight(static_cast<scene::RangedDirectionalLight *>(light));
        }
    }
    light->destroy();
}

scene::Camera *Root::createCamera() const {
    return ccnew scene::Camera(_device);
}

void Root::destroyScenes() {
    for (const auto &scene : _scenes) {
        CC_SAFE_DESTROY(scene);
    }
    _scenes.clear();
}

void Root::doXRFrameMove(int32_t totalFrames) {
    if (_xr->isRenderAllowable()) {
        bool isSceneUpdated = false;
        int viewCount = _xr->getXRConfig(xr::XRConfigKey::VIEW_COUNT).getInt();
        // compatible native pipeline
        static bool isNativePipeline = dynamic_cast<cc::render::NativePipeline*>(_pipelineRuntime.get()) != nullptr;
        bool forceUpdateSceneTwice = isNativePipeline ? true : _xr->getXRConfig(xr::XRConfigKey::EYE_RENDER_JS_CALLBACK).getBool();
        for (int xrEye = 0; xrEye < viewCount; xrEye++) {
            _xr->beginRenderEyeFrame(xrEye);

            ccstd::vector<IntrusivePtr<scene::Camera>> allCameras;
            for (const auto &window : _renderWindows) {
                const ccstd::vector<IntrusivePtr<scene::Camera>> &wndCams = window->getCameras();
                allCameras.insert(allCameras.end(), wndCams.begin(), wndCams.end());
            }

            // when choose PreEyeCamera, only hmd has PoseTracker
            // draw left eye change hmd node's position to -ipd/2 | draw right eye  change hmd node's position to ipd/2
            for (const auto &camera : allCameras) {
                if (camera->getTrackingType() != cc::scene::TrackingType::NO_TRACKING) {
                    Node *camNode = camera->getNode();
                    if (camNode) {
                        const auto &viewPosition = _xr->getHMDViewPosition(xrEye, static_cast<int>(camera->getTrackingType()));
                        camNode->setPosition({viewPosition[0], viewPosition[1], viewPosition[2]});
                    }
                }
            }

            frameMoveBegin();
            // condition1: mainwindow has left camera && right camera,
            // but we only need left/right camera when in left/right eye loop
            // condition2: main camera draw twice
            for (const auto &window : _renderWindows) {
                if (window->getSwapchain()) {
                    // not rt
                    _xr->bindXREyeWithRenderWindow(window, static_cast<xr::XREye>(xrEye));
                }
            }

            bool isNeedUpdateScene = xrEye == static_cast<uint32_t>(xr::XREye::LEFT) || (xrEye == static_cast<uint32_t>(xr::XREye::RIGHT) && !isSceneUpdated);
            if (forceUpdateSceneTwice) {
                isNeedUpdateScene = true;
            }
            frameMoveProcess(isNeedUpdateScene, totalFrames);
            auto camIter = _cameraList.begin();
            while (camIter != _cameraList.end()) {
                scene::Camera *cam = *camIter;
                bool isMismatchedCam =
                    (static_cast<xr::XREye>(xrEye) == xr::XREye::LEFT && cam->getCameraType() == scene::CameraType::RIGHT_EYE) ||
                    (static_cast<xr::XREye>(xrEye) == xr::XREye::RIGHT && cam->getCameraType() == scene::CameraType::LEFT_EYE);
                if (isMismatchedCam) {
                    // currently is left eye loop, so right camera do not need active
                    camIter = _cameraList.erase(camIter);
                } else {
                    camIter++;
                }
            }

            if (_pipelineRuntime != nullptr && !_cameraList.empty()) {
                if (isNeedUpdateScene) {
                    isSceneUpdated = true;
                    // only one eye enable culling (without other cameras)
                    if (_cameraList.size() == 1 && _cameraList[0]->getTrackingType() != cc::scene::TrackingType::NO_TRACKING) {
                        _cameraList[0]->setCullingEnable(true);
                        _pipelineRuntime->resetRenderQueue(true);
                    }
                } else {
                    // another eye disable culling (without other cameras)
                    if (_cameraList.size() == 1 && _cameraList[0]->getTrackingType() != cc::scene::TrackingType::NO_TRACKING) {
                        _cameraList[0]->setCullingEnable(false);
                        _pipelineRuntime->resetRenderQueue(false);
                    }
                }
            }

            frameMoveEnd();
            _xr->endRenderEyeFrame(xrEye);
        }
        // recovery to normal status (condition: xr scene jump to normal scene)
        if (_pipelineRuntime) {
            _pipelineRuntime->resetRenderQueue(true);
        }

        for (scene::Camera *cam : _cameraList) {
            cam->setCullingEnable(true);
        }
    } else {
        CC_LOG_WARNING("[XR] isRenderAllowable is false !!!");
    }
}

void Root::addWindowEventListener() {
    _windowDestroyListener.bind([this](uint32_t windowId) -> void {
        for (const auto &window : _renderWindows) {
            window->onNativeWindowDestroy(windowId);
        }
    });

    _windowRecreatedListener.bind([this](uint32_t windowId) -> void {
        for (const auto &window : _renderWindows) {
            window->onNativeWindowResume(windowId);
        }
    });
}

void Root::removeWindowEventListener() {
    _windowDestroyListener.reset();
    _windowRecreatedListener.reset();
}

} // namespace cc
