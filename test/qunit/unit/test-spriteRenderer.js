largeModule('SpriteRenderer');

asyncTest('basic test', function () {
    var url = assetDir + '/button.png';

    var node = new cc.Node();
    cc.director.getScene().addChild(node);

    node.color = Color.RED;
    var render = node.addComponent(cc.SpriteRenderer);

    deepEqual(render._sgNode.color, Color.RED, 'color set success');

    var texture = new cc.Texture2D();
    texture.url = url;
    cc.loader.load(texture.url, function (err) {
        texture.handleLoadedTexture(cc.path.extname(url) === '.png');
    });
    cc.textureCache.cacheImage(url, texture);

    var newSprite = new cc.SpriteFrame();
    newSprite.setTexture(texture);
    render.sprite = newSprite;

    render.sprite.on('load', function () {
        strictEqual(render._sgNode._scale9Image.texture.url, url, 'texture set success');
        start();
    });
});
