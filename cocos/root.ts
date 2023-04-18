/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { Pool, cclegacy, warnID, settings, Settings, macro } from './core';
import { RenderPipeline, createDefaultPipeline, DeferredPipeline } from './rendering';
import { DebugView } from './rendering/debug-view';
import { Camera, Light, Model } from './render-scene/scene';
import type { DataPoolManager } from './3d/skeletal-animation/data-pool-manager';
import { LightType } from './render-scene/scene/light';
import { IRenderSceneInfo, RenderScene } from './render-scene/core/render-scene';
import { DirectionalLight } from './render-scene/scene/directional-light';
import { SphereLight } from './render-scene/scene/sphere-light';
import { SpotLight } from './render-scene/scene/spot-light';
import { RenderWindow, IRenderWindowInfo } from './render-scene/core/render-window';
import { ColorAttachment, DepthStencilAttachment, RenderPassInfo, StoreOp, Device, Swapchain, Feature, deviceManager, LegacyRenderMode } from './gfx';
import { Pipeline, PipelineRuntime } from './rendering/custom/pipeline';
import { Batcher2D } from './2d/renderer/batcher-2d';
import { IPipelineEvent } from './rendering/pipeline-event';
import { localDescriptorSetLayout_ResizeMaxJoints, UBOCamera, UBOGlobal, UBOLocal, UBOShadow, UBOWorldBound } from './rendering/define';

/**
 * @en Initialization information for the Root
 * @zh Root 初始化描述信息
 */
export interface IRootInfo {
    enableHDR?: boolean;
}

/**
 * @en Creation information for the Root
 * @zh 场景创建描述信息
 */
export interface ISceneInfo {
    name: string;
}

/**
 * @en The root manager of the renderer which manages all device resources and the render pipeline.
 * @zh 基础渲染器管理类，管理所有设备相关的资源创建以及渲染管线。
 */
export class Root {
    /**
     * @en The GFX device
     * @zh GFX 设备
     */
    public get device (): Device {
        return this._device;
    }

    /**
     * @en The main window
     * @zh 主窗口
     */
    public get mainWindow (): RenderWindow | null {
        return this._mainWindow;
    }

    /**
     * @en The current active window
     * @zh 当前激活的窗口
     */
    public set curWindow (window: RenderWindow | null) {
        this._curWindow = window;
    }

    public get curWindow (): RenderWindow | null {
        return this._curWindow;
    }

    /**
     * @e The temporary window for data transmission
     * @zh 临时窗口（用于数据传输）
     * @internal
     */
    public set tempWindow (window: RenderWindow | null) {
        this._tempWindow = window;
    }

    public get tempWindow (): RenderWindow | null {
        return this._tempWindow;
    }

    /**
     * @en The windows list
     * @zh 窗口列表
     */
    public get windows (): RenderWindow[] {
        return this._windows;
    }

    /**
     * @zh
     * 启用自定义渲染管线
     */
    public get usesCustomPipeline (): boolean {
        return this._usesCustomPipeline;
    }

    /**
     * @en The render pipeline
     * @zh 渲染管线
     */
    public get pipeline (): PipelineRuntime {
        return this._pipeline!;
    }

    /**
     * @en The custom render pipeline
     * @zh 自定义渲染管线
     */
    public get customPipeline (): Pipeline {
        return this._customPipeline!;
    }

    /**
     * @en The pipeline events
     * @zh 渲染管线事件
     */
    public get pipelineEvent (): IPipelineEvent {
        return this._pipelineEvent!;
    }

    /**
     * @en The draw batch manager for 2D UI, for engine internal usage, user do not need to use this.
     * @zh 2D UI 渲染合批管理器，引擎内部使用，用户无需使用此接口
     */
    public get batcher2D (): Batcher2D {
        return this._batcher as Batcher2D;
    }

    /**
     * @en Render scenes list
     * @zh 渲染场景列表
     */
    public get scenes (): RenderScene[] {
        return this._scenes;
    }

    /**
     * @en The debug view manager for rendering
     * @zh 渲染调试管理器
     */
    public get debugView (): DebugView {
        return this._debugView;
    }

