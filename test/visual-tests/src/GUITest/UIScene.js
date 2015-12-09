/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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
var UIScene  = TestScene.extend({
    runThisTest: function(){
        var layer = new UIMainLayer();
        this.addChild(layer);
        cc.director.runScene(this);
    }
});
var UIMainLayer = BaseTestLayer.extend({
    _topDisplayLabel:null,
    _bottomDisplayLabel:null,
    _mainNode:null,
    _widget: {
        width: 480,
        height: 320,
        getContentSize: function () {
            return cc.size(480, 320);
        }
    },
    _backgroundSize: cc.size(300, 170),

    init: function() {
        this._super();

        var winSize = cc.winSize;
        var mainNode = new _ccsg.Node();
        var scale = winSize.height/320;
        mainNode.attr({anchorX: 0, anchorY: 0, scale: scale, x: (winSize.width - 480 * scale) / 2, y: (winSize.height - 320 * scale) / 2});
        this.addChild(mainNode);
        this._mainNode = mainNode;

        //add topDisplayLabel
        var widgetSize = cc.size(480, 320);
        var topDisplayText = new ccui.Text();
        topDisplayText.attr({
            string: "",
            fontName: "Marker Felt",
            fontSize: 32,
            anchorX: 0.5,
            anchorY: -1,
            x: widgetSize.width / 2.0,
            y: widgetSize.height / 2.0
        });
        mainNode.addChild(topDisplayText);

        //add bottomDisplayLabel
        var bottomDisplayText = new ccui.Text();
        bottomDisplayText.attr({
            string: "INIT",
            fontName: "Marker Felt",
            fontSize: 30,
            color: cc.color(159, 168, 176),
            x: widgetSize.width / 2.0
        });
        bottomDisplayText.y = widgetSize.height / 2.0 - bottomDisplayText.height * 1.75;
        mainNode.addChild(bottomDisplayText);

        this._topDisplayLabel = topDisplayText;
        this._bottomDisplayLabel = bottomDisplayText;
        this._mainNode = mainNode;
        return true;
    },
    setSceneTitle: function (title) {
        this._title = title;
    },

    onBackCallback: function (sender) {
        cc.director.runScene(UISceneManager.getInstance().previousUIScene());
    },

    onRestartCallback: function (sender) {
        UISceneManager.purge();
        GUITestScene.prototype.runThisTest();
    },

    onNextCallback: function (sender) {
        cc.director.runScene(UISceneManager.getInstance().nextUIScene());
    }
});