import { utils } from '../scene-graph';
import { vec3, quat, mat4 } from '../vmath';

let _v3_tmp = vec3.create();
let _qt_tmp = quat.create();

export default class Skeleton {
  constructor() {
    this._root = null;
    this._joints = null;
    this._matrices = null;
  }

  setRoot(root) {
    this._root = root;
    this._joints = utils.flat(this._root);
    this._matrices = new Array(this._joints.length);

    for (let i = 0; i < this._joints.length; ++i) {
      this._matrices[i] = mat4.create();
    }
    this.updateMatrices();
  }

  blend(fromSkel, toSkel, alpha) {
    for (let i = 0; i < this._joints.length; ++i) {
      let joint = this._joints[i];
      let jointFrom = fromSkel._joints[i];
      let jointTo = toSkel._joints[i];

      vec3.lerp(_v3_tmp, jointFrom._lpos, jointTo._lpos, alpha);
      joint.setLocalPos(_v3_tmp);

      vec3.lerp(_v3_tmp, jointFrom._lscale, jointTo._lscale, alpha);
      joint.setLocalScale(_v3_tmp);

      quat.lerp(_qt_tmp, jointFrom._lrot, jointTo._lrot, alpha);
      joint.setLocalRot(_qt_tmp);
    }
  }

  updateMatrices() {
    for (let i = 0; i < this._joints.length; ++i) {
      this._joints[i].getWorldMatrix(this._matrices[i]);
    }
  }

  getWorldMatrix(i) {
    return this._matrices[i];
  }

  getJointIndex(jointName) {
    for (let i = 0; i < this._joints.length; ++i) {
      let joint = this._joints[i];
      if (joint.name == jointName) {
        return i;
      }
    }
    return -1;
  }

  clone() {
    let newSkeleton = new Skeleton();
    newSkeleton.setRoot(utils.deepClone(this._root));

    return newSkeleton;
  }

  createMask() {
    return new SkeletonMask(this);
  }
}

export class SkeletonMask {
  constructor(skeleton) {
    this._skeleton = skeleton;

    this._isMaskedArray = new Array(skeleton._joints.length);
    for (let i = 0; i < this._isMaskedArray.length; ++i) {
      this._isMaskedArray[i] = false;
    }
  }

  setMasked(jointIndex, masked = true) {
    this._isMaskedArray[jointIndex] = masked;
  }

  setMaskedRecursive(jointIndex, masked = true) {
    if (jointIndex < 0 || jointIndex >= this._skeleton._joints.length) {
      return;
    }

    this._isMaskedArray[jointIndex] = masked;
    utils.walk(this._skeleton._joints[jointIndex], (joint) => {
      let idx = this._skeleton._joints.indexOf(joint);
      if (idx >= 0) {
        this._isMaskedArray[idx] = masked;
      }
    });
  }

  isMasked(jointIndex) {
    return this._isMaskedArray[jointIndex];
  }

  complement() {
    let ret = new SkeletonMask(this._skeleton);
    for (let i = 0; i < this._isMaskedArray.length; ++i) {
      ret._isMaskedArray[i] = !this._isMaskedArray[i];
    }
    return ret;
  }
}