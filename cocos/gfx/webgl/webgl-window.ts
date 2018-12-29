import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { GFXWindow, GFXWindowInfo } from '../window';
import { GFXFramebufferInfo } from '../framebuffer';
import { GFXRenderPassInfo, GFXColorAttachment, GFXLoadOp, GFXStoreOp, GFXTextureLayout, GFXPipelineBindPoint, GFXDepthStencilAttachment } from '../render-pass';
import { GFXTextureType, GFXTextureUsageBit, GFXTextureFlagBit } from '../texture';
import { GFXTextureViewType } from '../texture-view';
import { GFXFormat } from '../define';

export class WebGLGFXWindow extends GFXWindow {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXWindowInfo): boolean {

        if(info.title) {
            this._title = info.title;
        }

        if(info.left) {
            this._left = info.left;
        }

        if(info.top) {
            this._top = info.top;
        }

        this._width = info.width;
        this._height = info.height;
        this._colorFmt = GFXFormat.RGBA8;

        if(this.webGLDevice.WEBGL_depth_texture) {
            this._depthStencilFmt = GFXFormat.D24S8;
        } else {
            this._depthStencilFmt = GFXFormat.D16S8;
        }

        this._renderPass = this._device.createRenderPass({
            colorAttachment: [{
                format: this._colorFmt,
                loadOp: GFXLoadOp.CLEAR,
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                endLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
            }],
            depthStencilAttachment: {
                format : this._depthStencilFmt,
                depthLoadOp : GFXLoadOp.CLEAR,
                depthStoreOp : GFXStoreOp.STORE,
                stencilLoadOp : GFXLoadOp.CLEAR,
                stencilStoreOp : GFXStoreOp.STORE,
                sampleCount : 1,
                beginLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });

        this._colorTex = this._device.createTexture({
            type : GFXTextureType.TEX2D,
            usage : GFXTextureUsageBit.COLOR_ATTACHMENT,
            format : this._colorFmt,
            width : this._width,
            height : this._height,
            depth : 1,
            arrayLayer : 1,
            mipLevel : 1,
            flags : GFXTextureFlagBit.NONE,
        });

        if(this._colorTex) {
            this._colorTexView = this._device.createTextureView({
                texture : this._colorTex,
                type : GFXTextureViewType.TV2D,
                format : this._colorFmt,
                baseLevel : 0,
                levelCount : 1,
                baseLayer : 0,
                layerCount : 1,
            });
        }

        this._depthStencilTex = this._device.createTexture({
            type : GFXTextureType.TEX2D,
            usage : GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            format : this._depthStencilFmt,
            width : this._width,
            height : this._height,
            depth : 1,
            arrayLayer : 1,
            mipLevel : 1,
            flags : GFXTextureFlagBit.NONE,
        });

        if(this._depthStencilTex) {
            this._depthStencilTexView = this._device.createTextureView({
                texture : this._depthStencilTex,
                type : GFXTextureViewType.TV2D,
                format : this._depthStencilFmt,
                baseLevel : 0,
                levelCount : 1,
                baseLayer : 0,
                layerCount : 1,
            });
        }

        if(this._colorTexView && this._renderPass && this._depthStencilTexView) {
            this._framebuffer = this._device.createFramebuffer({
                renderPass: this._renderPass,
                colorViews: [this._colorTexView],
                depthStencilView: this._depthStencilTexView,
                isOffscreen: false,
            });
        }

        return true;
    }

    public destroy() {
        if(this._depthStencilTexView) {
            this._depthStencilTexView.destroy();
            this._depthStencilTexView = null;
        }

        if(this._depthStencilTex) {
            this._depthStencilTex.destroy();
            this._depthStencilTex = null;
        }

        if(this._colorTexView) {
            this._colorTexView.destroy();
            this._colorTexView = null;
        }

        if(this._colorTex) {
            this._colorTex.destroy();
            this._colorTex = null;
        }

        if(this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
        }

        if(this._renderPass) {
            this._renderPass.destroy();
            this._renderPass = null;
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

};
