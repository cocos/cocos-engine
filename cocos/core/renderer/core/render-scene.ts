/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */
import { Root } from '../../root';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { DirectionalLight } from '../scene/directional-light';
import { Model } from '../scene/model';
import { SphereLight } from '../scene/sphere-light';
import { SpotLight } from '../scene/spot-light';
import { TransformBit } from '../../scene-graph/node-enum';
import { DrawBatch2D } from '../../../2d/renderer/draw-batch';

export interface IRenderSceneInfo {
    name: string;
}

export interface ISceneNodeInfo {
    name: string;
    isStatic?: boolean;
    // parent: Node;
}

/**
 * @en The result of one raycast operation
 * @zh 一次射线检测的结果
 */
export interface IRaycastResult {
    node: Node;
    distance: number;
}

/**
 * @en The render scene which is created by the [[Root]] and provides all basic render scene elements for the render process.
 * It manages:
 * 1. [[Camera]]s
 * 2. [[Light]]s
 * 3. Renderable objects: [[renderer.Model]]s and `DrawBatchs`
 * @zh 渲染场景，由 [[Root]] 创建，并提供用于渲染流程的所有场景基础元素。它管理：
 * 1. [[Camera]]s：相机
 * 2. [[Light]]s：光源
 * 3. 渲染元素：[[renderer.Model]]s 和 `DrawBatchs`
 */
export class RenderScene {
    /**
     * @en The root manager of the renderer
     * @zh 基础渲染管理器
     */
    get root (): Root {
        return this._root;
    }

    /**
     * @en The name of the render scene
     * @zh 渲染场景的名称
     */
    get name (): string {
        return this._name;
    }

    /**
     * @en All cameras of the render scene
     * @zh 渲染场景管理的所有相机
     */
    get cameras (): Camera[] {
        return this._cameras;
    }

    /**
     * @en The main directional light source of the render scene
     * @zh 渲染场景管理的主方向光源
     */
    get mainLight (): DirectionalLight | null {
        return this._mainLight;
    }

    /**
     * @en All sphere light sources of the render scene
     * @zh 渲染场景管理的所有球面光源
     */
    get sphereLights (): SphereLight[] {
        return this._sphereLights;
    }

    /**
     * @en All spot light sources of the render scene
     * @zh 渲染场景管理的所有聚光灯光源
     */
    get spotLights (): SpotLight[] {
        return this._spotLights;
    }

    /**
     * @en All active models of the render scene
     * @zh 渲染场景管理的所有模型
     */
    get models (): Model[] {
        return this._models;
    }

    /**
     * @en All active 2d draw batches of the render scene
     * @zh 渲染场景管理的所有 2D 渲染批次对象
     */
    get batches () {
        return this._batches;
    }

    private _root: Root;
    private _name = '';
    private _cameras: Camera[] = [];
    private _models: Model[] = [];
    private _batches: DrawBatch2D[] = [];
    private _directionalLights: DirectionalLight[] = [];
    private _sphereLights: SphereLight[] = [];
    private _spotLights: SpotLight[] = [];
    private _mainLight: DirectionalLight | null = null;
    private _modelId = 0;

    /**
     * Register the creation function of the render scene to root.
     * @internal
     */
    public static registerCreateFunc (root: Root) {
        root._createSceneFun = (_root: Root): RenderScene => new RenderScene(_root);
    }

    constructor (root: Root) {
        this._root = root;
    }

