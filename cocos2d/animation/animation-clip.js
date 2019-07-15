/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const WrapMode = require('./types').WrapMode;
const { DynamicAnimCurve, quickFindIndex } = require('./animation-curves');
const sampleMotionPaths = require('./motion-path-helper').sampleMotionPaths;
const binarySearch = require('../core/utils/binary-search').binarySearchEpsilon;

/**
 * !#en Class for animation data handling.
 * !#zh 动画剪辑，用于存储动画数据。
 * @class AnimationClip
 * @extends Asset
 */
var AnimationClip = cc.Class({
    name: 'cc.AnimationClip',
    extends: cc.Asset,

    properties: {
        _duration: {
            default: 0,
            type: cc.Float,
        },

        /**
         * !#en Duration of this animation.
         * !#zh 动画的持续时间。
         * @property duration
         * @type {Number}
         */
        duration: {
            get: function () { return this._duration; },
        },

        /**
         * !#en FrameRate of this animation.
         * !#zh 动画的帧速率。
         * @property sample
         * @type {Number}
         */
        sample: {
            default: 60,
        },

        /**
         * !#en Speed of this animation.
         * !#zh 动画的播放速度。
         * @property speed
         * @type {Number}
         */
        speed: {
            default: 1
        },

        /**
         * !#en WrapMode of this animation.
         * !#zh 动画的循环模式。
         * @property wrapMode
         * @type {WrapMode}
         */
        wrapMode: {
            default: WrapMode.Normal
        },

        /**
         * !#en Curve data.
         * !#zh 曲线数据。
         * @property curveData
         * @type {Object}
         * @example {@link cocos2d/core/animation-clip/curve-data.js}
         */
        curveData: {
            default: {},
            visible: false,
        },

        /**
         * !#en Event data.
         * !#zh 事件数据。
         * @property events
         * @type {Object[]}
         * @example {@link cocos2d/core/animation-clip/event-data.js}
         * @typescript events: {frame: number, func: string, params: string[]}[]
         */
        events: {
            default: [],
            visible: false,
        }
    },

    statics: {
        /**
         * !#en Crate clip with a set of sprite frames
         * !#zh 使用一组序列帧图片来创建动画剪辑
         * @method createWithSpriteFrames
         * @param {[SpriteFrame]} spriteFrames
         * @param {Number} sample
         * @return {AnimationClip}
         * @static
         * @example
         *
         * var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
         *
         */
        createWithSpriteFrames: function (spriteFrames, sample) {
            if (!Array.isArray(spriteFrames)) {
                cc.errorID(3905);
                return null;
            }

            var clip = new AnimationClip();
            clip.sample = sample || clip.sample;

            clip._duration = spriteFrames.length / clip.sample;

            var frames = [];
            var step = 1 / clip.sample;

            for (var i = 0, l = spriteFrames.length; i < l; i++) {
                frames[i] = { frame: (i * step), value: spriteFrames[i] };
            }

            clip.curveData = {
                comps: {
                    // component
                    'cc.Sprite': {
                        // component properties
                        'spriteFrame': frames
                    }
                }
            };

            return clip;
        }
    },

    onLoad () {
        this._duration = Number.parseFloat(this.duration);
        this.speed = Number.parseFloat(this.speed);
        this.wrapMode = Number.parseInt(this.wrapMode);
        this.frameRate = Number.parseFloat(this.sample);
    },

    createPropCurve (target, propPath, keyframes) {
        let motionPaths = [];
        let isMotionPathProp = target instanceof cc.Node && propPath === 'position';

        let curve = new DynamicAnimCurve();

        // 缓存目标对象，所以 Component 必须一开始都创建好并且不能运行时动态替换……
        curve.target = target;
        curve.prop = propPath;

        // for each keyframes
        for (let i = 0, l = keyframes.length; i < l; i++) {
            let keyframe = keyframes[i];
            let ratio = keyframe.frame / this.duration;
            curve.ratios.push(ratio);

            if (isMotionPathProp) {
                motionPaths.push(keyframe.motionPath);
            }

            let curveValue = keyframe.value;
            curve.values.push(curveValue);

            let curveTypes = keyframe.curve;
            if (curveTypes) {
                if (typeof curveTypes === 'string') {
                    curve.types.push(curveTypes);
                    continue;
                }
                else if (Array.isArray(curveTypes)) {
                    if (curveTypes[0] === curveTypes[1] &&
                        curveTypes[2] === curveTypes[3]) {
                        curve.types.push(DynamicAnimCurve.Linear);
                    }
                    else {
                        curve.types.push(DynamicAnimCurve.Bezier(curveTypes));
                    }
                    continue;
                }
            }
            curve.types.push(DynamicAnimCurve.Linear);
        }
        
        if (isMotionPathProp) {
            sampleMotionPaths(motionPaths, curve, this.duration, this.sample, target);
        }

        // if every piece of ratios are the same, we can use the quick function to find frame index.
        let ratios = curve.ratios;
        let currRatioDif, lastRatioDif;
        let canOptimize = true;
        let EPSILON = 1e-6;
        for (let i = 1, l = ratios.length; i < l; i++) {
            currRatioDif = ratios[i] - ratios[i-1];
            if (i === 1) {
                lastRatioDif = currRatioDif;
            }
            else if (Math.abs(currRatioDif - lastRatioDif) > EPSILON) {
                canOptimize = false;                
                break;
            }
        }

        curve._findFrameIndex = canOptimize ? quickFindIndex : binarySearch;

        // find the lerp function
        let firstValue = curve.values[0];
        if (firstValue !== undefined && firstValue !== null && !curve._lerp) {
            if (typeof firstValue === 'number') {
                curve._lerp = DynamicAnimCurve.prototype._lerpNumber;
            }
            else if (firstValue instanceof cc.Quat) {
                curve._lerp = DynamicAnimCurve.prototype._lerpQuat;
            }
            else if (firstValue instanceof cc.Vec2 || firstValue instanceof cc.Vec3) {
                curve._lerp = DynamicAnimCurve.prototype._lerpVector;
            }
            else if (firstValue.lerp) {
                curve._lerp = DynamicAnimCurve.prototype._lerpObject;
            }
        }

        return curve;
    },

    createTargetCurves (target, curveData, curves) {
        let propsData = curveData.props;
        let compsData = curveData.comps;

        if (propsData) {
            for (let propPath in propsData) {
                let data = propsData[propPath];
                let curve = this.createPropCurve(target, propPath, data);

                curves.push(curve);
            }
        }

        if (compsData) {
            for (let compName in compsData) {
                let comp = target.getComponent(compName);

                if (!comp) {
                    continue;
                }

                let compData = compsData[compName];
                for (let propPath in compData) {
                    let data = compData[propPath];
                    let curve = this.createPropCurve(comp, propPath, data);

                    curves.push(curve);
                }
            }
        }
    },

    createCurves (state, root) {
        let curveData = this.curveData;
        let childrenCurveDatas = curveData.paths;
        let curves = [];

        this.createTargetCurves(root, curveData, curves);

        for (let namePath in childrenCurveDatas) {
            let target = cc.find(namePath, root);

            if (!target) {
                continue;
            }

            let childCurveDatas = childrenCurveDatas[namePath];
            this.createTargetCurves(target, childCurveDatas, curves);
        }

        return curves;
    }
});

cc.AnimationClip = module.exports = AnimationClip;
