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

cc.Audio = function (src) {
    this.src = src;
    this.volume = 1;
    this.loop = false;

    this.id = -1;
};

(function (prototype, audioEngine) {

    prototype.State = audioEngine.AudioState;

    prototype.play = function () {
        this.id = audioEngine.play2d(this.src, this.loop, this.volume);
    };

    prototype.pause = function () {
        audioEngine.pause(this.id);
    };

    prototype.resume = function () {
        audioEngine.resume(this.id);
    };

    prototype.stop = function () {
        audioEngine.stop(this.id);
    };

    prototype.setLoop = function (loop) {
        this.loop = loop;
        audioEngine.setLoop(this.id, loop)
    };

    prototype.getLoop = function () {
        return audioEngine.getLoop(this.id)
    };

    prototype.setVolume = function (volume) {
        this.volume = volume;
        return audioEngine.setVolume(this.id, volume)
    };

    prototype.getVolume = function () {
        return audioEngine.getVolume(this.id)
    };

    prototype.setCurrentTime = function (time) {
        audioEngine.setCurrentTime(this.id, time);
    };

    prototype.getCurrentTime = function () {
        return audioEngine.getCurrentTime(this.id)
    };

    prototype.getDuration = function () {
        return audioEngine.getDuration(this.id)
    };

    prototype.getState = function () {
        return audioEngine.getState(this.id)
    };

})(cc.Audio.prototype, jsb.AudioEngine);