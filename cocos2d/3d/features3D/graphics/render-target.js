cc3d.extend(cc3d, function () {
    'use strict';

    var defaultOptions = {
        depth: true,
        face: 0
    };

    /**
     * @name cc3d.RenderTarget
     * @class A render target is a rectangular rendering surface.
     * @description Creates a new render target.
     * @param {cc3d.GraphicsDevice} graphicsDevice The graphics device used to manage this frame buffer.
     * @param {cc3d.Texture} colorBuffer The texture that this render target will treat as a rendering surface.
     * @param {Object} options Object for passing optional arguments.
     * @param {Boolean} options.depth True if the render target is to include a depth buffer and false otherwise (default is true).
     * @param {Boolean} options.stencil True if the render target is to include a stencil buffer and false otherwise (default is false). Requires depth buffer.
     * Defaults to true.
     * @param {Number} options.face If the colorBuffer parameter is a cubemap, use this option to specify the
     * face of the cubemap to render to. Can be:
     * <ul>
     *     <li>cc3d.CUBEFACE_POSX</li>
     *     <li>cc3d.CUBEFACE_NEGX</li>
     *     <li>cc3d.CUBEFACE_POSY</li>
     *     <li>cc3d.CUBEFACE_NEGY</li>
     *     <li>cc3d.CUBEFACE_POSZ</li>
     *     <li>cc3d.CUBEFACE_NEGZ</li>
     * </ul>
     * Defaults to cc3d.CUBEFACE_POSX.
     * @example
     * // Create a 512x512x24-bit render target with a depth buffer
     * var colorBuffer = new cc3d.Texture(graphicsDevice, {
     *     width: 512,
     *     height: 512,
     *     format: cc3d.PIXELFORMAT_R8_G8_B8
     * });
     * var renderTarget = new cc3d.RenderTarget(graphicsDevice, colorBuffer, {
     *     depth: true
     * });
     *
     * // Set the render target on an entity's camera component
     * entity.camera.renderTarget = renderTarget;
     */
    var RenderTarget = function (graphicsDevice, colorBuffer, options) {
        this._device = graphicsDevice;
        this._colorBuffer = colorBuffer;

        // Process optional arguments
        options = (options !== undefined) ? options : defaultOptions;
        this._face = (options.face !== undefined) ? options.face : 0;
        this._depth = (options.depth !== undefined) ? options.depth : true;
        this._stencil = (options.stencil !== undefined) ? options.stencil : false;
    };

    RenderTarget.prototype = {
        /**
         * @function
         * @name cc3d.RenderTarget#destroy
         * @description Frees resources associated with this render target.
         */
        destroy: function () {
            var gl = this._device.gl;
            gl.deleteFramebuffer(this._frameBuffer);
            if (this._glDepthBuffer) {
                gl.deleteRenderbuffer(this._glDepthBuffer);
            }
        }
    };

    /**
     * @readonly
     * @name cc3d.RenderTarget#colorBuffer
     * @type cc3d.Texture
     * @description Color buffer set up on the render target.
     */
    Object.defineProperty(RenderTarget.prototype, 'colorBuffer', {
        get: function () {
            return this._colorBuffer;
        }
    });

    /**
     * @readonly
     * @name cc3d.RenderTarget#face
     * @type Number
     * @description If the render target is bound to a cubemap, this property
     * specifies which face of the cubemap is rendered to. Can be:
     * <ul>
     *     <li>cc3d.CUBEFACE_POSX</li>
     *     <li>cc3d.CUBEFACE_NEGX</li>
     *     <li>cc3d.CUBEFACE_POSY</li>
     *     <li>cc3d.CUBEFACE_NEGY</li>
     *     <li>cc3d.CUBEFACE_POSZ</li>
     *     <li>cc3d.CUBEFACE_NEGZ</li>
     * </ul>
     */
    Object.defineProperty(RenderTarget.prototype, 'face', {
        get: function () {
            return this._face;
        },
    });

    /**
     * @readonly
     * @name cc3d.RenderTarget#width
     * @type Number
     * @description Width of the render target in pixels.
     */
    Object.defineProperty(RenderTarget.prototype, 'width', {
        get: function () {
            return this._colorBuffer.width;
        }
    });

    /**
     * @readonly
     * @name cc3d.RenderTarget#height
     * @type Number
     * @description Height of the render target in pixels.
     */
    Object.defineProperty(RenderTarget.prototype, 'height', {
        get: function () {
            return this._colorBuffer.height;
        }
    });

    return {
        RenderTarget: RenderTarget
    };
}());
