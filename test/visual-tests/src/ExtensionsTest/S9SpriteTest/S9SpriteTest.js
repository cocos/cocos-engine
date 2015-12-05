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

// S9CreationBasic

var S9CreationBasic = S9SpriteTestDemo.extend({

    _title:"Scale9Sprite creation Basic test",
    _subtitle:"create(img), create(capinsets, img), create(img, texturerect, capinsets)",

    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        var s9sprite1 = cc.Scale9Sprite.create("Images/blocks9.png");

        var s9sprite2 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

        var s9sprite3 = cc.Scale9Sprite.create("Images/blocks9.png", cc.rect(0,0,60,60), cc.rect(20,20,30,30));
        s9sprite1.setPreferredSize(cc.size(150,150));
        s9sprite2.setPreferredSize(cc.size(150,150));
        s9sprite3.setPreferredSize(cc.size(150,150));
        s9sprite1.x = x/6; s9sprite1.y = y;

        s9sprite2.x = x/2; s9sprite2.y = y;

        s9sprite3.x = 5* x/6; s9sprite3.y = y;
        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
        this.addChild(s9sprite3);
    }
});

// S9creationSpriteFrame

var S9creationSpriteFrame = S9SpriteTestDemo.extend({

    _title:"Scale9Sprite creation spriteFrame test",
    _subtitle:"create(spriteFrame), create(spriteFrame, capinsets)",

    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        var s9sprite1 = cc.Scale9Sprite.create("blocks9.png");

        var s9sprite2 = cc.Scale9Sprite.create("blocks9.png",cc.rect(20,20,30,30));

        s9sprite1.setPreferredSize(cc.size(150,150));
        s9sprite2.setPreferredSize(cc.size(150,150));

        s9sprite1.x = x/4; s9sprite1.y = y;

        s9sprite2.x = 3 * x/4; s9sprite2.y = y;

        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
    }
});

var S9LaterUpdate = S9SpriteTestDemo.extend({
        _title:"Scale9Sprite creation empty and then updated",
        _subtitle:"update with sprite, update with spriteFrame",

        ctor:function() {
            this._super();

            var x = winSize.width;
            var y = 0 + (winSize.height/2);

            var s9sprite1 = cc.Scale9Sprite.create();

            var s9sprite2 = cc.Scale9Sprite.create();

            s9sprite1.setPreferredSize(cc.size(150,150));
            s9sprite2.setPreferredSize(cc.size(150,150));

            s9sprite1.x = x/4; s9sprite1.y = y;

            s9sprite2.x = 3 * x/4; s9sprite2.y = y;
            var sprite1 = cc.Sprite.create("Images/blocks9.png");
            s9sprite1.updateWithSprite(sprite1,sprite1.getTextureRect(),sprite1.textureRectRotated,cc.p(0,0),cc.size(0,0),cc.rect(20,20,30,30));

            var frame = cc.spriteFrameCache.getSpriteFrame("blocks9.png");
            s9sprite2.setSpriteFrame(frame,cc.rect(20,20,30,30));

            this.addChild(s9sprite1);
            this.addChild(s9sprite2);
        }
}
);

//S9RenderingTypeTest

