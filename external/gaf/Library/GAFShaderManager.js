
gaf._glShaderInit = function() {
    gaf._Uniforms = {
        ColorTransformMult: -1,
        ColorTransformOffset: -1,
        ColorMatrixBody: -1,
        ColorMatrixAppendix: -1,
        BlurTexelOffset: -1,
        GlowTexelOffset: -1,
        GlowColor: -1
    };

    gaf._shaderCreate = function (fs, vs) {
        var program = new cc.GLProgram();
        var result = program.initWithVertexShaderByteArray(vs, fs);
        cc.assert(result, "Shader init error");
        program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        result = program.link();
        cc.assert(result, "Shader linking error");
        program.updateUniforms();
        return program;
    };

    gaf._shaderCreateAlpha = function () {
        var program = gaf._shaderCreate(gaf.SHADER_COLOR_MATRIX_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
        gaf._Uniforms.ColorTransformMult = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_TINT_MULT);
        gaf._Uniforms.ColorTransformOffset = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_TINT_OFFSET);
        gaf._Uniforms.ColorMatrixBody = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_COLOR_MATRIX_BODY);
        gaf._Uniforms.ColorMatrixAppendix = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_COLOR_MATRIX_APPENDIX);
        return program;
    };

    gaf._shaderCreateBlur = function () {
        var program = gaf._shaderCreate(gaf.SHADER_GAUSSIAN_BLUR_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
        gaf._Uniforms.BlurTexelOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_BLUR_TEXEL_OFFSET);

        return program;
    };

    gaf._shaderCreateGlow = function () {
        var program = gaf._shaderCreate(gaf.SHADER_GLOW_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
        gaf._Uniforms.GlowTexelOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_GLOW_TEXEL_OFFSET);
        gaf._Uniforms.GlowColor = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_GLOW_COLOR);
        return program;
    };

    gaf._Shaders = {
        Alpha: gaf._shaderCreateAlpha(),
        Blur: gaf._shaderCreateBlur(),
        Glow: gaf._shaderCreateGlow()
    };
};

gaf._setupShaders = function() {
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        gaf._glShaderInit();
    }
    else {
        delete gaf._glShaderInit;
    }
};
