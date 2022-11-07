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
import { Vec3, geometry } from '../core';
import { Texture } from '../gfx';
import { Camera, Model } from '../render-scene/scene';
import { ReflectionProbe } from '../render-scene/scene/reflection-probe';
import { CAMERA_DEFAULT_MASK } from './define';

const SPHERE_NODE_NAME = 'Reflection Probe Sphere';
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
     * @en Update the cubemap captured by the reflection probe.
     * @zh 更新反射探针捕获的cubemap
     * @param probe update the texture for this probe
     */
    public updateBakedCubemap (probe: ReflectionProbe) {
        const models = this._getModelsByProbe(probe);
        if (!probe.cubemap) return;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            const meshRender = model.node.getComponent(MeshRenderer);
            if (meshRender) {
                meshRender.updateProbeCubemap(probe.cubemap);
            }
        }
        probe.needRefresh = false;
    }

    /**
     * @en Update the plane reflection map for reflection probe render.
     * @zh 更新反射探针渲染的平面反射贴图
     * @param probe update the texture for this probe
     */
    public updatePlanarMap (probe: ReflectionProbe, texture: Texture | null) {
        if (!probe.node || !probe.node.scene) return;
        const scene = probe.node.scene.renderScene;
        const models = scene!.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.node || !model.worldBounds) continue;
            if ((model.node.layer & CAMERA_DEFAULT_MASK) && geometry.intersect.aabbWithAABB(model.worldBounds, probe.boundingBox!)) {
                const meshRender = model.node.getComponent(MeshRenderer);
                if (meshRender) {
                    meshRender.updateProbePlanarMap(texture);
                }
            }
        }
    }

    /**
     * @en This function is called when the transform of the reflection probe changes, to update the object using this reflection probe.
     * @zh 反射探针的transform变化时,会调用此函数来更新使用此反射探针的物体。
     * @param probe update the object for this probe
     */
    public updateModes (probe: ReflectionProbe) {
        if (!probe.node || !probe.node.scene) return;
        const scene = probe.node.scene.renderScene;
        if (!scene) return;
        const models = scene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (model.node && model.worldBounds && ((model.node.layer & CAMERA_DEFAULT_MASK)) || model.node.name === SPHERE_NODE_NAME) {
                const nearest = this._getNearestProbe(model);
                if (!nearest) {
                    const meshRender = model.node.getComponent(MeshRenderer);
                    if (meshRender) {
                        meshRender.updateProbeCubemap(null);
                    }
                    this._models.delete(model);
                    continue;
                }
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
        let idx = -1;
        let find = false;
        for (let i = 0; i < this._probes.length; i++) {
            if (!this._probes[i].validate() || !geometry.intersect.aabbWithAABB(model.worldBounds, this._probes[i].boundingBox!)) {
                continue;
            } else if (!find) {
                find = true;
                distance = Vec3.distance(model.node.position, this._probes[i].node.position);
                idx = i;
            }
            const d = Vec3.distance(model.node.position, this._probes[i].node.position);
            if (d < distance) {
                distance = d;
                idx = i;
            }
        }
        return find ? this._probes[idx] : null;
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
