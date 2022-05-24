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

    constructor (root: Root) {
        this._root = root;
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
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
    }

    public removeSphereLight (pl: SphereLight) {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            if (this._sphereLights[i] === pl) {
                pl.detachFromScene();
                this._sphereLights.splice(i, 1);

                return;
            }
        }
    }

    public addSpotLight (sl: SpotLight) {
        sl.attachToScene(this);
        this._spotLights.push(sl);
    }

    public removeSpotLight (sl: SpotLight) {
        for (let i = 0; i < this._spotLights.length; ++i) {
            if (this._spotLights[i] === sl) {
                sl.detachFromScene();
                this._spotLights.splice(i, 1);

                return;
            }
        }
    }

    public removeSphereLights () {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            this._sphereLights[i].detachFromScene();
        }
        this._sphereLights.length = 0;
    }

    public removeSpotLights () {
        for (let i = 0; i < this._spotLights.length; ++i) {
            this._spotLights[i].detachFromScene();
        }
        this._spotLights = [];
    }

    public addModel (m: Model) {
        m.attachToScene(this);
        this._models.push(m);
    }

    public removeModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                model.detachFromScene();
                this._models.splice(i, 1);

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
    }

    public addBatch (batch: DrawBatch2D) {
        this._batches.push(batch);
    }

    public removeBatch (batch: DrawBatch2D) {
        for (let i = 0; i < this._batches.length; ++i) {
            if (this._batches[i] === batch) {
                this._batches.splice(i, 1);
                return;
            }
        }
    }

    public removeBatches () {
        this._batches.length = 0;
    }

    public onGlobalPipelineStateChanged () {
        for (const m of this._models) {
            m.onGlobalPipelineStateChanged();
        }
    }

    public generateModelId (): number {
        return this._modelId++;
    }
}
