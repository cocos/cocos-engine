// @ts-check
import { vec3, quat, mat4 } from '../../core/vmath';

let _v3_tmp = vec3.create();
let _qt_tmp = quat.create();

/**
 * 
 * @param {cc.Node} node 
 * @param {(node: cc.Node)=>void} fx 
 */
function _walk(node, fx) {
  fx(node);
  for (let i = 0; i < node.childrenCount; ++i) {
    _walk(node.children[i], fx);
  }
}

/**
 * 
 * @param {cc.Node} node 
 * @param {cc.Node[]} result
 */
function _flat(node, result) {
  _walk(node, (childNode) => {
    result.push(childNode);
  });
}

export default class SkeletonInstance {
  constructor() {
    this._root = null;
    this._joints = null;
    this._matrices = null;
  }

  setRoot(root, indexDelta = 0) {
    /**
     * @type {cc.Node}
     */
    this._root = root;
    /**
     * @type {cc.Node[]}
     */
    this._joints = [];
    _flat(this._root, this._joints);
    /**
     * @type {mat4[]}
     */
    this._matrices = new Array(this._joints.length);

    for (let i = 0; i < this._joints.length; ++i) {
      this._matrices[i] = mat4.create();
    }

    /**
     * @type {number}
     */
    this._indexDelta = indexDelta;

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

  getJointIndexFromOrignalNodeIndex(index) {
    return index - this._indexDelta;
  }

  clone() {
    let newSkeleton = new SkeletonInstance();
    newSkeleton.setRoot(cc.instantiate(this._root));

    return newSkeleton;
  }

  createMask() {
    return new SkeletonMask(this);
  }
}

export class SkeletonMask {
  constructor(skeleton) {
    /** @type {SkeletonInstance} */
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
    _walk(this._skeleton._joints[0], joint => {
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