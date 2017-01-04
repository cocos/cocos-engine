cc3d.extend(cc3d, (function () {
    'use strict';

    var shaderChunks = {};
    var shaderCache = {};

    var attrib2Semantic = {};
    attrib2Semantic["vertex_position"] = cc3d.SEMANTIC_POSITION;
    attrib2Semantic["vertex_normal"] = cc3d.SEMANTIC_NORMAL;
    attrib2Semantic["vertex_tangent"] = cc3d.SEMANTIC_TANGENT;
    attrib2Semantic["vertex_texCoord0"] = cc3d.SEMANTIC_TEXCOORD0;
    attrib2Semantic["vertex_texCoord1"] = cc3d.SEMANTIC_TEXCOORD1;
    attrib2Semantic["vertex_color"] = cc3d.SEMANTIC_COLOR;

    shaderChunks.collectAttribs = function (vsCode) {
        var attribs = {};
        var attrs = 0;

        var found = vsCode.indexOf("attribute");
        while (found >= 0) {
            var endOfLine = vsCode.indexOf(';', found);
            var startOfAttribName = vsCode.lastIndexOf(' ', endOfLine);
            var attribName = vsCode.substr(startOfAttribName + 1, endOfLine - (startOfAttribName + 1));

            var semantic = attrib2Semantic[attribName];
            if (semantic !== undefined) {
                attribs[attribName] = semantic;
            } else {
                attribs[attribName] = "ATTR" + attrs;
                attrs++;
            }

            found = vsCode.indexOf("attribute", found + 1);
        }
        return attribs;
    };


    shaderChunks.createShader = function (device, vsName, psName) {
        var vsCode = shaderChunks[vsName];
        var psCode = cc3d.programlib.precisionCode(device) + "\n" + shaderChunks[psName];
        var attribs = this.collectAttribs(vsCode);

        return new cc3d.Shader(device, {
            attributes: attribs,
            vshader: vsCode,
            fshader: psCode
        });
    };

    shaderChunks.createShaderFromCode = function (device, vsCode, psCode, uName) {
        var cached = shaderCache[uName];
        if (cached !== undefined) return cached;

        psCode = cc3d.programlib.precisionCode(device) + "\n" + psCode;
        var attribs = this.collectAttribs(vsCode);
        shaderCache[uName] = new cc3d.Shader(device, {
            attributes: attribs,
            vshader: vsCode,
            fshader: psCode
        });
        return shaderCache[uName];
    };

    shaderChunks.clearCache = function () {
        shaderCache = {};
    };

    return {
        shaderChunks: shaderChunks
    };
}()));
