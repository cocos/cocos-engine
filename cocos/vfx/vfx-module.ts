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

import { ModuleExecContext, VFXEmitterState } from './base';
import { ParticleDataSet } from './particle-data-set';
import { ccclass, serializable, type } from '../core/data/decorators';
import { assertIsTrue, CCBoolean, CCString } from '../core';
import { EmitterDataSet } from './emitter-data-set';
import { UserDataSet } from './user-data-set';
import { RandomStream } from './random-stream';

export enum ModuleExecStage {
    UNKNOWN = -1,
    EMITTER,
    SPAWN,
    UPDATE,
    EVENT_HANDLER,
}

export enum ModuleExecStageFlags {
    NONE = 0,
    EMITTER = 1 << ModuleExecStage.EMITTER,
    SPAWN = 1 << ModuleExecStage.SPAWN,
    UPDATE = 1 << ModuleExecStage.UPDATE,
    EVENT_HANDLER = 1 << ModuleExecStage.EVENT_HANDLER,
}

@ccclass('cc.VFXModule')
export abstract class VFXModule {
    public static register (name: string, stages: ModuleExecStageFlags, provide: string[] = [], consume: string[] = []) {
        return function (ctor: Constructor<VFXModule>) {
            for (let i = 0, length = VFXModule._allRegisteredModules.length; i < length; i++) {
                if (VFXModule._allRegisteredModules[i].ctor === ctor) {
                    throw new Error(`Duplicated calling registered module for module ${name}!`);
                }
                if (VFXModule._allRegisteredModules[i].name === name) {
                    throw new Error(`Duplicated name ${name} with other module!`);
                }
            }
            const identity = new VFXModuleIdentity(ctor, name, stages, provide, consume);
            VFXModule._allRegisteredModules.push(identity);
        };
    }

    public static get allRegisteredModules (): ReadonlyArray<VFXModuleIdentity> {
        return this._allRegisteredModules;
    }

    public static findAProperPositionToInsert (modules: VFXModule[], module: VFXModule, fromIndex: number, toIndex: number): number {
        if (fromIndex === toIndex) {
            return fromIndex;
        }
        const identity = VFXModule.getModuleIdentityByClassUnsafe(module.constructor as Constructor<VFXModule>);
        const provideParams = identity.provideParams;
        const consumeParams = identity.consumeParams;
        let lastIndexOfPreDependency = -1;
        for (let i = 0, l = consumeParams.length; i < l; i++) {
            for (let j = fromIndex; j < toIndex; j++) {
                const module = modules[j];
                const currentModuleId = VFXModule.getModuleIdentityByClassUnsafe(module.constructor as Constructor<VFXModule>);
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
                const currentModuleId = VFXModule.getModuleIdentityByClassUnsafe(module.constructor as Constructor<VFXModule>);
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
            return VFXModule.findAProperPositionToInsert(modules, module, lastIndexOfPreDependency + 1, toIndex);
        }
    }

    public static getModuleIdentityByClassUnsafe (ctor: Constructor<VFXModule>) {
        const identity = this.getModuleIdentityByClass(ctor);
        assertIsTrue(identity, 'Module not registered!');
        return identity;
    }

    public static getModuleIdentityByClass (ctor: Constructor<VFXModule>) {
        for (let i = 0, length = VFXModule._allRegisteredModules.length; i < length; i++) {
            if (VFXModule._allRegisteredModules[i].ctor === ctor) {
                return VFXModule._allRegisteredModules[i];
            }
        }
        return null;
    }

    public static getModuleIdentityByName (name: string) {
        for (let i = 0, length = VFXModule._allRegisteredModules.length; i < length; i++) {
            if (VFXModule._allRegisteredModules[i].name === name) {
                return VFXModule._allRegisteredModules[i];
            }
        }
        return null;
    }

    public static getModuleIdentitiesWithSpecificStage (stage: ModuleExecStage, out: VFXModuleIdentity[]) {
        for (let i = 0, length = VFXModule._allRegisteredModules.length; i < length; i++) {
            const identity = VFXModule._allRegisteredModules[i];
            if (identity.execStages & 1 << stage) {
                out.push(identity);
            }
        }
        return out;
    }

    public static clearRegisteredModules () {
        this._allRegisteredModules.length = 0;
    }

    private static _allRegisteredModules: VFXModuleIdentity[] = [];

    @type(CCBoolean)
    public get enabled () {
        return this._enabled;
    }

    public set enabled (val) {
        this._enabled = val;
    }

    @type(CCString)
    private get name () {
        return VFXModule.getModuleIdentityByClass(this.constructor as Constructor<VFXModule>)?.name;
    }

    public get randomSeed () {
        return this._randomSeed;
    }

    public get randomStream () {
        return this._randomStream;
    }

    @serializable
    private _enabled = true;
    private _randomSeed = 0;
    private _randomStream = new RandomStream(0);

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

    /**
     * @engineInternal
     * @internal
     */
    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {}
    /**
     * @engineInternal
     * @internal
     */
    public abstract execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext);
    /**
     * @engineInternal
     * @internal
     */
    public onPlay (state: VFXEmitterState) {
        this._randomSeed = Math.imul(state.randomStream.getUInt32(), state.randomStream.getUInt32());
        this._randomStream.seed = this._randomSeed;
    }
    /**
     * @engineInternal
     * @internal
     */
    public onStop (state: VFXEmitterState) {}
}

