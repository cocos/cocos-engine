cc3d.extend(cc3d, function () {

    // Primitive for drawFullscreenQuad
    var primitive = {
        type: cc3d.PRIMITIVE_TRISTRIP,
        base: 0,
        count: 4,
        indexed: false
    };

    /**
     * @name cc3d.PostEffect
     * @class Base class for all post effects. Post effects take a a render target as input
     * apply effects to it and then render the result to an output render target or the screen
     * if no output is specified.
     * @description Creates new PostEffect
     * @param {cc3d.GraphicsDevice} graphicsDevice The graphics device of the application
     */
    var PostEffect = function (graphicsDevice) {
        this.device = graphicsDevice;
        this.shader = null;
        this.depthMap = null;
        this.vertexBuffer = cc3d.createFullscreenQuad(graphicsDevice);
        this.needsDepthBuffer = false;
    };

    PostEffect.prototype = {
        /**
         * @function
         * @name cc3d.PostEffect#render
         * @description Render the post effect using the specified inputTarget
         * to the specified outputTarget.
         * @param {cc3d.RenderTarget} inputTarget The input render target
         * @param {cc3d.RenderTarget} outputTarget The output render target. If null then this will be the screen.
         * @param {cc.Vec4} rect (Optional) The rect of the current camera. If not specified then it will default to [0,0,1,1]
         */
        render: function (inputTarget, outputTarget, rect) {
        }
    };

    function createFullscreenQuad(device) {
        // Create the vertex format
        var vertexFormat = new cc3d.VertexFormat(device, [
            {semantic: cc3d.SEMANTIC_POSITION, components: 2, type: cc3d.ELEMENTTYPE_FLOAT32}
        ]);

        // Create a vertex buffer
        var vertexBuffer = new cc3d.VertexBuffer(device, vertexFormat, 4);

        // Fill the vertex buffer
        var iterator = new cc3d.VertexIterator(vertexBuffer);
        iterator.element[cc3d.SEMANTIC_POSITION].set(-1.0, -1.0);
        iterator.next();
        iterator.element[cc3d.SEMANTIC_POSITION].set(1.0, -1.0);
        iterator.next();
        iterator.element[cc3d.SEMANTIC_POSITION].set(-1.0, 1.0);
        iterator.next();
        iterator.element[cc3d.SEMANTIC_POSITION].set(1.0, 1.0);
        iterator.end();

        return vertexBuffer;
    }

    function drawFullscreenQuad(device, target, vertexBuffer, shader, rect) {
        device.setRenderTarget(target);
        device.updateBegin();
        var w = (target !== null) ? target.width : device.width;
        var h = (target !== null) ? target.height : device.height;
        var x = 0;
        var y = 0;

        if (rect) {
            x = rect.x * w;
            y = rect.y * h;
            w *= rect.z;
            h *= rect.w;
        }

        device.setViewport(x, y, w, h);
        device.setScissor(x, y, w, h);

        var oldBlending = device.getBlending();
        var oldDepthTest = device.getDepthTest();
        var oldDepthWrite = device.getDepthWrite();
        var oldCullMode = device.getCullMode();
        var oldWR = device.writeRed;
        var oldWG = device.writeGreen;
        var oldWB = device.writeBlue;
        var oldWA = device.writeAlpha;
        device.setBlending(false);
        device.setDepthTest(false);
        device.setDepthWrite(false);
        device.setCullMode(cc3d.CULLFACE_BACK);
        device.setColorWrite(true, true, true, true);
        device.setVertexBuffer(vertexBuffer, 0);
        device.setShader(shader);
        device.draw(primitive);
        device.setBlending(oldBlending);
        device.setDepthTest(oldDepthTest);
        device.setDepthWrite(oldDepthWrite);
        device.setCullMode(oldCullMode);
        device.setColorWrite(oldWR, oldWG, oldWB, oldWA);
        device.updateEnd();
    }

    return {
        PostEffect: PostEffect,
        createFullscreenQuad: createFullscreenQuad,
        drawFullscreenQuad: drawFullscreenQuad
    };
}());
