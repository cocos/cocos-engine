import { RenderPass, } from '../base/render-pass';
import { IWebGPUGPURenderPass } from './webgpu-gpu-objects';
import { LoadOp, StoreOp, RenderPassInfo, DepthStencilAttachment, ColorAttachment } from '../base/define';
import { WGPUFormatToGFXFormat } from './webgpu-commands';

export class WebGPURenderPass extends RenderPass {
    public get gpuRenderPass(): IWebGPUGPURenderPass {
        return this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGPUGPURenderPass | null = null;
    private _generateColorAttachment(colorAttachment: ColorAttachment): GPURenderPassColorAttachment {
        return {
            view: {} as GPUTextureView, // later
            loadOp: colorAttachment.loadOp === LoadOp.LOAD ? 'load' : 'clear', // what ever as long as not 'load'
            storeOp: colorAttachment.storeOp === StoreOp.STORE ? 'store' : 'discard',
        };
    }
    private _generateDSAttachment(dsAttachment: DepthStencilAttachment): GPURenderPassDepthStencilAttachment {
        const depthStencilDescriptor = {} as GPURenderPassDepthStencilAttachment;
        depthStencilDescriptor.depthClearValue = 1.0;
        depthStencilDescriptor.depthLoadOp = dsAttachment.depthLoadOp === LoadOp.CLEAR ? 'clear' : 'load'
        depthStencilDescriptor.depthStoreOp = dsAttachment.depthStoreOp === StoreOp.STORE ? 'store' : 'discard';
        depthStencilDescriptor.stencilClearValue = 0.0;
        depthStencilDescriptor.stencilLoadOp = dsAttachment.stencilLoadOp === LoadOp.CLEAR ? 'clear' : 'load'
        depthStencilDescriptor.stencilStoreOp = dsAttachment.stencilStoreOp === StoreOp.STORE ? 'store' : 'discard';
        depthStencilDescriptor.view = {} as GPUTextureView;
        return depthStencilDescriptor;
    }
    public initialize(info: Readonly<RenderPassInfo>): void {
        // info.colorAttachments.forEach((colorAttachment) => {
        //     colorAttachment.format = WGPUFormatToGFXFormat(navigator.gpu.getPreferredCanvasFormat());
        // })
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        this._subpasses = info.subpasses;

        const colorDescriptions: GPURenderPassColorAttachment[] = [];
        const originalColorDesc: GPURenderPassColorAttachment[] = [];
        for (const attachment of info.colorAttachments) {
            originalColorDesc[colorDescriptions.length] = this._generateColorAttachment(attachment);
            colorDescriptions[colorDescriptions.length] = this._generateColorAttachment(attachment);
        }

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: colorDescriptions,
        };
        const originalRPDesc: GPURenderPassDescriptor = {
            colorAttachments: originalColorDesc,
        };

        if (info.depthStencilAttachment) {
            const depthStencilDescriptor = this._generateDSAttachment(info.depthStencilAttachment);
            const originalDepthStencilDesc = this._generateDSAttachment(info.depthStencilAttachment);
            renderPassDesc.depthStencilAttachment = depthStencilDescriptor;
            originalRPDesc.depthStencilAttachment = originalDepthStencilDesc;
        }

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
            nativeRenderPass: renderPassDesc,
            originalRP: originalRPDesc,
        };
    }

    public destroy() {
        this._gpuRenderPass = null;
    }
}
