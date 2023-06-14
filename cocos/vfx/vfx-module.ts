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

import { DEBUG } from 'internal:constants';
import { ccclass, serializable, type } from '../core/data/decorators';
import { assertIsTrue, CCBoolean, CCString } from '../core';
import { VFXEmitter, VFXEmitterState } from './vfx-emitter';
import { VFXParameterMap } from './vfx-parameter-map';

export enum VFXExecutionStage {
    UNKNOWN = -1,
    EMITTER,
    SPAWN,
    UPDATE,
    EVENT_HANDLER,
}

export enum VFXExecutionStageFlags {
    NONE = 0,
    EMITTER = 1 << VFXExecutionStage.EMITTER,
    SPAWN = 1 << VFXExecutionStage.SPAWN,
    UPDATE = 1 << VFXExecutionStage.UPDATE,
    EVENT_HANDLER = 1 << VFXExecutionStage.EVENT_HANDLER,
}

@ccclass('cc.VFXModule')
export abstract class VFXModule {
    public static register (name: string, stages: VFXExecutionStageFlags, provide: string[] = [], consume: string[] = []) {
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

    public static getModuleIdentitiesWithSpecificStage (stage: VFXExecutionStage, out: VFXModuleIdentity[]) {
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
        this.requireRecompile();
    }

    @type(CCString)
    public get name () {
        return VFXModule.getModuleIdentityByClass(this.constructor as Constructor<VFXModule>)?.name;
    }

    public get usage () {
        return this._owner ? this._owner.usage : VFXExecutionStage.UNKNOWN;
    }

    @serializable
    private _enabled = true;
    private _owner: VFXStage | null = null;

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
    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        if (DEBUG) {
            assertIsTrue(this._owner);
        }
        this._owner = owner;
    }

    public requireRecompile () {
        if (this._owner) {
            this._owner.requireRecompile();
        }
    }

    /**
     * @engineInternal
     * @internal
     */
    public abstract execute (parameterMap: VFXParameterMap);
    /**
     * @engineInternal
     * @internal
     */
    public onPlay (state: VFXEmitterState) {
    }
    /**
     * @engineInternal
     * @internal
     */
    public onStop (state: VFXEmitterState) {}
}

@ccclass('cc.VFXStage')
export class VFXStage {
    @type([VFXModule])
    public get modules (): ReadonlyArray<VFXModule> {
        return this._modules;
    }

    public get usage () {
        return this._usage;
    }

    @serializable
    private _modules: VFXModule[] = [];
    @serializable
    private _usage = VFXExecutionStage.UNKNOWN;
    private _owner: VFXEmitter | null = null;

    constructor (stage: VFXExecutionStage = VFXExecutionStage.UNKNOWN) {
        this._usage = stage;
    }

    /**
     * @zh 添加粒子模块
     */
    public addModule<T extends VFXModule> (ModuleType: Constructor<T>): T {
        const id = VFXModule.getModuleIdentityByClass(ModuleType);
        assertIsTrue(id, 'Particle Module should be registered!');
        if (id.execStages & 1 << this._usage) {
            const newModule = new ModuleType();
            const index = VFXModule.findAProperPositionToInsert(this._modules, newModule, 0, this._modules.length);
            this._modules.splice(index, 0, newModule);
            this.requireRecompile();
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
            this.requireRecompile();
        }
    }

    public getOrAddModule<T extends VFXModule> (moduleType: Constructor<T>): T {
        let module = this.getModule(moduleType);
        if (!module) {
            module = this.addModule(moduleType);
        }
        return module;
    }

    public requireRecompile () {
        if (this._owner) {
            this._owner.requireRecompile();
        }
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
    public compile (parameterMap: VFXParameterMap, owner: VFXEmitter) {
        if (DEBUG) {
            assertIsTrue(this._owner);
        }
        this._owner = owner;
        const modules = this._modules;
        for (let i = 0, length = modules.length; i < length; i++) {
            const module = modules[i];
            if (module.enabled) {
                module.compile(parameterMap, this);
            }
        }
    }

    /**
     * @engineInternal
     * @internal
     */
    public execute (parameterMap: VFXParameterMap) {
        const modules = this._modules;
        for (let i = 0, length = modules.length; i < length; i++) {
            const module = modules[i];
            if (module.enabled) {
                module.execute(parameterMap);
            }
        }
    }
}

class VFXModuleIdentity {
    public readonly ctor: Constructor<VFXModule> | null = null;
    public readonly name: string = '';
    public readonly execStages = VFXExecutionStageFlags.NONE;
    public readonly provideParams: string[];
    public readonly consumeParams: string[];

    constructor (ctor: Constructor<VFXModule>, name: string, execStages: VFXExecutionStageFlags, provideParams: string[] = [], consumeParams: string[] = []) {
        this.ctor = ctor;
        this.name = name;
        this.execStages = execStages;
        this.provideParams = provideParams;
        this.consumeParams = consumeParams;
    }
}
