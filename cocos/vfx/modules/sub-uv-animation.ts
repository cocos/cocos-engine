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

import { ccclass, tooltip, type, serializable, range, visible } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { lerp, repeat, Enum, assertIsTrue, CCFloat, CCInteger } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { createRealCurve, FloatExpression } from '../expressions/float';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { RandomStream } from '../random-stream';

const TEXTURE_ANIMATION_RAND_OFFSET = 90794;

export enum TimeMode {
    LIFETIME,
    FPS,
}

/**
 * 贴图动画的播放方式。
 * @enum textureAnimationModule.Animation
 */
export enum Animation {
    /**
     * 播放贴图中的所有帧。
     */
    WHOLE_SHEET,

    /**
     * 播放贴图中的其中一行动画。
     */
    SINGLE_ROW
}

@ccclass('cc.SubUVAnimationModule')
@VFXModule.register('SubUVAnimation', ModuleExecStageFlags.UPDATE, [], [ParameterName.VELOCITY, ParameterName.NORMALIZED_AGE])
export class SubUVAnimationModule extends VFXModule {
    /**
     * @zh X 方向动画帧数。
     */
    @type(CCInteger)
    @range([0, Number.MAX_SAFE_INTEGER])
    @tooltip('i18n:textureAnimationModule.numTilesX')
    get numTilesX () {
        return this._numTilesX;
    }

    set numTilesX (val) {
        this._numTilesX = val;
        if (this.animation === Animation.WHOLE_SHEET) {
            this.frameOverTime.constant = this._numTilesX * this._numTilesY;
        } else {
            this.frameOverTime.constant = this._numTilesX;
        }
    }

    /**
     * @zh Y 方向动画帧数。
     */
    @type(CCInteger)
    @range([0, Number.MAX_SAFE_INTEGER])
    @tooltip('i18n:textureAnimationModule.numTilesY')
    get numTilesY () {
        return this._numTilesY;
    }

    set numTilesY (val) {
        this._numTilesY = val;
        if (this.animation === Animation.WHOLE_SHEET) {
            this.frameOverTime.constant = this._numTilesX * this._numTilesY;
        }
    }

    /**
     * @zh 动画播放方式 [[Animation]]。
     */
    @type(Enum(Animation))
    @tooltip('i18n:textureAnimationModule.animation')
    public get animation () {
        return this._animation;
    }

    public set animation (val) {
        this._animation = val;
        if (this._animation === Animation.WHOLE_SHEET) {
            this.frameOverTime.constant = this._numTilesX * this._numTilesY;
        } else {
            this.frameOverTime.constant = this._numTilesX;
        }
    }

    /**
     * @zh 随机从动画贴图中选择一行以生成动画。<br>
     * 此选项仅在动画播放方式为 SINGLE_ROW 时生效。
     */
    @serializable
    @tooltip('i18n:textureAnimationModule.randomRow')
    @visible(function (this: SubUVAnimationModule) { return this.animation === Animation.SINGLE_ROW; })
    public randomRow = false;

    /**
     * @zh 从动画贴图中选择特定行以生成动画。<br>
     * 此选项仅在动画播放方式为 SINGLE_ROW 时且禁用 randomRow 时可用。
     */
    @serializable
    @tooltip('i18n:textureAnimationModule.rowIndex')
    @visible(function (this: SubUVAnimationModule) { return this.animation === Animation.SINGLE_ROW && this.randomRow === false; })
    public rowIndex = 0;

    @type(Enum(TimeMode))
    @visible(true)
    public get timeMode () {
        return this._timeMode;
    }

    public set timeMode (val) {
        this._timeMode = val;
    }

    @type(CCFloat)
    @range([0.0001, Number.MAX_VALUE])
    @visible(function (this: SubUVAnimationModule) { return this._timeMode === TimeMode.FPS; })
    public get framesPerSecond () {
        return this._fps;
    }

