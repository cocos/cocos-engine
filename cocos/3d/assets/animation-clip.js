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
const {ccclass} = _decorator;
import Asset from "../../assets/CCAsset";

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

@ccclass
export class AnimationClip extends Asset {
  constructor() {
    super();

    /**
     * framesList: [{
     *   name: '',
     *   times: [0.0, ...],
     *   jionts: [{ id: -1, translations: [], rotations: [], scales: [] }, ...],
     * }, ...]
     */
    this._framesList = null;
    this._length = 0.0;

    // TODO:
    // this._events = []
  }

  get length() {
    return this._length;
  }

  sample(skeleton, t) {
    clamp(t, 0, this._length);

    for (let i = 0; i < this._framesList.length; ++i) {
      let frames = this._framesList[i];

      let idx = 0;
      if (frames.times.length != 1) {
        idx = _binaryIndexOf(frames.times, t);
      }
      if (idx == 0) {
        for (let j = 0; j < frames.joints.length; ++j) {
          let jointFrames = frames.joints[j];
          let joint = skeleton._joints[jointFrames.id];
          if (!joint) {
            continue;
          }

          if (jointFrames.translations) {
            joint.setLocalPos(jointFrames.translations[0]);
          }

          if (jointFrames.rotations) {
            joint.setLocalRot(jointFrames.rotations[0]);
          }

          if (jointFrames.scales) {
            joint.setLocalScale(jointFrames.scales[0]);
          }
        }
      } else {
        let loIdx = Math.max(idx - 1, 0);
        let hiIdx = Math.min(idx, frames.times.length);
        let ratio = (t - frames.times[loIdx]) / (frames.times[hiIdx] - frames.times[loIdx]);

        for (let j = 0; j < frames.joints.length; ++j) {
          let jointFrames = frames.joints[j];
          let joint = skeleton._joints[jointFrames.id];
          if (!joint) {
            continue;
          }

          if (jointFrames.translations) {
            let a = jointFrames.translations[loIdx];
            let b = jointFrames.translations[hiIdx];

            vec3.lerp(tmpvec3, a, b, ratio);
            joint.setLocalPos(tmpvec3);
          }

          if (jointFrames.rotations) {
            let a = jointFrames.rotations[loIdx];
            let b = jointFrames.rotations[hiIdx];

            quat.slerp(tmpquat, a, b, ratio);
            joint.setLocalRot(tmpquat);
          }

          if (jointFrames.scales) {
            let a = jointFrames.scales[loIdx];
            let b = jointFrames.scales[hiIdx];

            vec3.lerp(tmpvec3, a, b, ratio);
            joint.setLocalScale(tmpvec3);
          }
        }
      }
    }

    skeleton.updateMatrices();
  }

  /** Sample data of this animation clip in a specific time and blend that data
   *  with a weight together with previous data(if exist, or blank if not exists) sampled before.
   * 
   * @param {SamplingState} state Records the sampling state.
   * @param {Number} t The time.
   * @param {Number} weight The weight.
   * @param {SkeletonMask} mask The skeleton mask.
   */
  blendedSample(state, t, weight, mask) {
    clamp(t, 0, this._length);

    let isJointMaksed = (iJoint) => {
      return mask ? mask.isMasked(iJoint) : false;
    };

    for (let i = 0; i < this._framesList.length; ++i) {
      let frames = this._framesList[i];

      let idx = 0;
      if (frames.times.length != 1)
        idx = _binaryIndexOf(frames.times, t);
      if (idx == 0) {
        for (let j = 0; j < frames.joints.length; ++j) {
          let jointFrames = frames.joints[j];
          if (isJointMaksed(jointFrames.id)) {
            continue;
          }

          let jointState = state._jointStates[jointFrames.id];
          if (!jointState) {
            continue;
          }

          if (jointFrames.translations) {
            jointState.blendPosition(jointFrames.translations[0], weight);
          }

          if (jointFrames.rotations) {
            jointState.blendRotation(jointFrames.rotations[0], weight);
          }

          if (jointFrames.scales) {
            jointState.blendScale(jointFrames.scale[0], weight);
          }
        }
      }
      else {
        let loIdx = Math.max(idx - 1, 0);
        let hiIdx = Math.min(idx, frames.times.length);
        let ratio = (t - frames.times[loIdx]) / (frames.times[hiIdx] - frames.times[loIdx]);

        for (let j = 0; j < frames.joints.length; ++j) {
          let jointFrames = frames.joints[j];
          if (isJointMaksed(jointFrames.id)) {
            continue;
          }

          let jointState = state._jointStates[jointFrames.id];
          if (!jointState) {
            continue;
          }

          if (jointFrames.translations) {
            let a = jointFrames.translations[loIdx];
            let b = jointFrames.translations[hiIdx];

            vec3.lerp(tmpvec3, a, b, ratio);
            jointState.blendPosition(tmpvec3, weight);
          }

          if (jointFrames.rotations) {
            let a = jointFrames.rotations[loIdx];
            let b = jointFrames.rotations[hiIdx];

            quat.slerp(tmpquat, a, b, ratio);
            jointState.blendRotation(tmpquat, weight);
          }

          if (jointFrames.scales) {
            let a = jointFrames.scales[loIdx];
            let b = jointFrames.scales[hiIdx];

            vec3.lerp(tmpvec3, a, b, ratio);
            jointState.blendScale(tmpvec3, weight);
          }
        }
      }
    }
  }
}

