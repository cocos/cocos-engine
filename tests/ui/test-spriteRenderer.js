largeModule('Sprite');

test('basic test', function () {
    var url = assetDir + '/button.png';

    var node = new cc.Node();
    cc.director.getScene().addChild(node);

    node.color = Color.RED;
    var render = node.addComponent(cc.Sprite);

    deepEqual(node.color, Color.RED, 'color set success');

    var newSprite = new cc.SpriteFrame();
    var texture = cc.textureUtil.loadImage(url);
    newSprite.setTexture(texture);
    render.spriteFrame = newSprite;

    ok(true);
});

var generateSpriteFrame = function () {
    var url = assetDir + '/button.png';
    var texture = cc.textureUtil.loadImage(url);
    var spriteFrame = new cc.SpriteFrame();
    var rect = cc.rect(10, 10, 40, 60);
    var offset = cc.v2(-20, 10);
    var originalSize = cc.size(100, 100);
    //set border
    spriteFrame.insetLeft = 5;
    spriteFrame.insetRight = 6;
    spriteFrame.insetBottom = 7;
    spriteFrame.insetTop = 8;
    spriteFrame.initWithTexture(texture, rect, false, offset, originalSize);

    return spriteFrame;
};

if (!isPhantomJS) {

    var spriteFrame = generateSpriteFrame();
    cc.dynamicAtlasManager.enabled = false;

    test('simple spriteQuad trimmed', function () {
        var testCallBack = function () {
            var contentSize = cc.size(100, 100);
            var color = cc.color(255, 128, 0, 255);

            var node = new cc.Node();
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            sprite.trim = true;
            sprite.type = cc.Sprite.Type.SIMPLE;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;
            var uvs = sprite._spriteFrame.uv;

            strictEqual(vertices[0].x, -contentSize.width / 2, 'vertex-bl-x test success');
            strictEqual(vertices[0].y, -contentSize.height / 2, 'vertex-bl-y test success');

            strictEqual(vertices[3].x, contentSize.width / 2, 'vertex-tr-x test success');
            strictEqual(vertices[3].y, contentSize.height / 2, 'vertex-tr-y test success');

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

    test('simple spriteQuad un-trimmed', function () {
        var testCallBack = function () {
            var contentSize = cc.size(100, 100);
            var color = cc.color(255, 128, 0, 255);

            var node = new cc.Node();
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.trim = false;
            sprite.type = cc.Sprite.Type.SIMPLE;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;
            var uvs = sprite._spriteFrame.uv;
            var anchorX = node.width * node.anchorX;
            var anchorY = node.height * node.anchorY;
            
            strictEqual(vertices[0].x, 10 - anchorX, 'vertex-bl-x test success');
            strictEqual(vertices[0].y, 30 - anchorY, 'vertex-bl-y test success');

            strictEqual(vertices[3].x, 50 - anchorX, 'vertex-tr-x test success');
            strictEqual(vertices[3].y, 90 - anchorY, 'vertex-tr-y test success');

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

    test('scale9 spriteQuad un-trimmed', function () {
        var testCallBack = function () {
            var contentSize = cc.size(100, 100);
            var color = cc.color(255, 128, 0, 255);

            var node = new cc.Node();
            node.anchorX = 0;
            node.anchorY = 0;
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.trim = false;
            sprite.type = cc.Sprite.Type.SLICED;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;
            var uvs = sprite._spriteFrame.uvSliced;

            strictEqual(uvs.length == 16, true, 'have 16 uvs');
            strictEqual(vertices.length == 20, true, 'have 20 vertices');
            strictEqual(vertices[4].x, 0, 'x0 test success');
            strictEqual(vertices[4].y, 0, 'y0 test success');
            strictEqual(vertices[9].x, 5, 'x1 test success');
            strictEqual(vertices[9].y, 7, 'y1 test success');
            strictEqual(vertices[14].x, 94, 'x2 test success');
            strictEqual(vertices[14].y, 92, 'y2 test success');
            strictEqual(vertices[19].x, 100, 'x3 test success');
            strictEqual(vertices[19].y, 100, 'y3 test success');

            deepClose(uvs[0].u, 10 / 100, 0.01, 'u0 test success');
            deepClose(uvs[0].v, 70 / 100, 0.01, 'v0 test success');
            deepClose(uvs[5].u, 15 / 100, 0.01, 'u1 test success');
            deepClose(uvs[5].v, 63 / 100, 0.01, 'v1 test success');
            deepClose(uvs[10].u, 44 / 100, 0.01, 'u2 test success');
            deepClose(uvs[10].v, 18 / 100, 0.01, 'v2 test success');
            deepClose(uvs[15].u, 50 / 100, 0.01, 'u3 test success');
            deepClose(uvs[15].v, 10 / 100, 0.01, 'v3 test success');
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

            var node = new cc.Node();
            node.anchorX = 0;
            node.anchorY = 0;
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            sprite.trim = true;
            sprite.type = cc.Sprite.Type.TILED;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;

            strictEqual(vertices.length == 8, true, 'have 8 vertices');
            strictEqual(vertices[0].x, 0, 'x0 test success');
            strictEqual(vertices[1].x, 40, 'x1 test success');
            strictEqual(vertices[2].x, 80, 'x2 test success');
            strictEqual(vertices[3].x, 100, 'x3 test success');
            strictEqual(vertices[0].y, 0, 'y0 test success');
            strictEqual(vertices[1].y, 60, 'y1 test success');
            strictEqual(vertices[2].y, 100, 'y2 test success');
            //
            deepClose(vertices[0].u, 10 / 100, 0.01, 'full quad u0 test success');
            deepClose(vertices[0].v, 70 / 100, 0.01, 'full quad v0 test success');
            deepClose(vertices[3].u, 50 / 100, 0.01, 'full quad u1 test success');
            deepClose(vertices[3].v, 10 / 100, 0.01, 'full quad v1 test success');
            deepClose(vertices[4].u, 10 / 100, 0.01, 'part quad u0 test success');
            deepClose(vertices[4].v, 70 / 100, 0.01, 'part quad v0 test success');
            deepClose(vertices[7].u, 30 / 100, 0.01, 'part quad u1 test success');
            deepClose(vertices[7].v, 30 / 100, 0.01, 'part quad v1 test success');
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

            var node = new cc.Node();
            node.anchorX = 0;
            node.anchorY = 0;
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            sprite.trim = true;
            sprite.type = cc.Sprite.Type.FILLED;
            sprite.fillType = cc.Sprite.FillType.HORIZONTAL;
            sprite.fillStart = 0.1;
            sprite.fillRange = 0.3;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;

            strictEqual(vertices[4].x, 10, 'vertex-bl-x test success');
            strictEqual(vertices[4].y, 0, 'vertex-bl-y test success');
            strictEqual(vertices[7].x, 40, 'vertex-tr-x test success');
            strictEqual(vertices[7].y, 100, 'vertex-tr-y test success');

            deepClose(vertices[0].u, 14 / 100, 0.01, 'texCoords-bl-x test success');
            deepClose(vertices[0].v, 70 / 100, 0.01, 'texCoords-bl-y test success');
            deepClose(vertices[3].u, 26 / 100, 0.01, 'texCoords-tr-x test success');
            deepClose(vertices[3].v, 10 / 100, 0.01, 'texCoords-tr-y test success');

            sprite.fillStart = 0.3;
            sprite.fillRange = -0.4;
            sprite._assembler.updateRenderData(sprite);
            
            strictEqual(vertices[4].x, 0, 'vertex-bl-x test success');
            strictEqual(vertices[4].y, 0, 'vertex-bl-y test success');
            strictEqual(vertices[7].x, 30, 'vertex-tr-x test success');
            strictEqual(vertices[7].y, 100, 'vertex-tr-y test success');

            deepClose(vertices[0].u, 10 / 100, 0.01, 'texCoords-bl-x test success');
            deepClose(vertices[0].v, 70 / 100, 0.01, 'texCoords-bl-y test success');
            deepClose(vertices[3].u, 22 / 100, 0.01, 'texCoords-tr-x test success');
            deepClose(vertices[3].v, 10 / 100, 0.01, 'texCoords-tr-y test success');
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

            var node = new cc.Node();
            node.anchorX = 0;
            node.anchorY = 0;
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            sprite.trim = true;
            sprite.type = cc.Sprite.Type.FILLED;
            sprite.fillType = cc.Sprite.FillType.VERTICAL;
            sprite.fillStart = 0.1;
            sprite.fillRange = 0.3;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;

            strictEqual(vertices[4].x, 0, 'vertex-bl-x test success');
            strictEqual(vertices[4].y, 10, 'vertex-bl-y test success');
            strictEqual(vertices[7].x, 100, 'vertex-tr-x test success');
            strictEqual(vertices[7].y, 40, 'vertex-tr-y test success');

            deepClose(vertices[0].u, 10 / 100, 0.01, 'texCoords-bl-x test success');
            deepClose(vertices[0].v, 64 / 100, 0.01, 'texCoords-bl-y test success');
            deepClose(vertices[3].u, 50 / 100, 0.01, 'texCoords-tr-x test success');
            deepClose(vertices[3].v, 46 / 100, 0.01, 'texCoords-tr-y test success');

            sprite.fillStart = 0.3;
            sprite.fillRange = -0.4;
            sprite._assembler.updateRenderData(sprite);

            strictEqual(vertices[4].x, 0, 'vertex-bl-x test success');
            strictEqual(vertices[4].y, 0, 'vertex-bl-y test success');
            strictEqual(vertices[7].x, 100, 'vertex-tr-x test success');
            strictEqual(vertices[7].y, 30, 'vertex-tr-y test success');

            deepClose(vertices[0].u, 10 / 100, 0.01, 'texCoords-bl-x test success');
            deepClose(vertices[0].v, 70 / 100, 0.01, 'texCoords-bl-y test success');
            deepClose(vertices[3].u, 50 / 100, 0.01, 'texCoords-tr-x test success');
            deepClose(vertices[3].v, 52 / 100, 0.01, 'texCoords-tr-y test success');
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

            var node = new cc.Node();
            node.anchorX = 0;
            node.anchorY = 0;
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            sprite.trim = true;
            sprite.type = cc.Sprite.Type.FILLED;
            sprite.fillType = cc.Sprite.FillType.RADIAL;
            sprite.fillCenter = cc.v2(0.5, 0.5);
            sprite.fillStart = 0.0;
            sprite.fillRange = 1 / 4;

            node.color = color;
            node.setContentSize(contentSize);
            cc.director.getScene().addChild(node);
            
            sprite._assembler.updateRenderData(sprite);
            var vertices = sprite._renderData._data;
            
            var center = cc.v2(50, 50);
            var p0 = cc.v2(100, 50);
            var p1 = cc.v2(100, 100);
            var p2 = cc.v2(50, 100);

            deepClose(vertices[3].x, center.x, 0.01, 'center test success');
            deepClose(vertices[3].y, center.y, 0.01, 'center test success');
            deepClose(vertices[1].x, p0.x, 0.01, 'p0 test success');
            deepClose(vertices[1].y, p0.y, 0.01, 'p0 test success');
            deepClose(vertices[4].x, p1.x, 0.01, 'p1 test success');
            deepClose(vertices[4].y, p1.y, 0.01, 'p1 test success');
            deepClose(vertices[5].x, p2.x, 0.01, 'p2 test success');
            deepClose(vertices[5].y, p2.y, 0.01, 'p2 test success');
        };
        if (spriteFrame.textureLoaded()) {
            testCallBack();
        } else {
            spriteFrame.once('load', testCallBack);
        }
    });

}