    /**
     * @en The time cumulated in seconds since the game began running.
     * @zh 累计时间（秒）。
     */
    public get cumulativeTime (): number {
        return this._cumulativeTime;
    }

    /**
     * @en The current frame time in seconds.
     * @zh 帧时间（秒）。
     */
    public get frameTime (): number {
        return this._frameTime;
    }

    /**
     * @en The frame count during the last second
     * @zh 一秒内的累计帧数
     */
    public get frameCount (): number {
        return this._frameCount;
    }

    /**
     * @en The recent frame rate for the last second
     * @zh 当前每秒帧率
     */
    public get fps (): number {
        return this._fps;
    }

    /**
     * @en The wanted frame rate set by user
     * @zh 每秒设定帧率
     */
    public set fixedFPS (fps: number) {
        if (fps > 0) {
            this._fixedFPS = fps;
            this._fixedFPSFrameTime = 1000.0 / fps;
        } else {
            this._fixedFPSFrameTime = 0;
        }
    }

    public get fixedFPS (): number {
        return this._fixedFPS;
    }

    /**
     * @internal
     */
    public get dataPoolManager () {
        return this._dataPoolMgr;
    }

    /**
     * @en Whether the built-in deferred pipeline is used.
     * @zh 是否启用内置延迟渲染管线
     */
    public get useDeferredPipeline (): boolean {
        return this._useDeferredPipeline;
    }

    public get cameraList (): Camera[] {
        return this._cameraList;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _createSceneFun: (root: Root) => RenderScene = null!;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _createWindowFun: (root: Root) => RenderWindow = null!;

    private _device: Device;
    private _windows: RenderWindow[] = [];
    private _mainWindow: RenderWindow | null = null;
    private _curWindow: RenderWindow | null = null;
    private _tempWindow: RenderWindow | null = null;
    private _usesCustomPipeline = true;
    private _pipeline: PipelineRuntime | null = null;
    private _pipelineEvent: IPipelineEvent | null = null;
    private _classicPipeline: RenderPipeline | null = null;
    private _customPipeline: Pipeline | null = null;
    private _batcher: Batcher2D | null = null;
    private _dataPoolMgr: DataPoolManager;
    private _scenes: RenderScene[] = [];
    private _modelPools = new Map<Constructor<Model>, Pool<Model>>();
    private _cameraPool: Pool<Camera> | null = null;
    private _lightPools = new Map<Constructor<Light>, Pool<Light>>();
    private _debugView = new DebugView();
    private _fpsTime = 0;
    private _frameCount = 0;
    private _fps = 0;
    private _fixedFPS = 0;
    private _useDeferredPipeline = false;
    private _fixedFPSFrameTime = 0;
    private _cumulativeTime = 0;
    private _frameTime = 0;
    private declare _naitveObj: any;
    private _cameraList: Camera[] = [];

    /**
     * @en The constructor of the root, user shouldn't create the root instance, it's managed by the [[Director]].
     * @zh 构造函数，用户不应该自己创建任何 Root 对象，它是由 [[Director]] 管理的。
     * @param device GFX device
     */
    constructor (device: Device) {
        this._device = device;
        this._dataPoolMgr = cclegacy.internal.DataPoolManager && new cclegacy.internal.DataPoolManager(device) as DataPoolManager;

        RenderScene.registerCreateFunc(this);
        RenderWindow.registerCreateFunc(this);

        this._cameraPool = new Pool(() => new Camera(this._device), 4, (cam) => cam.destroy());
    }

    /**
     * @en The initialization function, user shouldn't initialize the root, it's managed by the [[Director]].
     * @zh 初始化函数，用户不应该自己初始化 Root，它是由 [[Director]] 管理的。
     * @param info Root initialization information
     */
    public initialize (info: IRootInfo) {
        const swapchain: Swapchain = deviceManager.swapchain;
        const colorAttachment = new ColorAttachment();
        colorAttachment.format = swapchain.colorTexture.format;
        const depthStencilAttachment = new DepthStencilAttachment();
        depthStencilAttachment.format = swapchain.depthStencilTexture.format;
        depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
        const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);

        this._mainWindow = this.createWindow({
            title: 'rootMainWindow',
            width: swapchain.width,
            height: swapchain.height,
            renderPassInfo,
            swapchain,
        });
        this._curWindow = this._mainWindow;
        const customJointTextureLayouts = settings.querySettings(Settings.Category.ANIMATION, 'customJointTextureLayouts') || [];
        this._dataPoolMgr?.jointTexturePool.registerCustomTextureLayouts(customJointTextureLayouts);
        this._resizeMaxJointForDS();
    }

