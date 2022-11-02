/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { MeshRenderer } from '../3d/framework/mesh-renderer';
import { Vec3 } from '../core';
import intersect from '../core/geometry/intersect';
import { Camera, Model } from '../render-scene/scene';
import { ReflectionProbe } from '../render-scene/scene/reflection-probe';
import { IRenderObject } from './define';

export class ReflectionProbeManager {
    public static probeManager: ReflectionProbeManager;
    private _probes: ReflectionProbe[] = [];
    /**
     * @en
     * All models in the scene that use reflection probes.
     * @zh
     * 场景中所有使用反射探针的模型
     */
    private _models = new Map<Model, ReflectionProbe>();

    public register (probe: ReflectionProbe) {
        const index = this._probes.indexOf(probe);
        if (index === -1) {
            this._probes.push(probe);
        }
    }

    public unregister (probe: ReflectionProbe) {
        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i] === probe) {
                const del = this._probes.splice(i, 1);
                if (del[0]) {
                    this._removeDependentModels(del[0]);
                }
                break;
            }
        }
    }

    public exists (probeId: number): boolean {
        if (this._probes.length === 0) return false;
        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].getProbeId() === probeId) {
                return true;
            }
        }
        return false;
    }

    public getProbes (): ReflectionProbe[] {
        return this._probes;
    }

    public clearAll () {
        this._probes = [];
    }

    public getProbeByCamera (camera: Camera) {
        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].camera === camera) {
                return this._probes[i];
            }
        }
        return null;
    }

    /**
     * @en
     * Render objects to the probe.
     * @zh
     * 渲染至probe的物体。
     */
    public addRenderObject (camera: Camera, obj: IRenderObject, bSkybox?: boolean) {
        const probe = this.getProbeByCamera(camera);
        if (!probe) return;
        if ((obj.model.worldBounds && intersect.aabbWithAABB(obj.model.worldBounds, probe.boundingBox)) || bSkybox) {
            probe.renderObjects.push(obj);
        }
    }

    public clearRenderObject (camera: Camera) {
        const probe = this.getProbeByCamera(camera);
        if (probe) {
            probe.renderObjects = [];
        }
    }

    public getRenderObjects (camera: Camera): readonly IRenderObject[] {
        const probe = this.getProbeByCamera(camera);
        if (probe) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return probe.renderObjects;
        }
        return [];
    }

    /**
     * @en Update the cubemap captured by the reflection probe.
     * @zh 更新反射探针捕获的cubemap
     * @param probe update the texture for this probe
     */
    public updateBakedCubemap (probe: ReflectionProbe) {
        if (!probe.cubemap) return;
        const scene = probe.node.scene.renderScene;
        if (!scene) return;
        for (let i = 0; i < scene.models.length; i++) {
            const model = scene.models[i];
            if (model.node && model.worldBounds && intersect.aabbWithAABB(model.worldBounds, probe.boundingBox)) {
                this._models.set(model, probe);
                const meshRender = model.node.getComponent(MeshRenderer);
                if (meshRender) {
                    meshRender.updateProbeCubemap(probe.cubemap);
                }
            }
        }
        probe.needRefresh = false;
    }

    /**
     * @en Update the plane reflection map for reflection probe render.
     * @zh 更新反射探针渲染的平面反射贴图
     * @param probe update the texture for this probe
     */
    public updatePlanarMap (probe: ReflectionProbe) {
        const models = this._getModelsByProbe(probe);
        if (!probe.realtimePlanarTexture) return;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            const meshRender = model.node.getComponent(MeshRenderer);
            if (meshRender) {
                meshRender.updateProbePlanarMap(probe.realtimePlanarTexture.getGFXTexture());
            }
        }
    }

    /**
     * @en Unbind planar reflection map
     * @zh 解除绑定的平面反射贴图
     * @param probe unbind the texture for this probe
     */
    public unbindingPlanarMap (probe: ReflectionProbe) {
        const models = this._getModelsByProbe(probe);
        if (!probe.realtimePlanarTexture) return;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            const meshRender = model.node.getComponent(MeshRenderer);
            if (meshRender) {
                meshRender.updateProbePlanarMap(null);
            }
        }
    }

    /**
     * @en This function is called when the transform of the reflection probe changes, to update the object using this reflection probe.
     * @zh 反射探针的transform变化时,会调用此函数来更新使用此反射探针的物体。
     * @param probe update the object for this probe
     */
    public updateModes (probe: ReflectionProbe) {
        const scene = probe.node.scene.renderScene;
        if (!scene) return;
        const models = scene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (model.node && model.worldBounds) {
                const nearest = this._getNearestProbe(model);
                if (!nearest) continue;

                if (this._models.has(model)) {
                    const old = this._models.get(model);
                    if (old === nearest) {
                        continue;
                    }
                }
                this._models.set(model, nearest);
                nearest.needRefresh = true;
            }
        }

        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].needRefresh) {
                this.updateBakedCubemap(this._probes[i]);
            }
        }
    }

    /**
     * @en
     * select the probe with the nearest distance.
     * @zh
     * 选择距离最近的probe。
     * @param model select the probe for this model
     */
    private _getNearestProbe (model: Model): ReflectionProbe | null {
        if (this._probes.length === 0) return null;
        if (!model.node || !model.worldBounds) return null;

        let distance = 0;
        let idx = 0;

        for (let i = 0; i < this._probes.length; i++) {
            if (!this._probes[i].validate() || !intersect.aabbWithAABB(model.worldBounds, this._probes[i].boundingBox)) {
                continue;
            }
            if (i === 0) {
                distance = Vec3.distance(model.node.position, this._probes[i].node.position);
            } else {
                const d = Vec3.distance(model.node.position, this._probes[i].node.position);
                if (d < distance) {
                    distance = d;
                    idx = i;
                }
            }
        }
        return this._probes[idx];
    }

    private _getModelsByProbe (probe: ReflectionProbe) {
        const models: Model[] = [];
        for (const entry of this._models.entries()) {
            if (entry[1] === probe) {
                models.push(entry[0]);
            }
        }
        return models;
    }

    private _removeDependentModels (probe: ReflectionProbe) {
        for (const key of this._models.keys()) {
            const p = this._models.get(key);
            if (p !== undefined && p === probe) {
                this._models.delete(key);
            }
        }
    }
}

ReflectionProbeManager.probeManager = new ReflectionProbeManager();
