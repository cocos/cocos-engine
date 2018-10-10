// @ts-check
import { vec3, quat, mat4 } from '../../core/vmath';
import { Node } from '../../scene-graph';

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

export default class SkeletonInstance {
  /**
   * 
   * @param {import("../assets/skeleton").default} skeleton 
   */
  constructor(skeleton) {
    this._skeleton = skeleton;

    /**
     * @type {cc.Node[]}
     */
    this._nodes = this._copyNodesForest(skeleton._nodes);

    /**
     * @type {mat4[]}
     */
    this._matrices = new Array(this._nodes.length);
    for (let i = 0; i < this._nodes.length; ++i) {
      this._matrices[i] = mat4.create();
    }

    this.updateMatrices();
  }

  /**
   * 
   * @param {cc.Node[]} nodes 
   */
  _copyNodesForest(nodes) {
    /** @type {cc.Node[]} */
    const newNodes = new Array(nodes.length);
    nodes.forEach((node, index) => {
      newNodes[index] = this._copyNode(node);
    });
    nodes.forEach((node, index) => {
      const newNode = newNodes[index];
      node.children.forEach(childNode => {
        const childIndex = nodes.indexOf(childNode);
        if (childIndex < 0) {
          debugger;
        }
        newNode.addChild(newNodes[childIndex]);
      });
    });
    return newNodes;
  }

  /**
   * 
   * @param {cc.Node} node 
   */
  _copyNode(node) {
    const newNode = new Node(node.name);
    newNode.setPosition(node.getPosition());
    newNode.setScale(node.getScale());
    newNode.setRotation(node.getRotation());
    return newNode;
  }

  blend(fromSkel, toSkel, alpha) {
    for (let i = 0; i < this._nodes.length; ++i) {
      let joint = this._nodes[i];
      let jointFrom = fromSkel._nodes[i];
      let jointTo = toSkel._nodes[i];

      vec3.lerp(_v3_tmp, jointFrom._lpos, jointTo._lpos, alpha);
      joint.setPosition(_v3_tmp);

      vec3.lerp(_v3_tmp, jointFrom._lscale, jointTo._lscale, alpha);
      joint.setScale(_v3_tmp);

      quat.lerp(_qt_tmp, jointFrom._lrot, jointTo._lrot, alpha);
      joint.setRotation(_qt_tmp);
    }
  }

  updateMatrices() {
    for (let i = 0; i < this._nodes.length; ++i) {
      this._nodes[i].getWorldMatrix(this._matrices[i]);
    }
  }

  /**
   * 
   * @param {number} i Index of the node. 
   */
  getWorldMatrix(i) {
    return this._matrices[i];
  }

  getJointIndex(jointName) {
    for (let i = 0; i < this._nodes.length; ++i) {
      let joint = this._nodes[i];
      if (joint.name == jointName) {
        return i;
      }
    }
    return -1;
  }

  getJointIndexFromOrignalNodeIndex(index) {
    return index;
  }

  clone() {
    return new SkeletonInstance(this._skeleton);
  }

  createMask() {
    return new SkeletonMask(this);
  }
}

export class SkeletonMask {
  /**
   * 
   * @param {SkeletonInstance} skeleton 
   */
  constructor(skeleton) {
    /**
     * @type {SkeletonInstance}
     * */
    this._skeleton = skeleton;

    this._isMaskedArray = new Array(skeleton._nodes.length);
    for (let i = 0; i < this._isMaskedArray.length; ++i) {
      this._isMaskedArray[i] = false;
    }
  }

  setMasked(jointIndex, masked = true) {
    this._isMaskedArray[jointIndex] = masked;
  }

  setMaskedRecursive(jointIndex, masked = true) {
    if (jointIndex < 0 || jointIndex >= this._skeleton._nodes.length) {
      return;
    }

    this._isMaskedArray[jointIndex] = masked;
    _walk(this._skeleton._nodes[0], joint => {
      let idx = this._skeleton._nodes.indexOf(joint);
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