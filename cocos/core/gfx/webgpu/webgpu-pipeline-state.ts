import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { IWebGPUGPUPipelineState } from './webgpu-gpu-objects';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUShader } from './webgpu-shader';
import { CullMode, DynamicStateFlagBit, FormatInfos, ShaderStageFlagBit, ShaderStageFlags } from '../base/define';
import { WebGPUPipelineLayout } from './webgpu-pipeline-layout';
import { WebGPUDevice } from './webgpu-device';
import {
    GFXFormatToWGPUFormat,
    WebGPUBlendFactors,
    WebGPUBlendOps,
    WebGPUCompereFunc,
    WebGPUStencilOp,
    GFXFormatToWGPUVertexFormat,
    WebGPUBlendMask,
} from './webgpu-commands';

const WebPUPrimitives: GPUPrimitiveTopology[] = [
    'point-list',
    'line-list',
    'line-strip',
    'line-strip',   // no line_loop in webgpu
    'line-list',
    'line-strip',
    'line-list',
    'triangle-list',
    'triangle-strip',
    'triangle-strip',
    'triangle-list',
    'triangle-strip',
    'triangle-strip',
    'triangle-strip',    // no quad
];

export class WebGPUPipelineState extends PipelineState {
    get gpuPipelineState (): IWebGPUGPUPipelineState {
        return this._gpuPipelineState!;
    }

    private _gpuPipelineState: IWebGPUGPUPipelineState | null = null;

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

        const dynamicStates: DynamicStateFlagBit[] = [];
        for (let i = 0; i < 31; i++) {
            if (this._dynamicStates & (1 << i)) {
                dynamicStates.push(1 << i);
            }
        }

        // colorstates
        const colorAttachments = this._renderPass.colorAttachments;
        const colorDescs: GPUColorStateDescriptor[] = [];
        for (let i = 0; i < colorAttachments.length; i++) {
            colorDescs.push({
                format: GFXFormatToWGPUFormat(colorAttachments[i].format),
                alphaBlend: {
                    dstFactor: WebGPUBlendFactors[this._bs.targets[i].blendDstAlpha],
                    operation: WebGPUBlendOps[this._bs.targets[i].blendAlphaEq],
                    srcFactor: WebGPUBlendFactors[this._bs.targets[i].blendSrcAlpha],
                },
                colorBlend: {
                    dstFactor: WebGPUBlendFactors[this._bs.targets[i].blendDst],
                    operation: WebGPUBlendOps[this._bs.targets[i].blendEq],
                    srcFactor: WebGPUBlendFactors[this._bs.targets[i].blendSrc],
                },
                writeMask: WebGPUBlendMask(this._bs.targets[i].blendColorMask),
            });
        }

        let vertexStage;
        let fragmentStage;
        const shaderStages = (this._shader as WebGPUShader).gpuShader.gpuStages;
        for (let i = 0; i < shaderStages.length; i++) {
            if (shaderStages[i].type === ShaderStageFlagBit.VERTEX) { vertexStage = shaderStages[i].glShader!; }
            if (shaderStages[i].type === ShaderStageFlagBit.FRAGMENT) { fragmentStage = shaderStages[i].glShader!; }
        }

        const gpuShader = info.shader as WebGPUShader;
        const attrs = gpuShader.attributes;
        const vbAttrDescs: GPUVertexAttributeDescriptor[] = [];
        let offset = 0;
        for (let i = 0; i < attrs.length; i++) {
            const attrDesc = {
                format: GFXFormatToWGPUVertexFormat(attrs[i].format),
                offset,
                shaderLocation: attrs[i].location,
            };
            offset += FormatInfos[attrs[i].format].size;
            vbAttrDescs.push(attrDesc);
        }

