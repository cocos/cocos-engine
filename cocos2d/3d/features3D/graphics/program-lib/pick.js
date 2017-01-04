cc3d.programlib.pick = {
    generateKey: function (device, options) {
        var key = "pick";
        if (options.skin) key += "_skin";
        if (options.opacityMap) key += "_opam" + options.opacityChannel;
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
        } else {
            code += chunks.transformVS;
        }

        if (options.opacityMap) {
            code += "attribute vec2 vertex_texCoord0;\n\n";
            code += 'varying vec2 vUv0;\n\n';
        }

        // VERTEX SHADER BODY
        code += cc3d.programlib.begin();

        code += "   gl_Position = getPosition();\n";
        if (options.opacityMap) {
            code += '    vUv0 = vertex_texCoord0;\n';
        }

        code += cc3d.programlib.end();

        var vshader = code;

        //////////////////////////////
        // GENERATE FRAGMENT SHADER //
        //////////////////////////////
        code = cc3d.programlib.precisionCode(device);

        code += "uniform vec4 uColor;"

        if (options.opacityMap) {
            code += 'varying vec2 vUv0;\n\n';
            code += 'uniform sampler2D texture_opacityMap;\n\n';
            code += chunks.alphaTestPS;
        }

        // FRAGMENT SHADER BODY
        code += cc3d.programlib.begin();

        if (options.opacityMap) {
            code += '    alphaTest( texture2D(texture_opacityMap, vUv0).' + options.opacityChannel + ' );\n\n';
        }
        code += '    gl_FragColor = uColor;\n';

        code += cc3d.programlib.end();

        var fshader = code;

        return {
            attributes: attributes,
            vshader: vshader,
            fshader: fshader
        };
    }
};
