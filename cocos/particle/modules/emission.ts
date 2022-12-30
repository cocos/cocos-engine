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
import { ParticleModule } from '../particle';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';

@ccclass('cc.EmissionModule')
export class EmissionModule extends ParticleModule {
    public get name (): string {
        return 'emissionModule';
    }

    public get enable (): boolean {
        return this._enabled;
    }

    public set enable (val: boolean) {
        this._enabled = val;
    }

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

    @serializable
    private _enabled = true;
    private _emitRateTimeCounter: number;
    private _emitRateDistanceCounter: number;

    constructor () {
        super();
        this.rateOverTime.constant = 10;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        // emit particles.
        const startDelay = this.startDelay.evaluate(0, 1)!;
        if (this._time > startDelay) {
            if (this._time > (this.duration + startDelay)) {
                // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
                // this._emitRateTimeCounter = 0.0;
                // this._emitRateDistanceCounter = 0.0;
                if (!this.loop) {
                    this._isEmitting = false;
                }
            }

            if (!this._isEmitting) return;

            // emit by rateOverTime
            this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1)! * dt;
            if (this._emitRateTimeCounter > 1) {
                const emitNum = Math.floor(this._emitRateTimeCounter);
                this._emitRateTimeCounter -= emitNum;
                this.emit(emitNum, dt);
            }

            // emit by rateOverDistance
            this.node.getWorldPosition(this._curWPos);
            const distance = Vec3.distance(this._curWPos, this._oldWPos);
            Vec3.copy(this._oldWPos, this._curWPos);
            this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1)!;

            if (this._emitRateDistanceCounter > 1) {
                const emitNum = Math.floor(this._emitRateDistanceCounter);
                this._emitRateDistanceCounter -= emitNum;
                this.emit(emitNum, dt);
            }

            // bursts
            for (const burst of this.bursts) {
                burst.update(this, dt);
            }
        }
    }

    public onStop (): void {
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        for (const burst of this.bursts) {
            burst.reset();
        }
    }
}
