import { RenderPass } from '../base/render-pass';
import { RenderPassInfo } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';
import { SampleCount, Format, LoadOp, StoreOp, ResolveMode } from '..';
import { WebGPUDevice } from './webgpu-device';

export class WebGPURenderPass extends RenderPass {
    private _nativeRenderPass;

    public initialize (info: RenderPassInfo): boolean {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        this._subpasses = info.subpasses;

        const renderPassInfo = new wgpuWasmModule.RenderPassInfoInstance();
        for (let i = 0; i < info.colorAttachments.length; i++) {
            const origin = info.colorAttachments[i];
            const color = new wgpuWasmModule.ColorAttachmentInstance();
            const formatStr = Format[origin.format];
            color.format = wgpuWasmModule.Format[formatStr];
            const samplerStr = SampleCount[origin.sampleCount];
            color.sampleCount = wgpuWasmModule.SampleCount[samplerStr];
            const loadOpStr = LoadOp[origin.loadOp];
            color.loadOp = wgpuWasmModule.LoadOp[loadOpStr];
            const storeOpStr = StoreOp[origin.storeOp];
            color.storeOp = wgpuWasmModule.StoreOp[storeOpStr];
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

            renderPassInfo.colorAttachments.push_back(color);
        }

        const depthStencil = renderPassInfo.depthStencilAttachment;
        const formatStr = Format[info.depthStencilAttachment.format];
        depthStencil.format = wgpuWasmModule.Format[formatStr];
        const sampleStr = SampleCount[info.depthStencilAttachment.sampleCount];
        depthStencil.sampleCount = wgpuWasmModule.SampleCount[sampleStr];
        const depthLoadOpStr = LoadOp[info.depthStencilAttachment.depthLoadOp];
        depthStencil.depthLoadOp = wgpuWasmModule.LoadOp[depthLoadOpStr];
        const depthStoreOpStr = StoreOp[info.depthStencilAttachment.depthStoreOp];
        depthStencil.depthStoreOp = wgpuWasmModule.StoreOp[depthStoreOpStr];
        const stencilLoadOpStr = LoadOp[info.depthStencilAttachment.stencilLoadOp];
        depthStencil.stencilLoadOp = wgpuWasmModule.LoadOp[stencilLoadOpStr];
        const stencilStoreOpStr = StoreOp[info.depthStencilAttachment.stencilStoreOp];
        depthStencil.stencilStoreOp = wgpuWasmModule.StoreOp[stencilStoreOpStr];

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

        const subpasses = renderPassInfo.subpasses;
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
            const depthResolveModeStr = ResolveMode[info.depthStencilAttachment.depthResolveMode];
            depthStencil.depthResolveMode = wgpuWasmModule.ResolveMode[depthResolveModeStr];
            const stencilResolveModeStr = ResolveMode[info.depthStencilAttachment.stencilResolveMode];
            depthStencil.stencilResolveMode = wgpuWasmModule.ResolveMode[stencilResolveModeStr];

            subpasses.push_back(subpass);
        }

        const dependencies = renderPassInfo.dependencies;
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

        const nativeDevice = wgpuWasmModule.nativeDevice;
        this._nativeRenderPass = nativeDevice?.createRenderPass(renderPassInfo);
        return true;
    }

    get nativeRenderPass () {
        return this._nativeRenderPass;
    }

    public destroy () {
        this._nativeRenderPass?.destroy();
        this._nativeRenderPass?.delete();
    }
}
