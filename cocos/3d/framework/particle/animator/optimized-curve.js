import { OptimizedKey, evalOptCurve } from "../../../geom-utils/curve";
import { repeat } from "../../../../core/vmath";

const CURVE_MODE_CONSTANT = 0;
const CURVE_MODE_RANDOM_CONSTANT = 1;
const CURVE_MODE_CURVE = 2;
const CURVE_MODE_RANDOM_CURVE = 3;

const UNIFORM_CURVE_KEY_NUM = 8;

//calculate the coefficience of the first order integral of the curve
function integrateKeyframe(coef) {
  coef[0] = coef[0] / 4;
  coef[1] = coef[1] / 3;
  coef[2] = coef[2] / 2;
  coef[3] = coef[3];
  return coef;
}

//calculate the coefficience of the second order integral of the curve
function integrateKeyframeTwice(coef) {
  coef[0] = coef[0] / 20;
  coef[1] = coef[1] / 12;
  coef[2] = coef[2] / 6;
  coef[3] = coef[3] / 2;
  return coef;
}

export class OptimizedCurve {
  constructor(constructUniform = false) {
    this.optimizedKeys = new Array; //the i-th optimezed key stores coefficients of [i,i+1] segment in the original curve,so if the time of last key of the original key is 1,the last key won't be kept in the opt curve.
    this.integral = new Array;      //the integral of the curve between 0 and corresponding key,the i-th integral corresponds to the i+1-th key in optimizedKeys (because the integral of the first key is always zero,the first key won't be stored)
    this.constructUniform = constructUniform;
  }

  buildCurve(animationCurve, multiplier = 1) {
    let keyNum = animationCurve.keyFrames.length - 1;
    let i = 0;
    if (this.optimizedKeys.length < keyNum) {
      let keyToAdd = keyNum - this.optimizedKeys.length;
      for (i = 0; i < keyToAdd; i++) {
        let optKey = new OptimizedKey();
        this.optimizedKeys.push(optKey);
      }
    } else {
      this.optimizedKeys.splice(keyNum);
    }
    if (animationCurve.keyFrames.length === 1) {
      this.optimizedKeys[0].coefficient[3] = animationCurve.keyFrames[0].value * multiplier;
      this.optimizedKeys[0].time = 0;
      this.optimizedKeys[0].endTime = 1;
    } else {
      let keyOffset = 0;
      if (animationCurve.keyFrames[0].time !== 0) {
        this.optimizedKeys.splice(0, 0, new OptimizedKey());
        this.optimizedKeys[0].time = 0;
        this.optimizedKeys[0].endTime = animationCurve.keyFrames[0].time;
        this.optimizedKeys[0].coefficient[3] = animationCurve.keyFrames[0].value;
        keyOffset = 1;
      }
      for (i = 0; i < keyNum; i++) {
        animationCurve.calcOptimizedKey(this.optimizedKeys[i + keyOffset], i, Math.min(i + 1, keyNum));
        this.optimizedKeys[i + keyOffset].index += keyOffset;
      }
      if (animationCurve.keyFrames[animationCurve.keyFrames.length - 1].time !== 1) {
        this.optimizedKeys.push(new OptimizedKey());
        this.optimizedKeys[this.optimizedKeys.length - 1].time = animationCurve.keyFrames[animationCurve.length - 1].time;
        this.optimizedKeys[this.optimizedKeys.length - 1].endTime = 1;
        this.optimizedKeys[this.optimizedKeys.length - 1].coefficient[3] = animationCurve.keyFrames[animationCurve.length - 1].value;
      }
    }
    for (i = 0; i < this.optimizedKeys.length; i++) {
      this.optimizedKeys[i].coefficient[0] *= multiplier;
      this.optimizedKeys[i].coefficient[1] *= multiplier;
      this.optimizedKeys[i].coefficient[2] *= multiplier;
      this.optimizedKeys[i].coefficient[3] *= multiplier;
    }
    if (this.constructUniform) {
      this.coefUniform = new Float32Array(UNIFORM_CURVE_KEY_NUM * 4);
      this.timeUniform = new Float32Array(UNIFORM_CURVE_KEY_NUM);
      this.updateKeyUniform();
    }
  }

  evaluate(time) {
    time = repeat(time, 1);
    for (let i = 1; i < this.optimizedKeys.length; i++) {
      if (time < this.optimizedKeys[i].time) {
        return this.optimizedKeys[i - 1].evaluate(time);
      }
    }
    return this.optimizedKeys[this.optimizedKeys.length - 1].evaluate(time);
  }

