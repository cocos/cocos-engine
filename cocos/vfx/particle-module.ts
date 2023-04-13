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

import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from './particle-base';
import { ParticleDataSet } from './particle-data-set';
import { ccclass, serializable, type, visible } from '../core/data/decorators';
import { assert, CCBoolean, CCString, Enum } from '../core';

export enum ModuleExecStage {
    NONE,
    EMITTER_UPDATE = 1,
    SPAWN = 1 << 1,
    UPDATE = 1 << 2,
    EVENT_HANDLER = 1 << 3,
    RENDER = 1 << 4,
    ALL = EMITTER_UPDATE | SPAWN | UPDATE | EVENT_HANDLER | RENDER,
}

@ccclass('cc.ParticleModule')
export abstract class ParticleModule {
    public static register (name: string, stages: ModuleExecStage, provide: string[] = [], consume: string[] = []) {
        return function (ctor: Constructor<ParticleModule>) {
            for (let i = 0, length = ParticleModule._allRegisteredModules.length; i < length; i++) {
                if (ParticleModule._allRegisteredModules[i].ctor === ctor) {
                    throw new Error(`Duplicated calling registered module for module ${name}!`);
                }
                if (ParticleModule._allRegisteredModules[i].name === name) {
                    throw new Error(`Duplicated name ${name} with other module!`);
                }
            }
            const identity = new ParticleModuleIdentity(ctor, name, stages, provide, consume);
            ParticleModule._moduleEnum[name] = ParticleModule._allRegisteredModules.length;
            Enum.update(ParticleModule._moduleEnum);
            ParticleModule._allRegisteredModules.push(identity);
        };
    }

    public static get allRegisteredModules (): ReadonlyArray<ParticleModuleIdentity> {
        return this._allRegisteredModules;
    }

    public static findAProperPositionToInsert (modules: ParticleModule[], module: ParticleModule, fromIndex: number, toIndex: number): number {
        if (fromIndex === toIndex) {
            return fromIndex;
        }
        const identity = ParticleModule.getModuleIdentityByClassNoCheck(module.constructor as Constructor<ParticleModule>);
        const provideParams = identity.provideParams;
        const consumeParams = identity.consumeParams;
        let lastIndexOfPreDependency = -1;
        for (let i = 0, l = consumeParams.length; i < l; i++) {
            for (let j = fromIndex; j < toIndex; j++) {
                const module = modules[j];
                const currentModuleId = ParticleModule.getModuleIdentityByClassNoCheck(module.constructor as Constructor<ParticleModule>);
                const currentProduceParams = currentModuleId.provideParams;
                if (currentProduceParams.includes(consumeParams[i])) {
                    if (j > lastIndexOfPreDependency) {
                        lastIndexOfPreDependency = j;
                    }
                }
            }
        }
        let firstIndexOfPostDependency = modules.length;
        for (let i = 0, l = provideParams.length; i < l; i++) {
            for (let j = toIndex - 1; j >= fromIndex; j--) {
                const module = modules[j];
                const currentModuleId = ParticleModule.getModuleIdentityByClassNoCheck(module.constructor as Constructor<ParticleModule>);
                const currentConsumeParams = currentModuleId.consumeParams;
                if (currentConsumeParams.includes(provideParams[i])) {
                    if (j < firstIndexOfPostDependency) {
                        firstIndexOfPostDependency = j;
                    }
                }
            }
        }
        if (firstIndexOfPostDependency > lastIndexOfPreDependency) {
            return firstIndexOfPostDependency;
        } else {
            return ParticleModule.findAProperPositionToInsert(modules, module, lastIndexOfPreDependency + 1, toIndex);
        }
    }

    public static get ModuleEnum () {
        return Enum(this._moduleEnum);
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

    public static getModuleIdentityByName (name: string) {
        for (let i = 0, length = ParticleModule._allRegisteredModules.length; i < length; i++) {
            if (ParticleModule._allRegisteredModules[i].name === name) {
                return ParticleModule._allRegisteredModules[i];
            }
        }
        return null;
    }

    public static getModuleIdentitiesWithSpecificStage (stage: ModuleExecStage, out: ParticleModuleIdentity[]) {
        for (let i = 0, length = ParticleModule._allRegisteredModules.length; i < length; i++) {
            const identity = ParticleModule._allRegisteredModules[i];
            if (identity.execStages & stage) {
                out.push(identity);
            }
        }
        return out;
    }

    public static clearRegisteredModules () {
        this._allRegisteredModules.length = 0;
        for (const key in this._moduleEnum) {
            delete this._moduleEnum[key];
        }
        Enum.update(this._moduleEnum);
    }

    private static _allRegisteredModules: ParticleModuleIdentity[] = [];
    private static _moduleEnum: Record<string, number> = {};

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
    private _enabled = true;

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
    @type(ParticleModule.ModuleEnum)
    @visible(true)
    public get add () {
        return this._moduleToAdd;
    }

    public set add (val) {
        const identity = ParticleModule.allRegisteredModules[val];
        if (!identity) { return; }
        if (identity.execStages & this._execStage) {
            this.addModule(identity.ctor as Constructor<ParticleModule>);
        }
    }

    @type([ParticleModule])
    public get modules (): ReadonlyArray<ParticleModule> {
        return this._modules;
    }

    private _moduleToAdd = 0;

    @serializable
    private _modules: ParticleModule[] = [];
    @serializable
    private _execStage = ModuleExecStage.NONE;

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
            const index = ParticleModule.findAProperPositionToInsert(this._modules, newModule, 0, this._modules.length);
            this._modules.splice(index, 0, newModule);
            return newModule;
        } else {
            throw new Error('This stage does not support this module!');
        }
    }

    public getModule<T extends ParticleModule> (moduleType: Constructor<T> | AbstractedConstructor<T>): T | null {
        for (let i = 0, l = this._modules.length; i < l; i++) {
            const particleModule = this._modules[i];
            if (particleModule instanceof moduleType) {
                return particleModule;
            }
        }
        return null;
    }

    public getModules<T extends ParticleModule> (moduleType: Constructor<T> | AbstractedConstructor<T>, out: Array<any>): Array<T> {
        out.length = 0;
        for (let i = 0, l = this._modules.length; i < l; i++) {
            const module = this._modules[i];
            if (module instanceof moduleType) {
                out.push(module);
            }
        }
        return out as Array<T>;
    }

    public moveUpModule (module: ParticleModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1 && index !== 0) {
            this._modules.splice(index, 1);
            this._modules.splice(index - 1, 0, module);
        }
    }

    public moveDownModule (module: ParticleModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1 && index !== this._modules.length - 1) {
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
        const modules = this._modules;
        for (let i = 0, length = modules.length; i < length; i++) {
            const module = modules[i];
            if (module.enabled) {
                module.tick(particles, params, context);
            }
        }
        context.setExecutionStage(ModuleExecStage.NONE);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.setExecutionStage(this._execStage);
        const modules = this._modules;
        for (let i = 0, length = modules.length; i < length; i++) {
            const module = modules[i];
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
    public readonly provideParams: string[];
    public readonly consumeParams: string[];

    constructor (ctor: Constructor<ParticleModule>, name: string, execStages: ModuleExecStage, provideParams: string[] = [], consumeParams: string[] = []) {
        this.ctor = ctor;
        this.name = name;
        this.execStages = execStages;
        this.provideParams = provideParams;
        this.consumeParams = consumeParams;
    }
}
