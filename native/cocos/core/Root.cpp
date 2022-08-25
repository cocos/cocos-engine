/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
#include "core/event/CallbacksInvoker.h"
#include "core/event/EventTypesToJS.h"
#include "platform/BasePlatform.h"
#include "platform/java/modules/XRInterface.h"
#include "profiler/Profiler.h"
#include "renderer/gfx-base/GFXDef.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXSwapchain.h"
#include "renderer/pipeline/GeometryRenderer.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/NativePipelineTypes.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "renderer/pipeline/deferred/DeferredPipeline.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/SpotLight.h"

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
    _eventProcessor = new CallbacksInvoker();
    // TODO(minggo):
    //    this._dataPoolMgr = legacyCC.internal.DataPoolManager && new legacyCC.internal.DataPoolManager(device) as DataPoolManager;

    _cameraList.reserve(6);
    _swapchains.reserve(2);
}

Root::~Root() {
    destroy();
    CC_SAFE_DELETE(_eventProcessor);
    instance = nullptr;
}

void Root::initialize(gfx::Swapchain *swapchain) {
    _swapchain = swapchain;
    _xr = CC_GET_XR_INTERFACE();

    gfx::RenderPassInfo renderPassInfo;

    gfx::ColorAttachment colorAttachment;
    colorAttachment.format = swapchain->getColorTexture()->getFormat();
    renderPassInfo.colorAttachments.emplace_back(colorAttachment);

    auto &depthStencilAttachment = renderPassInfo.depthStencilAttachment;
    depthStencilAttachment.format = swapchain->getDepthStencilTexture()->getFormat();
    depthStencilAttachment.depthStoreOp = gfx::StoreOp::DISCARD;
    depthStencilAttachment.stencilStoreOp = gfx::StoreOp::DISCARD;

    scene::IRenderWindowInfo info;
    info.title = ccstd::string{"rootMainWindow"};
    info.width = swapchain->getWidth();
    info.height = swapchain->getHeight();
    info.renderPassInfo = renderPassInfo;
    info.swapchain = swapchain;
    _mainWindow = createWindow(info);

    _curWindow = _mainWindow;

    // TODO(minggo):
    // return Promise.resolve(builtinResMgr.initBuiltinRes(this._device));
}

render::Pipeline *Root::getCustomPipeline() const {
    return dynamic_cast<render::Pipeline *>(_pipelineRuntime.get());
}

void Root::destroy() {
    destroyScenes();

    if (_usesCustomPipeline && _pipelineRuntime) {
        _pipelineRuntime->destroy();
    }
    _pipelineRuntime.reset();

    CC_SAFE_DESTROY_NULL(_pipeline);

    CC_SAFE_DELETE(_batcher);

    // TODO(minggo):
    //    this.dataPoolManager.clear();
}

void Root::resize(uint32_t width, uint32_t height) {
    for (const auto &window : _windows) {
        if (window->getSwapchain()) {
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
    ccstd::vector<gfx::CommandBuffer *> getCommandBuffers() const override {
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
    if (!_usesCustomPipeline) {
        if (rppl != nullptr && dynamic_cast<pipeline::DeferredPipeline *>(rppl) != nullptr) {
            _useDeferredPipeline = true;
        }

        bool isCreateDefaultPipeline{false};
        if (!rppl) {
            rppl = ccnew pipeline::ForwardPipeline();
            rppl->initialize({});
            isCreateDefaultPipeline = true;
        }

        _pipeline = rppl;
        _pipelineRuntime = std::make_unique<RenderPipelineBridge>(rppl);

        // now cluster just enabled in deferred pipeline
        if (!_useDeferredPipeline || !_device->hasFeature(gfx::Feature::COMPUTE_SHADER)) {
            // disable cluster
            _pipeline->setClusterEnabled(false);
        }
        _pipeline->setBloomEnabled(false);

        if (!_pipeline->activate(_mainWindow->getSwapchain())) {
            if (isCreateDefaultPipeline) {
                CC_SAFE_DESTROY(_pipeline);
            }

            _pipeline = nullptr;
            return false;
        }
    } else {
        _pipelineRuntime = std::make_unique<render::NativePipeline>(
            boost::container::pmr::get_default_resource());
        if (!_pipelineRuntime->activate(_mainWindow->getSwapchain())) {
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

    _pipelineRuntime->onGlobalPipelineStateChanged();
}

void Root::activeWindow(scene::RenderWindow *window) {
    _curWindow = window;
}

void Root::resetCumulativeTime() {
    _cumulativeTime = 0;
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

void Root::frameMoveProcess(bool isNeedUpdateScene, int32_t totalFrames, const ccstd::vector<IntrusivePtr<scene::RenderWindow>> &windows) {
    for (const auto &window : windows) {
        window->extractRenderCameras(_cameraList);
    }

    if (_pipelineRuntime != nullptr && !_cameraList.empty()) {
        _swapchains.clear();
        _swapchains.emplace_back(_swapchain);
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
        _eventProcessor->emit(EventTypesToJS::DIRECTOR_BEFORE_COMMIT, this);

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

        _pipelineRuntime->render(_cameraList);
#endif
        _device->present();
    }

    if (_batcher != nullptr) {
        _batcher->reset();
    }
}

void Root::frameMove(float deltaTime, int32_t totalFrames) {
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
        frameMoveProcess(true, totalFrames, _windows);
        frameMoveEnd();
    }
}

scene::RenderWindow *Root::createWindow(scene::IRenderWindowInfo &info) {
    IntrusivePtr<scene::RenderWindow> window = ccnew scene::RenderWindow();

    window->initialize(_device, info);
    _windows.emplace_back(window);
    return window;
}

void Root::destroyWindow(scene::RenderWindow *window) {
    auto it = std::find(_windows.begin(), _windows.end(), window);
    if (it != _windows.end()) {
        CC_SAFE_DESTROY(*it);
        _windows.erase(it);
    }
}

void Root::destroyWindows() {
    for (const auto &window : _windows) {
        CC_SAFE_DESTROY(window);
    }
    _windows.clear();
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
        for (int xrEye = 0; xrEye < viewCount; xrEye++) {
            _xr->beginRenderEyeFrame(xrEye);

            ccstd::vector<IntrusivePtr<scene::Camera>> allCameras;
            for (const auto &window : _windows) {
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
            //condition1: mainwindow has left camera && right camera,
            //but we only need left/right camera when in left/right eye loop
            //condition2: main camera draw twice
            ccstd::vector<IntrusivePtr<scene::RenderWindow>> xrWindows;
            for (const auto &window : _windows) {
                if (window->getSwapchain()) {
                    // not rt
                    _xr->bindXREyeWithRenderWindow(window, static_cast<xr::XREye>(xrEye));
                }
                xrWindows.emplace_back(window);
            }

            bool isNeedUpdateScene = xrEye == static_cast<uint32_t>(xr::XREye::LEFT) || (xrEye == static_cast<uint32_t>(xr::XREye::RIGHT) && !isSceneUpdated);
            frameMoveProcess(isNeedUpdateScene, totalFrames, xrWindows);
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

} // namespace cc
