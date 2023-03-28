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

import { ParticleExecContext, ParticleEmitterParams, BitsBucket, ParticleEmitterState } from './particle-base';
import { ParticleDataSet } from './particle-data-set';
import { ccclass, displayName, serializable, type } from '../core/data/decorators';
import { assert, CCBoolean, CCString, Mat4 } from '../core';

export enum ModuleExecStage {
    NONE,
    EMITTER_UPDATE = 1,
    SPAWN = 1 << 1,
    UPDATE = 1 << 2,
    EVENT_HANDLER = 1 << 3,
    RENDER = 1 << 4,
    SIMULATION = 1 << 5,
}

@ccclass('cc.ParticleModule')
export abstract class ParticleModule {
    public static register (name: string, stages: ModuleExecStage, preDependencies: string[] = [], postDependencies: string[] = []) {
        return function (ctor: Constructor<ParticleModule>) {
            for (let i = 0, length = ParticleModule._allRegisteredModules.length; i < length; i++) {
                if (ParticleModule._allRegisteredModules[i].ctor === ctor) {
                    throw new Error('Duplicated calling registered module!');
                }
                if (ParticleModule._allRegisteredModules[i].name === name) {
                    throw new Error('Duplicated name with other module!');
                }
            }
            const identity = new ParticleModuleIdentity(ctor, name, stages, preDependencies, postDependencies);
            ParticleModule._allRegisteredModules.push(identity);
        };
    }

    public static get allRegisteredModules (): ReadonlyArray<ParticleModuleIdentity> {
        return this._allRegisteredModules;
    }

    public static findAProperPositionToInsert (modules: ParticleModule[], module: ParticleModule) {
        const identity = ParticleModule.getModuleIdentityByClassNoCheck(module.constructor as Constructor<ParticleModule>);
        const preDependencies = identity.preDependencies;
        const postDependencies = identity.postDependencies;
        let lastIndexOfPreDependency = -1;
        for (let i = 0, l = preDependencies.length; i < l; i++) {
            for (let j = 0; j < modules.length; j++) {
                const module = modules[j];
                const currentModuleId = ParticleModule.getModuleIdentityByClassNoCheck(module.constructor as Constructor<ParticleModule>);
                if (currentModuleId.name === preDependencies[i]) {
                    if (j > lastIndexOfPreDependency) {
                        lastIndexOfPreDependency = j;
                    }
                }
            }
        }
        let firstIndexOfPostDependency = modules.length;
        for (let i = 0, l = postDependencies.length; i < l; i++) {
            for (let j = 0; j < modules.length; j++) {
                const module = modules[j];
                const currentModuleId = ParticleModule.getModuleIdentityByClassNoCheck(module.constructor as Constructor<ParticleModule>);
                if (currentModuleId.name === postDependencies[i]) {
                    if (j < firstIndexOfPostDependency) {
                        firstIndexOfPostDependency = j;
                    }
                }
            }
        }
        if (firstIndexOfPostDependency > lastIndexOfPreDependency) {
            return firstIndexOfPostDependency;
        } else {
            return lastIndexOfPreDependency + 1;
        }
    }

    public static getModuleIdentityByClassNoCheck (ctor: Constructor<ParticleModule>) {
        const identity = this.getModuleIdentityByClass(ctor);
        assert(identity, 'Module not registered!');
        return identity;
    }

    public static getModuleIdentityByClass (ctor: Constructor<ParticleModule>) {
        for (let i = 0, length = ParticleModule._allRegisteredModules.length; i < length; i++) {
            if (ParticleModule._allRegisteredModules[i].ctor === ctor) {
                return ParticleModule._allRegisteredModules[i];
            }
        }
        return null;
    }

    private static _allRegisteredModules: ParticleModuleIdentity[] = [];

    @type(CCBoolean)
    public get enabled () {
        return this._enabled;
    }

    public set enabled (val) {
        this._enabled = val;
    }

    @type(CCString)
    private get name () {
        return ParticleModule.getModuleIdentityByClass(this.constructor as Constructor<ParticleModule>)?.name;
    }

