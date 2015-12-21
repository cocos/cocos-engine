---------------------------------
var sp = new _ccsg.Sprite("a.png");
this.addChild(sp);
cc.pool.putInPool(sp);
cc.pool.getFromPool(_ccsg.Sprite, "a.png");