    public set framesPerSecond (val) {
        this._fps = val;
    }

    /**
     * @zh 一个周期内动画播放的帧与时间变化曲线。
     */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @tooltip('i18n:textureAnimationModule.frameOverTime')
    @visible(function (this: SubUVAnimationModule) { return this._timeMode === TimeMode.LIFETIME; })
    public frameOverTime = new FloatExpression(1, createRealCurve([
        [0.0, 0.0],
        [1.0, 1.0],
    ]));

    /**
     * @zh 从第几帧开始播放，时间为整个粒子系统的生命周期。
     */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @tooltip('i18n:textureAnimationModule.startFrame')
    public startFrame = new FloatExpression();

    /**
     * @zh 一个生命周期内播放循环的次数。
     */
    @serializable
    @tooltip('i18n:textureAnimationModule.cycleCount')
    @visible(function (this: SubUVAnimationModule) { return this._timeMode === TimeMode.LIFETIME; })
    public cycleCount = 1;

    @serializable
    private _numTilesX = 1;
    @serializable
    private _numTilesY = 1;
    @serializable
    private _animation = Animation.WHOLE_SHEET;
    @serializable
    private _timeMode = TimeMode.LIFETIME;
    @serializable
    private _fps = 30;

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        if (DEBUG) {
            assertIsTrue(this.startFrame.mode === FloatExpression.Mode.CONSTANT || this.startFrame.mode === FloatExpression.Mode.TWO_CONSTANTS,
                'The mode of startFrame in texture-animation module can not be Curve and TwoCurve!');
        }
        particles.markRequiredParameters(BuiltinParticleParameterFlags.SUB_UV_INDEX);
        if (this.startFrame.mode === FloatExpression.Mode.TWO_CONSTANTS || (this.animation === Animation.SINGLE_ROW && this.randomRow)) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this._timeMode === TimeMode.LIFETIME && (this.frameOverTime.mode === FloatExpression.Mode.TWO_CONSTANTS
            || this.frameOverTime.mode === FloatExpression.Mode.TWO_CURVES)) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this._timeMode === TimeMode.LIFETIME && (this.frameOverTime.mode === FloatExpression.Mode.TWO_CURVES
            || this.frameOverTime.mode === FloatExpression.Mode.CURVE)) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
        }
        if (this._timeMode === TimeMode.FPS) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
            particles.markRequiredParameters(BuiltinParticleParameterFlags.INV_START_LIFETIME);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const subUVIndex = particles.subUVIndex.data;
        const { fromIndex, toIndex } = context;

        if (this._timeMode === TimeMode.LIFETIME) {
            const cycleCount = this.cycleCount;
            const invRange = 1 / (this.animation === Animation.WHOLE_SHEET ? (this._numTilesX * this._numTilesY) : this._numTilesX);
            // use subUVIndex to cache lerp ratio
            if (this.startFrame.mode === FloatExpression.Mode.CONSTANT) {
                const startFrame = this.startFrame.constant;
                if (this.frameOverTime.mode === FloatExpression.Mode.CONSTANT) {
                    const frame = repeat(cycleCount * (this.frameOverTime.constant + startFrame) * invRange, 1);
                    for (let i = fromIndex; i < toIndex; i++) {
                        subUVIndex[i] = frame;
                    }
                } else if (this.frameOverTime.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                    const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                    const { constantMin, constantMax } = this.frameOverTime;
                    for (let i = fromIndex; i < toIndex; i++) {
                        subUVIndex[i] = repeat(cycleCount * (lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame) * invRange, 1);
                    }
                } else if (this.frameOverTime.mode === FloatExpression.Mode.CURVE) {
                    const { spline, multiplier } = this.frameOverTime;
                    const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        subUVIndex[i] = repeat(cycleCount * (spline.evaluate(normalizedAge[i]) * multiplier + startFrame) * invRange, 1);
                    }
                } else {
                    const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                    const { splineMin, splineMax, multiplier } = this.frameOverTime;
                    const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const time = normalizedAge[i];
                        subUVIndex[i] = repeat(cycleCount * (lerp(splineMin.evaluate(time), splineMax.evaluate(time), RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) * multiplier + startFrame) * invRange, 1);
                    }
                }
            } else if (this.startFrame.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin, constantMax } = this.startFrame;
                const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                if (this.frameOverTime.mode === FloatExpression.Mode.CONSTANT) {
                    const frame = this.frameOverTime.constant;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const startFrame = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                        subUVIndex[i] = repeat(cycleCount * (frame + startFrame) * invRange, 1);
                    }
                } else if (this.frameOverTime.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                    const { constantMin, constantMax } = this.frameOverTime;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const startFrame = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                        subUVIndex[i] = repeat(cycleCount * (lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame) * invRange, 1);
                    }
                } else if (this.frameOverTime.mode === FloatExpression.Mode.CURVE) {
                    const { spline, multiplier } = this.frameOverTime;
                    const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const startFrame = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                        subUVIndex[i] = repeat(cycleCount * (spline.evaluate(normalizedAge[i]) * multiplier + startFrame) * invRange, 1);
                    }
                } else {
                    const { splineMin, splineMax, multiplier } = this.frameOverTime;
                    const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const startFrame = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                        const time = normalizedAge[i];
                        subUVIndex[i] = repeat(cycleCount * (lerp(splineMin.evaluate(time), splineMax.evaluate(time), RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET)) * multiplier + startFrame) * invRange, 1);
                    }
                }
            }

            if (this.animation === Animation.SINGLE_ROW) {
                const rowLength = 1 / this.numTilesY;
                if (this.randomRow) {
                    const rows = this.numTilesY;
                    const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const startRow = Math.floor(RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET) * rows);
                        const from = startRow * rowLength;
                        const to = from + rowLength;
                        subUVIndex[i] = lerp(from, to, subUVIndex[i]);
                    }
                } else {
                    const from = this.rowIndex * rowLength;
                    const to = from + rowLength;
                    for (let i = fromIndex; i < toIndex; i++) {
                        subUVIndex[i] = lerp(from, to, subUVIndex[i]);
                    }
                }
            }
        } else {
            const invRange = 1 / (this.animation === Animation.WHOLE_SHEET ? (this._numTilesX * this._numTilesY) : this._numTilesX);
            const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
            const invStartLifeTime = particles.getFloatParameter(INV_START_LIFETIME).data;
            // use subUVIndex to cache lerp ratio
            if (this.startFrame.mode === FloatExpression.Mode.CONSTANT) {
                const startFrame = this.startFrame.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    subUVIndex[i] = repeat((normalizedAge[i] / invStartLifeTime[i] * this._fps + startFrame) * invRange, 1);
                }
            } else if (this.startFrame.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                const { constantMin, constantMax } = this.startFrame;
                for (let i = fromIndex; i < toIndex; i++) {
                    const startFrame = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET));
                    subUVIndex[i] = repeat((normalizedAge[i] / invStartLifeTime[i] * this._fps + startFrame) * invRange, 1);
                }
            }

            if (this.animation === Animation.SINGLE_ROW) {
                const rowLength = 1 / this.numTilesY;
                if (this.randomRow) {
                    const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                    const rows = this.numTilesY;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const startRow = Math.floor(RandomStream.getFloat(randomSeed[i] + TEXTURE_ANIMATION_RAND_OFFSET) * rows);
                        const from = startRow * rowLength;
                        const to = from + rowLength;
                        subUVIndex[i] = lerp(from, to, subUVIndex[i]);
                    }
                } else {
                    const from = this.rowIndex * rowLength;
                    const to = from + rowLength;
                    for (let i = fromIndex; i < toIndex; i++) {
                        subUVIndex[i] = lerp(from, to, subUVIndex[i]);
                    }
                }
            }
        }
    }
}
