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
import { _decorator, instantiate } from "../../core/data";
const { ccclass, property } = _decorator;
import Asset from "../../assets/CCAsset";
import SkeletonInstance from '../framework/skeleton-instance';
import { Node } from "../../scene-graph";
import { Mat4 } from "../../core/value-types";

/**
 * CLASS Skeleton
 * The skeleton class represent a kind of deformation.
 * A skeleton consists of a forest hierachy of nodes.
 * Some of the nodes, called joints, have special meanings.
 * Skeletons are not mutable, but they can be instantiated
 * to produce a skeleton instance. Skeleton instances can be modified,
 * for example, be animated.
 */
@ccclass('cc.Skeleton')
export default class Skeleton extends Asset {
  /**
   * The nodes.
   * @type {Node[]}
   */
  @property(Node)
  _nodes = [];

  /**
   * The index of root joint.
   */
  @property(Number)
  _skeleton = 0;

  /**
   * The indices of joints.
   * @type {number[]}
   */
  @property([Number])
  _jointIndices = [];

  /**
   * The inverse bind matrices of joints.
   * @type {Mat4[]}
   */
  @property([Mat4])
  _inverseBindMatrices = [];

  /**
   * Gets the bind pose matrices of joints.
   * @return {Mat4[]}
   */
  get bindposes() {
    return this._inverseBindMatrices;
  }

  /**
   * Sets the bind pose matrices of joints.
   * @param {Mat4[]} value
   */
  set bindposes(value) {
    this._inverseBindMatrices = value;
  }

  /**
   * Gets the indices of joints.
   * @return {number[]}
   */
  get jointIndices() {
    return this._jointIndices;
  }
}

cc.Skeleton = Skeleton;