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
import { ccclass, displayOrder, serializable, type } from 'cc.decorator';
import { DistributionMode, ShapeLocationModule } from './shape-location';
import { Enum, lerp, toDegree, toRadian, Vec3 } from '../../core';
import { ParticleDataSet, POSITION } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const pos = new Vec3();

@ccclass('cc.AngleBasedLocationModule')
export abstract class AngleBasedLocationModule extends ShapeLocationModule {
    /**
       * @zh 粒子发射器在一个扇形范围内发射。
       */
    @displayOrder(6)
    public get arc () {
        return toDegree(this._arc);
    }

    public set arc (val) {
        this._arc = toRadian(val);
    }

    /**
      * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
      */
    @type(Enum(DistributionMode))
    @serializable
    public distributionMode = DistributionMode.RANDOM;

    /**
      * @zh 控制可能产生粒子的弧周围的离散间隔。
      */
    @serializable
    public spread = 0;

    @serializable
    private _arc = toRadian(360);
    private _invArc = 0;
    private _arcRounded = 0;
    private _spreadStep = 0;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this._invArc = 1 / this._arc;
        this._spreadStep = this._arc * this.spread;
        this._arcRounded = Math.ceil(this._arc / this._spreadStep) * this._spreadStep;
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const rand = this.randomStream;
        const arcRounded = this._arcRounded;
        const spreadStep = this._spreadStep;
        const arcTimer = this._arcTimer;
        const arcTimePrev = this._arcTimePrev;
        const arc = this._arc;
        const invArc = this._invArc;
        const position = particles.getVec3Parameter(POSITION);
        if (this.distributionMode === DistributionMode.RANDOM) {
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePos(i, arc * rand.getFloat(), pos);
                    this.storePosition(i, pos, position);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePos(i, Math.floor((arcRounded * rand.getFloat()) / spreadStep) * spreadStep, pos);
                    this.storePosition(i, pos, position);
                }
            }
        } else if (this.distributionMode === DistributionMode.MOVE) {
            if (this.moveWrapMode === MoveWarpMode.LOOP) {
                const spawnTimeRatio = particles.getFloatParameter(SPAWN_TIME_RATIO).data;
                if (this.spread > 0) {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle = Math.floor(angle / spreadStep) * spreadStep;
                        angle %= arc;
                        if (angle < 0) {
                            angle += arc;
                        }
                        this.generatePos(i, angle, pos);
                        this.storePosition(i, pos, position);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle %= arc;
                        if (angle < 0) {
                            angle += arc;
                        }
                        this.generatePos(i, angle, pos);
                        this.storePosition(i, pos, position);
                    }
                }
            } else {
                const spawnTimeRatio = particles.getFloatParameter(SPAWN_TIME_RATIO).data;
                if (this.spread > 0) {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle = Math.floor(angle / spreadStep) * spreadStep;
                        angle *= invArc;
                        angle %= 2;
                        angle = Math.abs(angle);
                        if (angle >= 1.0) {
                            angle = 2 - angle;
                        }
                        this.generatePos(i, angle * arc, pos);
                        this.storePosition(i, pos, position);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle *= invArc;
                        angle %= 2;
                        angle = Math.abs(angle);
                        if (angle >= 1.0) {
                            angle = 2 - angle;
                        }
                        this.generatePos(i, angle * arc, pos);
                        this.storePosition(i, pos, position);
                    }
                }
            }
        } else {
            const invTotal = 1 / (toIndex - fromIndex);
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = i * invTotal * arc;
                    angle = Math.floor(angle / spreadStep) * spreadStep;
                    this.generatePos(i, angle, pos);
                    this.storePosition(i, pos, position);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePos(i, i * invTotal * arc, pos);
                    this.storePosition(i, pos, position);
                }
            }
        }
    }

    protected abstract generatePos (index: number, angle: number, pos: Vec3);
}