    /**
     * @en Destroy the root, user shouldn't invoke this function, it will cause undefined behavior.
     * @zh 销毁 Root，用户不应该调用此方法，会造成未知行为。
     */
    public destroy () {
        this.destroyScenes();

        if (this._pipeline) {
            this._pipeline.destroy();
            this._pipeline = null;
            this._pipelineEvent = null;
        }

        if (this._batcher) {
            this._batcher.destroy();
            this._batcher = null;
        }

        this._curWindow = null;
        this._mainWindow = null;
        this.dataPoolManager.clear();

        if (cclegacy.rendering) {
            cclegacy.rendering.destroy();
        }
    }

    /**
     * @en Resize the on-screen render windows.
     * @zh 重置在屏窗口的大小。
     * @param width The new width of the window.
     * @param height The new height of the window.
     * @param windowId The system window ID, optional for now.
     */
    public resize (width: number, height: number, windowId?: number) {
        for (const window of this._windows) {
            if (window.swapchain) {
                window.resize(width, height);
            }
        }
    }

    /**
     * @en Setup the render pipeline
     * @zh 设置渲染管线
     * @param rppl The render pipeline
     * @returns The setup is successful or not
     */
    public setRenderPipeline (rppl?: RenderPipeline): boolean {
        const { internal, director, rendering } = cclegacy;
        //-----------------------------------------------
        // prepare classic pipeline
        //-----------------------------------------------
        if (rppl instanceof DeferredPipeline) {
            this._useDeferredPipeline = true;
        }

        let isCreateDefaultPipeline = false;
        if (!rppl) {
            rppl = createDefaultPipeline();
            isCreateDefaultPipeline = true;
        }

        // now cluster just enabled in deferred pipeline
        if (!this._useDeferredPipeline || !this.device.hasFeature(Feature.COMPUTE_SHADER)) {
            // disable cluster
            rppl.clusterEnabled = false;
        }
        rppl.bloomEnabled = false;

        //-----------------------------------------------
        // choose pipeline
        //-----------------------------------------------
        if (macro.CUSTOM_PIPELINE_NAME !== '' && rendering && this.usesCustomPipeline) {
            this._customPipeline = rendering.createCustomPipeline();
            isCreateDefaultPipeline = true;
            this._pipeline = this._customPipeline!;
        } else {
            this._classicPipeline = rppl;
            this._pipeline = this._classicPipeline;
            this._pipelineEvent = this._classicPipeline;
            this._usesCustomPipeline = false;
        }

        const renderMode = settings.querySettings(Settings.Category.RENDERING, 'renderMode');
        if (renderMode !== LegacyRenderMode.HEADLESS || this._classicPipeline) {
            if (!this._pipeline.activate(this._mainWindow!.swapchain)) {
                if (isCreateDefaultPipeline) {
                    this._pipeline.destroy();
                }
                this._classicPipeline = null;
                this._customPipeline = null;
                this._pipeline = null;
                this._pipelineEvent = null;

                return false;
            }
        }

        //-----------------------------------------------
        // pipeline initialization completed
        //-----------------------------------------------
        const scene = director.getScene();
        if (scene) {
            scene.globals.activate();
        }

        this.onGlobalPipelineStateChanged();
        if (!this._batcher && internal.Batcher2D) {
            this._batcher = new internal.Batcher2D(this);
            if (!this._batcher!.initialize()) {
                this.destroy();
                return false;
            }
        }

        return true;
    }

    /**
     * @en Notify the pipeline and all scenes that the global pipeline state have been updated so that they can update their render data and states.
     * @zh 通知渲染管线和所有场景全局管线状态已更新，需要更新自身状态。
     */
    public onGlobalPipelineStateChanged () {
        for (let i = 0; i < this._scenes.length; i++) {
            this._scenes[i].onGlobalPipelineStateChanged();
        }

        this._pipeline!.onGlobalPipelineStateChanged();
    }

