/* eslint-disable max-len */
/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { MeshRenderer, ReflectionProbeType } from '../3d/framework/mesh-renderer';
import { ImageAsset, Texture2D } from '../asset/assets';
import { PixelFormat } from '../asset/assets/asset-enum';
import { Vec3, geometry, cclegacy } from '../core';
import { Texture } from '../gfx';
import { Camera, Model } from '../render-scene/scene';
import { ProbeType, ReflectionProbe } from '../render-scene/scene/reflection-probe';
import { Layers } from '../scene-graph/layers';

const REFLECTION_PROBE_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.UI_3D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER, Layers.Enum.IGNORE_RAYCAST]);
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
    private _updateForRuntime = true;
    private _dataTexture: Texture2D | null = null;
    private _registeredEvent = false;
    /**
     * @en Set and get whether to detect objects leaving or entering the reflection probe's bounding box at runtime.
     * @zh 设置和获取是否在运行时检测物体离开或者进入反射探针的包围盒。
     */
    set updateForRuntime (val: boolean) {
        this._updateForRuntime = val;
    }
    get updateForRuntime () {
        return this._updateForRuntime;
    }

    public registerEvent () {
        if (!this._registeredEvent) {
            cclegacy.director.on(cclegacy.Director.EVENT_BEFORE_UPDATE, this.onUpdateProbes, this);
            this._registeredEvent = true;
        }
    }
    /**
     * @en refresh all reflection probe
     * @zh 刷新所有反射探针
     */
    public onUpdateProbes (forceUpdate = false) {
        if (!this._updateForRuntime || this._probes.length === 0) return;
        const scene = cclegacy.director.getScene();
        if (!scene || !scene.renderScene) {
            return;
        }
        const models = scene.renderScene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.node) continue;
            if ((model.node.layer & REFLECTION_PROBE_DEFAULT_MASK) && (model.node.hasChangedFlags || forceUpdate)) {
                if (model.reflectionProbeType === ReflectionProbeType.BAKED_CUBEMAP) {
                    this.updateUseCubeModels(model);
                } else if (model.reflectionProbeType === ReflectionProbeType.PLANAR_REFLECTION) {
                    this.updateUsePlanarModels(model);
                }
            }
        }
    }

    public filterModelsForPlanarReflection () {
        if (this._probes.length === 0) return;
        const scene = cclegacy.director.getScene();
        if (!scene || !scene.renderScene) {
            return;
        }
        const models = scene.renderScene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.node) continue;
            if ((model.node.layer & REFLECTION_PROBE_DEFAULT_MASK) && model.reflectionProbeType === ReflectionProbeType.PLANAR_REFLECTION) {
                this.updateUsePlanarModels(model);
            }
        }
    }

    public clearPlanarReflectionMap (probe: ReflectionProbe) {
        for (const entry of this._usePlanarModels.entries()) {
            if (entry[1] === probe) {
                this._updatePlanarMapOfModel(entry[0], null, null);
            }
        }
    }

    public register (probe: ReflectionProbe) {
        const index = this._probes.indexOf(probe);
        if (index === -1) {
            this._probes.push(probe);
            this.updateProbeData();
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
        this.updateProbeData();
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

    public getProbeById (probeId: number): ReflectionProbe | null {
        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].getProbeId() === probeId) {
                return this._probes[i];
            }
        }
        return null;
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
            this._updateCubemapOfModel(model, probe);
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
            this._updatePlanarMapOfModel(models[i], texture, probe);
        }
        if (probe.previewPlane) {
            const meshRender = probe.previewPlane.getComponent(MeshRenderer);
            if (meshRender) {
                meshRender.updateProbePlanarMap(texture);
            }
        }
    }

    /**
     * @en Update objects using reflection probe for planar reflection.
     * @zh 更新使用反射探针进行平面反射的物体。
     * @param probe update the model for reflection probe
     * @engineInternal
     */
    public updateUsePlanarModels (model: Model) {
        if (!model.node || !model.worldBounds || model.reflectionProbeType !== ReflectionProbeType.PLANAR_REFLECTION) return;
        for (let i = 0; i < this._probes.length; i++) {
            const probe = this._probes[i];
            if (probe.probeType !== ProbeType.PLANAR) continue;
            if (model.node.layer & REFLECTION_PROBE_DEFAULT_MASK) {
                model.updateWorldBound();
                if (geometry.intersect.aabbWithAABB(model.worldBounds, probe.boundingBox!)) {
                    this._usePlanarModels.set(model, probe);
                } else if (this._usePlanarModels.has(model)) {
                    const old = this._usePlanarModels.get(model);
                    if (old === probe) {
                        this._usePlanarModels.delete(model);
                        this._updatePlanarMapOfModel(model, null, null);
                    }
                }
            }
        }

        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].probeType === ProbeType.PLANAR) {
                if (!this._probes[i].realtimePlanarTexture) {
                    this.updatePlanarMap(this._probes[i], null);
                } else {
                    this.updatePlanarMap(this._probes[i], this._probes[i].realtimePlanarTexture!.getGFXTexture());
                }
            }
        }
    }

    /**
     * @en Update objects using reflection probe for bake cubemap.
     * @zh 更新使用反射探针烘焙cubemap的物体。
     * @param model update the model for reflection probe
     * @engineInternal
     */
    public updateUseCubeModels (model: Model) {
        if (model.node && model.worldBounds && ((model.node.layer & REFLECTION_PROBE_DEFAULT_MASK))) {
            model.updateWorldBound();
            const nearest = this._getNearestProbe(model);
            if (!nearest) {
                //not in the range of any probe,set default texture for the model
                this._updateCubemapOfModel(model, null);
                this._useCubeModels.delete(model);
            } else if (this._useCubeModels.has(model)) {
                const old = this._useCubeModels.get(model);
                // if used other probe,reset texture
                if (old !== nearest) {
                    this._useCubeModels.set(model, nearest);
                    nearest.needRefresh = true;
                }
            } else {
                this._useCubeModels.set(model, nearest);
                nearest.needRefresh = true;
            }
        }

        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].needRefresh && this._probes[i].probeType === ProbeType.CUBE) {
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
            meshRender.updateProbeCubemap(probe.cubemap, !probe.cubemap);
        }
    }

    /**
     * @en Update the preview plane of the Reflection Probe planar mode.
     * @zh 更新反射探针预览平面
     */
    public updatePreviewPlane (probe: ReflectionProbe) {
        if (!probe || !probe.previewPlane) return;
        const meshRender = probe.previewPlane.getComponent(MeshRenderer);
        if (meshRender) {
            if (probe.realtimePlanarTexture) {
                this.updatePlanarMap(probe, probe.realtimePlanarTexture.getGFXTexture());
            }
        }
    }

    /**
     * @en Update reflection probe data of model bind.
     * @zh 更新模型绑定的反射探针数据。
     */
    public updateProbeData () {
        if (this._probes.length === 0) return;
        const maxId = this.getMaxProbeId();
        const height = maxId + 1;
        const dataWidth = 3;
        if (this._dataTexture) {
            this._dataTexture.destroy();
        }

        const buffer = new Float32Array(4 * dataWidth * height);
        let bufferOffset = 0;
        for (let i = 0; i <= maxId; i++) {
            const probe = this.getProbeById(i);
            if (!probe) {
                bufferOffset += 4 * dataWidth;
                continue;
            }
            if (probe.probeType === ProbeType.CUBE) {
                //world pos
                buffer[bufferOffset] = probe.node.worldPosition.x;
                buffer[bufferOffset + 1] = probe.node.worldPosition.y;
                buffer[bufferOffset + 2] = probe.node.worldPosition.z;
                buffer[bufferOffset + 3] = 0.0;

                buffer[bufferOffset + 4] = probe.size.x;
                buffer[bufferOffset + 5] = probe.size.y;
                buffer[bufferOffset + 6] = probe.size.z;
                buffer[bufferOffset + 7] = 0.0;
                buffer[bufferOffset + 8] = probe.cubemap ? probe.cubemap.mipmapLevel : 1.0;
            } else {
                //plane.xyz;
                buffer[bufferOffset] = probe.node.up.x;
                buffer[bufferOffset + 1] = probe.node.up.y;
                buffer[bufferOffset + 2] = probe.node.up.z;
                buffer[bufferOffset + 3] = 1.0;
                //plane.w;
                buffer[bufferOffset + 4] = 1.0;
                //planarReflectionDepthScale
                buffer[bufferOffset + 5] = 1.0;
                buffer[bufferOffset + 6] = 0.0;
                buffer[bufferOffset + 7] = 0.0;
                //mipCount;
                buffer[bufferOffset + 8] = 1.0;
            }
            bufferOffset += 4 * dataWidth;
        }
        const updateView = new Uint8Array(buffer.buffer);
        const image = new ImageAsset({
            _data: updateView,
            _compressed: false,
            width: dataWidth * 4,
            height,
            format: PixelFormat.RGBA8888,
        });

        this._dataTexture = new Texture2D();
        this._dataTexture.setFilters(Texture2D.Filter.NONE, Texture2D.Filter.NONE);
        this._dataTexture.setMipFilter(Texture2D.Filter.NONE);
        this._dataTexture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);
        this._dataTexture.image = image;

        this._dataTexture.uploadData(updateView);

        for (let i = 0; i < this._probes.length; i++) {
            const probe = this._probes[i];
            const models = this._getModelsByProbe(probe);
            for (let j = 0; j < models.length; j++) {
                const meshRender = models[j].node.getComponent(MeshRenderer);
                if (meshRender) {
                    meshRender.updateReflectionProbeDataMap(this._dataTexture);
                    meshRender.updateReflectionProbeId(probe.getProbeId());
                }
            }
        }
    }

    /**
     * @en get max value of probe id.
     * @zh 获取反射探针id的最大值。
     */
    public getMaxProbeId () {
        if (this._probes.length === 0) {
            return -1;
        }
        if (this._probes.length === 1) {
            return this._probes[0].getProbeId();
        }
        this._probes.sort((a: ReflectionProbe, b: ReflectionProbe) => a.getProbeId() - b.getProbeId());
        return this._probes[this._probes.length - 1].getProbeId();
    }
    /**
     * @en Get the reflection probe used by the model.
     * @zh 获取模型使用的反射探针。
     */
    public getUsedReflectionProbe (model: Model, probeType: ReflectionProbeType) {
        if (probeType === ReflectionProbeType.BAKED_CUBEMAP) {
            if (this._useCubeModels.has(model)) {
                return this._useCubeModels.get(model);
            }
        } else if (probeType === ReflectionProbeType.PLANAR_REFLECTION) {
            if (this._usePlanarModels.has(model)) {
                return this._usePlanarModels.get(model);
            }
        }
        return null;
    }

    /**
     * @en
     * select the probe with the nearest distance.
     * @zh
     * 选择距离最近的probe。
     * @param model select the probe for this model
     */
    private _getNearestProbe (model: Model): ReflectionProbe | null {
        if (!model.node || !model.worldBounds || this._probes.length === 0) return null;

        let nearestProbe: ReflectionProbe | null = null;
        let minDistance = Infinity;

        for (const probe of this._probes) {
            if (probe.probeType !== ProbeType.CUBE || !probe.validate() || !geometry.intersect.aabbWithAABB(model.worldBounds, probe.boundingBox!)) {
                continue;
            }

            const distance = Vec3.distance(model.node.worldPosition, probe.node.worldPosition);
            if (distance < minDistance) {
                minDistance = distance;
                nearestProbe = probe;
            }
        }

        return nearestProbe;
    }

    private _getBlendProbe (model: Model): ReflectionProbe | null {
        if (this._probes.length === 0) return null;
        if (!model.node || !model.worldBounds) return null;
        const temp: ReflectionProbe[] = [];
        for (let i = 0; i < this._probes.length; i++) {
            if (this._probes[i].probeType !== ProbeType.CUBE || !this._probes[i].validate() || !geometry.intersect.aabbWithAABB(model.worldBounds, this._probes[i].boundingBox!)) {
                continue;
            }
            temp.push(this._probes[i]);
        }
        temp.sort((a: ReflectionProbe, b: ReflectionProbe) => {
            const aDistance = Vec3.distance(model.node.worldPosition, a.node.worldPosition);
            const bDistance = Vec3.distance(model.node.worldPosition, b.node.worldPosition);
            return bDistance - aDistance;
        });
        return temp.length > 1 ? temp[1] : null;
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
                this.updateUseCubeModels(key);
            }
        }
        for (const key of this._usePlanarModels.keys()) {
            const p = this._usePlanarModels.get(key);
            if (p !== undefined && p === probe) {
                this._usePlanarModels.delete(key);
                this.updateUsePlanarModels(key);
            }
        }
    }

    private _updateCubemapOfModel (model: Model, probe: ReflectionProbe | null) {
        if (!model.node) {
            return;
        }
        const meshRender = model.node.getComponent(MeshRenderer);
        if (meshRender) {
            meshRender.updateProbeCubemap(probe ? probe.cubemap : null);
            meshRender.updateReflectionProbeId(probe ? probe.getProbeId() : -1);
            if (probe) {
                meshRender.updateReflectionProbeDataMap(this._dataTexture);
            }
        }
    }
    private _updatePlanarMapOfModel (model: Model, texture: Texture | null, probe: ReflectionProbe | null) {
        const meshRender = model.node.getComponent(MeshRenderer);
        if (meshRender) {
            meshRender.updateProbePlanarMap(texture);
            meshRender.updateReflectionProbeId(probe ? probe.getProbeId() : -1);
            if (probe) {
                meshRender.updateReflectionProbeDataMap(this._dataTexture);
            }
        }
    }
}

ReflectionProbeManager.probeManager = new ReflectionProbeManager();
cclegacy.internal.reflectionProbeManager = ReflectionProbeManager.probeManager;