var S9RenderingTypeTest = S9SpriteTestDemo.extend({
        _title:"Scale9Sprite RenderingType",
        _subtitle:"the right one is using simple mode, it should scales to size(150,150)",

        ctor:function() {
            this._super();

            var x = winSize.width;
            var y = 0 + (winSize.height/2);

            var s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

            var s9sprite2 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

            s9sprite1.setPreferredSize(cc.size(150,150));
            s9sprite2.setPreferredSize(cc.size(150,150));

            s9sprite2.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);

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

            var s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

            var s9sprite2 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

            s9sprite1.setPreferredSize(cc.size(150,150));
            s9sprite2.setPreferredSize(cc.size(150,150));

            s9sprite2.setState(ccui.Scale9Sprite.state.GRAY);

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

        var s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");
        s9sprite1.setPreferredSize(cc.size(150,150));
        s9sprite1.x = x/4; s9sprite1.y = y;

        this.addChild(s9sprite1);
        var actionArray = [];
        actionArray.push(cc.DelayTime.create(1));
        actionArray.push(cc.MoveBy.create(1,x/2, 0));
        actionArray.push(cc.RotateBy.create(2,360));
        actionArray.push(cc.ScaleBy.create(1,2));
        s9sprite1.runAction(cc.Sequence.create(actionArray));
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

        _s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");
        _s9sprite1.setPreferredSize(cc.size(150,150));
        _s9sprite1.x = x/4; _s9sprite1.y = y;

        this.addChild(_s9sprite1);
        var actionArray = [];
        actionArray.push(cc.DelayTime.create(1));
        actionArray.push(cc.CallFunc.create(this.changeFile1,this));
        actionArray.push(cc.DelayTime.create(2));
        actionArray.push(cc.CallFunc.create(this.changeFile2,this));
        _s9sprite1.runAction(cc.Sequence.create(actionArray));
    },
    changeFile1: function() {
        this.changeFile("Images/btn-highscores-normal.png");
    },
    changeFile2: function() {
        this.changeFile("Images/blocks9.png");
    },
    changeFile: function(file) {
        console.log("I'am going to change a new file");
        _s9sprite1.initWithFile(file);
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

        this._s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

        this._s9sprite2 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");
        var s9sprite1 = this._s9sprite1;
        var s9sprite2 = this._s9sprite2;
        s9sprite1.setPreferredSize(cc.size(96,96));
        s9sprite2.setPreferredSize(cc.size(96,96));
        this.scheduleUpdate();

        s9sprite2.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);

        s9sprite1.x = x/4; s9sprite1.y = y;

        s9sprite2.x = 3 * x/4; s9sprite2.y = y;

        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
    },

    update: function(dt) {
        this._dt += dt;
        if(this._dt > 3) this._dt = 3;
        var newSize = cc.size(96 + this._dt * 20, 96 + this._dt * 20);
        this._s9sprite1.setPreferredSize(newSize);
        this._s9sprite2.setPreferredSize(newSize);
        if(this._dt === 3) this.unscheduleUpdate();
    },
});

//S9ChangeCapInsetsTest
var S9ChangeCapInsetsTest = S9SpriteTestDemo.extend({

    _title:"Scale9 Change CapInsets Test",
    _subtitle:"Slice and Simple s9sprite will behave differently",
    _s9sprite1: null,
    _s9sprite2: null,
    _dt: 0,
    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        this._s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

        this._s9sprite2 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");
        var s9sprite1 = this._s9sprite1;
        var s9sprite2 = this._s9sprite2;
        s9sprite1.setPreferredSize(cc.size(150,150));
        s9sprite2.setPreferredSize(cc.size(150,150));
        this.scheduleUpdate();

        s9sprite2.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);

        s9sprite1.x = x/4; s9sprite1.y = y;

        s9sprite2.x = 3 * x/4; s9sprite2.y = y;

        this.addChild(s9sprite1);
        this.addChild(s9sprite2);
    },

    update: function(dt) {
        var rect = cc.rect(20,20,30,30);
        this._dt += dt;
        if(this._dt > 3) this._dt = 3;
        rect.x = rect.x + this._dt * 20;
        this._s9sprite1.setCapInsets(rect);
        this._s9sprite2.setCapInsets(rect);
        if(this._dt === 3) this.unscheduleUpdate();
    },
});

