--------------------------
1. //creates a TextureAtlas with  filename
var textureAtlas = new cc.TextureAtlas("res/hello.png", 3);

2. //creates a TextureAtlas with texture
var texture = cc.textureCache.addImage("hello.png");
var textureAtlas = new cc.TextureAtlas(texture, 3);
