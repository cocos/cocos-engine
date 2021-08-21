import { RenderPass } from '../base/render-pass';
import { RenderPassInfo } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPUDevice } from './webgpu-device';

export class WebGPURenderPass extends RenderPass {
    private _nativeRenderPass;

    public initialize (info: RenderPassInfo): boolean {
        const colorVec = new wgpuWasmModule.ColorAttachmentList();
        for (let i = 0; i < info.colorAttachments.length; i++) {
            const origin = info.colorAttachments[i];
            const color = new wgpuWasmModule.ColorAttachmentInstance();
            color.format = origin.format;
            color.sampleCount = origin.sampleCount;
            color.loadOp = origin.loadOp;
            color.storeOp = origin.storeOp;
            const beginAccesses = new wgpuWasmModule.AccessTypeList();
            for (let left = 0; left < origin.beginAccesses.length; left++) {
                beginAccesses.push_back(origin.beginAccesses[left]);
            }
            color.beginAccesses = beginAccesses;

            const endAccesses = new wgpuWasmModule.AccessTypeList();
            for (let right = 0; right < origin.endAccesses.length; right++) {
                endAccesses.push_back(origin.endAccesses[right]);
            }
            color.endAccesses = endAccesses;
            color.isGeneralLayout = origin.isGeneralLayout;

            colorVec.push_back(color);
        }

        const depthStencil = new wgpuWasmModule.DepthStencilAttachmentInstance();
        depthStencil.format = info.depthStencilAttachment.format;
        depthStencil.sampleCount = info.depthStencilAttachment.sampleCount;
        depthStencil.depthLoadOp = info.depthStencilAttachment.depthLoadOp;
        depthStencil.depthStoreOp = info.depthStencilAttachment.depthStoreOp;
        depthStencil.stencilLoadOp = info.depthStencilAttachment.stencilLoadOp;
        depthStencil.stencilStoreOp = info.depthStencilAttachment.stencilStoreOp;
        const beginAccesses = new wgpuWasmModule.AccessTypeList();
        for (let i = 0; i < info.depthStencilAttachment.beginAccesses.length; i++) {
            beginAccesses.push_back(info.depthStencilAttachment.beginAccesses[i]);
        }
        depthStencil.beginAccesses = beginAccesses;
        const endAccesses = new wgpuWasmModule.AccessTypeList();
        for (let i = 0; i < info.depthStencilAttachment.endAccesses.length; i++) {
            endAccesses.push_back(info.depthStencilAttachment.endAccesses[i]);
        }
        depthStencil.endAccesses = endAccesses;
        depthStencil.isGeneralLayout = info.depthStencilAttachment.isGeneralLayout;

        const subpasses = new wgpuWasmModule.SubpassInfoList();
        for (let i = 0; i < info.subpasses.length; i++) {
            const originSubpass = info.subpasses[i];
            const subpass = new wgpuWasmModule.SubpassInfoInstance();
            const inputs = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.inputs.length; j++) {
                inputs.push_back(originSubpass.inputs[i]);
            }
            subpass.inputs = inputs;
            const colors = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.colors.length; j++) {
                colors.push_back(originSubpass.colors[i]);
            }
            subpass.colors = colors;
            const resolves = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.resolves.length; j++) {
                resolves.push_back(originSubpass.resolves[i]);
            }
            subpass.resolves = resolves;
            const preserves = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.preserves.length; j++) {
                preserves.push_back(originSubpass.preserves[i]);
            }
            subpass.preserves = preserves;
            subpass.depthStencil = originSubpass.depthStencil;
            subpass.depthStencilResolve = originSubpass.depthStencilResolve;
            subpass.depthResolveMode = originSubpass.depthResolveMode;
            subpass.stencilResolveMode = originSubpass.stencilResolveMode;

            subpasses.push_back(subpass);
        }

        const dependencies = new wgpuWasmModule.SubpassDependencyList();
        for (let i = 0; i < info.dependencies.length; i++) {
            const originDeps = info.dependencies[i];
            const dependency = new wgpuWasmModule.SubpassDependencyInstance();
            dependency.srcSubpass = originDeps.srcSubpass;
            dependency.dstSubpass = originDeps.dstSubpass;
            const srcAccesses = new wgpuWasmModule.AccessTypeList();
            for (let j = 0; j < originDeps.srcAccesses.length; j++) {
                srcAccesses.push_back(originDeps.srcAccesses[i]);
            }
            dependency.srcAccesses = srcAccesses;
            const dstAccesses = new wgpuWasmModule.AccessTypeList();
            for (let j = 0; j < originDeps.dstAccesses.length; j++) {
                dstAccesses.push_back(originDeps.dstAccesses[i]);
            }
            dependency.dstAccesses = dstAccesses;
            dependencies.push_back(dependency);
        }

        const renderPassInfo = {
            colorAttachments: colorVec,
            depthStencilAttachment: depthStencil,
            subpasses,
            dependencies,
        };

        const wgpuDevice = this._device as unknown as WebGPUDevice;
        this._nativeRenderPass = wgpuDevice.nativeDevice?.createRenderPass(renderPassInfo);
        return true;
    }

    public nativeObj () {
        return this._nativeRenderPass;
    }

    public destroy () {
        this._nativeRenderPass?.destroy();
        this._nativeRenderPass?.delete();
    }
}
