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
import { Camera } from './camera';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { SphereLight } from './sphere-light';
import { SpotLight } from './spot-light';
import { TransformBit } from '../../scene-graph/node-enum';
import { ScenePool, SceneView, ModelArrayPool, ModelArrayHandle, SceneHandle, NULL_HANDLE,
    UIBatchArrayHandle, UIBatchArrayPool, LightArrayHandle, LightArrayPool } from '../core/memory-pools';
import { DrawBatch2D } from '../../../2d/renderer/draw-batch';

export interface IRenderSceneInfo {
    name: string;
}

export interface ISceneNodeInfo {
    name: string;
    isStatic?: boolean;
    // parent: Node;
}

export interface IRaycastResult {
    node: Node;
    distance: number;
}

export class RenderScene {
    get root (): Root {
        return this._root;
    }

    get name (): string {
        return this._name;
    }

    get cameras (): Camera[] {
        return this._cameras;
    }

    get mainLight (): DirectionalLight | null {
        return this._mainLight;
    }

    get sphereLights (): SphereLight[] {
        return this._sphereLights;
    }

    get spotLights (): SpotLight[] {
        return this._spotLights;
    }

    get models (): Model[] {
        return this._models;
    }

    get handle () : SceneHandle {
        return this._scenePoolHandle;
    }

    get batches () {
        return this._batches;
    }

