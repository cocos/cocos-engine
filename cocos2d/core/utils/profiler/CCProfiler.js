/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

let _stats = null;
let _rootNode = null;
let _label = null;

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

    let now = performance.now();
    for (let id in _stats) {
        _stats[id]._counter = new PerfCounter(id, _stats[id], now);
    }
}

function generateNode () {
    if (_rootNode && _rootNode.isValid) return;


    _rootNode = new cc.Node('PROFILER-NODE');
    _rootNode.x = _rootNode.y = 10;

    _rootNode.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG;
    cc.Camera._setupDebugCamera();

    _rootNode.zIndex = macro.MAX_ZINDEX;
    cc.game.addPersistRootNode(_rootNode);

    let left = new cc.Node('LEFT-PANEL');
    left.anchorX = left.anchorY = 0;
    let leftLabel = left.addComponent(cc.Label);
    leftLabel.fontSize = _fontSize;
    leftLabel.lineHeight = _fontSize;
    left.parent = _rootNode;

    let right = new cc.Node('RIGHT-PANEL');
    right.anchorX = 1;
    right.anchorY = 0;
    right.x = 200;
    let rightLabel = right.addComponent(cc.Label);
    rightLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
    rightLabel.fontSize = _fontSize;
    rightLabel.lineHeight = _fontSize;
    right.parent = _rootNode;
    if (cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU_GAME_SUB &&
        cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
        leftLabel.cacheMode = cc.Label.CacheMode.CHAR;
        rightLabel.cacheMode = cc.Label.CacheMode.CHAR;
    }

    _label = {
        left: leftLabel,
        right: rightLabel
    };
}

function beforeUpdate () {
    generateNode();

    let now = cc.director._lastUpdate;
    _stats['frame']._counter.start(now);
    _stats['logic']._counter.start(now);
}

function afterUpdate () {
    let now = performance.now();
    if (cc.director.isPaused()) {
        _stats['frame']._counter.start(now);
    }
    else {
        _stats['logic']._counter.end(now);
    }
    _stats['render']._counter.start(now);
}

function updateLabel (stat) {
    let length = 20;
    let desc = stat.desc;
    let value = stat._counter.human() + '';
    stat.label.string = stat.desc + '  ' + stat._counter.human();
}

function afterDraw () {
    let now = performance.now();
    _stats['render']._counter.end(now);
    _stats['draws']._counter.value = cc.renderer.drawCalls;
    _stats['frame']._counter.end(now);
    _stats['fps']._counter.frame(now);
    
    let left = '';
    let right = '';
    for (let id in _stats) {
        let stat = _stats[id];
        stat._counter.sample(now);

        left += stat.desc + '\n';
        right += stat._counter.human() + '\n';
    }

    if (_label) {
        _label.left.string = left;
        _label.right.string = right;
    }
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