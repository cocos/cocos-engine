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

import { ccclass, tooltip, displayOrder, type, formerlySerializedAs, serializable, range } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { lerp, pseudoRandom, repeat } from '../../core/math';
import { Enum } from '../../core/value-types';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { assert } from '../../core';

const TEXTURE_ANIMATION_RAND_OFFSET = 90794;

/**
 * 粒子贴图动画类型。
 * @enum textureAnimationModule.Mode
 */
const Mode = Enum({
    /**
     * 网格类型。
     */
    Grid: 0,

    /**
     * 精灵类型（暂未支持）。
     */
    // Sprites: 1,
});

/**
 * 贴图动画的播放方式。
 * @enum textureAnimationModule.Animation
 */
const Animation = Enum({
    /**
     * 播放贴图中的所有帧。
     */
    WholeSheet: 0,

    /**
     * 播放贴图中的其中一行动画。
     */
    SingleRow: 1,
});

@ccclass('cc.TextureAnimationModule')
export class TextureAnimationModule extends ParticleModule {
    /**
     * @zh 设定粒子贴图动画的类型（暂只支持 Grid 模式）[[Mode]]。
     */
    @type(Mode)
    @displayOrder(1)
    @tooltip('i18n:textureAnimationModule.mode')
    get mode () {
        return this._mode;
    }

    set mode (val) {
        if (val !== Mode.Grid) {
            console.error('particle texture animation\'s sprites is not supported!');
        }
    }

    /**
     * @zh X 方向动画帧数。
     */
    @displayOrder(2)
    @tooltip('i18n:textureAnimationModule.numTilesX')
    get numTilesX () {
        return this._numTilesX;
    }

    set numTilesX (val) {
        this._numTilesX = val;
    }

    /**
     * @zh Y 方向动画帧数。
     */
    @displayOrder(3)
    @tooltip('i18n:textureAnimationModule.numTilesY')
    get numTilesY () {
        return this._numTilesY;
    }

    set numTilesY (val) {
        this._numTilesY = val;
    }

    /**
     * @zh 动画播放方式 [[Animation]]。
     */
    @type(Animation)
    @serializable
    @displayOrder(4)
    @tooltip('i18n:textureAnimationModule.animation')
    public animation = Animation.WholeSheet;

    /**
     * @zh 一个周期内动画播放的帧与时间变化曲线。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(7)
    @tooltip('i18n:textureAnimationModule.frameOverTime')
    public frameOverTime = new CurveRange();

    /**
     * @zh 从第几帧开始播放，时间为整个粒子系统的生命周期。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(8)
    @tooltip('i18n:textureAnimationModule.startFrame')
    public startFrame = new CurveRange();

    /**
     * @zh 一个生命周期内播放循环的次数。
     */
    @serializable
    @displayOrder(9)
    @tooltip('i18n:textureAnimationModule.cycleCount')
    public cycleCount = 0;

    /**
     * @ignore
     */
    get flipU () {
        return this._flipU;
    }

    set flipU (val) {
        console.error('particle texture animation\'s flipU is not supported!');
    }

    get flipV () {
        return this._flipV;
    }

    set flipV (val) {
        console.error('particle texture animation\'s flipV is not supported!');
    }

    get uvChannelMask () {
        return this._uvChannelMask;
    }

    set uvChannelMask (val) {
        console.error('particle texture animation\'s uvChannelMask is not supported!');
    }

    /**
     * @zh 随机从动画贴图中选择一行以生成动画。<br>
     * 此选项仅在动画播放方式为 SingleRow 时生效。
     */
    @serializable
    @displayOrder(5)
    @tooltip('i18n:textureAnimationModule.randomRow')
    public randomRow = false;

    /**
     * @zh 从动画贴图中选择特定行以生成动画。<br>
     * 此选项仅在动画播放方式为 SingleRow 时且禁用 randomRow 时可用。
     */
    @serializable
    @displayOrder(6)
    @tooltip('i18n:textureAnimationModule.rowIndex')
    public rowIndex = 0;

