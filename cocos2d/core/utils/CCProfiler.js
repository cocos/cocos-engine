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

var LStats = require('../../../external/lstats/lstats');

var _fps = document.createElement('div');
_fps.id = 'fps';

let stats = new LStats(_fps, [
    'fps', 'ms', 'mem'
]);

let _showFPS = false;

function tick () {
    stats.tick();
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
            cc.director.off(cc.Director.EVENT_AFTER_VISIT, tick);
            _showFPS = false;
        }
    },

    showStats () {
        if (!_showFPS) {
            if (_fps.parentElement === null) {
                document.body.appendChild(_fps);
            }
            cc.director.on(cc.Director.EVENT_AFTER_VISIT, tick);
            _showFPS = true;
        }
    }
}