/**
 * The SamplingState class represents the progress of blended sampling.
 */
export class SamplingState {
  /**
   * 
   * @param {Skeleton} skeleton 
   */
  constructor(skeleton) {
    /**
     * @type {Skeleton}
     * @ignore
     */
    this._skeleton = skeleton;

    /**
     * @type {SamplingStateJointState[]}
     */
    this._jointStates = new Array(skeleton._joints.length);
    for (let i = 0; i < this._jointStates.length; ++i)
      this._jointStates[i] = new SamplingStateJointState(skeleton._joints[i]);
  }

  /**
   * Resets this state to get sampling start.
   */
  reset() {
    for (let i = 0; i < this._skeleton._joints.length; ++i)
      this._jointStates[i].reset();
  }

  /**
   * Updates the sampling result.
   */
  apply() {
    for (let i = 0; i < this._jointStates.length; ++i)
      this._jointStates[i].apply();
    this._skeleton.updateMatrices();
  }
}

class SamplingStateJointState {
  constructor(joint) {
    /**
     * @type {Joint}
     */
    this._joint = joint;

    /**
     * @type {vec3}
     */
    this._originalPos = joint.getLocalPos();

    /**
     * @type {vec3}
     */
    this._originalScale = joint.getLocalScale();

    /**
     * @type {quat}
     */
    this._originalRot = joint.getLocalRot();

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
  }

  reset() {
    this._joint.setLocalPos(0, 0, 0);
    this._joint.setLocalScale(1, 1, 1);
    this._joint.setLocalRot(0, 0, 0, 1);
    this._sumPosWeight = 0.0;
    this._sumScaleWeight = 0.0;
    this._sumRotWeight = 0.0;
  }

  blendPosition(pos, weight) {
    vec3.scaleAndAdd(tmpvec3, this._joint._lpos, pos, weight);
    this._joint.setLocalPos(tmpvec3);
    this._sumPosWeight += weight;
  }

  blendScale(scale, weight) {
    vec3.scaleAndAdd(tmpvec3, this._joint._lscale, scale, weight);
    this._joint.setLocalScale(tmpvec3);
    this._sumScaleWeight += weight;
  }

  /**
   * Inspired by:
   * https://gamedev.stackexchange.com/questions/62354/method-for-interpolation-between-3-quaternions
   */
  blendRotation(rot, weight) {
    let t = weight / (this._sumRotWeight + weight);
    quat.slerp(tmpquat, this._joint._lrot, rot, t);
    this._joint.setLocalRot(tmpquat);
    this._sumRotWeight += weight;
  }

  apply() {
    if (this._sumPosWeight < 1.0)
      this.blendPosition(this._originalPos, 1.0 - this._sumPosWeight);
    if (this._sumScaleWeight < 1.0)
      this.blendScale(this._originalScale, 1.0 - this._sumScaleWeight);
    if (this._sumRotWeight < 1.0)
      this.blendRotation(this._originalRot, 1.0 - this._sumRotWeight);
  }
}