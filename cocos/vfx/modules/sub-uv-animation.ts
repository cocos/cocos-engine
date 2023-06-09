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

import { ccclass, type, serializable, visible } from 'cc.decorator';
import { Enum, Vec2, CCBoolean } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ConstantVec2Expression, Vec2Expression, Int32Expression, ConstantInt32Expression } from '../expressions';
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatArrayParameter } from '../parameters';
import { P_VELOCITY, P_NORMALIZED_AGE, P_SUB_UV_INDEX1, C_FROM_INDEX, C_TO_INDEX, P_SUB_UV_INDEX4, P_SUB_UV_INDEX2, P_SUB_UV_INDEX3 } from '../define';

export enum SubUVAnimationMode {
    LINEAR,
    CURVE,
    RANDOM,
    INFINITE_LOOP,
    DIRECT_INDEX
}

export enum SubUVIndexChannel {
    SUB_UV_INDEX1,
    SUB_UV_INDEX2,
    SUB_UV_INDEX3,
    SUB_UV_INDEX4,
}

@ccclass('cc.SubUVAnimationModule')
@VFXModule.register('SubUVAnimation', ModuleExecStageFlags.UPDATE, [], [P_VELOCITY.name, P_NORMALIZED_AGE.name])
export class SubUVAnimationModule extends VFXModule {
    @type(Vec2Expression)
    public get subImageSize () {
        if (!this._subImageSize) {
            this._subImageSize = new ConstantVec2Expression(new Vec2(8, 8));
        }
        return this._subImageSize;
    }

    public set subImageSize (val) {
        this._subImageSize = val;
    }

    @type(CCBoolean)
    @serializable
    public useStartFrameRangeOverride = false;

    @type(Int32Expression)
    @visible(function (this: SubUVAnimationModule) { return this.useStartFrameRangeOverride; })
    public get startFrameRangeOverride () {
        if (!this._startFrameRangeOverride) {
            this._startFrameRangeOverride = new ConstantInt32Expression(0);
        }
        return this._startFrameRangeOverride;
    }

    public set startFrameRangeOverride (val) {
        this._startFrameRangeOverride = val;
    }

    @type(CCBoolean)
    @serializable
    public useEndFrameRangeOverride = false;

    @type(Int32Expression)
    @visible(function (this: SubUVAnimationModule) { return this.useEndFrameRangeOverride; })
    public get endFrameRangeOverride () {
        if (!this._endFrameRangeOverride) {
            this._endFrameRangeOverride = new ConstantInt32Expression(63);
        }
        return this._endFrameRangeOverride;
    }

    public set endFrameRangeOverride (val) {
        this._endFrameRangeOverride = val;
    }

    @type(Enum(SubUVIndexChannel))
    @serializable
    public subUVIndexChannel = SubUVIndexChannel.SUB_UV_INDEX1;

    /**
     * @zh 动画播放方式 [[SubUVAnimationMode]]。
     */
    @type(Enum(SubUVAnimationMode))
    @serializable
    public subUVAnimationMode = SubUVAnimationMode.LINEAR;

    @serializable
    private _subImageSize: Vec2Expression | null = null;
    @serializable
    private _startFrameRangeOverride: Int32Expression | null = null;
    @serializable
    private _endFrameRangeOverride: Int32Expression | null = null;

    public tick (dataStore: VFXDataStore) {
        if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX1) {
            particles.ensureParameter(P_SUB_UV_INDEX1);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX2) {
            particles.ensureParameter(P_SUB_UV_INDEX2);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX3) {
            particles.ensureParameter(P_SUB_UV_INDEX3);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX4) {
            particles.ensureParameter(P_SUB_UV_INDEX4);
        }
        this.subImageSize.tick(dataStore);
        if (this.useStartFrameRangeOverride) {
            this.startFrameRangeOverride.tick(dataStore);
        }
        if (this.useEndFrameRangeOverride) {
            this.endFrameRangeOverride.tick(dataStore);
        }
    }

    public execute (dataStore: VFXDataStore) {
        let subUVIndex: FloatArrayParameter;
        if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX1) {
            subUVIndex = particles.getFloatArrayParameter(P_SUB_UV_INDEX1);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX2) {
            subUVIndex = particles.getFloatArrayParameter(P_SUB_UV_INDEX2);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX3) {
            subUVIndex = particles.getFloatArrayParameter(P_SUB_UV_INDEX3);
        } else {
            subUVIndex = particles.getFloatArrayParameter(P_SUB_UV_INDEX4);
        }
        const fromIndex = context.getUint32Parameter(C_FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(C_TO_INDEX).data;
        if (this.subUVAnimationMode === SubUVAnimationMode.LINEAR) {
            for (let i = fromIndex; i < toIndex; i++) {

            }
        }
    }
}
