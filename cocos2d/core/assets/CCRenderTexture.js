const renderer = require('../renderer');
const renderEngine = require('../renderer/render-engine');
const Texture2D = require('./CCTexture2D');

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
     * @method initWithSize
     */
    initWithSize (width, height) {
        this.width = Math.floor(width || cc.visibleRect.width);
        this.height = Math.floor(height || cc.visibleRect.height);

        let opts = Texture2D._getSharedOptions();
        opts.format = this._format;
        opts.width = width;
        opts.height = height;
        opts.images = undefined;
        opts.wrapS = this._wrapS;
        opts.wrapT = this._wrapT;

        if (!this._texture) {
            this._texture = new renderer.Texture2D(renderer.device, opts);
        }
        else {
            this._texture.update(opts);
        }

        opts = {
            colors: [ this._texture ]
        };
        this._framebuffer = new renderEngine.gfx.FrameBuffer(renderer.device, width, height, opts);

        this.loaded = true;
        this.emit("load");
    },

    /**
     * !#en
     * Get pixels from render texture
     * !#zh
     * 从 render texture 读取像素数据
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

        let gl = renderer._forward._device._gl;
        let oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer._glID);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture._glID, 0);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.bindFramebuffer(gl.FRAMEBUFFER, oldFBO);

        return data;
    }
});

cc.RenderTexture = module.exports = RenderTexture;
