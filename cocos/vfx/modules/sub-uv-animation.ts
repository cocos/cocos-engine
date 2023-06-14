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
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { ConstantVec2Expression, Vec2Expression, Int32Expression, ConstantInt32Expression } from '../expressions';
import { VFXFloatArray } from '../parameters';
import { P_VELOCITY, P_NORMALIZED_AGE, P_SUB_UV_INDEX1, C_FROM_INDEX, C_TO_INDEX, P_SUB_UV_INDEX4, P_SUB_UV_INDEX2, P_SUB_UV_INDEX3 } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXEmitter } from '../vfx-emitter';

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
@VFXModule.register('SubUVAnimation', VFXExecutionStageFlags.UPDATE, [], [P_VELOCITY.name, P_NORMALIZED_AGE.name])
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
        this.requireRecompile();
    }

    @type(CCBoolean)
    public get useStartFrameRangeOverride () {
        return this._useStartFrameRangeOverride;
    }

    public set useStartFrameRangeOverride (val) {
        this._useStartFrameRangeOverride = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
    }

    @type(CCBoolean)
    public get useEndFrameRangeOverride () {
        return this._useEndFrameRangeOverride;
    }

    public set useEndFrameRangeOverride (val) {
        this._useEndFrameRangeOverride = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
    }

    @type(Enum(SubUVIndexChannel))
    public get subUVIndexChannel () {
        return this._subUVIndexChannel;
    }

    public set subUVIndexChannel (val) {
        this._subUVIndexChannel = val;
        this.requireRecompile();
    }

    /**
     * @zh 动画播放方式 [[SubUVAnimationMode]]。
     */
    @type(Enum(SubUVAnimationMode))
    public get subUVAnimationMode () {
        return this._subUVAnimationMode;
    }

    public set subUVAnimationMode (val) {
        this._subUVAnimationMode = val;
        this.requireRecompile();
    }

    @serializable
    private _subImageSize: Vec2Expression | null = null;
    @serializable
    private _useStartFrameRangeOverride = false;
    @serializable
    private _startFrameRangeOverride: Int32Expression | null = null;
    @serializable
    private _useEndFrameRangeOverride = false;
    @serializable
    private _endFrameRangeOverride: Int32Expression | null = null;
    @serializable
    private _subUVIndexChannel = SubUVIndexChannel.SUB_UV_INDEX1;
    @serializable
    private _subUVAnimationMode = SubUVAnimationMode.LINEAR;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX1) {
            parameterMap.ensure(P_SUB_UV_INDEX1);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX2) {
            parameterMap.ensure(P_SUB_UV_INDEX2);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX3) {
            parameterMap.ensure(P_SUB_UV_INDEX3);
        } else if (this.subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX4) {
            parameterMap.ensure(P_SUB_UV_INDEX4);
        }
        this.subImageSize.compile(parameterMap, this);
        if (this.useStartFrameRangeOverride) {
            this.startFrameRangeOverride.compile(parameterMap, this);
        }
        if (this.useEndFrameRangeOverride) {
            this.endFrameRangeOverride.compile(parameterMap, this);
        }
    }

    public execute (parameterMap: VFXParameterMap) {
        let subUVIndex: VFXFloatArray;
        if (this._subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX1) {
            subUVIndex = parameterMap.getFloatArrayVale(P_SUB_UV_INDEX1);
        } else if (this._subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX2) {
            subUVIndex = parameterMap.getFloatArrayVale(P_SUB_UV_INDEX2);
        } else if (this._subUVIndexChannel === SubUVIndexChannel.SUB_UV_INDEX3) {
            subUVIndex = parameterMap.getFloatArrayVale(P_SUB_UV_INDEX3);
        } else {
            subUVIndex = parameterMap.getFloatArrayVale(P_SUB_UV_INDEX4);
        }
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (this._subUVAnimationMode === SubUVAnimationMode.LINEAR) {
            for (let i = fromIndex; i < toIndex; i++) {

            }
        }
    }
}
