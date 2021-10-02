/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BlendTarget, PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUShader } from './webgpu-shader';
import {
    ComparisonFunc, CullMode, Format, PolygonMode, ShadeModel, StencilOp, BlendFactor,
    BlendOp, ColorMask, PrimitiveMode, DynamicStateFlagBit, PipelineBindPoint,
} from '../base/define';
import { WebGPUDevice } from './webgpu-device';
import {

} from './webgpu-commands';
import { nativeLib } from './webgpu-utils';
import { WebGPUPipelineLayout } from './webgpu-pipeline-layout';

export class WebGPUPipelineState extends PipelineState {
    private _nativePipelineState;

    get nativePipelineState () {
        return this._nativePipelineState;
    }

    public initialize (info: PipelineStateInfo): boolean {
        this._primitive = info.primitive;
        this._shader = info.shader;
        this._pipelineLayout = info.pipelineLayout;
        this._rs = info.rasterizerState;
        this._dss = info.depthStencilState;
        this._bs = info.blendState;
        this._is = info.inputState;
        this._renderPass = info.renderPass;
        this._dynamicStates = info.dynamicStates;

        const nativeDevice = nativeLib.nativeDevice;
        const pipelineStateInfo = new nativeLib.PipelineStateInfoInstance();
        pipelineStateInfo.setShader((info.shader as WebGPUShader).nativeShader);
        pipelineStateInfo.setPipelineLayout((info.pipelineLayout as WebGPUPipelineLayout).nativePipelineLayout);
        pipelineStateInfo.setRenderPass((info.renderPass as WebGPURenderPass).nativeRenderPass);

        const inputState = new nativeLib.InputStateInstance();
        const attrs = new nativeLib.AttributeList();
        for (let i = 0; i < info.inputState.attributes.length; i++) {
            const attribute = info.inputState.attributes[i];
            const nativeAttr = new nativeLib.AttributeInstance();
            nativeAttr.name = attribute.name;
            const formatStr = Format[attribute.format];
            nativeAttr.format = nativeLib.Format[formatStr];
            nativeAttr.isNormalized = attribute.isNormalized;
            nativeAttr.stream = attribute.stream;
            nativeAttr.isInstanced = attribute.isInstanced;
            nativeAttr.location = attribute.location;
            attrs.push_back(nativeAttr);
        }
        inputState.attributes = attrs;
        pipelineStateInfo.setInputState(inputState);

        const rasterizerState = new nativeLib.RasterizerStateInstance();
        rasterizerState.isDiscard = info.rasterizerState.isDiscard;
        const polygonModeStr = PolygonMode[info.rasterizerState.polygonMode];
        rasterizerState.polygonMode = nativeLib.PolygonMode[polygonModeStr];
        const shadeModelStr = ShadeModel[info.rasterizerState.shadeModel];
        rasterizerState.polygonMode = nativeLib.ShadeModel[shadeModelStr];
        const cullModeStr = CullMode[info.rasterizerState.cullMode];
        rasterizerState.polygonMode = nativeLib.CullMode[cullModeStr];
        rasterizerState.isFrontFaceCCW = info.rasterizerState.isFrontFaceCCW;
        rasterizerState.depthBiasEnabled = info.rasterizerState.depthBiasEnabled;
        rasterizerState.depthBias = info.rasterizerState.depthBias;
        rasterizerState.depthBiasClamp = info.rasterizerState.depthBiasClamp;
        rasterizerState.depthBiasSlop = info.rasterizerState.depthBiasSlop;
        rasterizerState.isDepthClip = info.rasterizerState.isDepthClip;
        rasterizerState.isMultisample = info.rasterizerState.isMultisample;
        rasterizerState.lineWidth = info.rasterizerState.lineWidth;
        pipelineStateInfo.setRasterizerState(rasterizerState);

        const depthStencilState = new nativeLib.DepthStencilStateInstance();
        depthStencilState.depthTest = info.depthStencilState.depthTest;
        depthStencilState.depthWrite = info.depthStencilState.depthWrite;
        const depthFuncStr = ComparisonFunc[info.depthStencilState.depthFunc];
        depthStencilState.depthFunc = nativeLib.ComparisonFunc[depthFuncStr];
        depthStencilState.stencilTestFront = info.depthStencilState.stencilTestFront;
        const stencilFuncFrontStr = ComparisonFunc[info.depthStencilState.stencilFuncFront];
        depthStencilState.stencilFuncFront = nativeLib.ComparisonFunc[stencilFuncFrontStr];
        depthStencilState.stencilReadMaskFront = info.depthStencilState.stencilReadMaskFront;
        depthStencilState.stencilWriteMaskFront = info.depthStencilState.stencilWriteMaskFront;
        const stencilFailOpFrontStr = StencilOp[info.depthStencilState.stencilFailOpFront];
        depthStencilState.stencilFailOpFront = nativeLib.StencilOp[stencilFailOpFrontStr];
        const stencilZFailOpFrontStr = StencilOp[info.depthStencilState.stencilZFailOpFront];
        depthStencilState.stencilZFailOpFront = nativeLib.StencilOp[stencilZFailOpFrontStr];
        const stencilPassOpFrontStr = StencilOp[info.depthStencilState.stencilPassOpFront];
        depthStencilState.stencilPassOpFront = nativeLib.StencilOp[stencilPassOpFrontStr];
        depthStencilState.stencilRefFront = info.depthStencilState.stencilRefFront;
        depthStencilState.stencilTestBack = info.depthStencilState.stencilTestBack;
        const stencilFuncBackStr = ComparisonFunc[info.depthStencilState.stencilFuncBack];
        depthStencilState.stencilFuncBack = nativeLib.ComparisonFunc[stencilFuncBackStr];
        depthStencilState.stencilReadMaskBack = info.depthStencilState.stencilReadMaskBack;
        depthStencilState.stencilWriteMaskBack = info.depthStencilState.stencilWriteMaskBack;
        const stencilFailOpBackStr = StencilOp[info.depthStencilState.stencilFailOpBack];
        depthStencilState.stencilFailOpBack = nativeLib.StencilOp[stencilFailOpBackStr];
        const stencilZFailOpBackStr = StencilOp[info.depthStencilState.stencilZFailOpBack];
        depthStencilState.stencilZFailOpBack = nativeLib.StencilOp[stencilZFailOpBackStr];
        const stencilPassOpBackStr = StencilOp[info.depthStencilState.stencilPassOpBack];
        depthStencilState.stencilPassOpBack = nativeLib.StencilOp[stencilPassOpBackStr];
        depthStencilState.stencilRefBack = info.depthStencilState.stencilRefBack;
        pipelineStateInfo.setDepthStencilState(depthStencilState);

        const blendState = new nativeLib.BlendStateInstance();
        blendState.isA2C = info.blendState.isA2C;
        blendState.isIndepend = info.blendState.isIndepend;
        blendState.color = info.blendState.blendColor;
        const targets = new nativeLib.BlendTargetList();
        for (let i = 0; i < info.blendState.targets.length; i++) {
            const target = info.blendState.targets[i];
            const nativeTarget = new nativeLib.BlendTargetInstance();
            nativeTarget.blend = target.blend;
            const srcBFStr = BlendFactor[target.blendSrc];
            nativeTarget.blendSrc = nativeLib.BlendFactor[srcBFStr];
            const dstBFStr = BlendFactor[target.blendDst];
            nativeTarget.blendDst = nativeLib.BlendFactor[dstBFStr];
            const blendStr = BlendOp[target.blendEq];
            nativeTarget.blendEq = nativeLib.BlendOp[blendStr];
            const srcAlphaBFStr = BlendFactor[target.blendSrcAlpha];
            nativeTarget.blendSrcAlpha = nativeLib.BlendFactor[srcAlphaBFStr];
            const dstAlphaBFStr = BlendFactor[target.blendDstAlpha];
            nativeTarget.blendDstAlpha = nativeLib.BlendFactor[dstAlphaBFStr];
            const blendAlphaEqStr = BlendOp[target.blendAlphaEq];
            nativeTarget.blendAlphaEq = nativeLib.BlendOp[blendAlphaEqStr];
            const colorMaskStr = ColorMask[target.blendColorMask];
            nativeTarget.blendColorMask = nativeLib.ColorMask[colorMaskStr];
            targets.push_back(nativeTarget);
        }
        blendState.targets = targets;
        pipelineStateInfo.setBlendState(blendState);

        const primitiveModeStr = PrimitiveMode[info.primitive];
        pipelineStateInfo.setPrimitiveMode(nativeLib.PrimitiveMode[primitiveModeStr]);

        const dsynamicFlagStr = DynamicStateFlagBit[info.dynamicStates];
        pipelineStateInfo.setDynamicStateFlags(nativeLib.DynamicStateFlagBit[dsynamicFlagStr]);

        const bindPointStr = PipelineBindPoint[info.bindPoint];
        pipelineStateInfo.setPipelineBindPoint(nativeLib.PipelineBindPoint[bindPointStr]);

        //TODO_Zeqaing: wgpu subpass config
        pipelineStateInfo.setSubpass(0);

        this._nativePipelineState = nativeDevice.createPipelineState(pipelineStateInfo);
        return true;
    }

    public destroy () {
        this._nativePipelineState.destroy();
        this._nativePipelineState.delete();
    }
}
