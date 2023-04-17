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

import { Component } from '../../scene-graph';
import { Attribute, deviceManager, Feature } from '../../gfx';
import ParticleBatchModel from '../models/particle-batch-model';
import ParticleSystemRenderer from './particle-system-renderer-data';
import { Material } from '../../asset/assets';
import { Particle, IParticleModule } from '../particle';
import { RenderMode } from '../enum';
import { cclegacy } from '../../core';
import { Pass } from '../../render-scene';

export abstract class ParticleSystemRendererBase {
    protected _particleSystem: any = null;
    /**
     * @engineInternal
     */
    public get model () {
        return this._model;
    }
    protected _model: ParticleBatchModel | null = null;
    protected _renderInfo: ParticleSystemRenderer | null = null;
    protected _vertAttrs: Attribute[] = [];
    protected _useInstance: boolean;

    constructor (info: ParticleSystemRenderer) {
        this._renderInfo = info;
        if (!deviceManager.gfxDevice.hasFeature(Feature.INSTANCED_ARRAYS)) {
            this._useInstance = false;
        } else {
            this._useInstance = true;
        }
    }

    public getUseInstance (): boolean {
        return this._useInstance;
    }

    public getInfo () {
        return this._renderInfo!;
    }

    public onInit (ps: Component) {
        this._particleSystem = ps;
    }

    public onEnable () {
        if (!this._particleSystem) {
            return;
        }
        this.attachToScene();
        const model = this._model;
        if (model) {
            model.node = model.transform = this._particleSystem.node;
        }
    }

    public onDisable () {
        this.detachFromScene();
    }

    public onDestroy () {
        if (this._model) {
            cclegacy.director.root.destroyModel(this._model);
            this._model = null;
        }
    }

    public attachToScene () {
        if (this._model) {
            if (this._model.scene) {
                this.detachFromScene();
            }
            this._particleSystem._getRenderScene().addModel(this._model);
        }
    }

    public detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    public setVertexAttributes () {
        if (this._model) {
            this.updateVertexAttrib();
            this._model.setVertexAttributes(this._renderInfo!.renderMode === RenderMode.Mesh ? this._renderInfo!.mesh : null, this._vertAttrs);
        }
    }

    public clear () {
        if (this._model) this._model.enabled = false;
    }

    public getModel () {
        return this._model;
    }

    protected _initModel () {
        if (!this._model) {
            this._model = cclegacy.director.root.createModel(ParticleBatchModel);
            this._model!.setCapacity(this._particleSystem.capacity);
            this._model!.visFlags = this._particleSystem.visibility;
        }
    }

    public updateTrailMaterial () {}
    public getDefaultTrailMaterial () { return null; }
    public abstract getParticleCount () : number;
    public abstract getFreeParticle (): Particle | null;
    public abstract onMaterialModified (index: number, material: Material) : void;
    public abstract onRebuildPSO (index: number, material: Material) : void;
    public abstract updateVertexAttrib (): void;
    public abstract updateRenderMode () : void;
    public abstract updateMaterialParams () : void;
    public abstract setNewParticle (p: Particle): void;
    public abstract getDefaultMaterial(): Material | null;
    public abstract updateRotation (pass: Pass | null): void;
    public abstract updateScale (pass: Pass | null): void;
    public abstract updateParticles (dt: number): number;
    public abstract updateRenderData (): void;
    public abstract enableModule (name: string, val: boolean, pm: IParticleModule): void;
    public abstract beforeRender (): void;
    public abstract setUseInstance (value: boolean): void;
    public abstract getNoisePreview (out: number[], width: number, height: number): void;
}