    /**
     * @en Active the render window as the [[curWindow]]
     * @zh 激活指定窗口为当前窗口 [[curWindow]]
     * @param window The render window to be activated
     */
    public activeWindow (window: RenderWindow) {
        this._curWindow = window;
    }

    /**
     * @en Reset the time cumulated
     * @zh 重置累计时间
     */
    public resetCumulativeTime () {
        this._cumulativeTime = 0;
    }

    /**
     * @en The entry function of the render process for every frame.
     * @zh 用于每帧执行渲染流程的入口函数
     * @param deltaTime @en The delta time since last update. @zh 距离上一帧间隔时间
     */
    public frameMove (deltaTime: number) {
        const { director, Director } = cclegacy;
        this._frameTime = deltaTime;

        /*
        if (this._fixedFPSFrameTime > 0) {

            const elapsed = this._frameTime * 1000.0;
            if (this._fixedFPSFrameTime > elapsed) {

                setTimeout(function () {}, this._fixedFPSFrameTime - elapsed);
            }
        }
        */

        ++this._frameCount;
        this._cumulativeTime += deltaTime;
        this._fpsTime += deltaTime;
        if (this._fpsTime > 1.0) {
            this._fps = this._frameCount;
            this._frameCount = 0;
            this._fpsTime = 0.0;
        }
        for (let i = 0; i < this._scenes.length; ++i) {
            this._scenes[i].removeBatches();
        }

        const windows = this._windows;
        const cameraList = this._cameraList;
        cameraList.length = 0;

        for (let i = 0; i < windows.length; i++) {
            const window = windows[i];
            window.extractRenderCameras(cameraList);
        }

        if (this._pipeline && cameraList.length > 0) {
            this._device.acquire([deviceManager.swapchain]);
            const scenes = this._scenes;
            const stamp = director.getTotalFrames();

            if (this._batcher) {
                this._batcher.update();
                this._batcher.uploadBuffers();
            }

            for (let i = 0; i < scenes.length; i++) {
                scenes[i].update(stamp);
            }

            director.emit(Director.EVENT_BEFORE_COMMIT);
            cameraList.sort((a: Camera, b: Camera) => a.priority - b.priority);

            for (let i = 0; i < cameraList.length; ++i) {
                cameraList[i].geometryRenderer?.update();
            }
            director.emit(Director.EVENT_BEFORE_RENDER);
            this._pipeline.render(cameraList);
            director.emit(Director.EVENT_AFTER_RENDER);
            this._device.present();
        }

        if (this._batcher) this._batcher.reset();
    }

    /**
     * @en Create a render window
     * @zh 创建一个新的窗口
     * @param info @en The window creation information @zh 窗口描述信息
     */
    public createWindow (info: IRenderWindowInfo): RenderWindow | null {
        const window = this._createWindowFun(this);
        window.initialize(this.device, info);
        this._windows.push(window);
        return window;
    }