    @serializable
    private _enabled = false;

    protected needsFilterSerialization () {
        return false;
    }

    protected getSerializedProps (): string[] {
        return [];
    }

    private _onBeforeSerialize (props: string[]) {
        if (!this.needsFilterSerialization()) {
            return props;
        } else {
            const serializableProps = this.getSerializedProps();
            serializableProps.push('_enabled');
            return serializableProps;
        }
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {}
    public abstract execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext);
    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {}
    public onStop (params: ParticleEmitterParams, state: ParticleEmitterState) {}
}

@ccclass('cc.ParticleModuleStage')
export class ParticleModuleStage {
    @serializable
    private _modules: ParticleModule[] = [];
    @serializable
    private _execStage = ModuleExecStage.NONE;

    @type([ParticleModule])
    public get modules (): ReadonlyArray<ParticleModule> {
        return this._modules;
    }

    constructor (stage: ModuleExecStage = ModuleExecStage.NONE) {
        this._execStage = stage;
    }

    /**
     * @zh 添加粒子模块
     */
    public addModule<T extends ParticleModule> (ModuleType: Constructor<T>): T {
        const id = ParticleModule.getModuleIdentityByClass(ModuleType);
        assert(id, 'Particle Module should be registered!');
        if (id.execStages & this._execStage) {
            const newModule = new ModuleType();
            const index = ParticleModule.findAProperPositionToInsert(this._modules, newModule);
            this._modules.splice(index, 0, newModule);
            return newModule;
        } else {
            throw new Error('This stage does not support this module!');
        }
    }

    public getModule<T extends ParticleModule> (moduleType: Constructor<T>): T | null {
        for (let i = 0, l = this._modules.length; i < l; i++) {
            const particleModule = this._modules[i];
            if (particleModule instanceof moduleType) {
                return particleModule;
            }
        }
        return null;
    }

    public getModules<T extends ParticleModule> (moduleType: Constructor<T>, out: Array<T>): Array<T> {
        out.length = 0;
        for (let i = 0, l = this._modules.length; i < l; i++) {
            const module = this._modules[i];
            if (module instanceof moduleType) {
                out.push(module);
            }
        }
        return out;
    }

    public moveUpModule (module: ParticleModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1) {
            this._modules.splice(index, 1);
            this._modules.splice(index - 1, 0, module);
        }
    }

    public moveDownModule (module: ParticleModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1) {
            this._modules.splice(index, 1);
            this._modules.splice(index + 1, 0, module);
        }
    }

    public removeModule (module: ParticleModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1) {
            this._modules.splice(index, 1);
        }
    }

    public getOrAddModule<T extends ParticleModule> (moduleType: Constructor<T>): T {
        let module = this.getModule(moduleType);
        if (!module) {
            module = this.addModule(moduleType);
        }
        return module;
    }

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            module.onPlay(params, state);
        }
    }

    public onStop (params: ParticleEmitterParams, state: ParticleEmitterState) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            module.onStop(params, state);
        }
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.setExecutionStage(this._execStage);
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            if (module.enabled) {
                module.tick(particles, params, context);
            }
        }
        context.setExecutionStage(ModuleExecStage.NONE);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.setExecutionStage(this._execStage);
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            if (module.enabled) {
                module.execute(particles, params, context);
            }
        }
        context.setExecutionStage(ModuleExecStage.NONE);
    }
}

class ParticleModuleIdentity {
    public readonly ctor: Constructor<ParticleModule> | null = null;
    public readonly name: string = '';
    public readonly execStages = ModuleExecStage.NONE;
    public readonly preDependencies: string[];
    public readonly postDependencies: string[];

    constructor (ctor: Constructor<ParticleModule>, name: string, execStages: ModuleExecStage, preDependencies: string[] = [], postDependencies: string[] = []) {
        this.ctor = ctor;
        this.name = name;
        this.execStages = execStages;
        this.preDependencies = preDependencies;
        this.postDependencies = postDependencies;
    }
}
