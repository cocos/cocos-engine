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

// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass, property } = _decorator;
import { Asset } from "../../assets/asset";
import vec3 from "../../core/vmath/vec3";
import quat from "../../core/vmath/quat";
import { clamp } from "../../core/vmath/utils";

/**
 * @typedef {import("../framework/skeleton-instance").SkeletonMask} SkeletonMask
 * @typedef {import("../../scene-graph/node").default} Node
 */

let tmpvec3 = vec3.create(0, 0, 0);
let tmpquat = quat.create();

function _binaryIndexOf(array, key) {
    let lo = 0;
    let hi = array.length - 1;
    let mid;

    while (lo <= hi) {
        mid = ((lo + hi) >> 1);
        let val = array[mid];

        if (val < key) {
            lo = mid + 1;
        } else if (val > key) {
            hi = mid - 1;
        } else {
            return mid;
        }
    }

    return lo;
}

@ccclass('cc.AnimationChannel')
export class AnimationChannel {
    /**
     * Target node's path into virtual hierarchy.
     * @type {string}
     */
    @property
    target = "";

    /**
     * Target node's position animation curve.
     * @type {cc.Vec3[]}
     */
    @property
    positionCurve = [];

    /**
     * Target node's scale animation curve.
     * @type {cc.Vec3[]}
     */
    @property
    scaleCurve = [];

    /**
     * Target node's rotation animation curve.
     * @type {cc.Quat[]}
     */
    @property
    rotationCurve = [];
}
cc.AnimationChannel = AnimationChannel;

@ccclass('cc.AnimationFrame')
export class AnimationFrame {
    @property
    _name = "";

    /**
     * @type {AnimationChannel[]}
     */
    @property
    _channels = [];

    /**
     * @type {number[]}
     */
    @property
    _times = [];

    get channels() {
        return this._channels;
    }

    get times() {
        return this._times;
    }
}
cc.AnimationFrame = AnimationFrame;

@ccclass('cc.AnimationClip')
export default class AnimationClip extends Asset {
    /**
     * @type {AnimationFrame[]}
     */
    @property
    _frames = [];

    /**
     * @type {number}
     */
    @property
    _length = 0.0;

    get frames() {
        return this._frames;
    }

    get length() {
        return this._length;
    }
}
cc.AnimationClip = AnimationClip;

export class AnimationTarget {
    constructor() {
        /**
         * @type {Node[]}
         */
        this._nodes = [];

        /**
         * @type {Map<string, number>}
         */
        this._pathMap = new Map();
    }

    add(path, node) {
        if (this._pathMap.has(path)) {
            return;
        }
        const index = this._nodes.length;
        this._nodes.push(node);
        this._pathMap.set(path, index);
    }

    get(path) {
        return this._pathMap.get(path);
    }

    get nodes() {
        return this._nodes;
    }

    getDefaultPosition(nodeIndex) {
        return this._nodes[nodeIndex].getPosition();
        //return this._defaultPositions[nodeIndex];
    }

    getDefaultScale(nodeIndex) {
        return this._nodes[nodeIndex].getScale();
        //return this._defaultScales[nodeIndex];
    }

    getDefaultRotation(nodeIndex) {
        return this._nodes[nodeIndex].getRotation();
        //return this._defaultRotations[nodeIndex];
    }

    // _saveDefaultTRS() {
    //     this._defaultPositions = new Array(this._nodes.length);
    //     this._defaultScales = new Array(this._nodes.length);
    //     this._defaultRotations = new Array(this._nodes.length);
    //     this._nodes.forEach((node, index) => {
    //         this._defaultPositions[index] = node.getPosition();
    //         this._defaultScales[index] = node.getScale();
    //         this._defaultRotations[index] = node.getRotation();
    //     });
    // }
}

/**
 * The AnimationTarget class represents the progress of blended sampling.
 */
export class AnimationSampler {
    /**
     *
     * @param {AnimationTarget} animationTarget
     */
    constructor(animationTarget) {
        /**
         * @type {AnimationTarget}
         */
        this._animationTarget = animationTarget;

        const targetNodes = this._animationTarget.nodes;
        /**
         * @type {NodeSamplingState[]}
         */
        this._nodeSamplingStates = new Array(targetNodes.length);
        this._animationTarget.nodes.forEach((targetNode, index) => {
            this._nodeSamplingStates[index] = new NodeSamplingState(
                targetNode,
                this._animationTarget.getDefaultPosition(index),
                this._animationTarget.getDefaultScale(index),
                this._animationTarget.getDefaultRotation(index));
        });
    }

    /**
     * Resets this state to get sampling start.
     */
    reset() {
        this._nodeSamplingStates.forEach(
            nodeSamlingState => nodeSamlingState.reset());
    }

    /**
     * Updates the sampling result.
     */
    apply() {
        this._nodeSamplingStates.forEach(
            nodeSamlingState => nodeSamlingState.apply());
    }

