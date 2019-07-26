// platform definition

var TestEditorExtends = typeof Editor === 'object' && Editor.serialize;

// shortcuts

var CCObject = cc.Object;
var Asset = cc.Asset;
var Vec2 = cc.Vec2;
var Rect = cc.Rect;
var Color = cc.Color;
var Texture = cc.Texture;
//var Sprite = cc.Sprite;
//var Atlas = cc.Atlas;
//var FontInfo = cc.FontInfo;

var Ticker = cc._Ticker;
var Time = cc.Time;
//var Camera = cc.Camera;
//var Component = cc.Component;
var AssetLibrary = cc.AssetLibrary;
//var SpriteRenderer = cc.SpriteRenderer;
//var Screen = cc.Screen;

var FO = cc.Object;
var V2 = cc.Vec2;
var v2 = cc.v2;
var color = cc.fireColor;

var TestTexture = cc.Class({
    name: 'TestTexture',
    extends: cc.Asset,

    properties: {
        /**
         * @property width
         * @type number
         */
        width: {
            default: 0,
            type: cc.Integer,
            readonly: true
        },

        /**
         * @property height
         * @type number
         */
        height: {
            default: 0,
            type: cc.Integer,
            readonly: true
        },
    }
});

var TestSprite = cc.Class({
    name: 'TestSprite',
    extends: cc.Asset,
    properties: {
        pivot: new cc.Vec2(0.5, 0.5),
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        texture: {
            default: null,
            type: TestTexture,
        },
        rotated: false,
        trimLeft: 0,
        trimTop: 0,
        rawWidth: 0,
        rawHeight: 0,
        //pixelLevelHitTest: false,
        //alphaThreshold: 25,
        insetTop: 0,
        insetBottom: 0,
        insetLeft: 0,
        insetRight: 0,
        rotatedWidth: {
            get: function () {
                return this.rotated ? this.height : this.width;
            }
        },
        rotatedHeight: {
            get: function () {
                return this.rotated ? this.width : this.height;
            }
        }
    }
});

var TestScript = cc.Class({
    name: 'TestScript',
    extends: cc.Component,
    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        target2: {
            default: null,
            type: cc.Node
        },
    }
});

var TestDependency = cc.Class({
    name: 'TestDependency',
    extends: cc.Asset,
    properties: {
        dependency: {
            default: '',
            url: TestDependency,
        }
    }
});

// mocks to test engine extends

cc.engine = new (cc.Class({
    extends: cc.EventTarget,
    properties: {
        attachedObjsForEditor: {
            default: {}
        },
    },
    getInstanceById: function (uuid) {
        return this.attachedObjsForEditor[uuid] || null;
    }
}))();

(function () {
    function beFalse () {
        return false;
    }

    window._Scene = window._Scene || {};
    _Scene.DetectConflict = {
        beforeAddChild: beFalse,
        afterAddChild: beFalse,
        checkConflict_Layout: beFalse,
        checkConflict_Widget: beFalse,
    };

    // 引擎内使用了 Editor.require 所以需要在测试内模拟
    if (!TestEditorExtends) {
        Editor.require = function () {
            return null;
        };
    }
})();

Editor.log = cc.log;
Editor.warn = cc.warn;
Editor.error = cc.error;
Editor.Utils = Editor.Utils || {};
Editor.Utils.UuidCache = {};

var assetDir = '../test/qunit/assets';

var canvas;
function _resetGame (w, h) {
    if (!cc.game._prepared) {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'test-canvas';
            document.body.appendChild(canvas);
        }
        cc.game.run({
            width: w,
            height: h,
            id: 'test-canvas',
            debugMode: cc.debug.DebugMode.INFO
        });
        cc.debug.setDisplayStats(false);
    }
    else {
        var view = cc.view;

        cc.game.canvas.width = w * view.getDevicePixelRatio();
        cc.game.canvas.height = h * view.getDevicePixelRatio();

        cc.game.canvas.style.width = w;
        cc.game.canvas.style.height = h;

        // reset container style
        var style = cc.game.container.style;
        style.paddingTop = "0px";
        style.paddingRight = "0px";
        style.paddingBottom = "0px";
        style.paddingLeft = "0px";
        style.borderTop = "0px";
        style.borderRight = "0px";
        style.borderBottom = "0px";
        style.borderLeft = "0px";
        style.marginTop = "0px";
        style.marginRight = "0px";
        style.marginBottom = "0px";
        style.marginLeft = "0px";

        cc.game.container.style.width = w;
        cc.game.container.style.height = h;

        var size = view.getDesignResolutionSize();
        view.setDesignResolutionSize(size.width, size.height, cc.ResolutionPolicy.SHOW_ALL);

        cc.view.emit('canvas-resize');
    }
    // Forbid render in test
    cc.renderer.render = function () {};
    cc.loader.releaseAll();
    cc.director.reset();
    cc.director.runSceneImmediate(new cc.Scene());
    //cc.director.pause();
}

_resetGame(64, 64);

var SetupEngine = {
    setup: function () {
        _resetGame(256, 512);
    },
    teardown: function () {
        // remove persist nodes
        var persistNodeUuids = Object.keys(cc.game._persistRootNodes);
        for (var i = 0; i < persistNodeUuids.length; i++) {
            var uuid = persistNodeUuids[i];
            cc.game.removePersistRootNode(cc.game._persistRootNodes[uuid]);
        }

        cc.game.pause();
        // check error
        // cc._Test.SceneGraphUtils.checkMatchCurrentScene();
    }
};

QUnit.config.testTimeout = 5000;

// force stop to ensure start will only called once
function asyncEnd () {
    cc.game.pause();
    //Engine.tick = function () {};
    //Engine.tickInEditMode = function () {};
    start();
}

function fastArrayEqual (actual, expected, message) {
    var hasError = false;
    if (hasError) {
        if (actual.length !== expected.length) {
            strictEqual(actual.length, expected.length, message + ' (array length should equal)');
        }
        for (var i = 0; i < expected.length; i++) {
            ok(actual[i] === expected[i], message + ' (element ' + i + ' should equal)');
        }
    }
    else {
        deepEqual(actual, expected, message);
    }
}

function createNodes (data) {
    var nodes = {
        attachToScene: function () {
            this.root.parent = cc.director.getScene();
        }
    };
    function createNode (data, name) {
        var node = new cc.Node();
        node.name = name;
        for (var key in data) {
            var value = data[key];
            if (key === 'comps') {
                if (Array.isArray(value)) {
                    for (var i = 0; i < value.length; i++) {
                        node.addComponent(value[i]);
                    }
                }
                else {
                    node.addComponent(value);
                }
                nodes[name + 'Comps'] = node._components.slice();
            }
            else if (typeof value === 'object') {
                var child = createNode(value, key);
                child.parent = node;
            }
        }
        nodes[name] = node;
        return node;
    }
    createNode(data, 'root');
    return nodes;
}

// output test states

//QUnit.testStart = function(test) {
//    console.log('#' + (test.module || '') + ": " + test.name + ": started.");
//};
//
//QUnit.testDone = function(test) {
//    console.log('#' + (test.module || '') + ": " + test.name + ": done.");
//    console.log('----------------------------------------');
//};
