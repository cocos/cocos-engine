import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { IWebGPUAttrib, IWebGPUGPUInputAssembler, IWebGPUGPUPipelineState } from './webgpu-gpu-objects';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUShader } from './webgpu-shader';
import { Attribute, CullMode, DynamicStateFlagBit, FormatInfos, PrimitiveMode, ShaderStageFlagBit, ShaderStageFlags } from '../base/define';
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
import { WebGPUDeviceManager } from './define';

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
    get gpuPipelineState(): IWebGPUGPUPipelineState {
        return this._gpuPipelineState!;
    }

    private _gpuPipelineState: IWebGPUGPUPipelineState | null = null;
    private _locations: Map<string, number> = new Map<string, number>();
    public initialize(info: Readonly<PipelineStateInfo>): void {
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
        const colorDescs: GPUColorTargetState[] = [];
        for (let i = 0; i < colorAttachments.length; i++) {
            const colDesc: GPUColorTargetState = {
                format: GFXFormatToWGPUFormat(colorAttachments[i].format),
                writeMask: WebGPUBlendMask(this._bs.targets[i].blendColorMask),
            };
            if(this._bs.targets[i].blend) {
                colDesc.blend = {
                    color: {
                        dstFactor: WebGPUBlendFactors[this._bs.targets[i].blendDst],
                        operation: WebGPUBlendOps[this._bs.targets[i].blendEq],
                        srcFactor: WebGPUBlendFactors[this._bs.targets[i].blendSrc],
                    },
                    alpha: {
                        dstFactor: WebGPUBlendFactors[this._bs.targets[i].blendDstAlpha],
                        operation: WebGPUBlendOps[this._bs.targets[i].blendAlphaEq],
                        srcFactor: WebGPUBlendFactors[this._bs.targets[i].blendSrcAlpha],
                    }
                }
            }
            colorDescs.push(colDesc);
        }

        let vertexStage: GPUProgrammableStage;
        let fragmentStage: GPUProgrammableStage;
        const shaderStages = (this._shader as WebGPUShader).gpuShader.gpuStages;
        for (let i = 0; i < shaderStages.length; i++) {
            if (shaderStages[i].type === ShaderStageFlagBit.VERTEX) { vertexStage = shaderStages[i].glShader!; }
            if (shaderStages[i].type === ShaderStageFlagBit.FRAGMENT) { fragmentStage = shaderStages[i].glShader!; }
        }

        const gpuShader = info.shader as WebGPUShader;

        const shaderAttrs = gpuShader.attributes;
        for (let i = 0; i < shaderAttrs.length; i++) {
            this._locations.set(shaderAttrs[i].name, shaderAttrs[i].location);
        }
        // let vbAttrDescs: GPUVertexAttribute[] = [];
        // let offset = 0;
        // // We need a real stride
        // const iaAttrs = this._is.attributes;
        // let gpuAttrib: Attribute | null;
        // let offsets = new Array(256).fill(0);
        // for(const iaAttr of iaAttrs) {
        //     gpuAttrib = null;
            
        //     if(gpuAttrib) {
        //         const attrDesc = {
        //             format: GFXFormatToWGPUVertexFormat(iaAttr.format),
        //             offset: offsets[iaAttr.stream],
        //             shaderLocation: gpuAttrib.location,
        //         };
        //         offset += FormatInfos[iaAttr.format].size;
        //         vbAttrDescs.push(attrDesc);
        //     } else {
        //         offset += FormatInfos[iaAttr.format].size;
        //     }
        //     offsets[iaAttr.stream] = offset;
        // }
        // vbAttrDescs = vbAttrDescs.filter(function(element) {
        //     return element !== undefined && element !== null;
        //   });
        const stripTopology = (info.primitive == PrimitiveMode.LINE_STRIP || info.primitive == PrimitiveMode.TRIANGLE_STRIP);
        const renderPplDesc: GPURenderPipelineDescriptor = {
            layout: (this._pipelineLayout as WebGPUPipelineLayout).gpuPipelineLayout.nativePipelineLayout,
            // vertexStage,
            // primitive: WebPUPrimitives[info.primitive],
            vertex: {
                module: vertexStage!.module,
                entryPoint: 'main',
                buffers: [],
            },
            primitive: {
                topology: WebPUPrimitives[info.primitive],
                frontFace: this._rs.isFrontFaceCCW ? 'ccw' : 'cw',
                cullMode: this._rs.cullMode === CullMode.NONE ? 'none' : (this._rs.cullMode === CullMode.FRONT) ? 'front' : 'back',
                // unclippedDepth: !this._rs.isDepthClip,
            },
            
            fragment: {
                module: fragmentStage!.module,
                entryPoint: 'main',
                targets: colorDescs,
            },
        };
        if(stripTopology) renderPplDesc.primitive!.stripIndexFormat = 'uint16'
        // const lyt = (this._pipelineLayout as WebGPUPipelineLayout);

        // if (fragmentStage) {
        //     renderPplDesc.fragmentStage = fragmentStage;
        // }

        // depthstencil states
        if (this._renderPass.depthStencilAttachment) {
            const dssDesc = {} as GPUDepthStencilState;
            dssDesc.format = GFXFormatToWGPUFormat(this._renderPass.depthStencilAttachment.format);// GFXFormatToWGPUFormat(this._renderPass.depthStencilAttachment.format);
            dssDesc.depthWriteEnabled = this._dss.depthWrite;
            dssDesc.depthCompare = this._dss.depthTest ? WebGPUCompereFunc[this._dss.depthFunc] : 'always';
            let stencilReadMask = this._dss.stencilReadMaskFront;
            let stencilWriteMask = this._dss.stencilWriteMaskFront;

            if (this._dss.stencilTestFront) {
                dssDesc.stencilFront = {
                    compare: WebGPUCompereFunc[this._dss.stencilFuncFront],
                    depthFailOp: WebGPUStencilOp[this._dss.stencilZFailOpFront],
                    passOp: WebGPUStencilOp[this._dss.stencilPassOpFront],
                    failOp: WebGPUStencilOp[this._dss.stencilFailOpFront],
                };
                // stencilReadMask |= this._dss.stencilReadMaskFront;
                // stencilWriteMask |= this._dss.stencilWriteMaskFront;
            }
            if (this._dss.stencilTestBack) {
                dssDesc.stencilBack = {
                    compare: WebGPUCompereFunc[this._dss.stencilFuncBack],
                    depthFailOp: WebGPUStencilOp[this._dss.stencilZFailOpBack],
                    passOp: WebGPUStencilOp[this._dss.stencilPassOpBack],
                    failOp: WebGPUStencilOp[this._dss.stencilFailOpBack],
                };
                // stencilReadMask |= this._dss.stencilReadMaskBack;
                // stencilWriteMask |= this._dss.stencilWriteMaskBack;
            }
            dssDesc.stencilReadMask = stencilReadMask;
            dssDesc.stencilWriteMask = stencilWriteMask;
            renderPplDesc.depthStencil = dssDesc;
        }

        // -------optional-------
        // renderPplDesc.vertexState = {};

        // if (renderPplDesc.primitiveTopology === 'line-strip' || renderPplDesc.primitiveTopology === 'triangle-strip') {
        //     renderPplDesc.vertexState!.indexFormat = 'uint16';
        // }
        // renderPplDesc.sampleCount = 1;
        // renderPplDesc.sampleMask = 0;
        // renderPplDesc.alphaToCoverageEnabled = true;

        

        // const cmdEncoder = nativeDevice?.createCommandEncoder();
        // nativeDevice?.queue.submit([cmdEncoder!.finish()]);

        this._gpuPipelineState = {
            glPrimitive: WebPUPrimitives[info.primitive],
            gpuShader: gpuShader.gpuShader,
            gpuPipelineLayout: (info.pipelineLayout as WebGPUPipelineLayout).gpuPipelineLayout,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            gpuRenderPass: (info.renderPass as WebGPURenderPass).gpuRenderPass,
            dynamicStates,
            pipelineState: renderPplDesc,
            nativePipeline: undefined,
        };
    }

    protected _getShaderLocation(name: string) {
        return this._locations.get(name);
    }

    public updatePipelineLayout() {
        if(this._gpuPipelineState && this._gpuPipelineState.pipelineState) {
            this._gpuPipelineState.pipelineState.layout = (this._pipelineLayout as WebGPUPipelineLayout).gpuPipelineLayout.nativePipelineLayout;
        }
    }

    public prepare(ia: IWebGPUGPUInputAssembler, forceUpdate: boolean = false) {
        if(this._gpuPipelineState!.nativePipeline && !forceUpdate) {
            return;
        }
        const gpuShader = this.shader;
        const shaderAttrs = gpuShader.attributes;
        const pipelineState = this._gpuPipelineState!.pipelineState!;
        const vertexAttrs: GPUVertexBufferLayout[] = [];
        const emptyPushAttr: string[] = [];
        const streamCount = ia.gpuVertexBuffers.length;
        for(let i = 0; i < streamCount; i++) {
            const currBufferLayout: GPUVertexBufferLayout = {
                arrayStride: 0,
                attributes: [],
            };
            const currAttrs: GPUVertexAttribute[] = [];
            for(let j = 0; j < shaderAttrs.length; j++) {
                const shaderAttr = shaderAttrs[j];
                let hasAttr = false;
                for(let k = 0; k < ia.glAttribs.length; k++) {
                    const glAttr = ia.glAttribs[k];
                    const attr = ia.attributes[k];
                    if(attr.name === shaderAttr.name) {
                        hasAttr = true;
                        let loc = shaderAttr.location;
                        // webgpu only supports locations smaller than 16
                        // if(loc !== undefined && loc > 16) {
                        //     const regex = new RegExp(`@location\(.*?\)\\s+${attr.name}`, 'g');
                        //     const wgpuShader = (this._shader as WebGPUShader);
                        //     const matches = regex.exec(wgpuShader.gpuShader.gpuStages[0].source);
                        //     if(matches) {
                        //         loc = Number(matches[1].replace(/\(|\)/g, ''));
                        //     } else {
                        //         continue;
                        //     }
                        // }
                        if(attr.stream === i) {
                            currBufferLayout.arrayStride = glAttr.stride;
                            currBufferLayout.stepMode = attr.isInstanced ? 'instance' : 'vertex';
                            const attrLayout: GPUVertexAttribute = {
                                format: GFXFormatToWGPUVertexFormat(attr.format),
                                offset: glAttr.offset,
                                shaderLocation: loc,
                            }
                            currAttrs.push(attrLayout);
                        }
                        break;
                    }
                }
                const format = shaderAttr.format;
                if(!hasAttr && !emptyPushAttr.includes(shaderAttr.name) 
                    && (FormatInfos[format].size <= ia.gpuVertexBuffers[i].stride)) {
                    emptyPushAttr.push(shaderAttr.name);
                    const attrLayout: GPUVertexAttribute = {
                        format: GFXFormatToWGPUVertexFormat(format),
                        offset: 0,
                        shaderLocation: shaderAttr.location,
                    }
                    currAttrs.push(attrLayout);
                }
            }
            
            if(currAttrs.length) {
                currBufferLayout.attributes = currAttrs;
                vertexAttrs.push(currBufferLayout);
            }
        }
        
        pipelineState.vertex.buffers = vertexAttrs;
        const webgpuDevice = (WebGPUDeviceManager.instance as WebGPUDevice);
        const nativeDevice = webgpuDevice.nativeDevice;
        const nativePipeline = nativeDevice?.createRenderPipeline(pipelineState);
        this._gpuPipelineState!.nativePipeline = nativePipeline;
    }

    public destroy() {
        this._gpuPipelineState = null;
    }
}
