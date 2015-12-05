/**
 * @class profiler
 */
cc.profiler = (function () {
    var _inited = _showFPS = false;
    var _frames = _frameRate = _lastSPF = _accumDt = 0;
    var _afterProjection = _afterVisitListener = _FPSLabel = _SPFLabel = _drawsLabel = null;

    var LEVEL_DET_FACTOR = 0.6, _levelDetCycle = 10;
    var LEVELS = [0, 10, 20, 30];
    var _fpsCount = [0, 0, 0, 0];
    var _currLevel = 3, _analyseCount = 0, _totalFPS = 0;

    var createStatsLabel = function () {
        var fontSize = 0;
        var w = cc.winSize.width, h = cc.winSize.height;
        var locStatsPosition = cc.DIRECTOR_STATS_POSITION;
        if (w > h)
            fontSize = 0 | (h / 320 * 24);
        else
            fontSize = 0 | (w / 320 * 24);

        _FPSLabel = new cc.LabelTTF("000.0", "Arial", fontSize);
        _SPFLabel = new cc.LabelTTF("0.000", "Arial", fontSize);
        _drawsLabel = new cc.LabelTTF("0000", "Arial", fontSize);

        _drawsLabel.setPosition(_drawsLabel.width / 2 + locStatsPosition.x, _drawsLabel.height * 5 / 2 + locStatsPosition.y);
        _SPFLabel.setPosition(_SPFLabel.width / 2 + locStatsPosition.x, _SPFLabel.height * 3 / 2 + locStatsPosition.y);
        _FPSLabel.setPosition(_FPSLabel.width / 2 + locStatsPosition.x, _FPSLabel.height / 2 + locStatsPosition.y);
    };

    var analyseFPS = function (fps) {
        var lastId = i = LEVELS.length - 1, ratio, average = 0;
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
                    if (i != _currLevel) {
                        _currLevel = i;
                        profiler.onFrameRateChange && profiler.onFrameRateChange(average.toFixed(2));
                    }
                    break;
                }
                // If no level determined, that means the framerate is not stable
            }

            _changeCount = 0;
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
        
        if (_accumDt > cc.DIRECTOR_FPS_INTERVAL) {
            _frameRate = _frames / _accumDt;
            _frames = 0;
            _accumDt = 0;

            if (profiler.onFrameRateChange) {
                analyseFPS(_frameRate);
            }

            if (_showFPS) {
                _SPFLabel.string = _lastSPF.toFixed(3);
                _FPSLabel.string = _frameRate.toFixed(1);
                _drawsLabel.string = (0 | cc.g_NumberOfDraws).toString();
            }
        }

        if (_showFPS) {
            _FPSLabel.visit();
            _SPFLabel.visit();
            _drawsLabel.visit();
        }
    };

    var afterProjection = function(){
        _FPSLabel._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        _SPFLabel._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        _drawsLabel._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
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
                _levelDetCycle = duration / cc.DIRECTOR_FPS_INTERVAL;
            }
        },

        resumeProfiling: function () {
            cc.director.on(cc.Director.EVENT_AFTER_VISIT, afterVisit);
            cc.director.on(cc.Director.EVENT_PROJECTION_CHANGED, afterProjection);
        },

        stopProfiling: function () {
            cc.director.off(cc.Director.EVENT_AFTER_VISIT, afterVisit);
            cc.director.off(cc.Director.EVENT_PROJECTION_CHANGED, afterProjection);
        },

        isShowingStats: function () {
            return _showFPS;
        },

        showStats: function () {
            if (!_inited) {
                this.init();
            }
            if (cc.LabelTTF && !_FPSLabel) {
                createStatsLabel();
            }
            if (_FPSLabel) {
                _showFPS = true;
            }
        },

        hideStats: function () {
            _showFPS = false;
        },

        init: function () {
            if (!_inited) {
                this.resumeProfiling();
                _inited = true;
            }
        }
    };

    return profiler;
})();

module.exports = cc.profiler;