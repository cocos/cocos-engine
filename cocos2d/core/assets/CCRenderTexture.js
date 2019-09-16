const renderer = require('../renderer');
const Texture2D = require('./CCTexture2D');

import gfx from '../../renderer/gfx';

/**
 * Render textures are textures that can be rendered to.
 * @class RenderTexture
 * @extends Texture2D
 */
let RenderTexture = cc.Class({
    name: 'cc.RenderTexture',
    extends: Texture2D,

    ctor () {
        this._framebuffer = null;
    },

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
    initWithSize (width, height, depthStencilFormat) {
        this.width = Math.floor(width || cc.visibleRect.width);
        this.height = Math.floor(height || cc.visibleRect.height);
        this._resetUnderlyingMipmaps();
        
        let opts = {
            colors: [ this._texture ],
        };

        if (this._depthStencilBuffer) this._depthStencilBuffer.destroy();
        let depthStencilBuffer;
        if (depthStencilFormat) {
            depthStencilBuffer = new gfx.RenderBuffer(renderer.device, depthStencilFormat, width, height);
            if (depthStencilFormat === gfx.RB_FMT_D24S8) {
                opts.depthStencil = depthStencilBuffer;
            }
            else if (depthStencilFormat === gfx.RB_FMT_S8) {
                opts.stencil = depthStencilBuffer;
            }
            else if (depthStencilFormat === gfx.RB_FMT_D16) {
                opts.depth = depthStencilBuffer;
            }
        }
        this._depthStencilBuffer = depthStencilBuffer;
        if (this._framebuffer) this._framebuffer.destroy();
        this._framebuffer = new gfx.FrameBuffer(renderer.device, width, height, opts);

        this._packable = false;
        
        this.loaded = true;
        this.emit("load");
    },

    updateSize(width, height) {
        this.width = Math.floor(width || cc.visibleRect.width);
        this.height = Math.floor(height || cc.visibleRect.height);
        this._resetUnderlyingMipmaps();

        let rbo = this._depthStencilBuffer;
        if (rbo) rbo.update(this.width, this.height);
        this._framebuffer._width = width;
        this._framebuffer._height = height;
    },

    /**
     * !#en Draw a texture to the specified position
     * !#zh 将指定的图片渲染到指定的位置上
     * @param {Texture2D} texture 
     * @param {Number} x 
     * @param {Number} y 
     */
    drawTextureAt (texture, x, y) {
        if (!texture._image) return;

        this._texture.updateSubImage({
            x, y,
            image: texture._image,
            width: texture.width,
            height: texture.height,
            level: 0,
            flipY: false,
            premultiplyAlpha: texture._premultiplyAlpha
        })
    },

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
    readPixels (data, x, y, w, h) {
        if (!this._framebuffer || !this._texture) return data;

        x = x || 0;
        y = y || 0;
        let width = w || this.width;
        let height = h || this.height
        data = data  || new Uint8Array(width * height * 4);

        let gl = cc.game._renderContext;
        let oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer._glID);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.bindFramebuffer(gl.FRAMEBUFFER, oldFBO);

        return data;
    },

    destroy () {
        this._super();
        if (this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
        }
    }
});

cc.RenderTexture = module.exports = RenderTexture;