@ccclass('cc.VFXModuleStage')
export class VFXModuleStage {
    @type([VFXModule])
    public get modules (): ReadonlyArray<VFXModule> {
        return this._modules;
    }

    public get execStage () {
        return this._execStage;
    }

    @serializable
    private _modules: VFXModule[] = [];
    @serializable
    private _execStage = ModuleExecStage.UNKNOWN;

    constructor (stage: ModuleExecStage = ModuleExecStage.UNKNOWN) {
        this._execStage = stage;
    }

    /**
     * @zh 添加粒子模块
     */
    public addModule<T extends VFXModule> (ModuleType: Constructor<T>): T {
        const id = VFXModule.getModuleIdentityByClass(ModuleType);
        assertIsTrue(id, 'Particle Module should be registered!');
        if (id.execStages & 1 << this._execStage) {
            const newModule = new ModuleType();
            const index = VFXModule.findAProperPositionToInsert(this._modules, newModule, 0, this._modules.length);
            this._modules.splice(index, 0, newModule);
            return newModule;
        } else {
            throw new Error('This stage does not support this module!');
        }
    }

    public getModule<T extends VFXModule> (moduleType: Constructor<T> | AbstractedConstructor<T>): T | null {
        for (let i = 0, l = this._modules.length; i < l; i++) {
            const particleModule = this._modules[i];
            if (particleModule instanceof moduleType) {
                return particleModule;
            }
        }
        return null;
    }

    public getModules<T extends VFXModule> (moduleType: Constructor<T> | AbstractedConstructor<T>, out: Array<any>): Array<T> {
        out.length = 0;
        for (let i = 0, l = this._modules.length; i < l; i++) {
            const module = this._modules[i];
            if (module instanceof moduleType) {
                out.push(module);
            }
        }
        return out as Array<T>;
    }

    public moveUpModule (module: VFXModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1 && index !== 0) {
            this._modules.splice(index, 1);
            this._modules.splice(index - 1, 0, module);
        }
    }

    public moveDownModule (module: VFXModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1 && index !== this._modules.length - 1) {
            this._modules.splice(index, 1);
            this._modules.splice(index + 1, 0, module);
        }
    }

    public removeModule (module: VFXModule) {
        const index = this._modules.indexOf(module);
        if (index !== -1) {
            this._modules.splice(index, 1);
        }
    }

    public getOrAddModule<T extends VFXModule> (moduleType: Constructor<T>): T {
        let module = this.getModule(moduleType);
        if (!module) {
            module = this.addModule(moduleType);
        }
        return module;
    }

    /**
     * @engineInternal
     * @internal
     */
    public onPlay (state: VFXEmitterState) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            module.onPlay(state);
        }
    }

    /**
     * @engineInternal
     * @internal
     */
    public onStop (state: VFXEmitterState) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            module.onStop(state);
        }
    }

    /**
     * @engineInternal
     * @internal
     */
    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        context.setExecutionStage(this._execStage);
        const modules = this._modules;
        for (let i = 0, length = modules.length; i < length; i++) {
            const module = modules[i];
            if (module.enabled) {
                context.setModuleRandomSeed(module.randomSeed);
                context.setModuleRandomStream(module.randomStream);
                module.tick(particles, emitter, user, context);
            }
        }
        context.setExecutionStage(ModuleExecStage.UNKNOWN);
    }

    /**
     * @engineInternal
     * @internal
     */
    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        context.setExecutionStage(this._execStage);
        const modules = this._modules;
        for (let i = 0, length = modules.length; i < length; i++) {
            const module = modules[i];
            if (module.enabled) {
                context.setModuleRandomSeed(module.randomSeed);
                context.setModuleRandomStream(module.randomStream);
                module.execute(particles, emitter, user, context);
            }
        }
        context.setExecutionStage(ModuleExecStage.UNKNOWN);
    }
}

class VFXModuleIdentity {
    public readonly ctor: Constructor<VFXModule> | null = null;
    public readonly name: string = '';
    public readonly execStages = ModuleExecStageFlags.NONE;
    public readonly provideParams: string[];
    public readonly consumeParams: string[];

    constructor (ctor: Constructor<VFXModule>, name: string, execStages: ModuleExecStageFlags, provideParams: string[] = [], consumeParams: string[] = []) {
        this.ctor = ctor;
        this.name = name;
        this.execStages = execStages;
        this.provideParams = provideParams;
        this.consumeParams = consumeParams;
    }
}
