// Packed normalized depth
// Ortho: simple Z
// Persp: linear distance

cc3d.programlib.depthrgba = {
    generateKey: function (device, options) {
        var key = "depthrgba";
        if (options.skin) key += "_skin";
        if (options.opacityMap) key += "_opam" + options.opacityChannel;
        if (options.point) key += "_pnt";
        if (options.instancing) key += "_inst";
        key += "_" + options.shadowType;
        return key;
    },

    createShaderDefinition: function (device, options) {
        /////////////////////////
        // GENERATE ATTRIBUTES //
        /////////////////////////
        var attributes = {
            vertex_position: cc3d.SEMANTIC_POSITION
        };
        if (options.skin) {
            attributes.vertex_boneWeights = cc3d.SEMANTIC_BLENDWEIGHT;
            attributes.vertex_boneIndices = cc3d.SEMANTIC_BLENDINDICES;
        }
        if (options.opacityMap) {
            attributes.vertex_texCoord0 = cc3d.SEMANTIC_TEXCOORD0;
        }

        ////////////////////////////
        // GENERATE VERTEX SHADER //
        ////////////////////////////
        var chunks = cc3d.shaderChunks;
        var code = '';

        // VERTEX SHADER DECLARATIONS
        code += chunks.transformDeclVS;

        if (options.skin) {
            code += cc3d.programlib.skinCode(device);
            code += chunks.transformSkinnedVS;
        } else if (options.instancing) {
            attributes.instance_line1 = cc3d.SEMANTIC_TEXCOORD2;
            attributes.instance_line2 = cc3d.SEMANTIC_TEXCOORD3;
            attributes.instance_line3 = cc3d.SEMANTIC_TEXCOORD4;
            attributes.instance_line4 = cc3d.SEMANTIC_TEXCOORD5;
            code += chunks.instancingVS;
            code += chunks.transformInstancedVS;
        } else {
            code += chunks.transformVS;
        }

        if (options.opacityMap) {
            code += "attribute vec2 vertex_texCoord0;\n\n";
            code += 'varying vec2 vUv0;\n\n';
        }

        if (options.point) {
            code += 'varying vec3 worldPos;\n\n';
        }

        // VERTEX SHADER BODY
        code += cc3d.programlib.begin();

        code += "   gl_Position = getPosition();\n";

        if (options.opacityMap) {
            code += '    vUv0 = vertex_texCoord0;\n';
        }

        if (options.point) {
            code += '    worldPos = dPositionW;\n';
        }

        code += cc3d.programlib.end();

        var vshader = code;

        //////////////////////////////
        // GENERATE FRAGMENT SHADER //
        //////////////////////////////
        code = cc3d.programlib.precisionCode(device);

        if (options.shadowType === cc3d.SHADOW_VSM32) {
            if (device.extTextureFloatHighPrecision) {
                code += '#define VSM_EXPONENT 15.0\n\n';
            } else {
                code += '#define VSM_EXPONENT 5.54\n\n';
            }
        } else if (options.shadowType === cc3d.SHADOW_VSM16) {
            code += '#define VSM_EXPONENT 5.54\n\n';
        }

        if (options.opacityMap) {
            code += 'varying vec2 vUv0;\n\n';
            code += 'uniform sampler2D texture_opacityMap;\n\n';
            code += chunks.alphaTestPS;
        }

        if (options.point) {
            code += 'varying vec3 worldPos;\n\n';
            code += 'uniform vec3 view_position;\n\n';
            code += 'uniform float light_radius;\n\n';
        }

        if (options.shadowType === cc3d.SHADOW_DEPTH) {
            code += chunks.packDepthPS;
        } else if (options.shadowType === cc3d.SHADOW_VSM8) {
            code += "vec2 encodeFloatRG( float v ) {\n\
                     vec2 enc = vec2(1.0, 255.0) * v;\n\
                     enc = fract(enc);\n\
                     enc -= enc.yy * vec2(1.0/255.0, 1.0/255.0);\n\
                     return enc;\n\
                    }\n";
        }

        // FRAGMENT SHADER BODY
        code += cc3d.programlib.begin();

        if (options.opacityMap) {
            code += '    alphaTest( texture2D(texture_opacityMap, vUv0).' + options.opacityChannel + ' );\n\n';
        }

        if (options.point) {
            code += "   float depth = min(distance(view_position, worldPos) / light_radius, 0.99999);\n"
        } else {
            code += "   float depth = gl_FragCoord.z;\n"
        }

        if (options.shadowType === cc3d.SHADOW_DEPTH) {
            code += "   gl_FragData[0] = packFloat(depth);\n";
        } else if (options.shadowType === cc3d.SHADOW_VSM8) {
            code += "   gl_FragColor = vec4(encodeFloatRG(depth), encodeFloatRG(depth*depth));\n";
        } else {
            code += chunks.storeEVSMPS;
        }

        code += cc3d.programlib.end();

        var fshader = code;

        return {
            attributes: attributes,
            vshader: vshader,
            fshader: fshader
        };
    }
};