  //calculate first order integral coefficients of all keys
  integrateOnce() {
    let i = 0;
    if (this.integral.length + 1 < this.optimizedKeys.length) {
      for (i = 0; i < this.optimizedKeys.length - this.integral.length - 1; i++) {
        this.integral.push(0);
      }
    } else {
      this.integral.splice(this.optimizedKeys.length - 1);
    }
    for (i = 0; i < this.integral.length; i++) {
      integrateKeyframe(this.optimizedKeys[i].coefficient);
      let deltaT = this.optimizedKeys[i + 1].time - this.optimizedKeys[i].time;
      let prevIntegral = i === 0 ? 0 : this.integral[i - 1];
      this.integral[i] = prevIntegral + (deltaT * evalOptCurve(deltaT, this.optimizedKeys[i].coefficient));
    }
    integrateKeyframe(this.optimizedKeys[this.optimizedKeys.length - 1].coefficient);
    if (this.constructUniform) {
      this.updateKeyUniform();
      this.updateIntegralUniform();
    }
  }

  //get the integral of the curve using calculated coefficients
  evaluateIntegral(t, ts = 1) {
    t = repeat(t, 1);
    for (let i = 1; i < this.optimizedKeys.length; i++) {
      if (t < this.optimizedKeys[i].time) {
        let prevInt = i === 1 ? 0 : this.integral[i - 2];
        let dt = t - this.optimizedKeys[i - 1].time;
        return ts * (prevInt + (dt * evalOptCurve(dt, this.optimizedKeys[i - 1].coefficient)));
      }
    }
    let dt = t - this.optimizedKeys[this.optimizedKeys.length - 1].time;
    return ts * (this.integral[this.integral.length - 1] + (dt * evalOptCurve(dt, this.optimizedKeys[this.optimizedKeys.length - 1].coefficient)));
  }

  //calculate second order integral coefficients of all keys
  integrateTwice() {
    let i = 0;
    if (this.integral.length + 1 < this.optimizedKeys.length) {
      for (i = 0; i < this.optimizedKeys.length - this.integral.length - 1; i++) {
        this.integral.push(0);
      }
    } else {
      this.integral.splice(this.optimizedKeys.length - 1);
    }
    for (i = 0; i < this.integral.length; i++) {
      integrateKeyframeTwice(this.optimizedKeys[i].coefficient);
      let deltaT = this.optimizedKeys[i + 1].time - this.optimizedKeys[i].time;
      let prevIntegral = i === 0 ? 0 : this.integral[i - 1];
      this.integral[i] = prevIntegral + (deltaT * deltaT * evalOptCurve(deltaT, this.optimizedKeys[i].coefficient));
    }
    integrateKeyframeTwice(this.optimizedKeys[this.optimizedKeys.length - 1].coefficient);
    if (this.constructUniform) {
      this.updateKeyUniform();
      this.updateIntegralUniform();
    }
  }

  //get the second order integral of the curve using calculated coefficients
  evaluateIntegralTwice(t, ts = 1) {
    t = repeat(t, 1);
    for (let i = 1; i < this.optimizedKeys.length; i++) {
      if (t < this.optimizedKeys[i].time) {
        let prevInt = i === 1 ? 0 : this.integral[i - 2];
        let dt = t - this.optimizedKeys[i - 1].time;
        return ts * ts * (prevInt + (dt * dt * evalOptCurve(dt, this.optimizedKeys[i - 1].coefficient)));
      }
    }
    let dt = t - this.optimizedKeys[this.optimizedKeys.length - 1].time;
    return ts * ts * (this.integral[this.integral.length - 1] + (dt * dt * evalOptCurve(dt, this.optimizedKeys[this.optimizedKeys.length - 1].coefficient)));
  }

  updateKeyUniform() {
    for (let i = 0; i < this.optimizedKeys.length; i++) {
      this.coefUniform[i * 4] = this.optimizedKeys[i].coefficient[0];
      this.coefUniform[i * 4 + 1] = this.optimizedKeys[i].coefficient[1];
      this.coefUniform[i * 4 + 2] = this.optimizedKeys[i].coefficient[2];
      this.coefUniform[i * 4 + 3] = this.optimizedKeys[i].coefficient[3];
      this.timeUniform[i] = this.optimizedKeys[i].endTime;
    }
  }

  updateIntegralUniform() {
    this.integralUniform = new Float32Array(UNIFORM_CURVE_KEY_NUM - 1);
    for (let i = 0; i < this.integral.length; i++) {
      this.integralUniform[i] = this.integral[i];
    }
  }
}

