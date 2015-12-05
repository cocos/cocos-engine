---------------------------
var texture = cc.textureCache.addImage("hello.png");
var textureAtlas = new cc.TextureAtlas();
textureAtlas.initWithTexture(texture, 3);
