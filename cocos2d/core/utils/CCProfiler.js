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

/**
 * @class profiler
 */
cc.profiler = (function () {
    var _inited = false, _showFPS = false;
    var _frames = 0, _frameRate = 0, _lastSPF = 0, _accumDt = 0;
    var _FPSLabel = null,
        _SPFLabel = null,
        _drawsLabel = null,
        _ModeLabel = null,
        _fps = null;
    var LEVEL_DET_FACTOR = 0.6, _levelDetCycle = 10;
    var LEVELS = [0, 10, 20, 30];
    var _fpsCount = [0, 0, 0, 0];
    var _currLevel = 3, _analyseCount = 0, _totalFPS = 0;

    var createStatsLabel = function () {
        _FPSLabel = document.createElement('div');
        _SPFLabel = document.createElement('div');
        _drawsLabel = document.createElement('div');
        _ModeLabel = document.createElement('div');
        _fps = document.createElement('div');

        _fps.id = 'fps';
        _fps.style.position = 'absolute';
        _fps.style.padding = '3px';
        _fps.style.textAlign = 'left';
        _fps.style.backgroundColor = 'rgb(0, 0, 34)';
        _fps.style.bottom = cc.macro.DIRECTOR_STATS_POSITION.y + '0px';
        _fps.style.left = cc.macro.DIRECTOR_STATS_POSITION.x + 'px';
        _fps.style.width = '45px';
        _fps.style.height = '80px';

        var labels = [_drawsLabel, _SPFLabel, _FPSLabel, _ModeLabel];
        for (var i = 0; i < labels.length; ++i) {
            var style = labels[i].style;
            style.color = 'rgb(0, 255, 255)';
            style.font = 'bold 12px Helvetica, Arial';
            style.lineHeight = '20px';
            style.width = '100%';
            _fps.appendChild(labels[i]);
        }
    };

    var analyseFPS = function (fps) {
        var lastId = LEVELS.length - 1,
            i = lastId, 
            ratio, 
            average = 0;
        _analyseCount++;
        _totalFPS += fps;

        for (; i >= 0; i--) {
            if (fps >= LEVELS[i]) {
                _fpsCount[i]++;
                break;
            }
        }

        if (_analyseCount >= _levelDetCycle) {
            average = _totalFPS / _levelDetCycle;
            for (i = lastId; i >0; i--) {
                ratio = _fpsCount[i] / _levelDetCycle;
                // Determined level
                if (ratio >= LEVEL_DET_FACTOR && average >= LEVELS[i]) {
                    // Level changed
                    if (i !== _currLevel) {
                        _currLevel = i;
                        profiler.onFrameRateChange && profiler.onFrameRateChange(average.toFixed(2));
                    }
                    break;
                }
                // If no level determined, that means the framerate is not stable
            }

            _analyseCount = 0;
            _totalFPS = 0;
            for (i = lastId; i > 0; i--) {
                _fpsCount[i] = 0;
            }
        }
    };

    var afterVisit = function () {
        _lastSPF = cc.director.getSecondsPerFrame();
        _frames++;
        _accumDt += cc.director.getDeltaTime();
        
        if (_accumDt > cc.macro.DIRECTOR_FPS_INTERVAL) {
            _frameRate = _frames / _accumDt;
            _frames = 0;
            _accumDt = 0;

            if (profiler.onFrameRateChange) {
                analyseFPS(_frameRate);
            }

            if (_showFPS) {
                _SPFLabel.innerText = _lastSPF.toFixed(3);
                _FPSLabel.innerText = _frameRate.toFixed(1);
                _drawsLabel.innerText = (0 | cc.g_NumberOfDraws).toString();
                _ModeLabel.innerText = (cc._renderType === cc.game.RENDER_TYPE_CANVAS) ? 'Canvas' : 'WebGL';
            }
        }
    };

    var profiler = {
        onFrameRateChange: null,

        getSecondsPerFrame: function () {
            return _lastSPF;
        },
        getFrameRate: function () {
            return _frameRate;
        },

        setProfileDuration: function (duration) {
            if (!isNaN(duration) && duration > 0) {
                _levelDetCycle = duration / cc.macro.DIRECTOR_FPS_INTERVAL;
            }
        },

        resumeProfiling: function () {
            cc.director.on(cc.Director.EVENT_AFTER_VISIT, afterVisit);
        },

        stopProfiling: function () {
            cc.director.off(cc.Director.EVENT_AFTER_VISIT, afterVisit);
        },

        isShowingStats: function () {
            return _showFPS;
        },

        showStats: function () {
            if (!_inited) {
                this.init();
            }
            if (_fps.parentElement === null) {
                cc.container.appendChild(_fps);
            }
            _showFPS = true;
        },

        hideStats: function () {
            _showFPS = false;
            if (_fps && _fps.parentElement === cc.container) {
                cc.container.removeChild(_fps);
            }
        },

        init: function () {
            if (!_inited) {
                createStatsLabel();
                this.resumeProfiling();
                _inited = true;
            }
        }
    };

    return profiler;
})();

module.exports = cc.profiler;