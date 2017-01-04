cc3d.extend(cc3d, (function () {
    'use strict';

    var dpMult = 2.0;

    function paraboloidFromCubemap(device, sourceCubemap, fixSeamsAmount, dontFlipX) {
        var chunks = cc3d.shaderChunks;
        var shader = chunks.createShaderFromCode(device, chunks.fullscreenQuadVS,
            (sourceCubemap.fixCubemapSeams ? chunks.fixCubemapSeamsStretchPS : chunks.fixCubemapSeamsNonePS) + chunks.genParaboloidPS, "genParaboloid");
        var constantTexSource = device.scope.resolve("source");
        var constantParams = device.scope.resolve("params");
        var params = new cc.Vec4();
        var size = sourceCubemap.width;
        var rgbmSource = sourceCubemap.rgbm;
        var format = sourceCubemap.format;

        size = Math.max(size, 8) * dpMult;

        var tex = new cc3d.gfx.Texture(device, {
            rgbm: rgbmSource,
            format: format,
            width: size * 2,
            height: size,
            autoMipmap: false
        });
        tex.minFilter = cc3d.FILTER_LINEAR;
        tex.magFilter = cc3d.FILTER_LINEAR;
        tex.addressU = cc3d.ADDRESS_CLAMP_TO_EDGE;
        tex.addressV = cc3d.ADDRESS_CLAMP_TO_EDGE;

        var targ = new cc3d.RenderTarget(device, tex, {
            depth: false
        });

        params.x = fixSeamsAmount;
        params.y = dontFlipX ? -1.0 : 1.0;
        constantTexSource.setValue(sourceCubemap);
        constantParams.setValue(params.data);
        cc3d.drawQuadWithShader(device, targ, shader);

        return tex;
    }

    function getDpAtlasRect(rect, mip) {

        rect.x = cc3d.math.clamp(mip - 2.0, 0, 1) * 0.5;

        var t = mip - rect.x * 6.0;
        var i = 1.0 - rect.x;
        rect.y = Math.min(t * 0.5, 0.75) * i + rect.x;

        rect.z = (1.0 - cc3d.math.clamp(t, 0, 1) * 0.5) * i;
        rect.w = rect.z * 0.5;

        return 1.0 / rect.z;
    }

    function generateDpAtlas(device, sixCubemaps, dontFlipX) {
        var dp, rect;
        rect = new cc.Vec4();
        var params = new cc.Vec4();
        var size = sixCubemaps[0].width * 2 * dpMult;

        var chunks = cc3d.shaderChunks;
        var shader = chunks.createShaderFromCode(device, chunks.fullscreenQuadVS, chunks.dpAtlasQuadPS, "dpAtlasQuad");
        var constantTexSource = device.scope.resolve("source");
        var constantParams = device.scope.resolve("params");

        var tex = new cc3d.gfx.Texture(device, {
            rgbm: sixCubemaps[0].rgbm,
            format: sixCubemaps[0].format,
            width: size,
            height: size,
            autoMipmap: false
        });
        tex.minFilter = cc3d.FILTER_LINEAR;
        tex.magFilter = cc3d.FILTER_LINEAR;
        tex.addressU = cc3d.ADDRESS_CLAMP_TO_EDGE;
        tex.addressV = cc3d.ADDRESS_CLAMP_TO_EDGE;
        var targ = new cc3d.RenderTarget(device, tex, {
            depth: false
        });

        var borderSize = 2; // 1 pixel from each side
        var mip0Width = size;
        var scaleFactor = (mip0Width + borderSize) / mip0Width - 1;
        var scaleAmount;
        for (var i = 0; i < 6; i++) {
            dp = cc3d.paraboloidFromCubemap(device, sixCubemaps[i], i, dontFlipX);
            constantTexSource.setValue(dp);
            scaleAmount = getDpAtlasRect(rect, i);
            params.x = scaleAmount * scaleFactor;
            params.y = params.x * 2;
            params.x += 1;
            params.y += 1;
            constantParams.setValue(params.data);
            rect.x *= size;
            rect.y *= size;
            rect.z *= size;
            rect.w *= size;
            cc3d.drawQuadWithShader(device, targ, shader, rect);
        }

        return tex;
    }

    return {
        paraboloidFromCubemap: paraboloidFromCubemap,
        generateDpAtlas: generateDpAtlas
    };
}()));

