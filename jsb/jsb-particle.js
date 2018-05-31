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

'use strict';

cc.ParticleSystem.Mode = cc.Enum({
    /** The gravity mode (A mode) */
    GRAVITY: 0,
    /** The radius mode (B mode) */
    RADIUS: 1
});


cc.ParticleSystem.Type = cc.Enum({
    /**
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     */
    FREE: 0,

    /**
     * Living particles are attached to the world but will follow the emitter repositioning.<br/>
     * Use case: Attach an emitter to an sprite, and you want that the emitter follows the sprite.
     */
    RELATIVE: 1,

    /**
     * Living particles are attached to the emitter and are translated along with it.
     */
    GROUPED: 2
});

var funcNames = [
    {
        'tangentialAccel' : 'setTangentialAccel',
        'tangentialAccelVar' : 'setTangentialAccelVar',
        'radialAccel' : 'setRadialAccel',
        'radialAccelVar' : 'setRadialAccelVar',
        'rotationIsDir' : 'setRotationIsDir',
        'gravity' : 'setGravity',
        'speed' : 'setSpeed',
        'speedVar' : 'setSpeedVar'
    },
    {
        'startRadius' : 'setStartRadius',
        'startRadiusVar' : 'setStartRadiusVar',
        'endRadius' : 'setEndRadius',
        'endRadiusVar' : 'setEndRadiusVar',
        'rotatePerS' : 'setRotatePerSecond',
        'rotatePerSVar' : 'setRotatePerSecondVar'
    }
];

function getReplacer (oldFunc, mode) {
    return function (value) {
        if (this.getEmitterMode() === mode) {
            oldFunc.call(this, value);
        }
    };
}

var proto = cc.ParticleSystem.prototype;

proto._initWithFile = proto.initWithFile;
proto.initWithFile = function (plistFile) {
    var md5Pipe = cc.loader.md5Pipe;
    if (md5Pipe) {
        plistFile = md5Pipe.transformURL(plistFile);
    }
    this._initWithFile(plistFile);
};

for (var mode = 0; mode < funcNames.length; mode++) {
    var modeFuncs = funcNames[mode];
    for (var propName in modeFuncs) {
        var funcName = modeFuncs[propName];
        var func = proto[funcName];
        proto[funcName] = getReplacer(func, mode);

        var getter = funcName.replace('set', 'get');
        cc.defineGetterSetter(proto, propName, proto[getter], proto[funcName]);
    }
}

