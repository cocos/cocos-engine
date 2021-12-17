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
import { JSB } from 'internal:constants';
import { Root } from '../../root';
import { Node } from '../../scene-graph';
import { Camera } from './camera';
import { DirectionalLight } from './directional-light';
import { Model, ModelType } from './model';
import { SphereLight } from './sphere-light';
import { SpotLight } from './spot-light';
import { TransformBit } from '../../scene-graph/node-enum';
import { DrawBatch2D } from '../../../2d/renderer/draw-batch';
import { NativeDrawBatch2D, NativeRenderScene } from './native-scene';

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

    get native (): NativeRenderScene {
        return this._nativeObj!;
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
    private declare _nativeObj: NativeRenderScene | null;

    constructor (root: Root) {
        this._root = root;
        this._createNativeObject();
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        return true;
    }

    public activate () {
        if (JSB) {
            this._nativeObj!.activate();
        }
    }

    public update (stamp: number) {
        if (JSB) {
            const nativeBatches: NativeDrawBatch2D[]  = [];
            for (let i = 0, len = this._batches.length; i < len; ++i) {
                nativeBatches.push(this._batches[i].native);
            }
            this._nativeObj!.updateBatches(nativeBatches);
            this._nativeObj!.update(stamp);
            return;
        }
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

    protected _destroy () {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public destroy () {
        this.removeCameras();
        this.removeSphereLights();
        this.removeSpotLights();
        this.removeModels();
        this._destroy();
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

    public setMainLight (dl: DirectionalLight | null) {
        this._mainLight = dl;
        if (JSB) {
            this._nativeObj!.setMainLight(dl ? dl.native : null);
        }
    }

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
        if (JSB) {
            this._nativeObj!.addSphereLight(pl.native);
        }
    }

    public removeSphereLight (pl: SphereLight) {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            if (this._sphereLights[i] === pl) {
                pl.detachFromScene();
                this._sphereLights.splice(i, 1);
                if (JSB) {
                    this._nativeObj!.removeSphereLight(pl.native);
                }
                return;
            }
        }
    }

    public addSpotLight (sl: SpotLight) {
        sl.attachToScene(this);
        this._spotLights.push(sl);
        if (JSB) {
            this._nativeObj!.addSpotLight(sl.native);
        }
    }

    public removeSpotLight (sl: SpotLight) {
        for (let i = 0; i < this._spotLights.length; ++i) {
            if (this._spotLights[i] === sl) {
                sl.detachFromScene();
                this._spotLights.splice(i, 1);
                if (JSB) {
                    this._nativeObj!.removeSpotLight(sl.native);
                }
                return;
            }
        }
    }

    public removeSphereLights () {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            this._sphereLights[i].detachFromScene();
        }
        this._sphereLights.length = 0;
        if (JSB) {
            this._nativeObj!.removeSphereLights();
        }
    }

    public removeSpotLights () {
        for (let i = 0; i < this._spotLights.length; ++i) {
            this._spotLights[i].detachFromScene();
        }
        this._spotLights = [];
        if (JSB) {
            this._nativeObj!.removeSpotLights();
        }
    }

    public addModel (m: Model) {
        m.attachToScene(this);
        this._models.push(m);
        if (JSB) {
            switch (m.type) {
            case ModelType.SKINNING:
                this._nativeObj!.addSkinningModel(m.native);
                break;
            case ModelType.BAKED_SKINNING:
                this._nativeObj!.addBakedSkinningModel(m.native);
                break;
            case ModelType.DEFAULT:
            default:
                this._nativeObj!.addModel(m.native);
            }
        }
    }

    public removeModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                model.detachFromScene();
                this._models.splice(i, 1);
                if (JSB) {
                    this._nativeObj!.removeModel(i);
                }
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
        if (JSB) {
            this._nativeObj!.removeModels();
        }
    }

    public addBatch (batch: DrawBatch2D) {
        this._batches.push(batch);
    }

    public removeBatch (batch: DrawBatch2D) {
        for (let i = 0; i < this._batches.length; ++i) {
            if (this._batches[i] === batch) {
                this._batches.splice(i, 1);
                if (JSB) {
                    this._nativeObj!.removeBatch(i);
                }
                return;
            }
        }
    }

    public removeBatches () {
        this._batches.length = 0;
        if (JSB) {
            this._nativeObj!.removeBatches();
        }
    }

    public onGlobalPipelineStateChanged () {
        for (const m of this._models) {
            m.onGlobalPipelineStateChanged();
        }
    }

    public generateModelId (): number {
        return this._modelId++;
    }

    private _createNativeObject () {
        if (JSB && !this._nativeObj) {
            this._nativeObj = new NativeRenderScene();
        }
    }
}