    public static registerCreateFunc (root: Root) {
        root._createSceneFun = (_root: Root): RenderScene => new RenderScene(_root);
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
    private _scenePoolHandle: SceneHandle = NULL_HANDLE;
    private _modelArrayHandle: ModelArrayHandle = NULL_HANDLE;
    private _batchArrayHandle: UIBatchArrayHandle = NULL_HANDLE;
    private _sphereLightsHandle: LightArrayHandle = NULL_HANDLE;
    private _spotLightsHandle: LightArrayHandle = NULL_HANDLE;

    constructor (root: Root) {
        this._root = root;
        this._createHandles();
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        this._createHandles();
        return true;
    }

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

    public destroy () {
        this.removeCameras();
        this.removeSphereLights();
        this.removeSpotLights();
        this.removeModels();
        if (this._modelArrayHandle) {
            ModelArrayPool.free(this._modelArrayHandle);
            this._modelArrayHandle = NULL_HANDLE;
        }
        if (this._scenePoolHandle) {
            ScenePool.free(this._scenePoolHandle);
            this._scenePoolHandle = NULL_HANDLE;
        }
        if (this._sphereLightsHandle) {
            LightArrayPool.free(this._sphereLightsHandle);
            this._sphereLightsHandle = NULL_HANDLE;
        }
        if (this._spotLightsHandle) {
            LightArrayPool.free(this._spotLightsHandle);
            this._spotLightsHandle = NULL_HANDLE;
        }
        if (this._batchArrayHandle) {
            UIBatchArrayPool.free(this._batchArrayHandle);
            this._batchArrayHandle = NULL_HANDLE;
        }
    }

    public addCamera (cam: Camera) {
        cam.attachToScene(this);
        this._cameras.push(cam);
    }

    public removeCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                this._cameras.splice(i, 1);
                camera.detachFromScene();
                return;
            }
        }
    }

    public removeCameras () {
        for (const camera of this._cameras) {
            camera.detachFromScene();
        }
        this._cameras.splice(0);
    }

    public setMainLight (dl: DirectionalLight) {
        this._mainLight = dl;
        ScenePool.set(this._scenePoolHandle, SceneView.MAIN_LIGHT, dl.handle);
    }

    public unsetMainLight (dl: DirectionalLight) {
        if (this._mainLight === dl) {
            const dlList = this._directionalLights;
            if (dlList.length) {
                this._mainLight = dlList[dlList.length - 1];
                if (this._mainLight.node) { // trigger update
                    this._mainLight.node.hasChangedFlags |= TransformBit.ROTATION;
                }
            } else {
                this._mainLight = null;
            }
        }
    }

    public addDirectionalLight (dl: DirectionalLight) {
        dl.attachToScene(this);
        this._directionalLights.push(dl);
    }

    public removeDirectionalLight (dl: DirectionalLight) {
        for (let i = 0; i < this._directionalLights.length; ++i) {
            if (this._directionalLights[i] === dl) {
                dl.detachFromScene();
                this._directionalLights.splice(i, 1);
                return;
            }
        }
    }

    public addSphereLight (pl: SphereLight) {
        pl.attachToScene(this);
        this._sphereLights.push(pl);
        LightArrayPool.push(this._sphereLightsHandle, pl.handle);
    }

    public removeSphereLight (pl: SphereLight) {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            if (this._sphereLights[i] === pl) {
                pl.detachFromScene();
                this._sphereLights.splice(i, 1);
                LightArrayPool.erase(this._sphereLightsHandle, i);
                return;
            }
        }
    }

    public addSpotLight (sl: SpotLight) {
        sl.attachToScene(this);
        this._spotLights.push(sl);
        LightArrayPool.push(this._spotLightsHandle, sl.handle);
    }

    public removeSpotLight (sl: SpotLight) {
        for (let i = 0; i < this._spotLights.length; ++i) {
            if (this._spotLights[i] === sl) {
                sl.detachFromScene();
                this._spotLights.splice(i, 1);
                LightArrayPool.erase(this._spotLightsHandle, i);
                return;
            }
        }
    }

    public removeSphereLights () {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            this._sphereLights[i].detachFromScene();
        }
        this._sphereLights.length = 0;
        LightArrayPool.clear(this._sphereLightsHandle);
    }

    public removeSpotLights () {
        for (let i = 0; i < this._spotLights.length; ++i) {
            this._spotLights[i].detachFromScene();
        }
        this._spotLights = [];
        LightArrayPool.clear(this._spotLightsHandle);
    }

    public addModel (m: Model) {
        m.attachToScene(this);
        this._models.push(m);
        ModelArrayPool.push(this._modelArrayHandle, m.handle);
    }

    public removeModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                model.detachFromScene();
                this._models.splice(i, 1);
                ModelArrayPool.erase(this._modelArrayHandle, i);
                return;
            }
        }
    }

    public removeModels () {
        for (const m of this._models) {
            m.detachFromScene();
            m.destroy();
        }
        this._models.length = 0;
        ModelArrayPool.clear(this._modelArrayHandle);
    }

    public addBatch (batch: DrawBatch2D) {
        this._batches.push(batch);
        UIBatchArrayPool.push(this._batchArrayHandle, batch.handle);
    }

    public removeBatch (batch: DrawBatch2D) {
        for (let i = 0; i < this._batches.length; ++i) {
            if (this._batches[i] === batch) {
                this._batches.splice(i, 1);
                UIBatchArrayPool.erase(this._batchArrayHandle, i);
                return;
            }
        }
    }

    public removeBatches () {
        this._batches.length = 0;
        UIBatchArrayPool.clear(this._batchArrayHandle);
    }

    public onGlobalPipelineStateChanged () {
        for (const m of this._models) {
            m.onGlobalPipelineStateChanged();
        }
    }

    public generateModelId (): number {
        return this._modelId++;
    }

    private _createHandles () {
        if (!this._modelArrayHandle) {
            this._modelArrayHandle = ModelArrayPool.alloc();
            this._scenePoolHandle = ScenePool.alloc();
            ScenePool.set(this._scenePoolHandle, SceneView.MODEL_ARRAY, this._modelArrayHandle);

            this._spotLightsHandle = LightArrayPool.alloc();
            ScenePool.set(this._scenePoolHandle, SceneView.SPOT_LIGHT_ARRAY, this._spotLightsHandle);

            this._sphereLightsHandle = LightArrayPool.alloc();
            ScenePool.set(this._scenePoolHandle, SceneView.SPHERE_LIGHT_ARRAY, this._sphereLightsHandle);
        }

        if (!this._batchArrayHandle) {
            this._batchArrayHandle = UIBatchArrayPool.alloc();
            ScenePool.set(this._scenePoolHandle, SceneView.BATCH_ARRAY_2D, this._batchArrayHandle);
        }
    }
}
