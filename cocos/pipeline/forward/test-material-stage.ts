import { Material } from '../../3d/assets/material';
import ImageAsset from '../../assets/image-asset';
import Texture2D from '../../assets/texture-2d';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType } from '../../gfx/define';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { RenderFlow } from '../render-flow';
import { RenderStage, IRenderStageInfo } from '../render-stage';
import { RenderView } from '../render-view';

export class TestMaterialStage extends RenderStage {

    private _textureAsset: Texture2D | null = null;
    private _material: Material = new Material();

    constructor (flow: RenderFlow) {
        super(flow);
    }

    public initialize (info: IRenderStageInfo): boolean {

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
        if (this._textureAsset) {
            this._textureAsset.destroy();
            this._textureAsset = null;
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

            /* efficient pass API *
            const texBinding = pass.getBinding('u_sampler');
            const texView = this._textureAsset && this._textureAsset.getGFXTextureView();
            if (texView) { pass.bindTextureView(texBinding, texView); }
            const colorHandle = pass.getHandle('u_color');
            pass.setUniform(colorHandle, cc.color('#ffffff'));
            /* convenient material API */
            mtl.setProperty('u_sampler', this._textureAsset);
            mtl.setProperty('u_color', cc.color('#ff0000'));
            /**/

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
        const textureAsset = this._textureAsset = new Texture2D();
        textureAsset.image = new ImageAsset(image);

        const texture = textureAsset.getGFXTexture();
        if (!texture) { return false; }
        const texView = textureAsset.getGFXTextureView();
        if (!texView) { return false; }

        return true;
    }
}
