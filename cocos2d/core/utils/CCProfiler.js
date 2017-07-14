/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var PStats = require('../../../external/pstats/pstats');
var macro = require('../platform/CCMacro');

var _fps = document.createElement('div');
_fps.id = 'fps';

var stats = null;

let _showFPS = false;

function beforeUpdate () {
    stats('frame').start();
    stats('logic').start();
}

function afterVisit () {
    if (cc.director.isPaused()) {
        stats('frame').start();
    }
    else {
        stats('logic').end();
    }
    stats('render').start();
}

function afterDraw () {
    stats('render').end();
    stats('draws').value = cc.g_NumberOfDraws;
    stats('frame').end();
    stats('fps').frame();
    stats().tick();
}

cc.profiler = module.exports = {
    isShowingStats () {
        return _showFPS;
    },

    hideStats () {
        if (_showFPS) {
            if (_fps.parentElement === document.body) {
                document.body.removeChild(_fps);
            }
            cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.off(cc.Director.EVENT_AFTER_VISIT, afterVisit);
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = false;
        }
    },

    showStats () {
        if (!_showFPS) {
            if (!stats) {
                stats = PStats.new(_fps, {
                    showGraph: false,
                    values: {
                        frame: { desc: 'Frame time (ms)', min: 0, max: 50, average: 500 },
                        fps: { desc: 'Framerate (FPS)', below: 30, average: 500 },
                        draws: { desc: 'Draw call' },
                        logic: { desc: 'Game Logic (ms)', min: 0, max: 50, average: 500, color: '#080' },
                        render: { desc: 'Renderer (ms)', min: 0, max: 50, average: 500, color: '#f90' },
                        mode: { desc: cc._renderType === cc.game.RENDER_TYPE_WEBGL ? 'WebGL' : 'Canvas', min: 1 }
                    },
                    css: '.pstats {left: ' + macro.DIRECTOR_STATS_POSITION.x + 'px; bottom: ' + macro.DIRECTOR_STATS_POSITION.y + 'px;}'
                });
            }

            if (_fps.parentElement === null) {
                document.body.appendChild(_fps);
            }
            cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
            cc.director.on(cc.Director.EVENT_AFTER_VISIT, afterVisit);
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);
            _showFPS = true;
        }
    }
}