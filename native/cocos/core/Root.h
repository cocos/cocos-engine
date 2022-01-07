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
#pragma once

#include <cstdint>
#include <vector>
//#include "3d/skeletal-animation/DataPoolManager.h"
#include "core/memop/Pool.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "scene/Camera.h"
#include "scene/DrawBatch2D.h"
#include "scene/Light.h"
#include "scene/Model.h"
#include "scene/RenderScene.h"
#include "scene/RenderWindow.h"
#include "scene/SphereLight.h"

namespace cc {

namespace gfx {
class SwapChain;
}

class CallbacksInvoker;

class Root final {
public:
    static Root *getInstance(); //cjh todo: put Root Managerment to Director class.
    explicit Root(gfx::Device *device);
    ~Root();

    // @minggo IRootInfo seems is not use, and how to return Promise?
    void initialize(gfx::Swapchain *swapchain);
    void destroy();

    /**
     * @zh
     * 重置大小
     * @param width 屏幕宽度
     * @param height 屏幕高度
     */
    void resize(uint32_t width, uint32_t height);

    bool setRenderPipeline(pipeline::RenderPipeline *rppl = nullptr);
    void onGlobalPipelineStateChanged();

    /**
     * @zh
     * 激活指定窗口为当前窗口
     * @param window GFX 窗口
     */
    void activeWindow(scene::RenderWindow *);

    /**
     * @zh
     * 重置累计时间
     */
    void resetCumulativeTime();

    /**
     * @zh
     * 每帧执行函数
     * @param deltaTime 间隔时间
     */
    void frameMove(float deltaTime, int32_t totalFrames); // TODO(): c++ doesn't have a Director, so totalFrames need to be set from JS

    /**
     * @zh
     * 创建窗口
     * @param info GFX 窗口描述信息
     */
    scene::RenderWindow *createWindow(scene::IRenderWindowInfo &);

    /**
     * @zh
     * 销毁指定的窗口
     * @param window GFX 窗口
     */
    void destroyWindow(scene::RenderWindow *);

    /**
     * @zh
     * 销毁全部窗口
     */
    void destroyWindows();

    /**
     * @zh
     * 创建渲染场景
     * @param info 渲染场景描述信息
     */
    scene::RenderScene *createScene(const scene::IRenderSceneInfo &);

    /**
     * @zh
     * 销毁指定的渲染场景
     * @param scene 渲染场景
     */
    void destroyScene(scene::RenderScene *);

    /**
     * @zh
     * 销毁全部场景
     */
    void destroyScenes();

    template <typename T, typename = std::enable_if_t<std::is_base_of<scene::Model, T>::value>>
    T *createModel() {
        //cjh TODO: need use model pool?
        T *model = new T();
        model->initialize();
        return model;
    }

    void destroyModel(scene::Model *model);

    template <typename T, typename = std::enable_if_t<std::is_base_of<scene::Light, T>::value>>
    T *createLight() {
        //TODO(xwx): need use model pool?
        T *light = new T();
        light->initialize();
        return light;
    }

    void destroyLight(scene::Light *light);

    inline scene::Camera *createCamera() const {
        return new scene::Camera(_device);
    }

    /**
     * @zh
     * GFX 设备
     */
    inline gfx::Device *getDevice() const { return _device; }

    /**
     * @zh
     * 主窗口
     */
    inline scene::RenderWindow *getMainWindow() const { return _mainWindow.get(); }

    /**
     * @zh
     * 当前窗口
     */
    inline void setCurWindow(scene::RenderWindow *window) { _curWindow = window; }

    inline scene::RenderWindow *getCurWindow() const { return _curWindow.get(); }

    /**
     * @zh
     * 临时窗口（用于数据传输）
     */
    void setTempWindow(scene::RenderWindow *window) { _tempWindow = window; }

    inline scene::RenderWindow *getTempWindow() const { return _tempWindow.get(); }

    /**
     * @zh
     * 窗口列表
     */
    inline const std::vector<IntrusivePtr<scene::RenderWindow>> &getWindows() const { return _windows; }

    /**
     * @zh
     * 渲染管线
     */
    inline pipeline::RenderPipeline *getPipeline() const { return _pipeline.get(); }

    /**
     * @zh
     * UI实例
     * 引擎内部使用，用户无需调用此接口
     */
    inline scene::DrawBatch2D *getBatcher2D() const { return _batcher2D; }

    /**
     * @zh
     * 场景列表
     */
    inline const std::vector<IntrusivePtr<scene::RenderScene>> &getScenes() const { return _scenes; }

    /**
     * @zh
     * 累计时间（秒）
     */
    inline float getCumulativeTime() const { return _cumulativeTime; }

    /**
     * @zh
     * 帧时间（秒）
     */
    inline float getFrameTime() const { return _frameTime; }

    /**
     * @zh
     * 一秒内的累计帧数
     */
    inline uint32_t getFrameCount() const { return _frameCount; }

    /**
     * @zh
     * 每秒帧率
     */
    inline uint32_t getFps() const { return _fps; }

    /**
     * @zh
     * 每秒固定帧率
     */
    void setFixedFPS(uint32_t fps) { _fixedFPS = fps; }

    inline uint32_t getFixedFPS() const { return _fixedFPS; }

    //    inline DataPoolManager *getDataPoolManager() { return _dataPoolMgr.get(); }

    inline bool isUsingDeferredPipeline() const { return _useDeferredPipeline; }

    inline CallbacksInvoker *getEventProcessor() const { return _eventProcessor; }

private:
    gfx::Device *                                  _device{nullptr};
    gfx::Swapchain *                               _swapchain{nullptr};
    IntrusivePtr<scene::RenderWindow>              _mainWindow;
    IntrusivePtr<scene::RenderWindow>              _curWindow;
    IntrusivePtr<scene::RenderWindow>              _tempWindow;
    std::vector<IntrusivePtr<scene::RenderWindow>> _windows;
    IntrusivePtr<pipeline::RenderPipeline>         _pipeline{nullptr};
    scene::DrawBatch2D *                           _batcher2D{nullptr};
    //    IntrusivePtr<DataPoolManager>                  _dataPoolMgr;
    std::vector<IntrusivePtr<scene::RenderScene>> _scenes;
    memop::Pool<scene::Camera> *                  _cameraPool{nullptr};
    float                                         _cumulativeTime{0.F};
    float                                         _frameTime{0.F};
    float                                         _fpsTime{0.F};
    uint32_t                                      _frameCount{0};
    uint32_t                                      _fps{0};
    uint32_t                                      _fixedFPS{0};
    bool                                          _useDeferredPipeline{false};
    CallbacksInvoker *                            _eventProcessor{nullptr};

    // Cache std::vector to avoid allocate every frame in frameMove
    std::vector<scene::Camera *>  _cameraList;
    std::vector<gfx::Swapchain *> _swapchains;
    //
};

} // namespace cc