        const renderPplDesc: GPURenderPipelineDescriptor = {
            layout: (this._pipelineLayout as WebGPUPipelineLayout).gpuPipelineLayout.nativePipelineLayout,
            vertexStage,
            primitiveTopology: WebPUPrimitives[info.primitive],
            vertexState: {
                vertexBuffers: [
                    {
                        arrayStride: offset,
                        attributes: vbAttrDescs,
                    },
                ],
            },
            rasterizationState: {
                frontFace: this._rs.isFrontFaceCCW ? 'ccw' : 'cw',
                cullMode: this._rs.cullMode === CullMode.NONE ? 'none' : (this._rs.cullMode === CullMode.FRONT) ? 'front' : 'back',
                clampDepth: this._rs.isDepthClip,
                depthBias: this._rs.depthBias,
                depthBiasSlopeScale: this._rs.depthBiasSlop,
                depthBiasClamp: this._rs.depthBiasClamp,
            },
            colorStates: colorDescs,
        };

        const lyt = (this._pipelineLayout as WebGPUPipelineLayout);

        if (fragmentStage) {
            renderPplDesc.fragmentStage = fragmentStage;
        }

        // depthstencil states
        if (this._renderPass.depthStencilAttachment) {
            const dssDesc = {} as GPUDepthStencilStateDescriptor;
            dssDesc.format = 'depth24plus-stencil8';// GFXFormatToWGPUFormat(this._renderPass.depthStencilAttachment.format);
            dssDesc.depthWriteEnabled = this._dss.depthWrite;
            dssDesc.depthCompare = WebGPUCompereFunc[this._dss.depthFunc];
            let stencilReadMask = 0x0;
            let stencilWriteMask = 0x0;

            if (this._dss.stencilTestFront) {
                dssDesc.stencilFront = {
                    compare: WebGPUCompereFunc[this._dss.stencilFuncFront],
                    depthFailOp: WebGPUStencilOp[this._dss.stencilZFailOpFront],
                    passOp: WebGPUStencilOp[this._dss.stencilPassOpFront],
                    failOp: WebGPUStencilOp[this._dss.stencilFailOpFront],
                };
                stencilReadMask |= this._dss.stencilReadMaskFront;
                stencilWriteMask |= this._dss.stencilWriteMaskFront;
            }
            if (this._dss.stencilTestBack) {
                dssDesc.stencilBack = {
                    compare: WebGPUCompereFunc[this._dss.stencilFuncBack],
                    depthFailOp: WebGPUStencilOp[this._dss.stencilZFailOpBack],
                    passOp: WebGPUStencilOp[this._dss.stencilPassOpBack],
                    failOp: WebGPUStencilOp[this._dss.stencilFailOpBack],
                };
                stencilReadMask |= this._dss.stencilReadMaskBack;
                stencilWriteMask |= this._dss.stencilWriteMaskBack;
            }
            dssDesc.stencilReadMask = stencilReadMask;
            dssDesc.stencilWriteMask = stencilWriteMask;
            renderPplDesc.depthStencilState = dssDesc;
        }

        // -------optional-------
        // renderPplDesc.vertexState = {};

        if (renderPplDesc.primitiveTopology === 'line-strip' || renderPplDesc.primitiveTopology === 'triangle-strip') {
            renderPplDesc.vertexState!.indexFormat = 'uint16';
        }
        // renderPplDesc.sampleCount = 1;
        // renderPplDesc.sampleMask = 0;
        // renderPplDesc.alphaToCoverageEnabled = true;

        const nativeDevice = (this._device as WebGPUDevice).nativeDevice();
        const nativePipeline = nativeDevice?.createRenderPipeline(renderPplDesc);

        const cmdEncoder = nativeDevice?.createCommandEncoder();
        nativeDevice?.queue.submit([cmdEncoder!.finish()]);

        this._gpuPipelineState = {
            glPrimitive: WebPUPrimitives[info.primitive],
            gpuShader: gpuShader.gpuShader,
            gpuPipelineLayout: (info.pipelineLayout as WebGPUPipelineLayout).gpuPipelineLayout,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            gpuRenderPass: (info.renderPass as WebGPURenderPass).gpuRenderPass,
            dynamicStates,
            nativePipeline,
        };

        return true;
    }

    public destroy () {
        this._gpuPipelineState = null;
    }
}