export class CurveUniform {
  constructCurve(cr) {
    this.mode = cr.mode;
    switch (cr.mode) {
      case 'constant':
        this.minConstant = cr.constant;
        break;
      case 'twoConstants':
        this.minConstant = cr.constantMin;
        this.maxConstant = cr.constantMax;
        break;
      case 'curve':
        this.minCurve = new OptimizedCurve(true);
        this.minCurve.buildCurve(cr.curve, cr.multiplier);
        break;
      case 'twoCurves':
        this.minCurve = new OptimizedCurve(true);
        this.minCurve.buildCurve(cr.curveMin, cr.multiplier);
        this.maxCurve = new OptimizedCurve(true);
        this.maxCurve.buildCurve(cr.curveMax, cr.multiplier);
        break;
    }
  }

  constructCurveIntegral(cr) {
    this.mode = cr.mode;
    switch (cr.mode) {
      case 'constant':
        this.minConstant = cr.constant;
        break;
      case 'twoConstants':
        this.minConstant = cr.constantMin;
        this.maxConstant = cr.constantMax;
        break;
      case 'curve':
        this.minCurve = new OptimizedCurve(true);
        this.minCurve.buildCurve(cr.curve, cr.multiplier);
        this.minCurve.integrateOnce();
        break;
      case 'twoCurves':
        this.minCurve = new OptimizedCurve(true);
        this.minCurve.buildCurve(cr.curveMin, cr.multiplier);
        this.minCurve.integrateOnce();
        this.maxCurve = new OptimizedCurve(true);
        this.maxCurve.buildCurve(cr.curveMax, cr.multiplier);
        this.maxCurve.integrateOnce();
        break;
    }
  }

  constructCurveIntegralTwice(cr) {
    this.mode = cr.mode;
    switch (cr.mode) {
      case 'constant':
        this.minConstant = cr.constant;
        break;
      case 'twoConstants':
        this.minConstant = cr.constantMin;
        this.maxConstant = cr.constantMax;
        break;
      case 'curve':
        this.minCurve = new OptimizedCurve(true);
        this.minCurve.buildCurve(cr.curve, cr.multiplier);
        this.minCurve.integrateTwice();
        break;
      case 'twoCurves':
        this.minCurve = new OptimizedCurve(true);
        this.minCurve.buildCurve(cr.curveMin, cr.multiplier);
        this.minCurve.integrateTwice();
        this.maxCurve = new OptimizedCurve(true);
        this.maxCurve.buildCurve(cr.curveMax, cr.multiplier);
        this.maxCurve.integrateTwice();
        break;
    }
  }

  uploadUniform(device, name) {
    switch (this.mode) {
      case 'constant':
        device.setUniform('u_' + name + '_curveMode', CURVE_MODE_CONSTANT);
        device.setUniform('u_' + name + '_minConstant', this.minConstant);
        break;
      case 'twoConstants':
        device.setUniform('u_' + name + '_curveMode', CURVE_MODE_RANDOM_CONSTANT);
        device.setUniform('u_' + name + '_minConstant', this.minConstant);
        device.setUniform('u_' + name + '_maxConstant', this.maxConstant);
        break;
      case 'curve':
        device.setUniform('u_' + name + '_curveMode', CURVE_MODE_CURVE);
        device.setUniform('u_' + name + '_minKeyTime', this.minCurve.timeUniform);
        device.setUniform('u_' + name + '_minKeyCoef', this.minCurve.coefUniform);
        if (this.minCurve.integralUniform !== undefined) {
          device.setUniform('u_' + name + '_minIntegral', this.minCurve.integralUniform);
        }
        break;
      case 'twoCurves':
        device.setUniform('u_' + name + '_curveMode', CURVE_MODE_RANDOM_CURVE);
        device.setUniform('u_' + name + '_minKeyTime', this.minCurve.timeUniform);
        device.setUniform('u_' + name + '_minKeyCoef', this.minCurve.coefUniform);
        if (this.minCurve.integralUniform !== undefined) {
          device.setUniform('u_' + name + '_minIntegral', this.minCurve.integralUniform);
        }
        device.setUniform('u_' + name + '_maxKeyTime', this.maxCurve.timeUniform);
        device.setUniform('u_' + name + '_maxKeyCoef', this.maxCurve.coefUniform);
        if (this.minCurve.integralUniform !== undefined) {
          device.setUniform('u_' + name + '_maxIntegral', this.maxCurve.integralUniform);
        }
        break;
    }
  }
}