    /**
     * @en Destroy a render window
     * @zh 销毁指定的窗口
     * @param window The render window to be destroyed
     */
    public destroyWindow (window: RenderWindow) {
        for (let i = 0; i < this._windows.length; ++i) {
            if (this._windows[i] === window) {
                window.destroy();
                this._windows.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @en Destroy all render windows
     * @zh 销毁全部窗口
     */
    public destroyWindows () {
        for (const window of this._windows) {
            window.destroy();
        }
        this._windows.length = 0;
    }

    /**
     * @en Create a render scene
     * @zh 创建渲染场景
     * @param info @en The creation information for render scene @zh 渲染场景描述信息
     */
    public createScene (info: IRenderSceneInfo): RenderScene {
        const scene: RenderScene = this._createSceneFun(this);
        scene.initialize(info);
        this._scenes.push(scene);
        return scene;
    }

    /**
     * @en Destroy the given render scene
     * @zh 销毁指定的渲染场景
     * @param scene @en The render scene to be destroyed. @zh 要销毁的渲染场景
     */
    public destroyScene (scene: RenderScene) {
        for (let i = 0; i < this._scenes.length; ++i) {
            if (this._scenes[i] === scene) {
                scene.destroy();
                this._scenes.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @en Destroy all render scenes.
     * @zh 销毁全部场景。
     */
    public destroyScenes () {
        for (const scene of this._scenes) {
            scene.destroy();
        }
        this._scenes.length = 0;
    }

    /**
     * @en Create a model
     * @zh 创建模型
     * @param ModelCtor @en The class of the model @zh 模型的类
     * @returns The model created
     */
    public createModel<T extends Model> (ModelCtor: typeof Model): T {
        let p = this._modelPools.get(ModelCtor);
        if (!p) {
            this._modelPools.set(ModelCtor, new Pool(() => new ModelCtor(), 10, (obj) => obj.destroy()));
            p = this._modelPools.get(ModelCtor)!;
        }
        const model = p.alloc() as T;
        model.initialize();
        return model;
    }

    /**
     * @en Destroy the given model
     * @zh 销毁指定的模型
     * @param m @en The model to be destroyed @zh 要销毁的模型
     */
    public destroyModel (m: Model) {
        const p = this._modelPools.get(m.constructor as Constructor<Model>);
        if (p) {
            p.free(m);
            if (m.scene) {
                m.scene.removeModel(m);
            }
        } else {
            warnID(1300, m.constructor.name);
        }
        m.destroy();
    }

    /**
     * @en Create a camera
     * @zh 创建一个相机
     * @returns The camera created.
     */
    public createCamera (): Camera {
        return this._cameraPool!.alloc();
    }

    /**
     * @en Create a light source
     * @zh 创建光源
     * @param LightCtor @en The class of the light @zh 光源的类
     * @returns The light created
     */
    public createLight<T extends Light> (LightCtor: new () => T): T {
        let l = this._lightPools.get(LightCtor);
        if (!l) {
            this._lightPools.set(LightCtor, new Pool<Light>(() => new LightCtor(), 4, (obj) => obj.destroy()));
            l = this._lightPools.get(LightCtor)!;
        }
        const light = l.alloc() as T;
        light.initialize();
        return light;
    }

    /**
     * @en Destroy the given light
     * @zh 销毁指定的光源
     * @param l @en The light to be destroyed @zh 要销毁的光源
     */
    public destroyLight (l: Light) {
        if (l.scene) {
            switch (l.type) {
            case LightType.DIRECTIONAL:
                l.scene.removeDirectionalLight(l as DirectionalLight);
                break;
            case LightType.SPHERE:
                l.scene.removeSphereLight(l as SphereLight);
                break;
            case LightType.SPOT:
                l.scene.removeSpotLight(l as SpotLight);
                break;
            default:
                break;
            }
        }
        l.destroy();
    }

    /**
     * @en recycle the given light to light object pool
     * @zh 回收指定的光源到对象池
     * @param l @en The light to be recycled @zh 要回收的光源
     */
    public recycleLight (l: Light) {
        const p = this._lightPools.get(l.constructor as Constructor<Light>);
        if (p) {
            p.free(l);
            if (l.scene) {
                switch (l.type) {
                case LightType.DIRECTIONAL:
                    l.scene.removeDirectionalLight(l as DirectionalLight);
                    break;
                case LightType.SPHERE:
                    l.scene.removeSphereLight(l as SphereLight);
                    break;
                case LightType.SPOT:
                    l.scene.removeSpotLight(l as SpotLight);
                    break;
                default:
                    break;
                }
            }
        }
    }

    private _resizeMaxJointForDS () {
        const usedUBOVectorCount = (UBOGlobal.COUNT + UBOCamera.COUNT + UBOShadow.COUNT + UBOLocal.COUNT + UBOWorldBound.COUNT) / 4;
        let maxJoints = Math.floor((deviceManager.gfxDevice.capabilities.maxVertexUniformVectors - usedUBOVectorCount) / 3);
        maxJoints = maxJoints < 256 ? maxJoints : 256;
        localDescriptorSetLayout_ResizeMaxJoints(maxJoints);
    }
}

cclegacy.Root = Root;
