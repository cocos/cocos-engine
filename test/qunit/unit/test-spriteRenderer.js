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
        var quads = s9Sprite._quads;
        strictEqual(quads.length, 1, 'quads number[1] success');
        strictEqual(quads[0]._bl.vertices.x, 0, 'vertex-bl-x test success');
        strictEqual(quads[0]._bl.vertices.y, 0, 'vertex-bl-y test success');

        strictEqual(quads[0]._tr.vertices.x, contentSize.width, 'vertex-tr-x test success');
        strictEqual(quads[0]._tr.vertices.y, contentSize.height, 'vertex-tr-y test success');

        deepClose(quads[0]._bl.texCoords.u, 10 / 100, 0.0001, 'texCoords-bl-x test success');
        deepClose(quads[0]._bl.texCoords.v, 70 / 100, 0.0001, 'texCoords-bl-y test success');

        deepClose(quads[0]._tr.texCoords.u, 50 / 100, 0.0001, 'texCoords-tr-x test success');
        deepClose(quads[0]._tr.texCoords.v, 10 / 100, 0.0001, 'texCoords-tr-y test success');
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
        var quads = s9Sprite._quads;
        strictEqual(quads.length, 1, 'quads number[1] success');
        strictEqual(quads[0]._bl.vertices.x, 10, 'vertex-bl-x test success');
        strictEqual(quads[0]._bl.vertices.y, 30, 'vertex-bl-y test success');

        strictEqual(quads[0]._tr.vertices.x, 50, 'vertex-tr-x test success');
        strictEqual(quads[0]._tr.vertices.y, 90, 'vertex-tr-y test success');

        deepClose(quads[0]._bl.texCoords.u, 10 / 100, 0.0001, 'texCoords-bl-x test success');
        deepClose(quads[0]._bl.texCoords.v, 70 / 100, 0.0001, 'texCoords-bl-y test success');

        deepClose(quads[0]._tr.texCoords.u, 50 / 100, 0.0001, 'texCoords-tr-x test success');
        deepClose(quads[0]._tr.texCoords.v, 10 / 100, 0.0001, 'texCoords-tr-y test success');
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
        var quads = s9Sprite._quads;
        strictEqual(quads.length, 9, 'quads number[9] success');
        strictEqual(quads[0]._bl.vertices.x, 0, 'x0 test success');
        strictEqual(quads[0]._bl.vertices.y, 0, 'y0 test success');

        strictEqual(quads[4]._bl.vertices.x, 5, 'x1 test success');
        strictEqual(quads[4]._bl.vertices.y, 7, 'y1 test success');

        strictEqual(quads[8]._bl.vertices.x, 94, 'x2 test success');
        strictEqual(quads[8]._bl.vertices.y, 92, 'y2 test success');

        strictEqual(quads[8]._tr.vertices.x, 100, 'x3 test success');
        strictEqual(quads[8]._tr.vertices.y, 100, 'y3 test success');

        deepClose(quads[0]._bl.texCoords.u, 10 / 100, 0.0001, 'u0 test success');
        deepClose(quads[0]._bl.texCoords.v, 70 / 100, 0.0001, 'v0 test success');

        deepClose(quads[4]._bl.texCoords.u, 15 / 100, 0.0001, 'u1 test success');
        deepClose(quads[4]._bl.texCoords.v, 63 / 100, 0.0001, 'v1 test success');

        deepClose(quads[8]._bl.texCoords.u, 44 / 100, 0.0001, 'u2 test success');
        deepClose(quads[8]._bl.texCoords.v, 18 / 100, 0.0001, 'v2 test success');

        deepClose(quads[8]._tr.texCoords.u, 50 / 100, 0.0001, 'u3 test success');
        deepClose(quads[8]._tr.texCoords.v, 10 / 100, 0.0001, 'v3 test success');
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
        var quads = s9Sprite._quads;
        strictEqual(quads.length, 6, 'quads number[6] success');
        strictEqual(quads[0]._bl.vertices.x, 0, 'x0 test success');
        strictEqual(quads[2]._bl.vertices.x, 40, 'x1 test success');
        strictEqual(quads[4]._bl.vertices.x, 80, 'x2 test success');
        strictEqual(quads[4]._tr.vertices.x, 100, 'x3 test success');

        strictEqual(quads[0]._bl.vertices.y, 0, 'y0 test success');
        strictEqual(quads[5]._bl.vertices.y, 60, 'y1 test success');
        strictEqual(quads[5]._tr.vertices.y, 100, 'y2 test success');

        strictEqual(quads[2]._bl.vertices.x, 40, 'x1 test success');
        strictEqual(quads[2]._bl.vertices.x, 40, 'x1 test success');
        strictEqual(quads[2]._bl.vertices.x, 40, 'x1 test success');
        strictEqual(quads[2]._bl.vertices.x, 40, 'x1 test success');
        //
        deepClose(quads[2]._bl.texCoords.u, 10 / 100, 0.0001, 'full quad u0 test success');
        deepClose(quads[2]._bl.texCoords.v, 70 / 100, 0.0001, 'full quad v0 test success');

        deepClose(quads[2]._tr.texCoords.u, 50 / 100, 0.0001, 'full quad u1 test success');
        deepClose(quads[2]._tr.texCoords.v, 10 / 100, 0.0001, 'full quad v1 test success');

        deepClose(quads[5]._bl.texCoords.u, 10 / 100, 0.0001, 'part quad u0 test success');
        deepClose(quads[5]._bl.texCoords.v, 70 / 100, 0.0001, 'part quad v0 test success');

        deepClose(quads[5]._tr.texCoords.u, 30 / 100, 0.0001, 'part quad u1 test success');
        deepClose(quads[5]._tr.texCoords.v, 30 / 100, 0.0001, 'part quad v1 test success');
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
        var quads = s9Sprite._quads;
        strictEqual(quads.length, 1, 'quads number[1] success');
        strictEqual(quads[0]._bl.vertices.x, 10, 'vertex-bl-x test success');
        strictEqual(quads[0]._bl.vertices.y, 0, 'vertex-bl-y test success');

        strictEqual(quads[0]._tr.vertices.x, 40, 'vertex-tr-x test success');
        strictEqual(quads[0]._tr.vertices.y, 100, 'vertex-tr-y test success');

        deepClose(quads[0]._bl.texCoords.u, 14 / 100, 0.0001, 'texCoords-bl-x test success');
        deepClose(quads[0]._bl.texCoords.v, 70 / 100, 0.0001, 'texCoords-bl-y test success');

        deepClose(quads[0]._tr.texCoords.u, 26 / 100, 0.0001, 'texCoords-tr-x test success');
        deepClose(quads[0]._tr.texCoords.v, 10 / 100, 0.0001, 'texCoords-tr-y test success');

        s9Sprite.setFillStart(0.3);
        s9Sprite.setFillRange(-0.4);
        s9Sprite._rebuildQuads();
        quads = s9Sprite._quads;
        strictEqual(quads.length, 1, 'quads number[1] success');
        strictEqual(quads[0]._bl.vertices.x, 0, 'vertex-bl-x test success');
        strictEqual(quads[0]._bl.vertices.y, 0, 'vertex-bl-y test success');

        strictEqual(quads[0]._tr.vertices.x, 30, 'vertex-tr-x test success');
        strictEqual(quads[0]._tr.vertices.y, 100, 'vertex-tr-y test success');

        deepClose(quads[0]._bl.texCoords.u, 10 / 100, 0.0001, 'texCoords-bl-x test success');
        deepClose(quads[0]._bl.texCoords.v, 70 / 100, 0.0001, 'texCoords-bl-y test success');

        deepClose(quads[0]._tr.texCoords.u, 22 / 100, 0.0001, 'texCoords-tr-x test success');
        deepClose(quads[0]._tr.texCoords.v, 10 / 100, 0.0001, 'texCoords-tr-y test success');
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
        var quads = s9Sprite._quads;
        strictEqual(quads.length, 1, 'quads number[1] success');
        strictEqual(quads[0]._bl.vertices.x, 0, 'vertex-bl-x test success');
        strictEqual(quads[0]._bl.vertices.y, 10, 'vertex-bl-y test success');

        strictEqual(quads[0]._tr.vertices.x, 100, 'vertex-tr-x test success');
        strictEqual(quads[0]._tr.vertices.y, 40, 'vertex-tr-y test success');

        deepClose(quads[0]._bl.texCoords.u, 10 / 100, 0.0001, 'texCoords-bl-x test success');
        deepClose(quads[0]._bl.texCoords.v, 64 / 100, 0.0001, 'texCoords-bl-y test success');

        deepClose(quads[0]._tr.texCoords.u, 50 / 100, 0.0001, 'texCoords-tr-x test success');
        deepClose(quads[0]._tr.texCoords.v, 46 / 100, 0.0001, 'texCoords-tr-y test success');

        s9Sprite.setFillStart(0.3);
        s9Sprite.setFillRange(-0.4);
        s9Sprite._rebuildQuads();
        quads = s9Sprite._quads;
        strictEqual(quads.length, 1, 'quads number[1] success');
        strictEqual(quads[0]._bl.vertices.x, 0, 'vertex-bl-x test success');
        strictEqual(quads[0]._bl.vertices.y, 0, 'vertex-bl-y test success');

        strictEqual(quads[0]._tr.vertices.x, 100, 'vertex-tr-x test success');
        strictEqual(quads[0]._tr.vertices.y, 30, 'vertex-tr-y test success');

        deepClose(quads[0]._bl.texCoords.u, 10 / 100, 0.0001, 'texCoords-bl-x test success');
        deepClose(quads[0]._bl.texCoords.v, 70 / 100, 0.0001, 'texCoords-bl-y test success');

        deepClose(quads[0]._tr.texCoords.u, 50 / 100, 0.0001, 'texCoords-tr-x test success');
        deepClose(quads[0]._tr.texCoords.v, 52 / 100, 0.0001, 'texCoords-tr-y test success');
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
        var quads = s9Sprite._quads;
        strictEqual(s9Sprite._isTriangle, true, "Triangles used");
        strictEqual(quads.length, 2, 'triangles number[2] success');

        var center = cc.v2(50, 50);
        var p0 = cc.v2(100, 50);
        var p1 = cc.v2(100, 100);
        var p2 = cc.v2(50, 100);

        deepClose(quads[1]._tl.vertices.x, center.x, 0.0001, 'center test success');
        deepClose(quads[1]._tl.vertices.y, center.y, 0.0001, 'center test success');

        deepClose(quads[0]._bl.vertices.x, p0.x, 0.0001, 'p0 test success');
        deepClose(quads[0]._bl.vertices.y, p0.y, 0.0001, 'p0 test success');

        deepClose(quads[1]._bl.vertices.x, p1.x, 0.0001, 'p1 test success');
        deepClose(quads[1]._bl.vertices.y, p1.y, 0.0001, 'p1 test success');

        deepClose(quads[1]._tr.vertices.x, p2.x, 0.0001, 'p2 test success');
        deepClose(quads[1]._tr.vertices.y, p2.y, 0.0001, 'p2 test success');
    };
    if (spriteFrame.textureLoaded()) {
        testCallBack();
    } else {
        spriteFrame.once('load', testCallBack);
    }
});
