/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var macro = require('../../platform/CCMacro');

const PerfCounter = require('./perf-counter');

let _showFPS = false;
let _fontSize = 15;

let _atlas = null;
let _stats = null;
let _rootNode = null;
let _label = null;

function generateAtlas () {
    if (_atlas) return;

    let textureWidth = 256,
        textureHeight = 256;

    let canvas = document.createElement("canvas");
    canvas.style.width = canvas.width = textureWidth;
    canvas.style.height = canvas.height = textureHeight;

    // comment out this to show atlas
    // document.body.appendChild(canvas)

    let ctx = canvas.getContext('2d');
    ctx.font = `${_fontSize}px Arial`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    
    let space = 2;
    let x = space;
    let y = space;
    let lineHeight = _fontSize;

    _atlas = new cc.LabelAtlas();
    _atlas._fntConfig = {
        atlasName: 'profiler-arial',
        commonHeight: lineHeight,
        fontSize: _fontSize,
        kerningDict: {},
        fontDefDictionary: {}
    };

    _atlas._name = 'profiler-arial';
    _atlas.fontSize = _fontSize;

    let dict = _atlas._fntConfig.fontDefDictionary;
    
    for (let i = 32; i <= 126; i++) {
        let char = String.fromCharCode(i);
        let width = ctx.measureText(char).width;
    
        if ((x + width) >= textureWidth) {
            x = space;
            y += lineHeight + space;
        }
        ctx.fillText(char, x, y);

        dict[i] = {
            xAdvance: width,
            xOffset: 0,
            yOffset: 0,
            rect: {
                x: x,
                y: y,
                width: width,
                height: lineHeight
            }
        }

        x += width + space;
    }

    let texture = new cc.Texture2D();
    texture.initWithElement(canvas);
    texture.handleLoadedTexture();

    let spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(texture);

    _atlas.spriteFrame = spriteFrame;
}

function generateStats () {
    if (_stats) return;
    
    _stats = {
        frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
        fps: { desc: 'Framerate (FPS)', below: 30, average: 500 },
        draws: { desc: 'Draw call' },
        logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
        render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' },
        mode: { desc: cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? 'WebGL' : 'Canvas', min: 1 }
    };

    for (let id in _stats) {
        _stats[id]._counter = new PerfCounter(id, _stats[id]);
    }
}

function generateNode () {
    if (_rootNode && _rootNode.isValid) return;

    _rootNode = new cc.Node('PROFILER-NODE');
    _rootNode.x = _rootNode.y = 10;

    _rootNode.zIndex = macro.MAX_ZINDEX;
    cc.game.addPersistRootNode(_rootNode);

    let left = new cc.Node('LEFT-PANEL');
    left.anchorX = left.anchorY = 0;
    left.parent = _rootNode;
    let leftLabel = left.addComponent(cc.Label);
    leftLabel.font = _atlas;
    leftLabel.fontSize = _fontSize;
    leftLabel.lineHeight = _fontSize;

    let right = new cc.Node('RIGHT-PANEL');
    right.anchorX = 1;
    right.anchorY = 0;
    right.x = 200;
    right.parent = _rootNode;
    let rightLabel = right.addComponent(cc.Label);
    rightLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
    rightLabel.font = _atlas;
    rightLabel.fontSize = _fontSize;
    rightLabel.lineHeight = _fontSize;

    _label = {
        left: leftLabel,
        right: rightLabel
    };
}

function beforeUpdate () {
    generateNode();

    _stats['frame']._counter.start();
    _stats['logic']._counter.start();
}

function afterUpdate () {
    if (cc.director.isPaused()) {
        _stats['frame']._counter.start();
    }
    else {
        _stats['logic']._counter.end();
    }
    _stats['render']._counter.start();
}

function updateLabel (stat) {
    let length = 20;
    let desc = stat.desc;
    let value = stat._counter.human() + '';
    stat.label.string = stat.desc + '  ' + stat._counter.human();
}

function afterDraw () {
    _stats['render']._counter.end();
    _stats['draws']._counter.value = cc.renderer.drawCalls;
    _stats['frame']._counter.end();
    _stats['fps']._counter.frame();
    
    let left = '';
    let right = '';
    for (let id in _stats) {
        let stat = _stats[id];
        stat._counter.sample();

        left += stat.desc + '\n';
        right += stat._counter.human() + '\n';
    }

    _label.left.string = left;
    _label.right.string = right;
}

cc.profiler = module.exports = {
    isShowingStats () {
        return _showFPS;
    },

    hideStats () {
        if (_showFPS) {
            if (_rootNode) {
                _rootNode.active = false;
            }

            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, afterUpdate);
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = false;
        }
    },

    showStats () {
        if (!_showFPS) {
            generateAtlas();
            generateStats();

            if (_rootNode) {
                _rootNode.active = true;
            }

            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, afterUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = true;
        }
    }
}