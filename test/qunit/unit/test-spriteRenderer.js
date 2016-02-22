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

asyncTest('simple spriteQuad trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(100,100);
        var color = cc.color(255,128,0,255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.SIMPLE);
        s9Sprite._rebuildQuads();
        var quads = s9Sprite._quads;
        deepEqual(quads.length, 1, 'quads number[1] success');
        deepEqual(quads[0]._bl.vertices.x,0, 'vertex-bl-x test success');
        deepEqual(quads[0]._bl.vertices.y,0, 'vertex-bl-y test success');

        deepEqual(quads[0]._tr.vertices.x,contentSize.width, 'vertex-tr-x test success');
        deepEqual(quads[0]._tr.vertices.y,contentSize.height, 'vertex-tr-y test success');
        var u1 = quads[0]._bl.texCoords.u - rect.x/originalSize.width;
        var v1 = quads[0]._bl.texCoords.v - (rect.y + rect.height) / originalSize.height;
        var u2 = quads[0]._tr.texCoords.u - (rect.x + rect.width) / originalSize.width
        var v2 = quads[0]._tr.texCoords.v - rect.y / originalSize.height;
        var EPSILON = 0.00001;
        deepEqual(Math.abs(u1) < EPSILON, true, 'texCoords-bl-x test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'texCoords-bl-y test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'texCoords-tr-x test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'texCoords-tr-y test success');

        ok(true);
        start();
    },500);

});

asyncTest('simple spriteQuad no trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(originalSize);
        var color = cc.color(255,128,0,255);
        var isTrimmed = false;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.SIMPLE);
        s9Sprite._rebuildQuads();
        var quads = s9Sprite._quads;
        deepEqual(quads.length, 1, 'quads number[1] success');
        deepEqual(quads[0]._bl.vertices.x, rect.x, 'vertex-bl-x test success');
        deepEqual(quads[0]._bl.vertices.y, contentSize.height - rect.y - rect.height, 'vertex-bl-y test success');

        deepEqual(quads[0]._tr.vertices.x,contentSize.width - rect.x - rect.width, 'vertex-tr-x test success');
        deepEqual(quads[0]._tr.vertices.y,contentSize.height - rect.x, 'vertex-tr-y test success');
        var u1 = quads[0]._bl.texCoords.u - rect.x/originalSize.width;
        var v1 = quads[0]._bl.texCoords.v - (rect.y + rect.height) / originalSize.height;
        var u2 = quads[0]._tr.texCoords.u - (rect.x + rect.width) / originalSize.width
        var v2 = quads[0]._tr.texCoords.v - rect.y / originalSize.height;
        var EPSILON = 0.00001;
        deepEqual(Math.abs(u1) < EPSILON, true, 'texCoords-bl-x test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'texCoords-bl-y test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'texCoords-tr-x test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'texCoords-tr-y test success');

        ok(true);
        start();
    },500);

});

