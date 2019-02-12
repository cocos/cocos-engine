import { GFXLoadOp, GFXStatus, GFXStoreOp, GFXTextureLayout } from '../define';
import { GFXDevice } from '../device';
import { GFXWindow, IGFXWindowInfo } from '../window';

export class WebGL2GFXWindow extends GFXWindow {

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
        this._width = width;
        this._height = height;
    }
}
