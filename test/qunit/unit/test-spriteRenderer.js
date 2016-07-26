largeModule('Sprite');

test('basic test', function () {
    var url = assetDir + '/button.png';

    var node = new cc.Node();
    cc.director.getScene().addChild(node);

    node.color = Color.RED;
    var render = node.addComponent(cc.Sprite);

    deepEqual(render._sgNode.color, Color.RED, 'color set success');

    var newSprite = new cc.SpriteFrame();
    var texture = cc.textureCache.addImage(url);
    newSprite.setTexture(texture);
    render.spriteFrame = newSprite;

    ok(true);
});

var generateSpriteFrame = function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    var spriteFrame = new cc.SpriteFrame();
    var rect = cc.rect(10, 10, 40, 60);
    var offset = cc.v2(-20, 10);
    var originalSize = cc.size(100, 100);
    spriteFrame.initWithTexture(texture, rect, false, offset, originalSize);

    return spriteFrame;
};

var spriteFrame = generateSpriteFrame();

test('simple spriteQuad trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.SIMPLE);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 8 && uvs.length >= 8, true, 'vertices have at least 8 floats');
        strictEqual(vertices[0], 0, 'vertex-bl-x test success');
        strictEqual(vertices[1], 0, 'vertex-bl-y test success');

        strictEqual(vertices[6], contentSize.width, 'vertex-tr-x test success');
        strictEqual(vertices[7], contentSize.height, 'vertex-tr-y test success');

        deepClose(uvs[0], 10 / 100, 0.01, 'texCoords-bl-x test success');
        deepClose(uvs[1], 70 / 100, 0.01, 'texCoords-bl-y test success');

        deepClose(uvs[6], 50 / 100, 0.01, 'texCoords-tr-x test success');
        deepClose(uvs[7], 10 / 100, 0.01, 'texCoords-tr-y test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});

test('simple spriteQuad no trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = false;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.SIMPLE);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 8 && uvs.length >= 8, true, 'vertices have at least 8 floats');
        strictEqual(vertices[0], 10, 'vertex-bl-x test success');
        strictEqual(vertices[1], 30, 'vertex-bl-y test success');

        strictEqual(vertices[6], 50, 'vertex-tr-x test success');
        strictEqual(vertices[7], 90, 'vertex-tr-y test success');

        deepClose(uvs[0], 10 / 100, 0.01, 'texCoords-bl-x test success');
        deepClose(uvs[1], 70 / 100, 0.01, 'texCoords-bl-y test success');

        deepClose(uvs[6], 50 / 100, 0.01, 'texCoords-tr-x test success');
        deepClose(uvs[7], 10 / 100, 0.01, 'texCoords-tr-y test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});

test('scale9 spriteQuad trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = false;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        //set border
        s9Sprite.setInsetLeft(5);
        s9Sprite.setInsetRight(6);
        s9Sprite.setInsetBottom(7);
        s9Sprite.setInsetTop(8);

        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.SLICED);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 32 && uvs.length >= 32, true, 'vertices have at least 32 floats');
        strictEqual(vertices[0], 0, 'x0 test success');
        strictEqual(vertices[1], 0, 'y0 test success');
        strictEqual(vertices[10], 5, 'x1 test success');
        strictEqual(vertices[11], 7, 'y1 test success');
        strictEqual(vertices[20], 94, 'x2 test success');
        strictEqual(vertices[21], 92, 'y2 test success');
        strictEqual(vertices[30], 100, 'x3 test success');
        strictEqual(vertices[31], 100, 'y3 test success');

        deepClose(uvs[0], 10 / 100, 0.01, 'u0 test success');
        deepClose(uvs[1], 70 / 100, 0.01, 'v0 test success');
        deepClose(uvs[10], 15 / 100, 0.01, 'u1 test success');
        deepClose(uvs[11], 63 / 100, 0.01, 'v1 test success');
        deepClose(uvs[20], 44 / 100, 0.01, 'u2 test success');
        deepClose(uvs[21], 18 / 100, 0.01, 'v2 test success');
        deepClose(uvs[30], 50 / 100, 0.01, 'u3 test success');
        deepClose(uvs[31], 10 / 100, 0.01, 'v3 test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});

test('tiled spriteQuad trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.TILED);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 48, true, 'vertices have at least 48 floats');
        strictEqual(vertices[0], 0, 'x0 test success');
        strictEqual(vertices[8], 40, 'x1 test success');
        strictEqual(vertices[16], 80, 'x2 test success');
        strictEqual(vertices[18], 100, 'x3 test success');

        strictEqual(vertices[1], 0, 'y0 test success');
        strictEqual(vertices[41], 60, 'y1 test success');
        strictEqual(vertices[47], 100, 'y2 test success');
        //
        deepClose(uvs[8], 10 / 100, 0.01, 'full quad u0 test success');
        deepClose(uvs[9], 70 / 100, 0.01, 'full quad v0 test success');
        deepClose(uvs[14], 50 / 100, 0.01, 'full quad u1 test success');
        deepClose(uvs[15], 10 / 100, 0.01, 'full quad v1 test success');
        deepClose(uvs[40], 10 / 100, 0.01, 'part quad u0 test success');
        deepClose(uvs[41], 70 / 100, 0.01, 'part quad v0 test success');
        deepClose(uvs[46], 30 / 100, 0.01, 'part quad u1 test success');
        deepClose(uvs[47], 30 / 100, 0.01, 'part quad v1 test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }

});

test('filled-bar-horizontal spriteQuad trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.FILLED);
        s9Sprite.setFillType(cc.Scale9Sprite.FillType.HORIZONTAL);
        s9Sprite.setFillStart(0.1);
        s9Sprite.setFillRange(0.3);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 8 && uvs.length >= 8, true, 'vertices have at least 8 floats');
        strictEqual(vertices[0], 10, 'vertex-bl-x test success');
        strictEqual(vertices[1], 0, 'vertex-bl-y test success');
        strictEqual(vertices[6], 40, 'vertex-tr-x test success');
        strictEqual(vertices[7], 100, 'vertex-tr-y test success');

        deepClose(uvs[0], 14 / 100, 0.01, 'texCoords-bl-x test success');
        deepClose(uvs[1], 70 / 100, 0.01, 'texCoords-bl-y test success');
        deepClose(uvs[6], 26 / 100, 0.01, 'texCoords-tr-x test success');
        deepClose(uvs[7], 10 / 100, 0.01, 'texCoords-tr-y test success');

        s9Sprite.setFillStart(0.3);
        s9Sprite.setFillRange(-0.4);
        s9Sprite._rebuildQuads();
        vertices = s9Sprite._vertices;
        uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 8 && uvs.length >= 8, true, 'vertices have at least 8 floats');
        strictEqual(vertices[0], 0, 'vertex-bl-x test success');
        strictEqual(vertices[1], 0, 'vertex-bl-y test success');
        strictEqual(vertices[6], 30, 'vertex-tr-x test success');
        strictEqual(vertices[7], 100, 'vertex-tr-y test success');

        deepClose(uvs[0], 10 / 100, 0.01, 'texCoords-bl-x test success');
        deepClose(uvs[1], 70 / 100, 0.01, 'texCoords-bl-y test success');
        deepClose(uvs[6], 22 / 100, 0.01, 'texCoords-tr-x test success');
        deepClose(uvs[7], 10 / 100, 0.01, 'texCoords-tr-y test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});

test('filled-bar-vertical spriteQuad trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.FILLED);
        s9Sprite.setFillType(cc.Scale9Sprite.FillType.VERTICAL);
        s9Sprite.setFillStart(0.1);
        s9Sprite.setFillRange(0.3);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 8 && uvs.length >= 8, true, 'vertices have at least 8 floats');
        strictEqual(vertices[0], 0, 'vertex-bl-x test success');
        strictEqual(vertices[1], 10, 'vertex-bl-y test success');
        strictEqual(vertices[6], 100, 'vertex-tr-x test success');
        strictEqual(vertices[7], 40, 'vertex-tr-y test success');

        deepClose(uvs[0], 10 / 100, 0.01, 'texCoords-bl-x test success');
        deepClose(uvs[1], 64 / 100, 0.01, 'texCoords-bl-y test success');
        deepClose(uvs[6], 50 / 100, 0.01, 'texCoords-tr-x test success');
        deepClose(uvs[7], 46 / 100, 0.01, 'texCoords-tr-y test success');

        s9Sprite.setFillStart(0.3);
        s9Sprite.setFillRange(-0.4);
        s9Sprite._rebuildQuads();
        vertices = s9Sprite._vertices;
        uvs = s9Sprite._uvs;
        strictEqual(vertices.length >= 8 && uvs.length >= 8, true, 'vertices have at least 8 floats');
        strictEqual(vertices[0], 0, 'vertex-bl-x test success');
        strictEqual(vertices[1], 0, 'vertex-bl-y test success');
        strictEqual(vertices[6], 100, 'vertex-tr-x test success');
        strictEqual(vertices[7], 30, 'vertex-tr-y test success');

        deepClose(uvs[0], 10 / 100, 0.01, 'texCoords-bl-x test success');
        deepClose(uvs[1], 70 / 100, 0.01, 'texCoords-bl-y test success');
        deepClose(uvs[6], 50 / 100, 0.01, 'texCoords-tr-x test success');
        deepClose(uvs[7], 52 / 100, 0.01, 'texCoords-tr-y test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});

test('filled-bar-radial spriteQuad trimmed', function () {
    var testCallBack = function () {
        var contentSize = cc.size(100, 100);
        var color = cc.color(255, 128, 0, 255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.FILLED);
        s9Sprite.setFillType(cc.Scale9Sprite.FillType.RADIAL);
        s9Sprite.setFillCenter(0.5, 0.5);
        s9Sprite.setFillStart(0.0);
        s9Sprite.setFillRange(1 / 4);
        s9Sprite._rebuildQuads();
        var vertices = s9Sprite._vertices;
        var uvs = s9Sprite._uvs;
        strictEqual(s9Sprite._isTriangle, true, "Triangles used");
        strictEqual(vertices.length >= 30 && uvs.length >= 30, true, 'vertices have at least 30 floats');

        var center = cc.v2(50, 50);
        var p0 = cc.v2(100, 50);
        var p1 = cc.v2(100, 100);
        var p2 = cc.v2(50, 100);

        deepClose(vertices[6], center.x, 0.01, 'center test success');
        deepClose(vertices[7], center.y, 0.01, 'center test success');
        deepClose(vertices[2], p0.x, 0.01, 'p0 test success');
        deepClose(vertices[3], p0.y, 0.01, 'p0 test success');
        deepClose(vertices[8], p1.x, 0.01, 'p1 test success');
        deepClose(vertices[9], p1.y, 0.01, 'p1 test success');
        deepClose(vertices[10], p2.x, 0.01, 'p2 test success');
        deepClose(vertices[11], p2.y, 0.01, 'p2 test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});
