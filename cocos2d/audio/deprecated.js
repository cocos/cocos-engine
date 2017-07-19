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
// var INFO = cc._LogInfos.deprecated;

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
	js.get(audioEngine, 'playMusic', function () {
		// cc.warn(INFO, 'audioEngine.playMusic', 'audioEngine.play');
		return function (url, loop) {
			audioEngine.stop(musicId);
			musicId = audioEngine.play(url, loop, musicVolume);
			musicPath = url;
			musicLoop = loop;
			return musicId;
		}
	});
	js.get(audioEngine, 'stopMusic', function () {
		// cc.warn(INFO, 'audioEngine.stopMusic', 'audioEngine.stop');
		return function () {
			audioEngine.stop(musicId);
			return musicId;
		}
	});
	js.get(audioEngine, 'pauseMusic', function () {
		// cc.warn(INFO, 'audioEngine.pauseMusic', 'audioEngine.pause');
		return function () {
			audioEngine.pause(musicId);
			return musicId;
		}
	});
	js.get(audioEngine, 'resumeMusic', function () {
		// cc.warn(INFO, 'audioEngine.resumeMusic', 'audioEngine.resume');
		return function () {
			audioEngine.resume(musicId);
			return musicId;
		}
	});
	js.get(audioEngine, 'rewindMusic', function () {
		// cc.warn(INFO, 'audioEngine.rewindMusic', 'audioEngine.setCurrentTime');
		return function () {
			audioEngine.setCurrentTime(musicId, 0);
			return musicId;
		}
	});
	js.get(audioEngine, 'getMusicVolume', function () {
		// cc.warn(INFO, 'audioEngine.getMusicVolume', 'audioEngine.getVolume');
		return function () {
			return musicVolume;
		}
	});
	js.get(audioEngine, 'setMusicVolume', function () {
		// cc.warn(INFO, 'audioEngine.setMusicVolume', 'audioEngine.setVolume');
		return function (volume) {
			musicVolume = volume;
			audioEngine.setVolume(musicId, musicVolume);
			return musicVolume;
		}
	});
	js.get(audioEngine, 'isMusicPlaying', function () {
		// cc.warn(INFO, 'audioEngine.isMusicPlaying', 'audioEngine.getState');
		return function () {
			return audioEngine.getState(musicId) === audioEngine.AudioState.PLAYING;
		}
	});
	js.get(audioEngine, 'playEffect', function () {
		// cc.warn(INFO, 'audioEngine.playEffect', 'audioEngine.play');
		return function (url, loop, volume) {
			return audioEngine.play(url, loop || false, volume === undefined ? effectsVolume : volume);
		}
	});
	js.get(audioEngine, 'setEffectsVolume', function (volume) {
		// cc.warn(INFO, 'audioEngine.setEffectsVolume', 'audioEngine.setVolume');
		return function (volume) {
			effectsVolume = volume;
			var id2audio = audioEngine._id2audio;
			for (var id in id2audio) {
				if (id === musicId) continue;
				audioEngine.setVolume(id, volume);
			}
		}
	});
	js.get(audioEngine, 'getEffectsVolume', function () {
		// cc.warn(INFO, 'audioEngine.getEffectsVolume', 'audioEngine.getVolume');
		return function () {
			return effectsVolume;
		}
	});
	js.get(audioEngine, 'pauseEffect', function () {
		// cc.warn(INFO, 'audioEngine.pauseEffect', 'audioEngine.pause');

		return function (id) {
			return audioEngine.pause(id);
		}
	});
	js.get(audioEngine, 'pauseAllEffects', function () {
		// cc.warn(INFO, 'audioEngine.pauseAllEffects', 'audioEngine.pauseAll');

		if (CC_JSB) {
			return function () {
				var musicPlay = audioEngine.getState(musicId) === audioEngine.AudioState.PLAYING;
				audioEngine.pauseAll();
				if (musicPlay) {
					audioEngine.resume(musicId);
				}
			}
		}

		return function () {
			pauseIDCache.length = 0;
			var id2audio = audioEngine._id2audio;
			for (var id in id2audio) {
				if (id === musicId) continue;
				var audio = id2audio[id];
				var state = audio.getState();
				if (state === audioEngine.AudioState.PLAYING) {
					pauseIDCache.push(id);
					audio.pause();
				}
			}
		}
	});
	js.get(audioEngine, 'resumeEffect', function () {
		// cc.warn(INFO, 'audioEngine.resumeEffect', 'audioEngine.resume');
		return function (id) {
			audioEngine.resume(id);
		}
	});
	js.get(audioEngine, 'resumeAllEffects', function () {
		// cc.warn(INFO, 'audioEngine.resumeEffect', 'audioEngine.resume');

		if (CC_JSB) {
			return function () {
				var musicPaused = audioEngine.getState(musicId) === audioEngine.AudioState.PAUSED;
				audioEngine.resumeAll();
				if (musicPaused && audioEngine.getState(musicId) === audioEngine.AudioState.PLAYING) {
					audioEngine.pause(musicId);
				}
			};
		}

		return function () {
			var id2audio = audioEngine._id2audio;
			while (pauseIDCache.length > 0) {
				var id = pauseIDCache.pop();
				var audio = id2audio[id];
				if (audio && audio.resume)
					audio.resume();
			}
		}
	});
	js.get(audioEngine, 'stopEffect', function () {
		// cc.warn(INFO, 'audioEngine.stopEffect', 'audioEngine.stop');
		return function (id) {
			return audioEngine.stop(id);
		}
	});
	js.get(audioEngine, 'stopAllEffects', function () {
		// cc.warn(INFO, 'audioEngine.stopAllEffects', 'audioEngine.stopAll');

		if (CC_JSB) {
			return function () {
				var musicPlay = audioEngine.getState(musicId) === audioEngine.AudioState.PLAYING;
				var currentTime = audioEngine.getCurrentTime(musicId);
				audioEngine.stopAll();
				if (musicPlay) {
					musicId = audioEngine.play(musicPath, musicLoop);
					audioEngine.setCurrentTime(musicId, currentTime);
				}
			}
		}

		return function () {
			var id2audio = audioEngine._id2audio;
			for (var id in id2audio) {
				if (id === musicId) continue;
				var audio = id2audio[id];
				var state = audio.getState();
				if (state === audioEngine.AudioState.PLAYING) {
					audio.stop();
				}
			}
		}
	});
	js.get(audioEngine, 'unloadEffect', function () {
		// cc.warn(INFO, 'audioEngine.unloadEffect', 'audioEngine.stop');
		return function (id) {
			return audioEngine.stop(id);
		}
	});

	if (!CC_JSB) {
		js.get(audioEngine, 'end', function () {
			// cc.warn(INFO, 'audioEngine.end', 'audioEngine.stopAll');
			return function () {
				return audioEngine.stopAll();
			}
		});
	}
};
