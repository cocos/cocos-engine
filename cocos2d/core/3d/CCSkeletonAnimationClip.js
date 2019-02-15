/****************************************************************************
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

const AnimationClip = require('../../animation/animation-clip');

const PropertyEnum = cc.Enum({
    POSITION: 1,
    SCALE: 2,
    QUAT: 4
});

 /**
 * @module cc
 */
/**
 * !#en SkeletonAnimationClip Asset.
 * !#zh 骨骼动画剪辑。
 * @class SkeletonAnimationClip
 * @extends AnimationClip
 */
var SkeletonAnimationClip = cc.Class({
    name: 'cc.SkeletonAnimationClip',
    extends: AnimationClip,

    properties: {
        _nativeAsset: {
            override: true,
            get () {
                return this._buffer;
            },
            set (bin) {
                let buffer = ArrayBuffer.isView(bin) ? bin.buffer : bin;
                this._buffer = new Float32Array(buffer || bin, 0, buffer.byteLength/4);
            }
        },

        /**
         * Describe the data structure.
         * { path: { offset, frameCount, property } }
         */
        description: {
            default: null,
            type: Object,
        },

        /**
         * SkeletonAnimationClip's curveData is generated from binary buffer.
         * So should not serialize curveData.
         */
        curveData: {
            default: {},
            visible: false,
            override: true,
            serializable: false
        },
    },

    statics: { 
        PropertyEnum
    },
    
    onLoad () {
        let buffer = this._buffer;
        let description = this.description;

        let offset = 0;
        function getValue () {
            return buffer[offset++];
        }

        if (!this.curveData) {
            this.curveData = {};
        }
        if (!this.curveData.paths) {
            this.curveData.paths = {};
        }
        let paths = this.curveData.paths;

        for (let path in description) {
            let des = description[path];
            let curves = {};
            paths[path] = { props: curves };
            
            for (let property in des) {
                let frames = [];

                let frameCount = des[property].frameCount;
                offset = des[property].offset;
                for (let i = 0; i < frameCount; i++) {
                    let frame = getValue();
                    let value;
                    if (property === 'position' || property === 'scale') {
                        value = cc.v3(getValue(), getValue(), getValue());
                    }
                    else if (property === 'quat') {
                        value = cc.quat(getValue(), getValue(), getValue(), getValue());
                    }
                    frames.push({ frame, value });
                }
                
                curves[property] = frames;
            }
        }
    }

});

cc.SkeletonAnimationClip = module.exports = SkeletonAnimationClip;
