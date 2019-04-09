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
import { _decorator } from '../../core/data/index';
const { ccclass, property } = _decorator;
import { Asset } from '../../assets/asset';
import { Quat, Vec3 } from '../../core/value-types';
import quat from '../../core/vmath/quat';
import { clamp } from '../../core/vmath/utils';
import vec3 from '../../core/vmath/vec3';
import { Node } from '../../scene-graph/node';
import { ccenum } from '../../core/value-types/enum';

const tmpvec3 = new Vec3();
const tmpquat = new Quat();

function _binaryIndexOf (array: number[], key: number) {
    let lo = 0;
    let hi = array.length - 1;
    while (lo <= hi) {
        const mid = ((lo + hi) >> 1);
        const val = array[mid];
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

export enum AnimationTargetProperty {
    position,
    rotation,
    scale,
}

cc.AnimationTargetProperty = AnimationTargetProperty;

ccenum(AnimationTargetProperty);

export interface IPropertyAnimation {
    /**
     * Target Property to animate.
     */
    property: AnimationTargetProperty;

    /**
     * Index of keys into animation's keysList property;
     */
    indexOfKeys: number;

    /**
     * Property values.
     */
    values: number[];
}

export interface IAnimationChannel {
    /**
     * Target node's path in scene graph.
     */
    target: string;

    /**
     * Properties animation.
     */
    propertyAnimations: IPropertyAnimation[];
}

@ccclass('cc.AnimationClip')
export default class AnimationClip extends Asset {
    @property
    private _channels: IAnimationChannel[] = [];

    @property
    private _keysList: number[][] = [];

    @property
    private _length: number = 0.0;

    get keysList () {
        return this._keysList;
    }

    get channels () {
        return this._channels;
    }

    get length () {
        return this._length;
    }
}

cc.AnimationClip = AnimationClip;

export class AnimationTarget {
    private _nodes: Node[] = [];
    private _pathMap: Map<string, number> = new Map();

    public add (path: string, node: Node) {
        if (this._pathMap.has(path)) {
            return;
        }
        const index = this._nodes.length;
        this._nodes.push(node);
        this._pathMap.set(path, index);
    }

    public get (path: string) {
        return this._pathMap.get(path);
    }

    get nodes () {
        return this._nodes;
    }

    public getDefaultPosition (nodeIndex: number) {
        return this._nodes[nodeIndex].getPosition();
        // return this._defaultPositions[nodeIndex];
    }

    public getDefaultScale (nodeIndex: number) {
        return this._nodes[nodeIndex].getScale();
        // return this._defaultScales[nodeIndex];
    }

    public getDefaultRotation (nodeIndex: number) {
        return this._nodes[nodeIndex].getRotation();
        // return this._defaultRotations[nodeIndex];
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
    private _animationTarget: AnimationTarget;
    private _nodeSamplingStates: NodeSamplingState[];

    constructor (animationTarget: AnimationTarget) {
        this._animationTarget = animationTarget;

        const targetNodes = this._animationTarget.nodes;
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
    public reset () {
        this._nodeSamplingStates.forEach(
            (nodeSamlingState) => nodeSamlingState.reset());
    }

    /**
     * Updates the sampling result.
     */
    public apply () {
        this._nodeSamplingStates.forEach(
            (nodeSamlingState) => nodeSamlingState.apply());
    }

    /** Sample data of this animation clip in a specific time and blend that data
     *  with a weight together with previous data(if exist, or blank if not exists) sampled before.
     *
     * @param clip
     * @param t The time.
     * @param weight The weight.
     * @param [mask] The skeleton mask.
     */
    public sample (clip: AnimationClip, t: number, weight: number, mask?: any) {
        t = clamp(t, 0, clip.length);

        const binaryIndicesOfKeysList: number[] = new Array(clip.keysList.length);
        binaryIndicesOfKeysList.fill(-1);
        const calcBinarayIndicesOfKeys = (iKeys: number) => {
            let v = binaryIndicesOfKeysList[iKeys];
            if (v < 0) {
                const keys = clip.keysList[iKeys];
                if (keys.length === 1) {
                    v = 0;
                } else {
                    v = _binaryIndexOf(keys, t);
                }
                binaryIndicesOfKeysList[iKeys] = v;
            }
            return v;
        };

        const getState = (channel: IAnimationChannel) => {
            const iNode = this._animationTarget.get(channel.target);
            if (iNode === undefined) {
                return null;
            }
            return this._nodeSamplingStates[iNode];
        };

        const tempVec3_1 = new Vec3();
        const tempVec3_2 = new Vec3();
        const tempQuat_1 = new Quat();
        const tempQuat_2 = new Quat();

        clip.channels.forEach((channel) => {
            const nodeSamlingState = getState(channel);
            if (!nodeSamlingState) {
                return;
            }
            channel.propertyAnimations.forEach((propertyAnimation) => {
                const getPositionAt = (index: number, out: Vec3) => vec3.set(out,
                    propertyAnimation.values[index * 3 + 0],
                    propertyAnimation.values[index * 3 + 1],
                    propertyAnimation.values[index * 3 + 2]);
                const getRotationAt = (index: number, out: Quat) => quat.set(out,
                    propertyAnimation.values[index * 4 + 0],
                    propertyAnimation.values[index * 4 + 1],
                    propertyAnimation.values[index * 4 + 2],
                    propertyAnimation.values[index * 4 + 3]);
                const getScaleAt = getPositionAt;
                const keys = clip.keysList[propertyAnimation.indexOfKeys];
                const idx = calcBinarayIndicesOfKeys(propertyAnimation.indexOfKeys);

                if (idx === 0) {
                    if (propertyAnimation.property === AnimationTargetProperty.position) {
                        const p = getPositionAt(0, tempVec3_1);
                        nodeSamlingState.blendPosition(p, weight);
                    } else if (propertyAnimation.property === AnimationTargetProperty.rotation) {
                        const r = getRotationAt(0, tempQuat_1);
                        nodeSamlingState.blendRotation(r, weight);
                    } else if (propertyAnimation.property === AnimationTargetProperty.scale) {
                        const s = getScaleAt(0, tempVec3_1);
                        nodeSamlingState.blendScale(s, weight);
                    }
                } else {
                    const loIdx = Math.max(idx - 1, 0);
                    const hiIdx = Math.min(idx, keys.length);
                    const ratio = (t - keys[loIdx]) / (keys[hiIdx] - keys[loIdx]);
                    if (propertyAnimation.property === AnimationTargetProperty.position) {
                        const a = getPositionAt(loIdx, tempVec3_1);
                        const b = getPositionAt(hiIdx, tempVec3_2);
                        vec3.lerp(tmpvec3, a, b, ratio);
                        nodeSamlingState.blendPosition(tmpvec3, weight);
                    } else if (propertyAnimation.property === AnimationTargetProperty.rotation) {
                        const a = getRotationAt(loIdx, tempQuat_1);
                        const b = getRotationAt(hiIdx, tempQuat_2);
                        quat.slerp(tmpquat, a, b, ratio);
                        nodeSamlingState.blendRotation(tmpquat, weight);
                    } else if (propertyAnimation.property === AnimationTargetProperty.scale) {
                        const a = getScaleAt(loIdx, tempVec3_1);
                        const b = getScaleAt(hiIdx, tempVec3_2);
                        vec3.lerp(tmpvec3, a, b, ratio);
                        nodeSamlingState.blendScale(tmpvec3, weight);
                    }
                }
            });
        });
    }
}

class NodeSamplingState {
    private _target: Node;
    private _defaultPosition: Vec3;
    private _defaultScale: Vec3;
    private _defaultRotation: Quat;
    private _sumPosWeight = 0;
    private _sumScaleWeight = 0;
    private _sumRotWeight = 0;

    constructor (target: Node, defaultPosition: Vec3, defaultScale: Vec3, defaultRotation: Quat) {
        this._target = target;
        this._defaultPosition = defaultPosition;
        this._defaultScale = defaultScale;
        this._defaultRotation = defaultRotation;
    }

    public reset () {
        this._sumPosWeight = 0.0;
        this._sumScaleWeight = 0.0;
        this._sumRotWeight = 0.0;
        this._target.setPosition(0, 0, 0);
        this._target.setScale(0, 0, 0);
        this._target.setRotation(0, 0, 0, 1);
    }

    public blendPosition (position: Vec3, weight: number) {
        vec3.scaleAndAdd(tmpvec3, this._target.getPosition(), position, weight);
        this._target.setPosition(tmpvec3);
        this._sumPosWeight += weight;
    }

    public blendScale (scale: Vec3, weight: number) {
        vec3.scaleAndAdd(tmpvec3, this._target.getScale(), scale, weight);
        this._target.setScale(tmpvec3);
        this._sumScaleWeight += weight;
    }

    /**
     * Inspired by:
     * https://gamedev.stackexchange.com/questions/62354/method-for-interpolation-between-3-quaternions
     */
    public blendRotation (rotation: Quat, weight: number) {
        if (weight === 0) {
            return;
        }
        const t = weight / (this._sumRotWeight + weight);
        quat.slerp(tmpquat, this._target.getRotation(), rotation, t);
        this._target.setRotation(tmpquat);
        this._sumRotWeight += weight;
    }

    public apply () {
        if (CC_DEV) {
            if (this._sumPosWeight > 1.0 || this._sumRotWeight > 1.0 || this._sumScaleWeight > 1.0) {
                throw new Error(`Unexpected.`);
            }
        }

        if (this._sumPosWeight < 1.0) {
            this.blendPosition(this._defaultPosition, 1.0 - this._sumPosWeight);
        }
        if (this._sumScaleWeight < 1.0) {
            this.blendScale(this._defaultScale, 1.0 - this._sumScaleWeight);
        }
        if (this._sumRotWeight < 1.0) {
            this.blendRotation(this._defaultRotation, 1.0 - this._sumRotWeight);
        }
    }
}
