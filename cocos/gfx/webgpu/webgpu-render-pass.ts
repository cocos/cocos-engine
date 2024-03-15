import { color } from '../../core/math';
import { RenderPass, } from '../base/render-pass';
import { IWebGPUGPURenderPass } from './webgpu-gpu-objects';
import { LoadOp, StoreOp, RenderPassInfo } from '../base/define';
import { } from '../../core/utils/js';

export class WebGPURenderPass extends RenderPass {
    public get gpuRenderPass(): IWebGPUGPURenderPass {
        return this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGPUGPURenderPass | null = null;

    public initialize(info: Readonly<RenderPassInfo>): void {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        this._subpasses = info.subpasses;

        const colorDescriptions: GPURenderPassColorAttachment[] = [];
        for (const attachment of info.colorAttachments) {
            colorDescriptions[colorDescriptions.length] = {
                view: {} as GPUTextureView, // later
                loadOp: attachment.loadOp === LoadOp.LOAD ? 'load' : 'clear', // what ever as long as not 'load'
                storeOp: attachment.storeOp === StoreOp.STORE ? 'store' : 'discard',
            };
        }

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: colorDescriptions,
        };

        if (info.depthStencilAttachment) {
            const depthStencilDescriptor = {} as GPURenderPassDepthStencilAttachment;
            depthStencilDescriptor.depthClearValue = 1.0;
            depthStencilDescriptor.depthStoreOp = info.depthStencilAttachment?.depthStoreOp === StoreOp.STORE ? 'store' : 'discard';
            depthStencilDescriptor.stencilClearValue = 0.0;
            depthStencilDescriptor.stencilStoreOp = info.depthStencilAttachment?.stencilStoreOp === StoreOp.STORE ? 'store' : 'discard';
            depthStencilDescriptor.view = {} as GPUTextureView;

            renderPassDesc.depthStencilAttachment = depthStencilDescriptor;
        }

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
            nativeRenderPass: renderPassDesc,
        };

        this._hash = this.computeHash();
    }

    public destroy() {
        this._gpuRenderPass = null;
    }
}
