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

import { ccclass, displayOrder, serializable, tooltip, type, range } from '../../core/data/decorators';
import Burst from '../burst';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';
import { Vec3 } from '../../core';

@ccclass('cc.EmissionModule')
export class EmissionModule extends ParticleModule {
    /**
     * @zh 每秒发射的粒子数。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(14)
    @tooltip('i18n:particle_system.rateOverTime')
    public rateOverTime = new CurveRange();

    /**
     * @zh 每移动单位距离发射的粒子数。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(15)
    @tooltip('i18n:particle_system.rateOverDistance')
    public rateOverDistance = new CurveRange();

    /**
     * @zh 设定在指定时间发射指定数量的粒子的 burst 的数量。
     */
    @type([Burst])
    @serializable
    @displayOrder(16)
    @tooltip('i18n:particle_system.bursts')
    public bursts: Burst[] = [];

    public get name (): string {
        return 'EmissionModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.EMITTER_UPDATE;
    }

    private _emitRateTimeCounter: number;
    private _emitRateDistanceCounter: number;

    constructor () {
        super();
        this.rateOverTime.constant = 10;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        // emit by rateOverTime
        this._emitRateTimeCounter += this.rateOverTime.evaluate(particleUpdateContext.normalizedTimeInCycle, 1)! * particleUpdateContext.emitterDeltaTime;
        const emitNum = Math.floor(this._emitRateTimeCounter);
        this._emitRateTimeCounter -= emitNum;
        particleUpdateContext.newEmittingCount += emitNum;

        // emit by rateOverDistance
        const distance = Vec3.distance(particleUpdateContext.currentPosition, particleUpdateContext.lastPosition);

        this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(particleUpdateContext.normalizedTimeInCycle, 1)!;
        const distanceEmitNum = Math.floor(this._emitRateDistanceCounter);
        this._emitRateDistanceCounter -= distanceEmitNum;
        particleUpdateContext.newEmittingCount += distanceEmitNum;

        const preTime = particleUpdateContext.emitterAccumulatedTime - particleUpdateContext.emitterDeltaTime;
        const time = particleUpdateContext.emitterAccumulatedTime;
        for (let i = 0; i < this.bursts.length; i++) {
            const burst = this.bursts[i];
            if ((preTime < burst.time && time > burst.time) || (preTime > burst.time && burst.repeatCount > 1)) {
                const preEmitTime = Math.floor((preTime - burst.time) / burst.repeatInterval);
                if (preEmitTime < burst.repeatCount) {
                    const currentEmitTime = Math.min(Math.floor((time - burst.time) / burst.repeatInterval), burst.repeatCount);
                    const toEmitTime = currentEmitTime - preEmitTime;
                    for (let j = 0; j < toEmitTime; j++) {
                        particleUpdateContext.newEmittingCount += burst.count.evaluate(particleUpdateContext.normalizedTimeInCycle, 1);
                    }
                }
            }
        }
    }

    public onStop (): void {
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
    }
}
