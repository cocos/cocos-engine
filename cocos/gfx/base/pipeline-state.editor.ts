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

import { ccclass, serializable, type, editable } from 'cc.decorator';

import {
    RasterizerState,
    DepthStencilState,
    BlendTarget,
    BlendState,
} from './pipeline-state';

import {
    PolygonMode,
    ShadeModel,
    CullMode,
    ComparisonFunc,
    StencilOp,
    BlendFactor,
    BlendOp,
    ColorMask,
    PrimitiveMode,
    DynamicStateFlagBit,
} from './define';

import { EffectAsset } from '../../asset/assets/effect-asset';
import { RenderPassStage } from '../../rendering/define';
import { CCString, Enum, Color } from '../../core';

function isNumber(obj: any) {
    return typeof obj === 'number' && !isNaN(obj);
}

function getEnumData(enumObj: any) {
    const enumData: any = {};
    Object.keys(enumObj).forEach((key) => {
        if (!isNumber(Number(key))) {
            enumData[key] = enumObj[key];
        }
    });

    return enumData;
}

const toEnum = (() => {
    const copyAsCCEnum = <T>(e: T) => Enum(getEnumData(e));
    return {
        PolygonMode:copyAsCCEnum(PolygonMode),
        ShadeModel:copyAsCCEnum(ShadeModel),
        CullMode:copyAsCCEnum(CullMode),
        ComparisonFunc:copyAsCCEnum(ComparisonFunc),
        StencilOp:copyAsCCEnum(StencilOp),
        PrimitiveMode:copyAsCCEnum(PrimitiveMode),
        RenderPassStage:copyAsCCEnum(RenderPassStage),
        DynamicStateFlagBit:copyAsCCEnum(DynamicStateFlagBit),
    }
})();

@ccclass('RasterizerState')
export class RasterizerStateEditor extends RasterizerState {
    @serializable
    @editable
    public isDiscard = false;

    @serializable
    @editable
    @type(toEnum.PolygonMode)
    public polygonMode = PolygonMode.FILL;

    @type(toEnum.ShadeModel)
    @serializable
    @editable
    public shadeModel = ShadeModel.GOURAND;

    @type(toEnum.CullMode)
    @serializable
    @editable
    public cullMode = CullMode.BACK;

    @serializable
    @editable
    public isFrontFaceCCW = true;

    @serializable
    @editable
    public depthBias = 0;

    @serializable
    @editable
    public depthBiasClamp = 0.0;

    @serializable
    @editable
    public depthBiasSlop = 0.0;

    @serializable
    @editable
    public isDepthClip = true;

    @serializable
    @editable
    public isMultisample = false;

    @serializable
    @editable
    public lineWidth = 1.0;
}

@ccclass('DepthStencilState')
export class DepthStencilStateEditor extends DepthStencilState {
    @serializable
    @editable
    public depthTest = true;

    @serializable
    @editable
    public depthWrite = true;

    @type(toEnum.ComparisonFunc)
    @serializable
    @editable
    public depthFunc = ComparisonFunc.LESS;

    @serializable
    @editable
    public stencilTestFront = false;

    @type(toEnum.ComparisonFunc)
    @serializable
    @editable
    public stencilFuncFront = ComparisonFunc.ALWAYS;

    @serializable
    @editable
    public stencilReadMaskFront = 0xffffffff;

    @serializable
    @editable
    public stencilWriteMaskFront = 0xffffffff;

    @type(toEnum.StencilOp)
    @serializable
    @editable
    public stencilFailOpFront = StencilOp.KEEP;

    @type(toEnum.StencilOp)
    @serializable
    @editable
    public stencilZFailOpFront = StencilOp.KEEP;

    @type(toEnum.StencilOp)
    @serializable
    @editable
    public stencilPassOpFront = StencilOp.KEEP;

    @serializable
    @editable
    public stencilRefFront = 1;

    @serializable
    @editable
    public stencilTestBack = false;

    @type(toEnum.ComparisonFunc)
    @serializable
    @editable
    public stencilFuncBack = ComparisonFunc.ALWAYS;

    @serializable
    @editable
    public stencilReadMaskBack = 0xffffffff;

    @serializable
    @editable
    public stencilWriteMaskBack = 0xffffffff;

    @type(toEnum.StencilOp)
    @serializable
    @editable
    public stencilFailOpBack = StencilOp.KEEP;

    @type(toEnum.StencilOp)
    @serializable
    @editable
    public stencilZFailOpBack = StencilOp.KEEP;

    @type(toEnum.StencilOp)
    @serializable
    @editable
    public stencilPassOpBack = StencilOp.KEEP;

    @serializable
    @editable
    public stencilRefBack = 1;
}

// description of pipeline-state.ts class BlendTarget
@ccclass('BlendTarget')
export class BlendTargetEditor extends BlendTarget {
    @serializable
    @editable
    public blend = false;

    @type(BlendFactor)
    @serializable
    @editable
    public blendSrc = BlendFactor.ONE;

    @type(BlendFactor)
    @serializable
    @editable
    public blendDst = BlendFactor.ZERO;

    @type(BlendOp)
    @serializable
    @editable
    public blendEq = BlendOp.ADD;

    @type(BlendFactor)
    @serializable
    @editable
    public blendSrcAlpha = BlendFactor.ONE;

    @type(BlendFactor)
    @serializable
    @editable
    public blendDstAlpha = BlendFactor.ZERO;

    @type(BlendOp)
    @serializable
    @editable
    public blendAlphaEq = BlendOp.ADD;

    @type(ColorMask)
    @serializable
    @editable
    public blendColorMask = ColorMask.ALL;
}

@ccclass('BlendState')
export class BlendStateEditor {
    @serializable
    @editable
    public isA2C = false;

    @serializable
    @editable
    public isIndepend = false;

    @serializable
    @editable
    public blendColor: Color = Color.WHITE;

    @type([BlendTargetEditor])
    @serializable
    @editable
    public targets: BlendTargetEditor[] = [];

    public init (blendState: any) {
        let length = 1;
        if (blendState && blendState.targets) {
            length = blendState.targets.length;
        }

        for (let i = 0; i < length; i++) {
            this.targets.push(new BlendTargetEditor());
        }
    }
}

@ccclass('PassStates')
export class PassStatesEditor implements EffectAsset.IPassStates {
    @serializable
    @editable
    public priority = 128;

    @type(toEnum.PrimitiveMode)
    @serializable
    @editable
    public primitive = PrimitiveMode.TRIANGLE_LIST;

    @type(toEnum.RenderPassStage)
    @serializable
    @editable
    public stage = RenderPassStage.DEFAULT;

    @type(RasterizerStateEditor)
    @serializable
    @editable
    public rasterizerState: RasterizerStateEditor = new RasterizerStateEditor();

    @type(DepthStencilStateEditor)
    @serializable
    @editable
    public depthStencilState: DepthStencilStateEditor = new DepthStencilStateEditor();

    @type(BlendStateEditor)
    @serializable
    @editable
    public blendState: BlendStateEditor = new BlendStateEditor();

    @type([toEnum.DynamicStateFlagBit])
    @serializable
    @editable
    public dynamics = [];

    @type([CCString])
    @serializable
    @editable
    public customizations = [];

    @serializable
    @editable
    public phase = '';
}
