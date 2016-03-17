/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2013      Surith Thekkiam

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var sceneIdx = -1;

var spriteFrameCache = cc.spriteFrameCache;

//------------------------------------------------------------------
//
// S9SpriteTestDemo
//
//------------------------------------------------------------------
var S9SpriteTestDemo = cc.LayerGradient.extend({
    _title:"",
    _subtitle:"",

    ctor:function() {
        this._super(cc.color(0,0,0,255), cc.color(98,99,117,255));
        cc.spriteFrameCache.addSpriteFrames(s_s9s_blocks9_plist);
        cc.log('sprite frames added to sprite frame cache...');
    },
    onEnter:function () {
        this._super();

        var label = new cc.LabelTTF(this._title, "Arial", 28);
        this.addChild(label, 1);
        label.x = winSize.width / 2;
        label.y = winSize.height - 50;

        if (this._subtitle !== "") {
            var l = new cc.LabelTTF(this._subtitle, "Thonburi", 16);
            this.addChild(l, 1);
            l.x = winSize.width / 2;
            l.y = winSize.height - 80;
        }

        var item1 = new cc.MenuItemImage(s_pathB1, s_pathB2, this.onBackCallback, this);
        var item2 = new cc.MenuItemImage(s_pathR1, s_pathR2, this.onRestartCallback, this);
        var item3 = new cc.MenuItemImage(s_pathF1, s_pathF2, this.onNextCallback, this);

        var menu = new cc.Menu(item1, item2, item3);

        menu.x = 0;
        menu.y = 0;
        var width = item2.width, height = item2.height;
        item1.x = winSize.width/2 - width*2;
        item1.y = height/2;
        item2.x = winSize.width/2;
        item2.y = height/2;
        item3.x = winSize.width/2 + width*2;
        item3.y = height/2;

        this.addChild(menu, 1);
    },

    onExit:function () {
        this._super();
    },

    onRestartCallback:function (sender) {
        var s = new S9SpriteTestScene();
        s.addChild(restartS9SpriteTest());
        director.runScene(s);
    },
    onNextCallback:function (sender) {
        var s = new S9SpriteTestScene();
        s.addChild(nextS9SpriteTest());
        director.runScene(s);
    },
    onBackCallback:function (sender) {
        var s = new S9SpriteTestScene();
        s.addChild(previousS9SpriteTest());
        director.runScene(s);
    }
});

// S9CreationTest

var S9CreationTest = S9SpriteTestDemo.extend({

    _title:"Scale9Sprite creation test",
    _subtitle:"create(img), create(capinsets, img), create(img, texturerect, capinsets)",

    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        var s9sprite1 = new cc.Scale9Sprite("res/Images/blocks.png");

        var s9sprite2 = new cc.Scale9Sprite("blocks9.png");

        var s9sprite3 = new cc.Scale9Sprite("blocks9r.png");

        s9sprite1.setContentSize(cc.size(150,150));
        s9sprite2.setContentSize(cc.size(150,150));
        s9sprite3.setContentSize(cc.size(150,150));
        s9sprite1.x = x * 0.2; s9sprite1.y = y;

        s9sprite2.x = x * 0.5; s9sprite2.y = y;

        s9sprite3.x = x * 0.8; s9sprite3.y = y;
        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
        this.addChild(s9sprite3);
    }
});

//S9RenderingTypeTest

var S9RenderingTypeTest = S9SpriteTestDemo.extend({
        _title:"Scale9Sprite RenderingType",
        _subtitle:"the insets and preferred size is the same, the left one should be 9 slice scaled",

        ctor:function() {
            this._super();

            var x = winSize.width;
            var y = 0 + (winSize.height/2);

            var s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");

            var s9sprite2 = new cc.Scale9Sprite("res/Images/blocks9.png");
            s9sprite1.setInsetLeft(20);
            s9sprite1.setInsetRight(20);
            s9sprite1.setInsetTop(30);
            s9sprite1.setInsetBottom(30);

            s9sprite2.setInsetLeft(20);
            s9sprite2.setInsetRight(20);
            s9sprite2.setInsetTop(30);
            s9sprite2.setInsetBottom(30);

            s9sprite1.setContentSize(cc.size(150,150));
            s9sprite2.setContentSize(cc.size(150,150));

            s9sprite2.setRenderingType(cc.Scale9Sprite.RenderingType.SIMPLE);

            s9sprite1.x = x/4; s9sprite1.y = y;

            s9sprite2.x = 3 * x/4; s9sprite2.y = y;

            this.addChild(s9sprite1);
            this.addChild(s9sprite2);
        }
    }
);

