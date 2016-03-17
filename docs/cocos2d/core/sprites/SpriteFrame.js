// ----------------------------------------------------
// 1. Create a cc.SpriteFrame with image path
var url = cc.url.raw('resources/textures/grossini_dance.png');
var frame1 = new cc.SpriteFrame(url, cc.Rect(0, 0, 90, 128));

// ----------------------------------------------------
// 2. Create a cc.SpriteFrame with a texture, rect, rotated, offset and originalSize in pixels.
var url = cc.url.raw('resources/textures/grossini_dance.png');
var texture = cc.textureCache.addImage(url);
var frame1 = new cc.SpriteFrame(texture, cc.Rect(0, 0, 90, 128));
var frame2 = new cc.SpriteFrame(texture, cc.Rect(0, 0, 90, 128), false, 0, cc.Size(90, 128));

// ----------------------------------------------------
// 3. load a cc.SpriteFrame with image path (Recommend)
var url = 'resources://test assets/PurpleMonster.png/PurpleMonster';
var self = this;
cc.loader.load(url, function (err, spriteFrame) {
        var node = new cc.Node("New Sprite");
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        node.parent = self.node
    }
);
