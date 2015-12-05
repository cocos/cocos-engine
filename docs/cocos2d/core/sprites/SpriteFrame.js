----------------------------------------------------
// 1. Create a cc.SpriteFrame with image path
var frame1 = new cc.SpriteFrame("res/grossini_dance.png",cc.rect(0,0,90,128));
var frame2 = new cc.SpriteFrame("res/grossini_dance.png",cc.rect(0,0,90,128),false,0,cc.size(90,128));
 
// 2. Create a cc.SpriteFrame with a texture, rect, rotated, offset and originalSize in pixels.
var texture = cc.textureCache.addImage("res/grossini_dance.png");
var frame1 = new cc.SpriteFrame(texture, cc.rect(0,0,90,128));
var frame2 = new cc.SpriteFrame(texture, cc.rect(0,0,90,128),false,0,cc.size(90,128));
