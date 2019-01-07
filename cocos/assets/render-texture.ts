import { ccclass } from '../core/data/class-decorator';
import gfx from '../renderer/gfx';
import Texture2D from './texture-2d';

/**
 * Render textures are textures that can be rendered to.
 * @class RenderTexture
 * @extends Texture2D
 */
@ccclass('cc.RenderTexture')
export default class RenderTexture extends Texture2D {

    constructor () {
        super();
        this._framebuffer = null;
    }

    /**
     * !#en
     * Init the render texture with size.
     * !#zh
     * 初始化 render texture
     * @param {Number} [width]
     * @param {Number} [height]
     * @param {Number} [depthStencilFormat]
     * @method initWithSize
     */
    public initWithSize (width, height, depthStencilFormat) {
        this.width = Math.floor(width || cc.visibleRect.width);
        this.height = Math.floor(height || cc.visibleRect.height);
        this._resetUnderlyingMipmaps();

        const opts = {
            colors: [ this._texture ],
        };
        if (depthStencilFormat) {
            if (this.depthStencilBuffer) { this.depthStencilBuffer.destroy(); }
            const depthStencilBuffer = new gfx.RenderBuffer(cc.game._renderContext, depthStencilFormat, this.width, this.height);
            if (depthStencilFormat === gfx.RB_FMT_D24S8) {
                opts.depthStencil = depthStencilBuffer;
            } else if (depthStencilFormat === gfx.RB_FMT_S8) {
                opts.stencil = depthStencilBuffer;
            } else if (depthStencilFormat === gfx.RB_FMT_D16) {
                opts.depth = depthStencilBuffer;
            }
            this.depthStencilBuffer = depthStencilBuffer;
            this.depthStencilFormat = depthStencilFormat;
        }

        if (this._framebuffer) { this._framebuffer.destroy(); }
        this._framebuffer = new gfx.FrameBuffer(cc.game._renderContext, this.width, this.height, opts);

        this.loaded = true;
        this.emit('load');
    }

    public updateSize (width, height) {
        this.width = Math.floor(width || cc.visibleRect.width);
        this.height = Math.floor(height || cc.visibleRect.height);
        this._resetUnderlyingMipmaps();

        const rbo = this.depthStencilBuffer;
        if (rbo) { rbo.update(this.width, this.height); }
        this._framebuffer._width = width;
        this._framebuffer._height = height;
    }

    /**
     * !#en Draw a texture to the specified position
     * !#zh 将指定的图片渲染到指定的位置上
     * @param {Texture2D} texture
     * @param {Number} x
     * @param {Number} y
     */
    public drawTextureAt (texture, x, y) {
        if (!texture._image) { return; }

        this._texture.updateSubImage({
            x, y,
            image: texture._image,
            width: texture.width,
            height: texture.height,
            level: 0,
            flipY: false,
            premultiplyAlpha: texture._premultiplyAlpha,
        });
    }

    /**
     * !#en
     * Get pixels from render texture, the pixels data stores in a RGBA Uint8Array.
     * It will return a new (width * height * 4) length Uint8Array by default。
     * You can specify a data to store the pixels to reuse the data,
     * you and can specify other params to specify the texture region to read.
     * !#zh
     * 从 render texture 读取像素数据，数据类型为 RGBA 格式的 Uint8Array 数组。
     * 默认每次调用此函数会生成一个大小为 （长 x 高 x 4） 的 Uint8Array。
     * 你可以通过传入 data 来接收像素数据，也可以通过传参来指定需要读取的区域的像素。
     * @method readPixels
     * @param {Uint8Array} [data]
     * @param {Number} [x]
     * @param {Number} [y]
     * @param {Number} [w]
     * @param {Number} [h]
     * @return {Uint8Array}
     */
    public readPixels (data, x, y, w, h) {
        if (!this._framebuffer || !this._texture) { return data; }

        x = x || 0;
        y = y || 0;
        const width = w || this.width;
        const height = h || this.height;
        data = data  || new Uint8Array(width * height * 4);

        const gl = cc.game._renderContext._gl;
        const oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer._glID);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.bindFramebuffer(gl.FRAMEBUFFER, oldFBO);

        return data;
    }

    public destroy () {
        super.destroy();
        if (this._framebuffer) {
            this._framebuffer.destroy();
        }
    }
}

cc.RenderTexture = RenderTexture;
