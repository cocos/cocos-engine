import { Component, IGFXAttribute } from '../../core';
import ParticleBatchModel from '../models/particle-batch-model';
import ParticleSystemRenderer from './particle-system-renderer-data';
import { Material } from '../../core/assets';
import { Particle, IParticleModule } from '../particle';
import { RenderMode } from '../enum';
import { legacyCC } from '../../core/global-exports';

export interface IParticleSystemRenderer {
    onInit (ps: Component): void;
    onEnable (): void;
    onDisable (): void;
    onDestroy (): void;
    clear (): void;
    attachToScene (): void;
    detachFromScene (): void;
    updateMaterialParams (): void;
    setVertexAttributes (): void;
    updateRenderMode (): void;
    onMaterialModified (index: number, material: Material): void;
    onRebuildPSO (index: number, material: Material) : void;
    getParticleCount (): number;
    getFreeParticle (): Particle | null;
    setNewParticle (p: Particle): void;
    updateParticles (dt: number): number;
    updateRenderData (): void;
    enableModule (name: string, val: Boolean, pm: IParticleModule): void;
    updateTrailMaterial (): void;
    getDefaultTrailMaterial (): any;
}

export abstract class ParticleSystemRendererBase implements IParticleSystemRenderer {
    protected _particleSystem: any = null;
    protected _model: ParticleBatchModel | null = null;
    protected _renderInfo: ParticleSystemRenderer | null = null;
    protected _vertAttrs: IGFXAttribute[] = [];

    constructor (info: ParticleSystemRenderer) {
        this._renderInfo = info;
    }

    public onInit (ps: Component) {
        this._particleSystem = ps;
    }

    public onEnable () {
        if (!this._particleSystem) {
            return;
        }
        this.attachToScene();
        this._model!.initialize(this._particleSystem.node);
        this._model!.enabled = this._particleSystem.enabledInHierarchy;
    }

    public onDisable () {
        this.detachFromScene();
    }

    public onDestroy () {
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
        }
    }

    public attachToScene () {
        if (this._model) {
            if (this._model.scene) {
                this.detachFromScene();
            }
            this._particleSystem!._getRenderScene().addModel(this._model);
        }
    }

    public detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    public setVertexAttributes () {
        if (this._model) {
            this._model.setVertexAttributes(this._renderInfo!.renderMode === RenderMode.Mesh ? this._renderInfo!.mesh : null, this._vertAttrs);
        }
    }

    protected _updateModel () {
        if (!this._model) {
            this._model = legacyCC.director.root.createModel(ParticleBatchModel);
            this._model!.setCapacity(this._particleSystem.capacity);
            this._model!.visFlags = this._particleSystem.visibility;
        }

        this._model!.setVertexAttributes(this._renderInfo!.renderMode === RenderMode.Mesh ? this._renderInfo!.mesh : null, this._vertAttrs);
    }

    public updateTrailMaterial () {}
    public getDefaultTrailMaterial () { return null; }
    public abstract getParticleCount () : number;
    public abstract getFreeParticle (): Particle | null;
    public abstract onMaterialModified (index: number, material: Material) : void;
    public abstract onRebuildPSO (index: number, material: Material) : void;
    public abstract updateRenderMode () : void;
    public abstract updateMaterialParams () : void;
    public abstract clear () : void;
    public abstract setNewParticle (p: Particle): void;
    public abstract updateParticles (dt: number): number;
    public abstract updateRenderData (): void;
    public abstract enableModule (name: string, val: Boolean, pm: IParticleModule): void;
}