    /**
     * @en Initialize the render scene
     * @zh 初始化渲染场景
     * @returns Successful
     */
    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        return true;
    }

    /**
     * @en The update process of the render scene, it updates all rendering related data for the lights and the models.
     * @zh 渲染场景的更新流程，会更新所有光源和模型的渲染相关数据。
     * @param stamp The update time stamp
     * @returns void
     */
    public update (stamp: number) {
        const mainLight = this._mainLight;
        if (mainLight) {
            mainLight.update();
        }

        const sphereLights = this._sphereLights;
        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            light.update();
        }

        const spotLights = this._spotLights;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            light.update();
        }

        const models = this._models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];

            if (model.enabled) {
                model.updateTransform(stamp);
                model.updateUBOs(stamp);
            }
        }
    }

    /**
     * @en Destroy the render scene, dangerous, please do not invoke manually.
     * @zh 销毁渲染场景，请不要手动销毁，会造成未知行为。
     */
    public destroy () {
        this.removeCameras();
        this.removeSphereLights();
        this.removeSpotLights();
        this.removeModels();
    }

    /**
     * @en Attach a camera to the render scene
     * @zh 向渲染场景挂载一个相机
     */
    public addCamera (cam: Camera) {
        cam.attachToScene(this);
        this._cameras.push(cam);
    }

    /**
     * @en Detach a camera to the render scene
     * @zh 从渲染场景移除一个相机
     */
    public removeCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                this._cameras.splice(i, 1);
                camera.detachFromScene();
                return;
            }
        }
    }

    /**
     * @en Detach all cameras to the render scene
     * @zh 从渲染场景移除所有相机
     */
    public removeCameras () {
        for (const camera of this._cameras) {
            camera.detachFromScene();
        }
        this._cameras.splice(0);
    }

    /**
     * @en Sets the main light source for the render scene
     * @zh 给渲染场景设置主光源
     * @param dl The main directional light source
     */
    public setMainLight (dl: DirectionalLight | null) {
        this._mainLight = dl;
    }

    /**
     * @en Remove the main light source from the render scene
     * @zh 从渲染场景移除主光源
     * @param dl The main directional light source, if it's not the actual main light, nothing happens.
     */
    public unsetMainLight (dl: DirectionalLight) {
        if (this._mainLight === dl) {
            const dlList = this._directionalLights;
            if (dlList.length) {
                this.setMainLight(dlList[dlList.length - 1]);
                if (this._mainLight.node) { // trigger update
                    this._mainLight.node.hasChangedFlags |= TransformBit.ROTATION;
                }
                return;
            }
            this.setMainLight(null);
        }
    }

    /**
     * @en Add a directional light source, only one directional light is active and act as the main light source.
     * @zh 增加一个方向光源，场景中只会有一个方向光是起效的，并且会作为主光源。
     * @param dl The directional light.
     */
    public addDirectionalLight (dl: DirectionalLight) {
        dl.attachToScene(this);
        this._directionalLights.push(dl);
    }

    /**
     * @en Remove a directional light source.
     * @zh 删除一个方向光源。
     * @param dl The directional light.
     */
    public removeDirectionalLight (dl: DirectionalLight) {
        for (let i = 0; i < this._directionalLights.length; ++i) {
            if (this._directionalLights[i] === dl) {
                dl.detachFromScene();
                this._directionalLights.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @en Add a sphere light source.
     * @zh 增加一个球面光源。
     * @param pl The sphere light.
     */
    public addSphereLight (pl: SphereLight) {
        pl.attachToScene(this);
        this._sphereLights.push(pl);
    }

    /**
     * @en Remove a sphere light source.
     * @zh 删除一个球面光源。
     * @param pl The sphere light.
     */
    public removeSphereLight (pl: SphereLight) {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            if (this._sphereLights[i] === pl) {
                pl.detachFromScene();
                this._sphereLights.splice(i, 1);

                return;
            }
        }
    }

    /**
     * @en Add a spot light source.
     * @zh 增加一个聚光灯光源。
     * @param sl The spot light.
     */
    public addSpotLight (sl: SpotLight) {
        sl.attachToScene(this);
        this._spotLights.push(sl);
    }

    /**
     * @en Remove a spot light source.
     * @zh 删除一个聚光灯光源。
     * @param sl The spot light.
     */
    public removeSpotLight (sl: SpotLight) {
        for (let i = 0; i < this._spotLights.length; ++i) {
            if (this._spotLights[i] === sl) {
                sl.detachFromScene();
                this._spotLights.splice(i, 1);

                return;
            }
        }
    }

    /**
     * @en Remove all sphere light sources.
     * @zh 删除所有球面光源。
     */
    public removeSphereLights () {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            this._sphereLights[i].detachFromScene();
        }
        this._sphereLights.length = 0;
    }

    /**
     * @en Remove all spot light sources.
     * @zh 删除所有聚光灯光源。
     */
    public removeSpotLights () {
        for (let i = 0; i < this._spotLights.length; ++i) {
            this._spotLights[i].detachFromScene();
        }
        this._spotLights = [];
    }

    /**
     * @en Add a model, all models attached to the render scene will be submitted for rendering.
     * @zh 增加一个模型，渲染场景上挂载的所有模型都会被提交渲染。
     * @param m The model.
     */
    public addModel (m: Model) {
        m.attachToScene(this);
        this._models.push(m);
    }

    /**
     * @en Remove a model, model removed will no longer be submitted for rendering.
     * @zh 删除一个模型，移除的模型将不再被提交渲染。
     * @param m The model.
     */
    public removeModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                model.detachFromScene();
                this._models.splice(i, 1);

                return;
            }
        }
    }

    /**
     * @en Remove all models.
     * @zh 删除所有模型。
     */
    public removeModels () {
        for (const m of this._models) {
            m.detachFromScene();
            m.destroy();
        }
        this._models.length = 0;
    }

    /**
     * @en Add a draw batch of 2d objects, all draw batches attached to the render scene will be submitted for rendering.
     * @zh 增加一个 2D 渲染批次，渲染场景上挂载的所有 2D 渲染批次都会被提交渲染。
     * @param batch The draw batch.
     * @internal
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    public addBatch (batch: DrawBatch2D) {
        this._batches.push(batch);
    }

    /**
     * @en Remove a draw batch of 2d objects, draw batch removed will no longer be submitted for rendering.
     * @zh 删除一个 2D 渲染批次，移除的 2D 渲染批次将不再被提交渲染。
     * @param batch The draw batch.
     * @internal
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    public removeBatch (batch: DrawBatch2D) {
        for (let i = 0; i < this._batches.length; ++i) {
            if (this._batches[i] === batch) {
                this._batches.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @en Remove all 2d draw batches.
     * @zh 删除所有 2D 渲染批次。
     * @internal
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    public removeBatches () {
        this._batches.length = 0;
    }

    /**
     * @en Notify all models that the global pipeline state have been updated so that they can update their render data and states.
     * @zh 通知所有模型全局管线状态已更新，需要更新自身状态。
     */
    public onGlobalPipelineStateChanged () {
        for (const m of this._models) {
            m.onGlobalPipelineStateChanged();
        }
    }

    /**
     * @en Generate a new model id.
     * @zh 生成一个新的模型 ID
     * @returns The model id
     */
    public generateModelId (): number {
        return this._modelId++;
    }
}