//S9StateTest
var S9StateTest = S9SpriteTestDemo.extend({
        _title:"Scale9Sprite state test",
        _subtitle:"the right one is gray)",

        ctor:function() {
            this._super();

            var x = winSize.width;
            var y = 0 + (winSize.height/2);

            var s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");

            var s9sprite2 = new cc.Scale9Sprite("res/Images/blocks9.png");

            s9sprite1.setContentSize(cc.size(150,150));
            s9sprite2.setContentSize(cc.size(150,150));

            s9sprite2.setState(cc.Scale9Sprite.state.GRAY);

            s9sprite1.x = x/4; s9sprite1.y = y;

            s9sprite2.x = 3 * x/4; s9sprite2.y = y;

            this.addChild(s9sprite1);
            this.addChild(s9sprite2);
        }
    }
);

//S9Actiontest
var S9Actiontest = S9SpriteTestDemo.extend({

    _title:"Scale9 Action test",
    _subtitle:"",

    ctor:function() {
        this._super();

        var x = winSize.width ;
        var y = 0 + (winSize.height / 2);

        var s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");
        s9sprite1.setContentSize(cc.size(150,150));
        s9sprite1.x = x/4; s9sprite1.y = y;

        this.addChild(s9sprite1);
        var actionArray = [];
        actionArray.push(cc.delayTime(1));
        actionArray.push(cc.moveBy(1,x/2, 0));
        actionArray.push(cc.rotateBy(2,360));
        actionArray.push(cc.scaleBy(1,2));
        s9sprite1.runAction(cc.sequence(actionArray));
    }
});

//S9Actiontest
var S9ChangeFiletest = S9SpriteTestDemo.extend({

    _title:"Scale9 Change File test",
    _subtitle:"",
    _s9sprite1: null,
    ctor:function() {
        this._super();

        var x = winSize.width ;
        var y = 0 + (winSize.height / 2);

        _s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");
        _s9sprite1.setContentSize(cc.size(300,200));
        _s9sprite1.x = x/2; _s9sprite1.y = y;

        this.addChild(_s9sprite1);
        var actionArray = [];
        actionArray.push(cc.delayTime(1));
        actionArray.push(cc.callFunc(this.changeFile1,this));
        actionArray.push(cc.delayTime(2));
        actionArray.push(cc.callFunc(this.changeFile2,this));
        _s9sprite1.runAction(cc.sequence(actionArray));
    },
    changeFile1: function() {
        this.changeFile("res/Images/btn-highscores-normal.png");
    },
    changeFile2: function() {
        this.changeFile("res/Images/blocks9.png");
    },
    changeFile: function(file) {
        console.log("I'am going to change a new file");
        _s9sprite1.initWithTexture(file);
        _s9sprite1.setInsetTop(10);
        _s9sprite1.setInsetBottom(10);
        _s9sprite1.setInsetLeft(10);
        _s9sprite1.setInsetRight(10);
    }
});

//S9ChangePreferredSizeTest
var S9ChangePreferredSizeTest = S9SpriteTestDemo.extend({

    _title:"Scale9 Change PreferredSize Test",
    _subtitle:"Slice and Simple s9sprite will behave differently",
    _s9sprite1: null,
    _s9sprite2: null,
    _dt: 0,
    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        this._s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");

        this._s9sprite2 = new cc.Scale9Sprite("res/Images/blocks9.png");
        var s9sprite1 = this._s9sprite1;
        var s9sprite2 = this._s9sprite2;
        s9sprite1.setContentSize(cc.size(96,96));
        s9sprite2.setContentSize(cc.size(96,96));

        s9sprite1.setInsetLeft(20);
        s9sprite1.setInsetRight(20);
        s9sprite1.setInsetTop(30);
        s9sprite1.setInsetBottom(30);

        s9sprite2.setInsetLeft(20);
        s9sprite2.setInsetRight(20);
        s9sprite2.setInsetTop(30);
        s9sprite2.setInsetBottom(30);

        this.scheduleUpdate();

        s9sprite2.setRenderingType(cc.Scale9Sprite.RenderingType.SIMPLE);

        s9sprite1.x = x/4; s9sprite1.y = y;

        s9sprite2.x = 3 * x/4; s9sprite2.y = y;

        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
    },

    update: function(dt) {
        this._dt += dt;
        if(this._dt > 3) this._dt = 3;
        var newSize = cc.size(96 + this._dt * 20, 96 + this._dt * 20);
        this._s9sprite1.setContentSize(newSize);
        this._s9sprite2.setContentSize(newSize);
        if(this._dt === 3) this.unscheduleUpdate();
    },
});

