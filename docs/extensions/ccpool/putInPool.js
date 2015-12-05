---------------------------------
var sp = new cc.Sprite("a.png");
this.addChild(sp);
cc.pool.putInPool(sp);
cc.pool.getFromPool(cc.Sprite, "a.png");
