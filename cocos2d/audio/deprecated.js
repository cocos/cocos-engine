/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

var js = cc.js;
var INFO = cc._LogInfos.deprecated;

exports.removed = function (audioEngine) {
	function willPlayMusicError () {
		cc.errorID(1403);
	}
	js.getset(audioEngine, 'willPlayMusic', willPlayMusicError, willPlayMusicError);
};

exports.deprecated = function (audioEngine) {

	var musicId = -1;
	var musicPath = 1;
	var musicLoop = 1;
	var musicVolume = 1;
	var effectsVolume = 1;
	var pauseIDCache = [];
	js.get(audioEngine, 'rewindMusic', function () {
		cc.warn(INFO, 'audioEngine.rewindMusic', 'audioEngine.setCurrentTime');
		return function () {
			audioEngine.setCurrentTime(musicId, 0);
			return musicId;
		}
	});
	js.get(audioEngine, 'unloadEffect', function () {
		cc.warn(INFO, 'audioEngine.unloadEffect', 'audioEngine.stop');
		return function (id) {
			return audioEngine.stop(id);
		}
	});

	if (!CC_JSB) {
		js.get(audioEngine, 'end', function () {
			cc.warn(INFO, 'audioEngine.end', 'audioEngine.stopAll');
			return function () {
				return audioEngine.stopAll();
			}
		});
	}
};
