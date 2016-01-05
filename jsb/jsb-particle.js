/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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
