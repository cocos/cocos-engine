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

import { ParticleEmitterContext, ParticleEmitterParams, ParticleUpdateContext } from './particle-update-context';
import { ParticleSOAData } from './particle-soa-data';
import { ccclass, displayName, serializable, type } from '../core/data/decorators';
import { CCBoolean, CCString, Mat4 } from '../core';

export enum ModuleExecStage {
    NONE,
    EMITTER_UPDATE = 1,
    SPAWN = 1 << 1,
    UPDATE = 1 << 2,
    EVENT_HANDLER = 1 << 3,
    RENDER = 1 << 4,
    SIMULATION = 1 << 5,
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

    private static _sortParticleModule (moduleA: ParticleModule, moduleB: ParticleModule) {
        return (moduleA.execPriority - moduleB.execPriority)
            || moduleA.name.localeCompare(moduleB.name);
    }

    constructor (stage: ModuleExecStage = ModuleExecStage.NONE) {
        this._execStage = stage;
    }

    /**
     * @zh 添加粒子模块
     */
    public addModule<T extends ParticleModule> (ModuleType: Constructor<T>): T {
        if ((ModuleType as unknown as typeof ParticleModule).execStages & this._execStage) {
            const newModule = new ModuleType();
            this._modules.push(newModule);
            this._modules.sort(ParticleModuleStage._sortParticleModule);
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

    public preTick (params: ParticleEmitterParams, currentTime: number, dt: number) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            if (module.enable) {
                module.preTick(params, currentTime, dt);
            }
        }
    }

    public emitterUpdate (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleEmitterContext,
        prevTime: number, currentTime: number) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            if (module.enable) {
                module.emitterUpdate(particles, params, context, prevTime, currentTime);
            }
        }
    }

    public spawn (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleEmitterContext,
        fromIndex: number, toIndex: number, currentTime: number) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            if (module.enable) {
                module.spawn(particles, params, context, fromIndex, toIndex, currentTime);
            }
        }
    }

    public update (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext, dt: number) {
        for (let i = 0, length = this._modules.length; i < length; i++) {
            const module = this._modules[i];
            if (module.enable) {
                module.update(particles, params, context, 0, particles.count, dt);
            }
        }
    }

    public handleEvent (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext) {

    }

    public render (particles: ParticleSOAData, params: ParticleEmitterParams, dt: number) {

    }

    public postTick (params: ParticleEmitterParams, currentTime: number, dt: number) {

    }
}

export function execStages (stages: ModuleExecStage) {
    return function (ctor: typeof ParticleModule) {
        (ctor as unknown as typeof ParticleModule).execStages = stages;
    };
}

export function execOrder (order: number) {
    return function (ctor: typeof ParticleModule) {
        (ctor as unknown as typeof ParticleModule).execOrder = order;
    };
}

export function moduleName (name: string) {
    return function (ctor: typeof ParticleModule) {
        (ctor as unknown as typeof ParticleModule).moduleName = name;
    };
}

export function registerParticleModule (name: string, stages: ModuleExecStage, order: number) {
    return function (ctor: typeof ParticleModule) {
        (ctor as unknown as typeof ParticleModule).moduleName = name;
        (ctor as unknown as typeof ParticleModule).execStages = stages;
        (ctor as unknown as typeof ParticleModule).execOrder = order;
    };
}

@ccclass('cc.ParticleModule')
export abstract class ParticleModule {
    @type(CCBoolean)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        this._enable = val;
    }

    @serializable
    private _enable = false;

    public static execStages = ModuleExecStage.NONE;
    public static execOrder = 0;
    public static moduleName = '';

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
            serializableProps.push('_enable');
            return serializableProps;
        }
    }

    public preTick (params: ParticleEmitterParams, currentTime: number, dt: number) {}
    public emitterUpdate (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleEmitterContext,
        prevTime: number, currentTime: number) {}
    public spawn (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleEmitterContext,
        fromIndex: number, toIndex: number, currentTime: number) {}
    public update (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {}
    public handleEvent (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext) {}
    public render (particles: ParticleSOAData, params: ParticleEmitterParams, dt: number) {}
    public postTick (params: ParticleEmitterParams, currentTime: number, dt: number) {}
}
