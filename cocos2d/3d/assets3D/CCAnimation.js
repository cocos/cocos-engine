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

var EventTarget = require('../../core/event/event-target');

var AnimationRes3D = cc.Class(/** @lends cc.Mesh# */{
    name: 'cc.AnimationRes3D',
    extends: require('../../core/assets/CCAsset'),
    mixins: [EventTarget],
    ctor: function() {
        this._jasons = null;
        this._loaded = false;
        this._animation = null;
    },
    _serialize: CC_EDITOR && function (exporting) {
        return {
            name: this._name,
            content: this._jasons
        };
    },
    _deserialize: function (data, handle) {
        this._name = data.name;
        this._jasons = data.content;
        this._parseAnimation();
        this.emit('load');
        this._loaded = true;
    },
    _parseAnimation: function() {
        var json = this._jasons;
        var animation = this._animation = new cc3d.Animation();

        animation.setName(json.id);
        //todo animation duration
        var duration = 0;
        var defaultP = [0,0,0];
        var defaultR = [0,0,0,1];
        var defaultS = [1,1,1];
        for(var j = 0; j < json.bones.length; ++j) {
            var boneKeys = json.bones[j];
            var boneNode = new cc3d.Node();
            boneNode._name = boneKeys.boneId;
            for(var k = 0; k < boneKeys.keyframes.length; ++k) {
                var keyFrame = boneKeys.keyframes[k];
                if(keyFrame.keytime > duration) duration = keyFrame.keytime;
                var p = keyFrame.translation || defaultP;
                var s = keyFrame.scale || defaultS;
                var r = keyFrame.rotation || defaultR;
                boneNode._keys.push(new cc3d.Key(keyFrame.keytime, new cc.Vec3(p[0], p[1], p[2]),
                    new cc.Quat(r[0], r[1], r[2], r[3]), new cc.Vec3(s[0], s[1], s[2])));
            }
            animation.addNode(boneNode);
        }
        animation.duration = duration;

    }
});

cc.AnimationRes3D = module.exports = AnimationRes3D;
