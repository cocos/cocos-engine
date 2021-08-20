import { color } from '../../math';
import { RenderPass, } from '../base/render-pass';
import { IWebGPUGPURenderPass } from './webgpu-gpu-objects';
import { LoadOp, StoreOp, RenderPassInfo } from '../base/define';
import { } from '../../utils/js';

export class WebGPURenderPass extends RenderPass {
    public get gpuRenderPass(): IWebGPUGPURenderPass {
        return this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGPUGPURenderPass | null = null;

    public initialize(info: RenderPassInfo): boolean {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        if (info.subpasses) {
            this._subpasses = info.subpasses;
        }

        const colorDescriptions: GPURenderPassColorAttachmentDescriptor[] = [];
        for (const attachment of info.colorAttachments) {
            colorDescriptions[colorDescriptions.length] = {
                attachment: {} as GPUTextureView, // later
                loadValue: attachment.loadOp === LoadOp.LOAD ? 'load' : [1, 1, 1, 1], // what ever as long as not 'load'
                storeOp: attachment.storeOp === StoreOp.STORE ? 'store' : 'clear',
            };
        }

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: colorDescriptions,
        };

        if (info.depthStencilAttachment) {
            const depthStencilDescriptor = {} as GPURenderPassDepthStencilAttachmentDescriptor;
            depthStencilDescriptor.depthLoadValue = 1.0;
            depthStencilDescriptor.depthStoreOp = info.depthStencilAttachment?.depthStoreOp === StoreOp.STORE ? 'store' : 'clear';
            depthStencilDescriptor.stencilLoadValue = 0.0;
            depthStencilDescriptor.stencilStoreOp = info.depthStencilAttachment?.stencilStoreOp === StoreOp.STORE ? 'store' : 'clear';
            depthStencilDescriptor.attachment = {} as GPUTextureView;

            renderPassDesc.depthStencilAttachment = {
                attachment: {} as GPUTextureView, // later
                depthLoadValue: info.depthStencilAttachment.depthLoadOp === LoadOp.LOAD ? 'load' : 1.0, // what ever as long as not 'load'
                depthStoreOp: info.depthStencilAttachment?.depthStoreOp === StoreOp.STORE ? 'store' : 'clear',
                stencilLoadValue: info.depthStencilAttachment.stencilLoadOp === LoadOp.LOAD ? 'load' : 0.0, // what ever as long as not 'load'
                stencilStoreOp: info.depthStencilAttachment?.stencilStoreOp === StoreOp.STORE ? 'store' : 'clear',
            };
        }

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
            nativeRenderPass: renderPassDesc,
        };

        this._hash = this.computeHash();

        return true;
    }

    public destroy() {
        this._gpuRenderPass = null;
    }
}