//S9ChangeCapInsetsTest
var S9ChangeCapInsetsTest = S9SpriteTestDemo.extend({
    //todo add a new test case
    _title:"Scale9 Change CapInsets Test",
    _subtitle:"Slice and Simple s9sprite will behave differently",
    _s9sprite1: null,
    _s9sprite2: null,
    _dt: 0,
    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        this._s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");

        this._s9sprite2 = new cc.Scale9Sprite("res/Images/blocks9.png");
        var s9sprite1 = this._s9sprite1;
        var s9sprite2 = this._s9sprite2;
        s9sprite1.setContentSize(cc.size(150,150));
        s9sprite2.setContentSize(cc.size(150,150));

        s9sprite1.setInsetLeft(20);
        s9sprite1.setInsetRight(20);
        s9sprite1.setInsetTop(30);
        s9sprite1.setInsetBottom(30);

        s9sprite2.setInsetLeft(20);
        s9sprite2.setInsetRight(20);
        s9sprite2.setInsetTop(30);
        s9sprite2.setInsetBottom(30);

        this.scheduleUpdate();

        s9sprite1.x = x/4; s9sprite1.y = y;

        s9sprite2.x = 3 * x/4; s9sprite2.y = y;

        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
    },

    update: function(dt) {
        var insetLeft = this._s9sprite1.getInsetLeft();
        var insetRight = this._s9sprite1.getInsetRight();

        var insetTop = this._s9sprite2.getInsetTop();
        var insetBottom = this._s9sprite2.getInsetBottom();

        insetLeft = insetLeft + dt * 20;
        insetLeft = insetLeft % (this._s9sprite1._spriteFrame.getOriginalSize().width - insetRight);
        this._s9sprite1.setInsetLeft(insetLeft);
        insetTop = insetTop + dt * 10;
        insetTop = insetTop % (this._s9sprite2._spriteFrame.getOriginalSize().height - insetBottom);
        this._s9sprite2.setInsetTop(insetTop);
    },
});

//S9ChangeColorOpacityTest
var S9ChangeColorOpacityTest = S9SpriteTestDemo.extend({

    _title:"Scale9 Change Color Opacity Test",
    _subtitle:"Slice and Simple s9sprite will behave differently",
    _s9sprite1: null,
    _s9sprite2: null,
    _dt: 0,
    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        this._s9sprite1 = new cc.Scale9Sprite("res/Images/blocks9.png");

        this._s9sprite2 = new cc.Scale9Sprite("res/Images/blocks9.png");
        var s9sprite1 = this._s9sprite1;
        var s9sprite2 = this._s9sprite2;
        s9sprite1.setContentSize(cc.size(150,150));
        s9sprite2.setContentSize(cc.size(150,150));
        s9sprite1.setBlendFunc(cc.BlendFunc.ALPHA_NON_PREMULTIPLIED);
        s9sprite2.setBlendFunc(cc.BlendFunc.ALPHA_NON_PREMULTIPLIED);
        this.scheduleUpdate();


        s9sprite1.x = x/4; s9sprite1.y = y;

        s9sprite2.x = 3 * x/4; s9sprite2.y = y;

        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
    },

    update: function(dt) {
        this._dt += dt;
        if(this._dt > 3) this._dt = 3;
        var opacity = 1;
        var color = cc.Color.WHITE;
        if(this._dt < 1.5){
            opacity = 1 - this._dt * 2 / 3;
        }
        else{
            opacity = (this._dt-1.5) * 2 / 3;
        }

        color.r = color.g = opacity * 255;
        this._s9sprite1.setOpacity(opacity * 255);
        this._s9sprite2.setColor(color);
        if(this._dt === 3) this.unscheduleUpdate();
    },
});

var S9SpriteTestScene = TestScene.extend({
    runThisTest:function (num) {
        sceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextS9SpriteTest();
        this.addChild(layer);

        director.runScene(this);
    }
});

//
// Flow control
//

var arrayOfS9SpriteTest = [
    S9CreationTest,
    S9RenderingTypeTest,
    S9StateTest,
    S9Actiontest,
    S9ChangePreferredSizeTest,
    S9ChangeCapInsetsTest,
    S9ChangeColorOpacityTest,
    S9ChangeFiletest,
];

var nextS9SpriteTest = function () {
    sceneIdx++;
    sceneIdx = sceneIdx % arrayOfS9SpriteTest.length;

    return new arrayOfS9SpriteTest[sceneIdx]();
};
var previousS9SpriteTest = function () {
    sceneIdx--;
    if (sceneIdx < 0)
        sceneIdx += arrayOfS9SpriteTest.length;

    return new arrayOfS9SpriteTest[sceneIdx]();
};
var restartS9SpriteTest = function () {
    return new arrayOfS9SpriteTest[sceneIdx]();
};