asyncTest('scale9 spriteQuad trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(originalSize);
        var color = cc.color(255,128,0,255);
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
        var EPSILON = 0.00001;
        deepEqual(quads.length, 9, 'quads number[9] success');
        deepEqual(quads[0]._bl.vertices.x, 0, 'x0 test success');
        deepEqual(quads[0]._bl.vertices.y, 0, 'y0 test success');

        deepEqual(quads[4]._bl.vertices.x, 5, 'x1 test success');
        deepEqual(quads[4]._bl.vertices.y, 7, 'y1 test success');

        deepEqual(quads[8]._bl.vertices.x, contentSize.width - 6, 'x2 test success');
        deepEqual(quads[8]._bl.vertices.y, contentSize.height - 8, 'y2 test success');

        deepEqual(quads[8]._tr.vertices.x, contentSize.width, 'x3 test success');
        deepEqual(quads[8]._tr.vertices.y, contentSize.height, 'y3 test success');

        var u0 = Math.abs(quads[0]._bl.texCoords.u - 10/100);
        var v0 = Math.abs(quads[0]._bl.texCoords.v - 70/100);

        var u1 = Math.abs(quads[4]._bl.texCoords.u - 15/100);
        var v1 = Math.abs(quads[4]._bl.texCoords.v - 63/100);

        var u2 = Math.abs(quads[8]._bl.texCoords.u - 44/100);
        var v2 = Math.abs(quads[8]._bl.texCoords.v - 18/100);

        var u3 = Math.abs(quads[8]._tr.texCoords.u - 50/100);
        var v3 = Math.abs(quads[8]._tr.texCoords.v - 10/100);

        deepEqual(Math.abs(u0) < EPSILON, true, 'u0 test success');
        deepEqual(Math.abs(v0) < EPSILON, true, 'v0 test success');

        deepEqual(Math.abs(u1) < EPSILON, true, 'u1 test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'v1 test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'u2 test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'v2 test success');

        deepEqual(Math.abs(u3) < EPSILON, true, 'u3 test success');
        deepEqual(Math.abs(v3) < EPSILON, true, 'v3 test success');

        ok(true);
        start();
    },500);

});

asyncTest('tiled spriteQuad trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(100,100);
        var color = cc.color(255,128,0,255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.TILED);
        s9Sprite._rebuildQuads();
        var quads = s9Sprite._quads;
        deepEqual(quads.length, 6, 'quads number[6] success');
        deepEqual(quads[0]._bl.vertices.x,0, 'x0 test success');
        deepEqual(quads[2]._bl.vertices.x,40, 'x1 test success');
        deepEqual(quads[4]._bl.vertices.x,80, 'x2 test success');
        deepEqual(quads[4]._tr.vertices.x,100, 'x3 test success');

        deepEqual(quads[0]._bl.vertices.y,0, 'y0 test success');
        deepEqual(quads[5]._bl.vertices.y,60, 'y1 test success');
        deepEqual(quads[5]._tr.vertices.y,100, 'y2 test success');
        var EPSILON = 0.00001;
        var fullu0 = Math.abs(quads[2]._bl.texCoords.u - 10/100);
        var fullv0 = Math.abs(quads[2]._bl.texCoords.v - 70/100);

        var fullu1 = Math.abs(quads[2]._tr.texCoords.u - 50/100);
        var fullv1 = Math.abs(quads[2]._tr.texCoords.v - 10/100);

        var partu0 = Math.abs(quads[5]._bl.texCoords.u - 10/100);
        var partv0 = Math.abs(quads[5]._bl.texCoords.v - 70/100);

        var partu1 = Math.abs(quads[5]._tr.texCoords.u - 30/100);
        var partv1 = Math.abs(quads[5]._tr.texCoords.v - 30/100);

        deepEqual(quads[2]._bl.vertices.x,40, 'x1 test success');
        deepEqual(quads[2]._bl.vertices.x,40, 'x1 test success');
        deepEqual(quads[2]._bl.vertices.x,40, 'x1 test success');
        deepEqual(quads[2]._bl.vertices.x,40, 'x1 test success');
        //
        deepEqual(Math.abs(fullu0) < EPSILON, true, 'full quad u0 test success');
        deepEqual(Math.abs(fullv0) < EPSILON, true, 'full quad v0 test success');

        deepEqual(Math.abs(fullu1) < EPSILON, true, 'full quad u1 test success');
        deepEqual(Math.abs(fullv1) < EPSILON, true, 'full quad v1 test success');

        deepEqual(Math.abs(partu0) < EPSILON, true, 'part quad u0 test success');
        deepEqual(Math.abs(partv0) < EPSILON, true, 'part quad v0 test success');

        deepEqual(Math.abs(partu1) < EPSILON, true, 'part quad u1 test success');
        deepEqual(Math.abs(partv1) < EPSILON, true, 'part quad v1 test success');

        ok(true);
        start();
    },500);

});

