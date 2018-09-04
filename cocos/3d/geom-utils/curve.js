import { repeat, pingPong, inverseLerp, clamp } from '../vmath';

const LOOK_FORWARD = 3;

export class Keyframe {

}

Keyframe.schema = {
  time: {
    type: 'number',
    default: 0,
  },
  value: {
    type: 'number',
    default: 0,
  },
  inTangent: {
    type: 'number',
    default: 0,
  },
  outTangent: {
    type: 'number',
    default: 0,
  }
};

export class OptimizedKey {
  constructor() {
    this.index = -1;
    this.time = 0;
    this.endTime = 0;
    this.coefficient = new Float32Array(4);
  }

  evaluate(T) {
    let t = T - this.time;
    return evalOptCurve(t, this.coefficient);
  }
}

export function evalOptCurve(t, coefs) {
  return (t * (t * (t * coefs[0] + coefs[1]) + coefs[2])) + coefs[3];
}

export class AnimationCurve {
  constructor(keyFrames) {
    this._keyFrames = keyFrames;
    this.cachedKey = new OptimizedKey();
  }

  addKey(keyFrame) {
    if (this._keyFrames === null)
      this._keyFrames = [];
    this._keyFrames.push(keyFrame);
  }

  //cubic Hermite spline
  evaluate_slow(time) {
    let wrappedTime = time;
    let wrapMode = time < 0 ? this._preWrapMode : this._postWrapMode;
    let startTime = this._keyFrames[0].time;
    let endTime = this._keyFrames[this._keyFrames.length - 1].time;
    switch (wrapMode) {
      case 'loop':
        wrappedTime = repeat(time - startTime, endTime - startTime) + startTime;
        break;
      case 'pingPong':
        wrappedTime = pingPong(time - startTime, endTime - startTime) + startTime;
        break;
      case 'clampForever':
        wrappedTime = clamp(time, startTime, endTime);
        break;
    }
    let preKFIndex = 0;
    if (wrappedTime > this._keyFrames[0].time) {
      if (wrappedTime >= this._keyFrames[this._keyFrames.length - 1].time)
        preKFIndex = this._keyFrames.length - 2;
      else {
        for (let i = 0; i < this._keyFrames.length - 1; i++) {
          if (wrappedTime >= this._keyFrames[0].time && wrappedTime <= this._keyFrames[i + 1].time) {
            preKFIndex = i;
            break;
          }
        }
      }
    }
    let keyframe0 = this._keyFrames[preKFIndex];
    let keyframe1 = this._keyFrames[preKFIndex + 1];

    let t = inverseLerp(keyframe0.time, keyframe1.time, wrappedTime);
    let dt = keyframe1.time - keyframe0.time;

    let m0 = keyframe0.outTangent * dt;
    let m1 = keyframe1.inTangent * dt;

    let t2 = t * t;
    let t3 = t2 * t;

    let a = 2 * t3 - 3 * t2 + 1;
    let b = t3 - 2 * t2 + t;
    let c = t3 - t2;
    let d = -2 * t3 + 3 * t2;

    return a * keyframe0.value + b * m0 + c * m1 + d * keyframe1.value;
  }

  evaluate(time) {
    let wrappedTime = time;
    let wrapMode = time < 0 ? this._preWrapMode : this._postWrapMode;
    let startTime = this._keyFrames[0].time;
    let endTime = this._keyFrames[this._keyFrames.length - 1].time;
    switch (wrapMode) {
      case 'loop':
        wrappedTime = repeat(time - startTime, endTime - startTime) + startTime;
        break;
      case 'pingPong':
        wrappedTime = pingPong(time - startTime, endTime - startTime) + startTime;
        break;
      case 'clampForever':
        wrappedTime = clamp(time, startTime, endTime);
        break;
    }
    if (wrappedTime >= this.cachedKey.time && wrappedTime < this.cachedKey.endTime) {
      return this.cachedKey.evaluate(wrappedTime);
    } else {
      let leftIndex = this.findIndex(this.cachedKey, wrappedTime);
      let rightIndex = leftIndex + 1;
      if (rightIndex == this._keyFrames.length) {
        rightIndex -= 1;
      }
      this.calcOptimizedKey(this.cachedKey, leftIndex, rightIndex);
      return this.cachedKey.evaluate(wrappedTime);
    }
  }

  calcOptimizedKey(optKey, leftIndex, rightIndex) {
    let lhs = this._keyFrames[leftIndex];
    let rhs = this._keyFrames[rightIndex];
    optKey.index = leftIndex;
    optKey.time = lhs.time;
    optKey.endTime = rhs.time;

    let dx = rhs.time - lhs.time;
    let dy = rhs.value - lhs.value;
    let length = 1 / (dx * dx);
    let d1 = lhs.outTangent * dx;
    let d2 = rhs.inTangent * dx;

    optKey.coefficient[0] = (d1 + d2 - dy - dy) * length / dx;
    optKey.coefficient[1] = (dy + dy + dy - d1 - d1 - d2) * length;
    optKey.coefficient[2] = lhs.outTangent;
    optKey.coefficient[3] = lhs.value;
  }

  findIndex(optKey, t) {
    let cachedIndex = optKey.index;
    if (cachedIndex !== -1) {
      let cachedTime = this._keyFrames[cachedIndex].time;
      if (t > cachedTime) {
        for (let i = 0; i < LOOK_FORWARD; i++) {
          let currIndex = cachedIndex + i;
          if (currIndex + 1 < this._keyFrames.length && this._keyFrames[currIndex + 1].time > t) {
            return currIndex;
          }
        }
      } else {
        for (let i = 0; i < LOOK_FORWARD; i++) {
          let currIndex = cachedIndex - i;
          if (currIndex >= 0 && this._keyFrames[currIndex - 1].time <= t) {
            return currIndex - 1;
          }
        }
      }
    }
    let left = 0;
    let right = this._keyFrames.length;
    let mid = parseInt((left + right) / 2);
    while (right - left > 1) {
      if (this._keyFrames[mid].time >= t) {
        right = mid;
      } else {
        left = mid + 1;
      }
      mid = parseInt((left + right) / 2);
    }
    return left;
  }
}

AnimationCurve.schema = {
  keyFrames: {
    type: 'Keyframe',
    default: null,
    array: true,
  },
  preWrapMode: {
    type: 'enums',
    default: 'default',
    options: [
      'default',
      'once',
      'loop',
      'pingPong',
      'clampForever'
    ],
  },
  postWrapMode: {
    type: 'enums',
    default: 'default',
    options: [
      'default',
      'once',
      'loop',
      'pingPong',
      'clampForever'
    ],
  }
};
