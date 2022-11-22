/* eslint-disable max-len */
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

import { MeshRenderer, ReflectionProbeType } from '../3d/framework/mesh-renderer';
import { Vec3, geometry } from '../core';
import { Texture } from '../gfx';
import { Camera, Model } from '../render-scene/scene';
import { ProbeType, ReflectionProbe } from '../render-scene/scene/reflection-probe';
import { Layers } from '../scene-graph/layers';

const REFLECTION_PROBE_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.UI_3D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);
export class ReflectionProbeManager {
    public static probeManager: ReflectionProbeManager;
    private _probes: ReflectionProbe[] = [];
    /**
     * @en
     * All models in the scene that use cube type reflection probe.
     * @zh
     * 场景中所有使用cube类型反射探针的模型
     */
    private _useCubeModels = new Map<Model, ReflectionProbe>();

    /**
     * @en
     * All models in the scene that use planar type reflection probe.
     * @zh
     * 场景中所有使用planar类型反射探针的模型
     */
    private _usePlanarModels = new Map<Model, ReflectionProbe>();

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

    public getNewReflectionProbeId () {
        let probeId = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (this.exists(probeId)) {
                probeId++;
            } else {
                return probeId;
            }
        }
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
        const models = this._getModelsByProbe(probe);
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            const meshRender = model.node.getComponent(MeshRenderer);
            if (meshRender) {
                meshRender.updateProbePlanarMap(texture);
            }
        }
    }

    /**
     * @en Update objects using reflection probe for planar reflection.
     * @zh 更新使用反射探针进行平面反射的物体。
     * @param probe update the object for this probe
     */
    public updateUsePlanarModels (probe: ReflectionProbe) {
        if (!probe.node || !probe.node.scene) return;
        const scene = probe.node.scene.renderScene;
        const models = scene!.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.node || !model.worldBounds
                || model.reflectionProbeType !== ReflectionProbeType.PLANAR_REFLECTION
                || probe.probeType !== ProbeType.PLANAR) continue;
            model.updateWorldBound();
            const meshRender = model.node.getComponent(MeshRenderer);
            if ((model.node.layer & REFLECTION_PROBE_DEFAULT_MASK) && meshRender) {
                if (geometry.intersect.aabbWithAABB(model.worldBounds, probe.boundingBox!)) {
                    this._usePlanarModels.set(model, probe);
                } else if (this._usePlanarModels.has(model)) {
                    const old = this._usePlanarModels.get(model);
                    if (old === probe) {
                        this._usePlanarModels.delete(model);
                        const meshRender = model.node.getComponent(MeshRenderer);
                        if (meshRender) {
                            meshRender.updateProbePlanarMap(null);
                        }
                    }
                }
            }
        }
    }

    /**
     * @en Update objects using reflection probe for bake cubemap.
     * @zh 更新使用反射探针烘焙cubemap的物体。
     * @param probe update the object for this probe
     */
    public updateUseCubeModels (probe: ReflectionProbe) {
        if (!probe.node || !probe.node.scene) return;
        const scene = probe.node.scene.renderScene;
        if (!scene) return;
        const models = scene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            model.updateWorldBound();
            if (model.node && model.worldBounds && ((model.node.layer & REFLECTION_PROBE_DEFAULT_MASK))) {
                const nearest = this._getNearestProbe(model);
                if (!nearest) {
                    const meshRender = model.node.getComponent(MeshRenderer);
                    if (meshRender) {
                        meshRender.updateProbeCubemap(null);
                    }
                    this._useCubeModels.delete(model);
                    continue;
                }
                if (this._useCubeModels.has(model)) {
                    const old = this._useCubeModels.get(model);
                    if (old === nearest) {
                        continue;
                    }
                }
                this._useCubeModels.set(model, nearest);
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
     * @en Update the preview sphere of the Reflection Probe cube mode.
     * @zh 更新反射探针cube模式的预览球
     */
    public updatePreviewSphere (probe: ReflectionProbe) {
        if (!probe || !probe.previewSphere) return;
        const meshRender = probe.previewSphere.getComponent(MeshRenderer);
        if (meshRender) {
            meshRender.updateProbeCubemap(probe.cubemap);
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
                distance = Vec3.distance(model.node.worldPosition, this._probes[i].node.worldPosition);
                idx = i;
            }
            const d = Vec3.distance(model.node.worldPosition, this._probes[i].node.worldPosition);
            if (d < distance) {
                distance = d;
                idx = i;
            }
        }
        return find ? this._probes[idx] : null;
    }

    private _getModelsByProbe (probe: ReflectionProbe) {
        const models: Model[] = [];
        let useModels = this._useCubeModels;
        if (probe.probeType === ProbeType.PLANAR) {
            useModels = this._usePlanarModels;
        }
        for (const entry of useModels.entries()) {
            if (entry[1] === probe) {
                models.push(entry[0]);
            }
        }
        return models;
    }

    private _removeDependentModels (probe: ReflectionProbe) {
        for (const key of this._useCubeModels.keys()) {
            const p = this._useCubeModels.get(key);
            if (p !== undefined && p === probe) {
                this._useCubeModels.delete(key);
            }
        }
    }
}

ReflectionProbeManager.probeManager = new ReflectionProbeManager();
