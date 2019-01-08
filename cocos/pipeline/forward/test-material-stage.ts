import { Material } from '../../3d/assets/material';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXBufferTextureCopy, GFXCommandBufferType, GFXFormat,
    GFXTextureFlagBit, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../../gfx/define';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXTexture } from '../../gfx/texture';
import { GFXTextureView } from '../../gfx/texture-view';
import { RenderFlow } from '../render-flow';
import { RenderStage, RenderStageInfo } from '../render-stage';
import { RenderView } from '../render-view';

export class TestMaterialStage extends RenderStage {

    private _texture: GFXTexture | null = null;
    private _texView: GFXTextureView | null = null;
    private _material: Material = new Material();

    constructor (flow: RenderFlow) {
        super(flow);
    }

    public initialize (info: RenderStageInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;
        this._framebuffer = info.framebuffer;
        if (!this._framebuffer) {
            return false;
        }

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        // load texture
        const imgElms = this._device.canvas.getElementsByTagName('img');
        if (imgElms.length) {
            if (!this.loadTexture(imgElms[0] as HTMLImageElement)) {
                console.error('Load texture failed.');
                return false;
            }
        } else {
            console.error('Not found image, load texture failed.');
        }

        return true;
    }

    public destroy () {

        if (this._texView) {
            this._texView.destroy();
            this._texView = null;
        }

        if (this._texture) {
            this._texture.destroy();
            this._texture = null;
        }

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public render (view: RenderView) {
        const mtl = this._material;
        // @ts-ignore
        if (!mtl.inited) {
            // material
            mtl.effectName = 'test'; // parsed-effect file is embedded in cocos/3d/builtin/effects.js
            const pass = mtl.passes[0];
            /* *
            const texBinding = pass.getBinding('u_sampler');
            pass.bindTextureView(texBinding,  this._texView as GFXTextureView);
            const colorHandle = pass.getHandle('u_color');
            pass.setUniform(colorHandle, cc.color('#ffffff'));
            /* */
            mtl.setProperty('u_sampler', {
                tv: this._texView,
                getGFXTextureView () { return this.tv; },
            });
            mtl.setProperty('u_color', cc.color('#ffffff'));
            /* */
            pass.update();
            // @ts-ignore
            mtl.inited = true;
        }

        const cmdBuff =  this._cmdBuff as GFXCommandBuffer;
        this._renderArea.width = view.width;
        this._renderArea.height = view.height;

        cmdBuff.begin();
        cmdBuff.beginRenderPass( this._framebuffer as GFXFramebuffer, this._renderArea, this._clearColors,
            this._clearDepth, this._clearStencil);

        cmdBuff.bindPipelineState(this._material.passes[0].pipelineState);
        cmdBuff.bindBindingLayout(this._material.passes[0].bindingLayout);

        cmdBuff.bindInputAssembler( this._pipeline.quadIA as GFXInputAssembler);
        cmdBuff.draw( this._pipeline.quadIA as GFXInputAssembler);
        cmdBuff.endRenderPass();
        cmdBuff.end();

        this._device.queue.submit([cmdBuff]);
    }

    private loadTexture (image: HTMLImageElement): boolean {
        this._texture = this._device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED | GFXTextureUsageBit.TRANSFER_DST,
            format: GFXFormat.RGBA8,
            width: image.width,
            height: image.height,
            flags: GFXTextureFlagBit.NONE,
        });

        if (!this._texture) {
            return false;
        }

        this._texView = this._device.createTextureView({
            texture: this._texture,
            type: GFXTextureViewType.TV2D,
            format: GFXFormat.RGBA8,
        });

        if (!this._texView) {
            return false;
        }

        const region: GFXBufferTextureCopy = {
            buffOffset: 0,
            buffStride: 0,
            buffTexHeight: 0,
            texOffset: { x: 0, y: 0, z: 0 },
            texExtent: { width: image.width, height: image.height, depth: 1 },
            texSubres: { baseMipLevel: 0, levelCount: 1, baseArrayLayer: 0, layerCount: 1 },
        };

        this._device.copyImageSourceToTexture(image, this._texture, [region]);

        return true;
    }
}