asyncTest('filled-bar-horizontal spriteQuad trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(100,100);
        var color = cc.color(255,128,0,255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.FILLED);
        s9Sprite.setFillType(cc.Scale9Sprite.FillType.Horizontal);
        s9Sprite.setFillStart(0.1);
        s9Sprite.setFillRange(0.3);
        s9Sprite._rebuildQuads();
        var quads = s9Sprite._quads;
        deepEqual(quads.length, 1, 'quads number[1] success');
        deepEqual(quads[0]._bl.vertices.x,10, 'vertex-bl-x test success');
        deepEqual(quads[0]._bl.vertices.y,0, 'vertex-bl-y test success');

        deepEqual(quads[0]._tr.vertices.x,40, 'vertex-tr-x test success');
        deepEqual(quads[0]._tr.vertices.y,100, 'vertex-tr-y test success');
        var u1 = quads[0]._bl.texCoords.u - 14/100;
        var v1 = quads[0]._bl.texCoords.v - 70/100;
        var u2 = quads[0]._tr.texCoords.u - 26/100;
        var v2 = quads[0]._tr.texCoords.v - 10/100;
        var EPSILON = 0.00001;
        deepEqual(Math.abs(u1) < EPSILON, true, 'texCoords-bl-x test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'texCoords-bl-y test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'texCoords-tr-x test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'texCoords-tr-y test success');
        ok(true);

        s9Sprite.setFillStart(0.3);
        s9Sprite.setFillRange(-0.4);
        s9Sprite._rebuildQuads();
        quads = s9Sprite._quads;
        deepEqual(quads.length, 1, 'quads number[1] success');
        deepEqual(quads[0]._bl.vertices.x,0, 'vertex-bl-x test success');
        deepEqual(quads[0]._bl.vertices.y,0, 'vertex-bl-y test success');

        deepEqual(quads[0]._tr.vertices.x,30, 'vertex-tr-x test success');
        deepEqual(quads[0]._tr.vertices.y,100, 'vertex-tr-y test success');
        var u1 = quads[0]._bl.texCoords.u - 10/100;
        var v1 = quads[0]._bl.texCoords.v - 70/100;
        var u2 = quads[0]._tr.texCoords.u - 22/100;
        var v2 = quads[0]._tr.texCoords.v - 10/100;
        var EPSILON = 0.00001;
        deepEqual(Math.abs(u1) < EPSILON, true, 'texCoords-bl-x test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'texCoords-bl-y test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'texCoords-tr-x test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'texCoords-tr-y test success');

        ok(true);
        start();
    },500);

});