//S9ChangeColorOpacityTest
var S9ChangeColorOpacityTest = S9SpriteTestDemo.extend({

    _title:"Scale9 Change CapInsets Test",
    _subtitle:"Slice and Simple s9sprite will behave differently",
    _s9sprite1: null,
    _s9sprite2: null,
    _dt: 0,
    ctor:function() {
        this._super();

        var x = winSize.width;
        var y = 0 + (winSize.height/2);

        this._s9sprite1 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");

        this._s9sprite2 = cc.Scale9Sprite.create(cc.rect(20,20,30,30),"Images/blocks9.png");
        var s9sprite1 = this._s9sprite1;
        var s9sprite2 = this._s9sprite2;
        s9sprite1.setPreferredSize(cc.size(150,150));
        s9sprite2.setPreferredSize(cc.size(150,150));
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

////old tests
//var S9BatchNodeBasic = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite created empty and updated from SpriteBatchNode",
//    _subtitle:"updateWithBatchNode(); capInsets=full size",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9BatchNodeBasic ...");
//
//        var batchNode = new cc.Scale9Sprite("Images/blocks9.png", cc.rect(0,0,80,80), cc.rect(20,20,30,30));
//        //batchNode.setScale9Enabled(false);
//        batchNode.setState(ccui.Scale9Sprite.state.GRAY);
//        batchNode.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);
//        batchNode.setPreferredSize(cc.size(200,200));
//        cc.log("batchNode created with : " + "Images/blocks9.png");
//
//        //var blocks = new cc.Scale9Sprite();
//        cc.log("... created");
//
//        //blocks.updateWithBatchNode(batchNode, cc.rect(0, 0, 96, 96), false, cc.rect(0, 0, 96, 96));
//        cc.log("... updateWithBatchNode");
//
//        batchNode.x = x;
//        batchNode.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(batchNode);
//        cc.log("this..addChild");
//
//        cc.log("... S9BatchNodeBasic done.");
//    }
//});
//
//// S9FrameNameSpriteSheet
//
//var S9FrameNameSpriteSheet = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite from sprite sheet",
//    _subtitle:"createWithSpriteFrameName(); default cap insets",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheet ...");
//
//        var blocks = new cc.Scale9Sprite('blocks9.png');
//        cc.log("... created");
//
//        blocks.x = x;
//        blocks.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheet done.");
//    }
//});
//
//// S9FrameNameSpriteSheetRotated
//
//var S9FrameNameSpriteSheetRotated = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite from sprite sheet (stored rotated)",
//    _subtitle:"createWithSpriteFrameName(); default cap insets",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetRotated ...");
//
//        var blocks = new cc.Scale9Sprite('blocks9r.png');
//        cc.log("... created");
//
//        blocks.x = x;
//        blocks.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetRotated done.");
//    }
//});
//
//// S9BatchNodeScaledNoInsets
//
//var S9BatchNodeScaledNoInsets = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite created empty and updated from SpriteBatchNode",
//    _subtitle:"updateWithBatchNode(); capInsets=full size; rendered 4 X width, 2 X height",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9BatchNodeScaledNoInsets ...");
//
//        // scaled without insets
//        var batchNode_scaled = new cc.SpriteBatchNode("Images/blocks9.png");
//        cc.log("batchNode_scaled created with : " + "Images/blocks9.png");
//
//        var blocks_scaled = new cc.Scale9Sprite();
//        cc.log("... created");
//        blocks_scaled.updateWithBatchNode(batchNode_scaled, cc.rect(0, 0, 96, 96), false, cc.rect(0, 0, 96, 96));
//        cc.log("... updateWithBatchNode");
//
//        blocks_scaled.x = x;
//        blocks_scaled.y = y;
//        cc.log("... setPosition");
//
//        blocks_scaled.width = 96 * 4;
//        blocks_scaled.height = 96*2;
//        cc.log("... setContentSize");
//
//        this.addChild(blocks_scaled);
//        cc.log("this..addChild");
//
//        cc.log("... S9BtchNodeScaledNoInsets done.");
//    }
//});
//
//// S9FrameNameSpriteSheetScaledNoInsets
//
//var S9FrameNameSpriteSheetScaledNoInsets = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite from sprite sheet",
//    _subtitle:"createWithSpriteFrameName(); default cap insets; rendered 4 X width, 2 X height",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetScaledNoInsets ...");
//
//        var blocks_scaled = new cc.Scale9Sprite('blocks9.png');
//        cc.log("... created");
//
//        blocks_scaled.x = x;
//        blocks_scaled.y = y;
//        cc.log("... setPosition");
//
//        blocks_scaled.width = 96 * 4;
//        blocks_scaled.height = 96*2;
//        cc.log("... setContentSize");
//
//        this.addChild(blocks_scaled);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetScaledNoInsets done.");
//    }
//});
//
//// S9FrameNameSpriteSheetRotatedScaledNoInsets
//
//var S9FrameNameSpriteSheetRotatedScaledNoInsets = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite from sprite sheet (stored rotated)",
//    _subtitle:"createWithSpriteFrameName(); default cap insets; rendered 4 X width, 2 X height",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetRotatedScaledNoInsets ...");
//
//        var blocks_scaled = new cc.Scale9Sprite('blocks9r.png');
//        cc.log("... created");
//
//        blocks_scaled.x = x;
//        blocks_scaled.y = y;
//        cc.log("... setPosition");
//
//        blocks_scaled.width = 96 * 4;
//        blocks_scaled.height = 96*2;
//        cc.log("... setContentSize");
//
//        this.addChild(blocks_scaled);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetRotatedScaledNoInsets done.");
//    }
//});
//
//
//// S9BatchNodeScaleWithCapInsets
//
//var S9BatchNodeScaleWithCapInsets = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite created empty and updated from SpriteBatchNode",
//    _subtitle:"updateWithBatchNode(); capInsets=(32, 32, 32, 32)",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9BatchNodeScaleWithCapInsets ...");
//
//        var batchNode_scaled_with_insets = new cc.SpriteBatchNode("Images/blocks9.png");
//        cc.log("batchNode_scaled_with_insets created with : " + "Images/blocks9.png");
//
//        var blocks_scaled_with_insets = new cc.Scale9Sprite();
//        cc.log("... created");
//
//        blocks_scaled_with_insets.updateWithBatchNode(batchNode_scaled_with_insets, cc.rect(0, 0, 96, 96), false, cc.rect(32, 32, 32, 32));
//        cc.log("... updateWithBatchNode");
//
//        blocks_scaled_with_insets.width = 96 * 4.5;
//        blocks_scaled_with_insets.height = 96 * 2.5;
//        cc.log("... setContentSize");
//
//        blocks_scaled_with_insets.x = x;
//        blocks_scaled_with_insets.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks_scaled_with_insets);
//        cc.log("this..addChild");
//
//        cc.log("... S9BatchNodeScaleWithCapInsets done.");
//    }
//});
//
//// S9FrameNameSpriteSheetInsets
//
//var S9FrameNameSpriteSheetInsets = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite scaled with insets sprite sheet",
//    _subtitle:"createWithSpriteFrameName(); cap insets=(32, 32, 32, 32)",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetInsets ...");
//
//        var blocks_with_insets = new cc.Scale9Sprite('blocks9.png', cc.rect(32, 32, 32, 32));
//        cc.log("... created");
//
//        blocks_with_insets.x = x;
//        blocks_with_insets.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks_with_insets);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetInsets done.");
//    }
//});
//
//// S9FrameNameSpriteSheetInsetsScaled
//
//var S9FrameNameSpriteSheetInsetsScaled = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite scaled with insets sprite sheet",
//    _subtitle:"createWithSpriteFrameName(); default cap insets; rendered scaled 4.5 X width, 2.5 X height",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetInsetsScaled ...");
//
//        var blocks_scaled_with_insets = new cc.Scale9Sprite('blocks9.png', cc.rect(32, 32, 32, 32));
//        cc.log("... created");
//
//        blocks_scaled_with_insets.width = 96 * 4.5;
//        blocks_scaled_with_insets.height = 96 * 2.5;
//        cc.log("... setContentSize");
//
//        blocks_scaled_with_insets.x = x;
//        blocks_scaled_with_insets.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks_scaled_with_insets);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetInsetsScaled done.");
//    }
//});
//
//// S9FrameNameSpriteSheetRotatedInsets
//
//var S9FrameNameSpriteSheetRotatedInsets = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite scaled with insets sprite sheet (stored rotated)",
//    _subtitle:"createWithSpriteFrameName(); cap insets=(32, 32, 32, 32)",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetRotatedInsets ...");
//
//        var blocks_with_insets = new cc.Scale9Sprite('blocks9r.png', cc.rect(32, 32, 32, 32));
//        cc.log("... created");
//
//        blocks_with_insets.x = x;
//        blocks_with_insets.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks_with_insets);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetRotatedInsets done.");
//    }
//});
//
//// S9_TexturePacker
//
//var S9_TexturePacker = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite from a spritesheet created with TexturePacker",
//    _subtitle:"createWithSpriteFrameName('button_normal.png');createWithSpriteFrameName('button_actived.png');",
//
//    ctor:function() {
//        this._super();
//        cc.spriteFrameCache.addSpriteFrames(s_s9s_ui_plist);
//
//        var x = winSize.width / 4;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9_TexturePacker ...");
//
//        var s = new cc.Scale9Sprite('button_normal.png');
//        cc.log("... created");
//
//        s.x = x;
//
//        s.y = y;
//        cc.log("... setPosition");
//
//        s.width = 21 * 16;
//
//        s.height = 13 * 16;
//        cc.log("... setContentSize");
//
//        this.addChild(s);
//        cc.log("this..addChild");
//
//        x = winSize.width * 3/4;
//
//        var s2 = new cc.Scale9Sprite('button_actived.png');
//        cc.log("... created");
//
//        s2.x = x;
//        s2.y = y;
//        cc.log("... setPosition");
//
//        s2.width = 21 * 16;
//        s2.height = 13 * 16;
//        cc.log("... setContentSize");
//
//        this.addChild(s2);
//        cc.log("this..addChild");
//
//        cc.log("... S9_TexturePacker done.");
//    }
//});
//
//// S9FrameNameSpriteSheetRotatedInsetsScaled
//
//var S9FrameNameSpriteSheetRotatedInsetsScaled = S9SpriteTestDemo.extend({
//
//    _title:"Scale9Sprite scaled with insets sprite sheet (stored rotated)",
//    _subtitle:"createWithSpriteFrameName(); default cap insets; rendered scaled 4.5 X width, 2.5 X height",
//
//    ctor:function() {
//        this._super();
//
//        var x = winSize.width / 2;
//        var y = 0 + (winSize.height / 2);
//
//        cc.log("S9FrameNameSpriteSheetRotatedInsetsScaled ...");
//
//        var blocks_scaled_with_insets = new cc.Scale9Sprite('blocks9.png', cc.rect(32, 32, 32, 32));
//        cc.log("... created");
//
//        blocks_scaled_with_insets.width = 96 * 4.5;
//        blocks_scaled_with_insets.height = 96 * 2.5;
//        cc.log("... setContentSize");
//
//        blocks_scaled_with_insets.x = x;
//        blocks_scaled_with_insets.y = y;
//        cc.log("... setPosition");
//
//        this.addChild(blocks_scaled_with_insets);
//        cc.log("this..addChild");
//
//        cc.log("... S9FrameNameSpriteSheetRotatedInsetsScaled done.");
//    }
//});
//
//var S9SpriteActionTest = S9SpriteTestDemo.extend({
//
//    _title:"Test Action for Scale9Sprite : Rotate + Scale + Translate",
//
//    ctor:function() {
//        this._super();
//
//        var blocks_with_insets = new cc.Scale9Sprite('blocks9.png');
//
//        blocks_with_insets.x = winSize.width / 2;
//        blocks_with_insets.y = winSize.height / 2;
//        blocks_with_insets.width = 96 * 4;
//        blocks_with_insets.height = 96 * 2;
//
//        this.addChild(blocks_with_insets);
//
//        var delay = cc.delayTime(0.25);
//
//        var rotateBy = cc.rotateBy(2, 360);
//        var rotateByBack = rotateBy.reverse();
//
//        var ScaleTo = cc.scaleTo(2, -0.44, 0.47);
//        var ScaleToBack = cc.scaleTo(2, 1.0, 1.0);
//
//        var moveBy = cc.moveBy(1, cc.p(80, 80));
//        var moveByBack = moveBy.reverse();
//
//        blocks_with_insets.runAction(cc.sequence(rotateBy, delay, rotateByBack));
//        blocks_with_insets.runAction(cc.sequence(ScaleTo, delay.clone(), ScaleToBack));
//        blocks_with_insets.runAction(cc.sequence(moveBy,moveByBack));
//    }
//});
//
//var S9SpriteColorOpacityTest = S9SpriteTestDemo.extend({
//    _title:"Test color/opacity cascade for Scale9Sprite (red with 128 opacity)",
//
//    ctor:function() {
//        this._super();
//
//        this.setCascadeColorEnabled(true);
//        this.setCascadeOpacityEnabled(true);
//        this.setOpacity(128);
//        this.setColor(cc.color(255, 0, 0));
//
//        var blocks = new cc.Scale9Sprite('blocks9.png');
//        blocks.x = winSize.width / 2 - 100;
//        blocks.y = winSize.height / 2;
//        this.addChild(blocks);
//
//        var batchNode = new cc.SpriteBatchNode("Images/blocks9.png");
//        var blocks2 = new cc.Scale9Sprite();
//        blocks2.updateWithBatchNode(batchNode, cc.rect(0, 0, 96, 96), false, cc.rect(0, 0, 96, 96));
//        blocks2.x = winSize.width / 2 + 100;
//        blocks2.y = winSize.height / 2;
//        this.addChild(blocks2);
//    }
//});

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
    S9CreationBasic,
    S9creationSpriteFrame,
    S9LaterUpdate,
    S9RenderingTypeTest,
    S9StateTest,
    S9Actiontest,
    S9ChangePreferredSizeTest,
    S9ChangeCapInsetsTest,
    S9ChangeColorOpacityTest,
    S9ChangeFiletest,
    //old ones
    //S9BatchNodeBasic,
    //S9FrameNameSpriteSheet,
    //S9FrameNameSpriteSheetRotated,
    //S9BatchNodeScaledNoInsets,
    //S9FrameNameSpriteSheetScaledNoInsets,
    //S9FrameNameSpriteSheetRotatedScaledNoInsets,
    //S9BatchNodeScaleWithCapInsets,
    //S9FrameNameSpriteSheetInsets,
    //S9FrameNameSpriteSheetInsetsScaled,
    //S9FrameNameSpriteSheetRotatedInsets,
    //S9FrameNameSpriteSheetRotatedInsetsScaled,
    //S9_TexturePacker,
    //S9SpriteActionTest,
    //S9SpriteColorOpacityTest
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
