import { Material } from '../../3d/assets/material';
import ImageAsset from '../../assets/image-asset';
import Texture2D from '../../assets/texture-2d';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType} from '../../gfx/define';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { Camera } from '../../renderer/scene/camera';
import Model from '../../renderer/scene/model';
import { Scene } from '../../scene-graph';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

export class TestModelStage extends RenderStage {

    private _material: Material = new Material("testMtrl");
    private _model: Model;
    private _scene: Scene;
    private _init: boolean = false;
    private _textureAsset: Texture2D | null = null;

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
            if (!this.loadTexture( imgElms[0] as HTMLImageElement)) {
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

        if (!this._init) {

            this._material.effectName = 'test'; // parsed-effect file is embedded in cocos/3d/builtin/effects.js
            this._material.setProperty('u_sampler', this._textureAsset);
            this._material.setProperty('u_color', cc.color('#ff1234'));
            this._material.passes[0].update();

            this._scene = new Scene();
            this._scene._scene = this._scene;
            const modelCom = this._scene.addComponent('cc.ModelComponent');
            modelCom.material = this._material;
            modelCom.mesh = cc.utils.createMesh(cc.game._renderContext, cc.primitives.box({length: 1, width: 1, height: 1}));
            this._model = modelCom._models[0];
            this._scene.setRotationFromEuler(45, 45, 45);
            this._scene._rot = this._scene._lrot;
            this._init = true;
        }

        const camera = view.camera as Camera;

        const cmdBuff =  this._cmdBuff as GFXCommandBuffer;
        this._renderArea.width = camera.width;
        this._renderArea.height = camera.height;
        this._model._updateTransform();
        this._model.updateRenderData();
        cmdBuff.begin();
        cmdBuff.beginRenderPass( this._framebuffer as GFXFramebuffer, this._renderArea, this._clearColors,
            this._clearDepth, this._clearStencil);

        cmdBuff.execute(this._model.commandBuffers);
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