asyncTest('filled-bar-vertical spriteQuad trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(100,100);
        var color = cc.color(255,128,0,255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.FILLED);
        s9Sprite.setFillType(cc.Scale9Sprite.FillType.Vertical);
        s9Sprite.setFillStart(0.1);
        s9Sprite.setFillRange(0.3);
        s9Sprite._rebuildQuads();
        var quads = s9Sprite._quads;
        deepEqual(quads.length, 1, 'quads number[1] success');
        deepEqual(quads[0]._bl.vertices.x,0, 'vertex-bl-x test success');
        deepEqual(quads[0]._bl.vertices.y,10, 'vertex-bl-y test success');

        deepEqual(quads[0]._tr.vertices.x,100, 'vertex-tr-x test success');
        deepEqual(quads[0]._tr.vertices.y,40, 'vertex-tr-y test success');
        var u1 = quads[0]._bl.texCoords.u - 10/100;
        var v1 = quads[0]._bl.texCoords.v - 64/100;
        var u2 = quads[0]._tr.texCoords.u - 50/100;
        var v2 = quads[0]._tr.texCoords.v - 46/100;
        var EPSILON = 0.00001;
        deepEqual(Math.abs(u1) < EPSILON, true, 'texCoords-bl-x test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'texCoords-bl-y test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'texCoords-tr-x test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'texCoords-tr-y test success');
        ok(true);

        s9Sprite.setFillStart(0.3);
        s9Sprite.setFillRange(-0.4);
        s9Sprite._rebuildQuads();
        quads = s9Sprite._quads;
        deepEqual(quads.length, 1, 'quads number[1] success');
        deepEqual(quads[0]._bl.vertices.x,0, 'vertex-bl-x test success');
        deepEqual(quads[0]._bl.vertices.y,0, 'vertex-bl-y test success');

        deepEqual(quads[0]._tr.vertices.x,100, 'vertex-tr-x test success');
        deepEqual(quads[0]._tr.vertices.y,30, 'vertex-tr-y test success');
        var u1 = quads[0]._bl.texCoords.u - 10/100;
        var v1 = quads[0]._bl.texCoords.v - 70/100;
        var u2 = quads[0]._tr.texCoords.u - 50/100;
        var v2 = quads[0]._tr.texCoords.v - 52/100;
        var EPSILON = 0.00001;
        deepEqual(Math.abs(u1) < EPSILON, true, 'texCoords-bl-x test success');
        deepEqual(Math.abs(v1) < EPSILON, true, 'texCoords-bl-y test success');

        deepEqual(Math.abs(u2) < EPSILON, true, 'texCoords-tr-x test success');
        deepEqual(Math.abs(v2) < EPSILON, true, 'texCoords-tr-y test success');

        ok(true);
        start();
    },500);

});

asyncTest('filled-bar-radial spriteQuad trimmed', function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureCache.addImage(url);
    setTimeout(function() {
        var spriteFrame = new cc.SpriteFrame();
        var rect = cc.rect(10,10,40,60);
        var offset = cc.v2(-20,10);
        var originalSize = cc.size(texture.getPixelWidth(), texture.getPixelHeight());
        spriteFrame.initWithTexture(texture, rect,false, offset, originalSize);
        var contentSize = cc.size(100,100);
        var color = cc.color(255,128,0,255);
        var isTrimmed = true;
        var s9Sprite = new cc.Scale9Sprite(spriteFrame);
        s9Sprite.setContentSize(contentSize);
        s9Sprite.setColor(color);
        s9Sprite.enableTrimmedContentSize(isTrimmed);
        s9Sprite.setRenderingType(cc.Scale9Sprite.RenderingType.FILLED);
        s9Sprite.setFillType(cc.Scale9Sprite.FillType.RADIAL);
        s9Sprite.setFillCenter(0.5,0.5);
        s9Sprite.setFillStart(0.0);
        s9Sprite.setFillRange(1 / 4);
        s9Sprite._rebuildQuads();
        var quads = s9Sprite._quads;
        deepEqual(s9Sprite._isTriangle, true, "Triangles used");
        deepEqual(quads.length, 2, 'triangles number[2] success');

        var center = cc.v2(50,50);
        var p0 = cc.v2(100,50);
        var p1 = cc.v2(100,100);
        var p2 = cc.v2(50,100);

        var EPSILON = 0.00001;

        deepEqual(quads[1]._tl.vertices.x, center.x, 'center test success');
        deepEqual(quads[1]._tl.vertices.y, center.y, 'center test success');

        deepEqual(quads[0]._bl.vertices.x, p0.x, 'p0 test success');
        deepEqual(quads[0]._bl.vertices.y, p0.y, 'p0 test success');

        deepEqual(quads[1]._bl.vertices.x, p1.x, 'p1 test success');
        deepEqual(quads[1]._bl.vertices.y, p1.y, 'p1 test success');

        deepEqual(quads[1]._tr.vertices.x, p2.x, 'p2 test success');
        deepEqual(quads[1]._tr.vertices.y, p2.y, 'p2 test success');


        ok(true);
        start();
    },500);

});