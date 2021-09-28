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
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPUPipelineLayout } from './webgpu-pipeline-layout';

export class WebGPUPipelineState extends PipelineState {
    private _nativePipelineState;

    get nativePipelineState () {
        return  this._nativePipelineState;
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

        const nativeDevice = wgpuWasmModule.nativeDevice;
        const pipelineStateInfo = new wgpuWasmModule.PipelineStateInfoInstance();
        pipelineStateInfo.setShader((info.shader as WebGPUShader).nativeShader);
        pipelineStateInfo.setPipelineLayout((info.pipelineLayout as WebGPUPipelineLayout).nativePipelineLayout);
        pipelineStateInfo.setRenderPass((info.renderPass as WebGPURenderPass).nativeRenderPass);

        const inputState = new wgpuWasmModule.InputStateInstance();
        const attrs = new wgpuWasmModule.AttributeList();
        for (let i = 0; i < info.inputState.attributes.length; i++) {
            const attribute = info.inputState.attributes[i];
            const nativeAttr = new wgpuWasmModule.AttributeInstance();
            nativeAttr.name = attribute.name;
            const formatStr = Format[attribute.format];
            nativeAttr.format = wgpuWasmModule.Format[formatStr];
            nativeAttr.isNormalized = attribute.isNormalized;
            nativeAttr.stream = attribute.stream;
            nativeAttr.isInstanced = attribute.isInstanced;
            nativeAttr.location = attribute.location;
            attrs.push_back(nativeAttr);
        }
        inputState.attributes = attrs;
        pipelineStateInfo.setInputState(inputState);

        const rasterizerState = new wgpuWasmModule.RasterizerStateInstance();
        rasterizerState.isDiscard = info.rasterizerState.isDiscard;
        const polygonModeStr = PolygonMode[info.rasterizerState.polygonMode];
        rasterizerState.polygonMode = wgpuWasmModule.PolygonMode[polygonModeStr];
        const shadeModelStr = ShadeModel[info.rasterizerState.shadeModel];
        rasterizerState.polygonMode = wgpuWasmModule.ShadeModel[shadeModelStr];
        const cullModeStr = CullMode[info.rasterizerState.cullMode];
        rasterizerState.polygonMode = wgpuWasmModule.CullMode[cullModeStr];
        rasterizerState.isFrontFaceCCW = info.rasterizerState.isFrontFaceCCW;
        rasterizerState.depthBiasEnabled = info.rasterizerState.depthBiasEnabled;
        rasterizerState.depthBias = info.rasterizerState.depthBias;
        rasterizerState.depthBiasClamp = info.rasterizerState.depthBiasClamp;
        rasterizerState.depthBiasSlop = info.rasterizerState.depthBiasSlop;
        rasterizerState.isDepthClip = info.rasterizerState.isDepthClip;
        rasterizerState.isMultisample = info.rasterizerState.isMultisample;
        rasterizerState.lineWidth = info.rasterizerState.lineWidth;
        pipelineStateInfo.setRasterizerState(rasterizerState);

        const depthStencilState = new wgpuWasmModule.DepthStencilStateInstance();
        depthStencilState.depthTest = info.depthStencilState.depthTest;
        depthStencilState.depthWrite = info.depthStencilState.depthWrite;
        const depthFuncStr = ComparisonFunc[info.depthStencilState.depthFunc];
        depthStencilState.depthFunc = wgpuWasmModule.ComparisonFunc[depthFuncStr];
        depthStencilState.stencilTestFront = info.depthStencilState.stencilTestFront;
        const stencilFuncFrontStr = ComparisonFunc[info.depthStencilState.stencilFuncFront];
        depthStencilState.stencilFuncFront = wgpuWasmModule.ComparisonFunc[stencilFuncFrontStr];
        depthStencilState.stencilReadMaskFront = info.depthStencilState.stencilReadMaskFront;
        depthStencilState.stencilWriteMaskFront = info.depthStencilState.stencilWriteMaskFront;
        const stencilFailOpFrontStr = StencilOp[info.depthStencilState.stencilFailOpFront];
        depthStencilState.stencilFailOpFront = wgpuWasmModule.StencilOp[stencilFailOpFrontStr];
        const stencilZFailOpFrontStr = StencilOp[info.depthStencilState.stencilZFailOpFront];
        depthStencilState.stencilZFailOpFront = wgpuWasmModule.StencilOp[stencilZFailOpFrontStr];
        const stencilPassOpFrontStr = StencilOp[info.depthStencilState.stencilPassOpFront];
        depthStencilState.stencilPassOpFront = wgpuWasmModule.StencilOp[stencilPassOpFrontStr];
        depthStencilState.stencilRefFront = info.depthStencilState.stencilRefFront;
        depthStencilState.stencilTestBack = info.depthStencilState.stencilTestBack;
        const stencilFuncBackStr = ComparisonFunc[info.depthStencilState.stencilFuncBack];
        depthStencilState.stencilFuncBack = wgpuWasmModule.ComparisonFunc[stencilFuncBackStr];
        depthStencilState.stencilReadMaskBack = info.depthStencilState.stencilReadMaskBack;
        depthStencilState.stencilWriteMaskBack = info.depthStencilState.stencilWriteMaskBack;
        const stencilFailOpBackStr = StencilOp[info.depthStencilState.stencilFailOpBack];
        depthStencilState.stencilFailOpBack = wgpuWasmModule.StencilOp[stencilFailOpBackStr];
        const stencilZFailOpBackStr = StencilOp[info.depthStencilState.stencilZFailOpBack];
        depthStencilState.stencilZFailOpBack = wgpuWasmModule.StencilOp[stencilZFailOpBackStr];
        const stencilPassOpBackStr = StencilOp[info.depthStencilState.stencilPassOpBack];
        depthStencilState.stencilPassOpBack = wgpuWasmModule.StencilOp[stencilPassOpBackStr];
        depthStencilState.stencilRefBack = info.depthStencilState.stencilRefBack;
        pipelineStateInfo.setDepthStencilState(depthStencilState);

        const blendState = new wgpuWasmModule.BlendStateInstance();
        blendState.isA2C = info.blendState.isA2C;
        blendState.isIndepend = info.blendState.isIndepend;
        blendState.color = info.blendState.blendColor;
        const targets = new wgpuWasmModule.BlendTargetList();
        for (let i = 0; i < info.blendState.targets.length; i++) {
            const target = info.blendState.targets[i];
            const nativeTarget = new wgpuWasmModule.BlendTargetInstance();
            nativeTarget.blend = target.blend;
            const srcBFStr = BlendFactor[target.blendSrc];
            nativeTarget.blendSrc = wgpuWasmModule.BlendFactor[srcBFStr];
            const dstBFStr = BlendFactor[target.blendDst];
            nativeTarget.blendDst = wgpuWasmModule.BlendFactor[dstBFStr];
            const blendStr = BlendOp[target.blendEq];
            nativeTarget.blendEq = wgpuWasmModule.BlendOp[blendStr];
            const srcAlphaBFStr = BlendFactor[target.blendSrcAlpha];
            nativeTarget.blendSrcAlpha = wgpuWasmModule.BlendFactor[srcAlphaBFStr];
            const dstAlphaBFStr = BlendFactor[target.blendDstAlpha];
            nativeTarget.blendDstAlpha = wgpuWasmModule.BlendFactor[dstAlphaBFStr];
            const blendAlphaEqStr = BlendOp[target.blendAlphaEq];
            nativeTarget.blendAlphaEq = wgpuWasmModule.BlendOp[blendAlphaEqStr];
            const colorMaskStr = ColorMask[target.blendColorMask];
            nativeTarget.blendColorMask = wgpuWasmModule.ColorMask[colorMaskStr];
            targets.push_back(nativeTarget);
        }
        blendState.targets = targets;
        pipelineStateInfo.setBlendState(blendState);

        const primitiveModeStr = PrimitiveMode[info.primitive];
        pipelineStateInfo.setPrimitiveMode(wgpuWasmModule.PrimitiveMode[primitiveModeStr]);

        const dsynamicFlagStr = DynamicStateFlagBit[info.dynamicStates];
        pipelineStateInfo.setDynamicStateFlags(wgpuWasmModule.DynamicStateFlagBit[dsynamicFlagStr]);

        const bindPointStr = PipelineBindPoint[info.bindPoint];
        pipelineStateInfo.setPipelineBindPoint(wgpuWasmModule.PipelineBindPoint[bindPointStr]);

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
