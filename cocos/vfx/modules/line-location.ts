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
import { ccclass, range, rangeMin, serializable, tooltip, type, visible } from 'cc.decorator';
import { DistributionMode, MoveWarpMode, ShapeLocationModule } from './shape-location';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Enum, Vec3, lerp } from '../../core';
import { INITIAL_DIR, POSITION, ParticleDataSet, SPAWN_TIME_RATIO } from '../particle-data-set';
import { VFXEmitterState, ModuleExecContext } from '../base';
import { FloatExpression } from '../expressions/float';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const dir = new Vec3();
const pos = new Vec3();

@ccclass('cc.LineLocationModule')
@VFXModule.register('LineLocation', ModuleExecStageFlags.SPAWN, [INITIAL_DIR.name])
export class LineLocationModule extends ShapeLocationModule {
    /**
     * @zh 粒子发射器半径。
     */
    @serializable
    @tooltip('i18n:shapeModule.radius')
    @rangeMin(0.0001)
    public length = 1;

    /**
     * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
     */
    @type(Enum(DistributionMode))
    @serializable
    @tooltip('i18n:shapeModule.arcMode')
    public distributionMode = DistributionMode.RANDOM;

    @type(Enum(MoveWarpMode))
    @serializable
    @visible(function (this: LineLocationModule) {
        return this.distributionMode === DistributionMode.MOVE;
    })
    public moveWrapMode = MoveWarpMode.LOOP;

    /**
     * @zh 使用移动分布方式时的移动速度。
     */
    @type(FloatExpression)
    @range([0, 1])
    @serializable
    @tooltip('i18n:shapeModule.arcSpeed')
    @visible(function (this: LineLocationModule) {
        return this.distributionMode === DistributionMode.MOVE;
    })
    public moveSpeed = 0;

    /**
      * @zh 控制可能产生粒子的弧周围的离散间隔。
      */
    @serializable
    @tooltip('i18n:shapeModule.arcSpread')
    public spread = 0;

    private _invLength = 0;
    private _lengthTimer = 0;
    private _lengthTimePrev = 0;
    private _spreadStep = 0;
    private _lengthRounded = 0;
    private _halfLength = 0;

    public onPlay (states: VFXEmitterState) {
        super.onPlay(states);
        this._lengthTimer = 0;
        this._lengthTimePrev = 0;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        if (this.distributionMode === DistributionMode.MOVE) {
            particles.markRequiredParameter(SPAWN_TIME_RATIO);
        }
        this._lengthTimePrev = this._lengthTimer;
        let deltaTime = emitter.deltaTime;
        if (emitter.normalizedLoopAge < emitter.normalizedPrevLoopAge) {
            this._lengthTimer += (this.moveSpeed * (emitter.currentDuration - emitter.prevLoopAge));
            deltaTime = emitter.loopAge;
        }
        this._lengthTimer += this.moveSpeed * deltaTime;
        this._invLength = 1 / this.length;
        this._spreadStep = this.spread * this._invLength;
        this._lengthRounded = Math.ceil(this.length / this._spreadStep) * this._spreadStep;
        this._halfLength = this.length * 0.5;
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const initialDir = particles.getVec3Parameter(INITIAL_DIR);
        const position = particles.getVec3Parameter(POSITION);
        const rand = this.randomStream;
        const spreadStep = this._spreadStep;
        const lengthTimer = this._lengthTimer;
        const lengthTimerPrev = this._lengthTimePrev;
        const length = this.length;
        const invLength = this._invLength;
        const lengthRounded = this._lengthRounded;
        const halfLength = this._halfLength;
        if (this.distributionMode === DistributionMode.RANDOM) {
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const len = length * rand.getFloat();
                    Vec3.set(pos, len - halfLength, 0, 0);
                    Vec3.set(dir, 0, 1, 0);
                    this.storePositionAndDirection(i, dir, pos, initialDir, position);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const len = Math.floor((lengthRounded * rand.getFloat()) / spreadStep) * spreadStep;
                    Vec3.set(pos, len - halfLength, 0, 0);
                    Vec3.set(dir, 0, 1, 0);
                    this.storePositionAndDirection(i, dir, pos, initialDir, position);
                }
            }
        } else if (this.distributionMode === DistributionMode.MOVE) {
            if (this.moveWrapMode === MoveWarpMode.LOOP) {
                const spawnTimeRatio = particles.getFloatParameter(SPAWN_TIME_RATIO).data;
                if (this.spread > 0) {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let len = lerp(lengthTimer, lengthTimerPrev, spawnTimeRatio[i]);
                        len = Math.floor(len / spreadStep) * spreadStep;
                        len %= length;
                        if (len < 0) {
                            len += length;
                        }
                        Vec3.set(pos, len - halfLength, 0, 0);
                        Vec3.set(dir, 0, 1, 0);
                        this.storePositionAndDirection(i, dir, pos, initialDir, position);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let len = lerp(lengthTimer, lengthTimerPrev, spawnTimeRatio[i]);
                        len %= length;
                        if (len < 0) {
                            len += length;
                        }
                        Vec3.set(pos, len - halfLength, 0, 0);
                        Vec3.set(dir, 0, 1, 0);
                        this.storePositionAndDirection(i, dir, pos, initialDir, position);
                    }
                }
            } else {
                const spawnTimeRatio = particles.getFloatParameter(SPAWN_TIME_RATIO).data;
                if (this.spread > 0) {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let len = lerp(lengthTimer, lengthTimerPrev, spawnTimeRatio[i]);
                        len = Math.floor(len / spreadStep) * spreadStep;
                        len *= invLength;
                        len %= 2;
                        len = Math.abs(len);
                        if (len >= 1.0) {
                            len = 2 - len;
                        }
                        len *= length;
                        Vec3.set(pos, len - halfLength, 0, 0);
                        Vec3.set(dir, 0, 1, 0);
                        this.storePositionAndDirection(i, dir, pos, initialDir, position);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let len = lerp(lengthTimer, lengthTimerPrev, spawnTimeRatio[i]);
                        len *= invLength;
                        len %= 2;
                        len = Math.abs(len);
                        if (len >= 1.0) {
                            len = 2 - len;
                        }
                        len *= length;
                        Vec3.set(pos, len - halfLength, 0, 0);
                        Vec3.set(dir, 0, 1, 0);
                        this.storePositionAndDirection(i, dir, pos, initialDir, position);
                    }
                }
            }
        } else {
            const invTotal = 1 / (toIndex - fromIndex);
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let len = i * invTotal * length;
                    len = Math.floor(len / spreadStep) * spreadStep;
                    Vec3.set(pos, len - halfLength, 0, 0);
                    Vec3.set(dir, 0, 1, 0);
                    this.storePositionAndDirection(i, dir, pos, initialDir, position);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const len = i * invTotal * length;
                    Vec3.set(pos, len - halfLength, 0, 0);
                    Vec3.set(dir, 0, 1, 0);
                    this.storePositionAndDirection(i, dir, pos, initialDir, position);
                }
            }
        }
    }
}
