largeModule('SpriteRenderer');

asyncTest('basic test', function () {
    var url = assetDir + '/button.png';

    var node = new cc.Node();
    cc.director.getScene().addChild(node);

    node.color = Color.RED;
    var render = node.addComponent(cc.SpriteRenderer);

    deepEqual(render._sgNode.color, Color.RED, 'color set success');

    var newSprite = new cc.SpriteFrame();
    newSprite.initWithTexture(url, cc.rect(0, 0, 10, 10));
    render.sprite = newSprite;
    var tex = newSprite.getTexture();
    tex.once('load', function () {
        strictEqual(render._sgNode._scale9Image.texture.url, url, 'texture set success');
        start();
    });
});
