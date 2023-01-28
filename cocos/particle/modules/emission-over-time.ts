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
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';

@ccclass('cc.EmissionOverTimeModule')
export class EmissionOverTimeModule extends ParticleModule {
    /**
     * @zh 每秒发射的粒子数。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(14)
    @tooltip('i18n:particle_system.rateOverTime')
    public rate = new CurveRange();

    public get name (): string {
        return 'EmissionOverTimeModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.EMITTER_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    private _emitRateTimeCounter = 0;

    constructor () {
        super();
        this.rate.constant = 10;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        this._emitRateTimeCounter += this.rate.evaluate(particleUpdateContext.normalizedTimeInCycle, 1)! * particleUpdateContext.emitterDeltaTime;
        const emitNum = Math.floor(this._emitRateTimeCounter);
        this._emitRateTimeCounter -= emitNum;
        particleUpdateContext.emittingAccumulatedCount += emitNum;
    }

    public onStop (): void {
        this._emitRateTimeCounter = 0.0;
    }
}
