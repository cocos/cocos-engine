import {
    GFXFormat,
    GFXLoadOp,
    GFXStoreOp,
    GFXTextureFlagBit,
    GFXTextureLayout,
    GFXTextureType,
    GFXTextureUsageBit,
    GFXStatus,
} from '../define';
import { GFXWindow, IGFXWindowInfo } from '../window';
import { GFXTexture } from '../../gfx/texture';

export class WebGLGFXWindow extends GFXWindow {

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

        if (info.isOffscreen !== undefined) {
            this._isOffscreen = info.isOffscreen;
        }

        this._width = info.width;
        this._height = info.height;
        this._nativeWidth = this._width;
        this._nativeHeight = this._height;
        this._colorFmt = info.colorFmt;
        this._depthStencilFmt = info.depthStencilFmt;

        this._renderPass = this._device.createRenderPass({
            colorAttachments: [{
                format: this._colorFmt,
                loadOp: GFXLoadOp.CLEAR,
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                endLayout: GFXTextureLayout.PRESENT_SRC,
            }],
            depthStencilAttachment: {
                format : this._depthStencilFmt,
                depthLoadOp : GFXLoadOp.CLEAR,
                depthStoreOp : GFXStoreOp.STORE,
                stencilLoadOp : GFXLoadOp.CLEAR,
                stencilStoreOp : GFXStoreOp.STORE,
                sampleCount : 1,
                beginLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                endLayout : GFXTextureLayout.PRESENT_SRC,
            },
        });

        const colorTextures: GFXTexture[] = [];

        if (this._isOffscreen) {
            if (this._colorFmt !== GFXFormat.UNKNOWN) {
                this._colorTex = this._device.createTexture({
                    type : GFXTextureType.TEX2D,
                    usage : GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                    format : this._colorFmt,
                    width : this._width,
                    height : this._height,
                    depth : 1,
                    arrayLayer : 1,
                    mipLevel : 1,
                    flags : GFXTextureFlagBit.NONE,
                });
                colorTextures.push(this._colorTex);
            }

            if (this._depthStencilFmt !== GFXFormat.UNKNOWN) {
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
            }
        }

        this._framebuffer = this._device.createFramebuffer({
            renderPass: this._renderPass,
            colorTextures,
            depthStencilTexture: this._depthStencilTex,
            isOffscreen: this._isOffscreen,
        });

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._depthStencilTex) {
            this._depthStencilTex.destroy();
            this._depthStencilTex = null;
        }

        if (this._colorTex) {
            this._colorTex.destroy();
            this._colorTex = null;
        }

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

        if (width > this._nativeWidth ||
            height > this._nativeHeight) {

            this._nativeWidth = width;
            this._nativeHeight = height;

            if (this._depthStencilTex) {
                this._depthStencilTex.resize(width, height);
            }

            if (this._colorTex) {
                this._colorTex.resize(width, height);
            }

            if (this._framebuffer && this._framebuffer.isOffscreen) {
                this._framebuffer.destroy();
                this._framebuffer.initialize({
                    renderPass: this._renderPass!,
                    colorTextures: [ this._colorTex! ],
                    depthStencilTexture: this._depthStencilTex!,
                });
            }
        }
    }
}