    /** Sample data of this animation clip in a specific time and blend that data
     *  with a weight together with previous data(if exist, or blank if not exists) sampled before.
     *
     * @param {AnimationClip} clip
     * @param {Number} t The time.
     * @param {Number} weight The weight.
     * @param {SkeletonMask} [mask] The skeleton mask.
     */
    sample(clip, t, weight, mask) {
        t = clamp(t, 0, clip.length);

        const getState = /** @param {AnimationChannel} [channel] */(channel) => {
            return this._nodeSamplingStates[this._animationTarget.get(channel.target)];
        };

        clip.frames.forEach((frame) => {
            let idx = 0;
            if (frame.times.length != 1)
                idx = _binaryIndexOf(frame.times, t);
            if (idx == 0) {
                frame.channels.forEach((channel) => {
                    const nodeSamlingState = getState(channel);
                    if (!nodeSamlingState) {
                        return;
                    }
                    if (channel.positionCurve.length != 0) {
                        nodeSamlingState.blendPosition(channel.positionCurve[0], weight);
                    }
                    if (channel.rotationCurve.length != 0) {
                        nodeSamlingState.blendRotation(channel.rotationCurve[0], weight);
                    }
                    if (channel.scaleCurve.length != 0) {
                        nodeSamlingState.blendScale(channel.scaleCurve[0], weight);
                    }
                });
            }
            else {
                let loIdx = Math.max(idx - 1, 0);
                let hiIdx = Math.min(idx, frame.times.length);
                let ratio = (t - frame.times[loIdx]) / (frame.times[hiIdx] - frame.times[loIdx]);

                frame.channels.forEach((channel) => {
                    const nodeSamlingState = getState(channel);
                    if (!nodeSamlingState) {
                        return;
                    }
                    if (channel.positionCurve.length != 0) {
                        let a = channel.positionCurve[loIdx];
                        let b = channel.positionCurve[hiIdx];
                        vec3.lerp(tmpvec3, a, b, ratio);
                        nodeSamlingState.blendPosition(tmpvec3, weight);
                    }
                    if (channel.rotationCurve.length != 0) {
                        let a = channel.rotationCurve[loIdx];
                        let b = channel.rotationCurve[hiIdx];
                        quat.slerp(tmpquat, a, b, ratio);
                        nodeSamlingState.blendRotation(tmpquat, weight);
                    }
                    if (channel.scaleCurve.length != 0) {
                        let a = channel.scaleCurve[loIdx];
                        let b = channel.scaleCurve[hiIdx];
                        vec3.lerp(tmpvec3, a, b, ratio);
                        nodeSamlingState.blendScale(tmpvec3, weight);
                    }
                });
            }
        });
    }
}

class NodeSamplingState {
    /**
     *
     * @param {Node} target
     * @param {cc.Vec3} defaultPosition
     * @param {cc.Vec3} defaultScale
     * @param {cc.Quat} defaultRotation
     */
    constructor(target, defaultPosition, defaultScale, defaultRotation) {
        /**
         * @type {Node}
         */
        this._target = target;

        /**
         * @type {cc.Vec3}
         */
        this._defaultPosition = defaultPosition;

        /**
         * @type {cc.Vec3}
         */
        this._defaultScale = defaultScale;

        /**
         * @type {cc.Quat}
         */
        this._defaultRotation = defaultRotation;
    }

    reset() {
        /**
         * @type {Number}
         */
        this._sumPosWeight = 0.0;

        /**
         * @type {Number}
         */
        this._sumScaleWeight = 0.0;

        /**
         * @type {Number}
         */
        this._sumRotWeight = 0.0;
        this._target.setPosition(0, 0, 0);
        this._target.setScale(0, 0, 0);
        this._target.setRotation(0, 0, 0, 1);
    }

    blendPosition(pos, weight) {
        vec3.scaleAndAdd(tmpvec3, this._target._lpos, pos, weight);
        this._target.setPosition(tmpvec3);
        this._sumPosWeight += weight;
    }

    blendScale(scale, weight) {
        vec3.scaleAndAdd(tmpvec3, this._target._lscale, scale, weight);
        this._target.setScale(tmpvec3);
        this._sumScaleWeight += weight;
    }

    /**
     * Inspired by:
     * https://gamedev.stackexchange.com/questions/62354/method-for-interpolation-between-3-quaternions
     */
    blendRotation(rot, weight) {
        let t = weight / (this._sumRotWeight + weight);
        quat.slerp(tmpquat, this._target._lrot, rot, t);
        this._target.setRotation(tmpquat);
        this._sumRotWeight += weight;
    }

    apply() {
        if (this._sumPosWeight < 1.0)
            this.blendPosition(this._defaultPosition, 1.0 - this._sumPosWeight);
        if (this._sumScaleWeight < 1.0)
            this.blendScale(this._defaultScale, 1.0 - this._sumScaleWeight);
        if (this._sumRotWeight < 1.0)
            this.blendRotation(this._defaultRotation, 1.0 - this._sumRotWeight);
    }
}
