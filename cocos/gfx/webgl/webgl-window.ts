import { GFXLoadOp, GFXStatus, GFXStoreOp, GFXTextureLayout } from '../define';
import { GFXDevice } from '../device';
import { GFXWindow, IGFXWindowInfo } from '../window';
import { WebGLGFXDevice } from './webgl-device';

export class WebGLGFXWindow extends GFXWindow {

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXWindowInfo): boolean {

        if (info.title !== undefined) {
            this._title = info.title;
        }

        if (info.left !== undefined) {
            this._left = info.left;
        }

        if (info.top !== undefined) {
            this._top = info.top;
        }

        this._width = info.width;
        this._height = info.height;
        this._colorFmt = info.colorFmt;
        this._depthStencilFmt = info.depthStencilFmt;

        this._renderPass = this._device.createRenderPass({
            colorAttachments: [{
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

        if (!this._renderPass) {
            this.destroy();
            return false;
        }

        /*
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

        if(!this._colorTex) {
            this.destroy();
            return false;
        }

        this._colorTexView = this._device.createTextureView({
            texture : this._colorTex,
            type : GFXTextureViewType.TV2D,
            format : this._colorFmt,
            baseLevel : 0,
            levelCount : 1,
            baseLayer : 0,
            layerCount : 1,
        });

        if(!this._colorTexView) {
            this.destroy();
            return false;
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

        if(!this._depthStencilTex) {
            this.destroy();
            return false;
        }

        this._depthStencilTexView = this._device.createTextureView({
            texture : this._depthStencilTex,
            type : GFXTextureViewType.TV2D,
            format : this._depthStencilFmt,
            baseLevel : 0,
            levelCount : 1,
            baseLayer : 0,
            layerCount : 1,
        });

        if(!this._depthStencilTexView) {
            this.destroy();
            return false;
        }
        */

        this._framebuffer = this._device.createFramebuffer({
            renderPass: this._renderPass,
            // colorViews: [this._colorTexView],
            // depthStencilView: this._depthStencilTexView,
            isOffscreen: false,
        });

        if (!this._framebuffer) {
            this.destroy();
            return false;
        }
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        /*
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
        */

        if (this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
        }

        if (this._renderPass) {
            this._renderPass.destroy();
            this._renderPass = null;
        }

        this._status = GFXStatus.UNREADY;
    }

    public resize (width: number, height: number) {
    }

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

}