    public get name (): string {
        return 'textureModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.POST_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    @serializable
    private _flipU = 0;
    @formerlySerializedAs('numTilesX')
    private _numTilesX = 0;
    @formerlySerializedAs('numTilesY')
    private _numTilesY = 0;
    @serializable
    private _mode = Mode.Grid;
    @serializable
    private _flipV = 0;
    @serializable
    private _uvChannelMask = -1;

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { count, randomSeed, frameIndex, normalizedAliveTime } = particles;
        if (DEBUG) {
            assert(this.startFrame.mode === CurveRange.Mode.Constant || this.startFrame.mode === CurveRange.Mode.TwoConstants,
                'The mode of startFrame in texture-animation module can not be Curve and TwoCurve!');
        }
        const cycleCount = this.cycleCount;
        // use frameIndex to cache lerp ratio
        if (this.startFrame.mode === CurveRange.Mode.Constant) {
            const startFrame = this.startFrame.constant;
            if (this.frameOverTime.mode === CurveRange.Mode.Constant) {
                const frame = repeat(cycleCount * (this.frameOverTime.constant + startFrame), 1);
                for (let i = 0; i < count; i++) {
                    frameIndex[i] = frame;
                }
            } else if (this.frameOverTime.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.frameOverTime;
                for (let i = 0; i < count; i++) {
                    frameIndex[i] = repeat(cycleCount * (lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
                }
            } else if (this.frameOverTime.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.frameOverTime;
                for (let i = 0; i < count; i++) {
                    frameIndex[i] = repeat(cycleCount * (spline.evaluate(normalizedAliveTime[i]) * multiplier + startFrame), 1);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.frameOverTime;
                for (let i = 0; i < count; i++) {
                    frameIndex[i] = repeat(cycleCount * (lerp(splineMin.evaluate(normalizedAliveTime[i]), splineMax.evaluate(normalizedAliveTime[i]), pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) * multiplier + startFrame), 1);
                }
            }
        } else if (this.startFrame.mode === CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.startFrame;
            if (this.frameOverTime.mode === CurveRange.Mode.Constant) {
                const frame = this.frameOverTime.constant;
                for (let i = 0; i < count; i++) {
                    const startFrame = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                    frameIndex[i] = repeat(cycleCount * (frame + startFrame), 1);
                }
            } else if (this.frameOverTime.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.frameOverTime;
                for (let i = 0; i < count; i++) {
                    const startFrame = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                    frameIndex[i] = repeat(cycleCount * (lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
                }
            } else if (this.frameOverTime.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.frameOverTime;
                for (let i = 0; i < count; i++) {
                    const startFrame = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                    frameIndex[i] = repeat(cycleCount * (spline.evaluate(normalizedAliveTime[i]) * multiplier + startFrame), 1);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.frameOverTime;
                for (let i = 0; i < count; i++) {
                    const startFrame = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                    frameIndex[i] = repeat(cycleCount * (lerp(splineMin.evaluate(normalizedAliveTime[i]), splineMax.evaluate(normalizedAliveTime[i]), pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) * multiplier + startFrame), 1);
                }
            }
        }

        if (this.animation === Animation.SingleRow) {
            const rowLength = 1 / this.numTilesY;
            if (this.randomRow) {
                const rows = this.numTilesY;
                for (let i = 0; i < count; i++) {
                    const startRow = Math.floor(pseudoRandom(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET) * rows);
                    const from = startRow * rowLength;
                    const to = from + rowLength;
                    frameIndex[i] = lerp(from, to, frameIndex[i]);
                }
            } else {
                const from = this.rowIndex * rowLength;
                const to = from + rowLength;
                for (let i = 0; i < count; i++) {
                    frameIndex[i] = lerp(from, to, frameIndex[i]);
                }
            }
        }
    }
}
