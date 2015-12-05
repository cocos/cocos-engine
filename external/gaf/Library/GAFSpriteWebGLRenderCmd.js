
(function(){
    gaf.Sprite.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
        this._defualtShader = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        this._customShader = gaf._Shaders.Alpha;

        //this._shaderProgram = this._defualtShader;

        this._tintMult = null;
        this._tintOffset = null;
        this._ctxMatrixBody = null;
        this._ctxMatrixAppendix = null;
    };

    var proto = gaf.Sprite.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    proto.constructor = gaf.Sprite.WebGLRenderCmd;

    proto._identityVec = [1.0, 1.0, 1.0, 1.0];
    proto._zeroVec = [0.0, 0.0, 0.0, 0.0];
    proto._identityMat = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    proto._disableCtx = function(){
        this.setShaderProgram(this._defualtShader);
    };

    proto._enableCtx = function(){
        this.setShaderProgram(this._customShader);
    };

    proto._applyCtxState = function(gafObject){
        var tintMult = gafObject._cascadeColorMult;
        this._tintMult = [
            tintMult.r / 255,
            tintMult.g / 255,
            tintMult.b / 255,
            tintMult.a / 255
        ];

        var tintOffset = gafObject._cascadeColorOffset;
        this._tintOffset = [
            tintOffset.r / 255,
            tintOffset.g / 255,
            tintOffset.b / 255,
            tintOffset.a / 255
        ];

        var filterStack = gafObject._filterStack;
        if(filterStack && filterStack.length > 0 && filterStack[0].type === gaf.EFFECT_COLOR_MATRIX)
        {
            var m = filterStack[0].colorMatrix;
            this._ctxMatrixBody = [
                m.rr, m.rg, m.rb, m.ra,
                m.gr, m.gg, m.gb, m.ga,
                m.br, m.bg, m.bb, m.ba,
                m.ar, m.ag, m.ab, m.aa
            ];
            this._ctxMatrixAppendix = [
                m.r / 255,
                m.g / 255,
                m.b / 255,
                m.a / 255
            ];
        }
        else
        {
            this._ctxMatrixBody = null;
            this._ctxMatrixAppendix = null;
        }
    };

    proto._setUniforms = function()
    {
        if(this._shaderProgram === this._customShader)
        {
            this._shaderProgram.use();
            {
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorTransformMult,
                    this._tintMult,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorTransformOffset,
                    this._tintOffset,
                    1
                );
            }

            if(this._ctxMatrixBody && this._ctxMatrixAppendix)
            {
                this._shaderProgram.setUniformLocationWithMatrix4fv(
                    gaf._Uniforms.ColorMatrixBody,
                    this._ctxMatrixBody,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorMatrixAppendix,
                    this._ctxMatrixAppendix,
                    1
                );
            }
            else
            {
                this._shaderProgram.setUniformLocationWithMatrix4fv(
                    gaf._Uniforms.ColorMatrixBody,
                    this._identityMat,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorMatrixAppendix,
                    this._zeroVec,
                    1
                );
            }
        }
    };

    proto.rendering = function(ctx)
    {
        this._setUniforms();

        // Super call
        cc.Sprite.WebGLRenderCmd.prototype.rendering.call(this, ctx);
    };

})();
