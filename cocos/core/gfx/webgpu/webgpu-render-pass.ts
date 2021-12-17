/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable new-cap */
import { RenderPass } from '../base/render-pass';
import { RenderPassInfo } from '../base/define';
import { nativeLib } from './webgpu-utils';
import { SampleCount, Format, LoadOp, StoreOp, ResolveMode } from '..';

export class WebGPURenderPass extends RenderPass {
    private _nativeRenderPass;

    public initialize (info: RenderPassInfo): boolean {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        this._subpasses = info.subpasses;

        const renderPassInfo = new nativeLib.RenderPassInfoInstance();
        const colorAttachmentList = new nativeLib.ColorAttachmentList();
        for (let i = 0; i < info.colorAttachments.length; i++) {
            const origin = info.colorAttachments[i];
            const color = new nativeLib.ColorAttachmentInstance();
            const formatStr = Format[origin.format];
            color.format = nativeLib.Format[formatStr];
            const samplerStr = SampleCount[origin.sampleCount];
            color.sampleCount = nativeLib.SampleCount[samplerStr];
            const loadOpStr = LoadOp[origin.loadOp];
            color.loadOp = nativeLib.LoadOp[loadOpStr];
            const storeOpStr = StoreOp[origin.storeOp];
            color.storeOp = nativeLib.StoreOp[storeOpStr];
            const beginAccesses = new nativeLib.AccessTypeList();
            for (let left = 0; left < origin.beginAccesses.length; left++) {
                beginAccesses.push_back(origin.beginAccesses[left]);
            }
            color.beginAccesses = beginAccesses;

            const endAccesses = new nativeLib.AccessTypeList();
            for (let right = 0; right < origin.endAccesses.length; right++) {
                endAccesses.push_back(origin.endAccesses[right]);
            }
            color.endAccesses = endAccesses;
            color.isGeneralLayout = origin.isGeneralLayout;

            colorAttachmentList.push_back(color);
        }
        renderPassInfo.colorAttachments = colorAttachmentList;

        const depthStencil = renderPassInfo.depthStencilAttachment;
        const formatStr = Format[info.depthStencilAttachment.format];
        depthStencil.format = nativeLib.Format[formatStr];
        const sampleStr = SampleCount[info.depthStencilAttachment.sampleCount];
        depthStencil.sampleCount = nativeLib.SampleCount[sampleStr];
        const depthLoadOpStr = LoadOp[info.depthStencilAttachment.depthLoadOp];
        depthStencil.depthLoadOp = nativeLib.LoadOp[depthLoadOpStr];
        const depthStoreOpStr = StoreOp[info.depthStencilAttachment.depthStoreOp];
        depthStencil.depthStoreOp = nativeLib.StoreOp[depthStoreOpStr];
        const stencilLoadOpStr = LoadOp[info.depthStencilAttachment.stencilLoadOp];
        depthStencil.stencilLoadOp = nativeLib.LoadOp[stencilLoadOpStr];
        const stencilStoreOpStr = StoreOp[info.depthStencilAttachment.stencilStoreOp];
        depthStencil.stencilStoreOp = nativeLib.StoreOp[stencilStoreOpStr];

        const beginAccesses = new nativeLib.AccessTypeList();
        for (let i = 0; i < info.depthStencilAttachment.beginAccesses.length; i++) {
            beginAccesses.push_back(info.depthStencilAttachment.beginAccesses[i]);
        }
        depthStencil.beginAccesses = beginAccesses;
        const endAccesses = new nativeLib.AccessTypeList();
        for (let i = 0; i < info.depthStencilAttachment.endAccesses.length; i++) {
            endAccesses.push_back(info.depthStencilAttachment.endAccesses[i]);
        }
        depthStencil.endAccesses = endAccesses;
        depthStencil.isGeneralLayout = info.depthStencilAttachment.isGeneralLayout;

        const subpasses = new nativeLib.SubpassInfoList();
        for (let i = 0; i < info.subpasses.length; i++) {
            const originSubpass = info.subpasses[i];
            const subpass = new nativeLib.SubpassInfoInstance();
            const inputs = new nativeLib.vector_uint32();
            for (let j = 0; j < originSubpass.inputs.length; j++) {
                inputs.push_back(originSubpass.inputs[i]);
            }
            subpass.inputs = inputs;
            const colors = new nativeLib.vector_uint32();
            for (let j = 0; j < originSubpass.colors.length; j++) {
                colors.push_back(originSubpass.colors[i]);
            }
            subpass.colors = colors;
            const resolves = new nativeLib.vector_uint32();
            for (let j = 0; j < originSubpass.resolves.length; j++) {
                resolves.push_back(originSubpass.resolves[i]);
            }
            subpass.resolves = resolves;
            const preserves = new nativeLib.vector_uint32();
            for (let j = 0; j < originSubpass.preserves.length; j++) {
                preserves.push_back(originSubpass.preserves[i]);
            }
            subpass.preserves = preserves;
            subpass.depthStencil = originSubpass.depthStencil;
            subpass.depthStencilResolve = originSubpass.depthStencilResolve;
            const depthResolveModeStr = ResolveMode[originSubpass.depthResolveMode];
            subpass.depthResolveMode = nativeLib.ResolveMode[depthResolveModeStr];
            const stencilResolveModeStr = ResolveMode[originSubpass.stencilResolveMode];
            subpass.stencilResolveMode = nativeLib.ResolveMode[stencilResolveModeStr];

            subpasses.push_back(subpass);
        }
        renderPassInfo.subpasses = subpasses;

        const dependencies = new nativeLib.SubpassDependencyList();
        for (let i = 0; i < info.dependencies.length; i++) {
            const originDeps = info.dependencies[i];
            const dependency = new nativeLib.SubpassDependencyInstance();
            dependency.srcSubpass = originDeps.srcSubpass;
            dependency.dstSubpass = originDeps.dstSubpass;
            const srcAccesses = new nativeLib.AccessTypeList();
            for (let j = 0; j < originDeps.srcAccesses.length; j++) {
                srcAccesses.push_back(originDeps.srcAccesses[i]);
            }
            dependency.srcAccesses = srcAccesses;
            const dstAccesses = new nativeLib.AccessTypeList();
            for (let j = 0; j < originDeps.dstAccesses.length; j++) {
                dstAccesses.push_back(originDeps.dstAccesses[i]);
            }
            dependency.dstAccesses = dstAccesses;
            dependencies.push_back(dependency);
        }
        renderPassInfo.dependencies = dependencies;

        const nativeDevice = nativeLib.nativeDevice;
        this._nativeRenderPass = nativeDevice?.createRenderPass(renderPassInfo);
        this._hash = this.computeHash();
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
