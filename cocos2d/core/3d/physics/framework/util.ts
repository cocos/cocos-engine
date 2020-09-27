/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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

import { IVec3Like, IQuatLike } from '../spec/i-common';

export function stringfyVec3 (value: IVec3Like): string {
    return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;
}

export function stringfyQuat (value: IQuatLike): string {
    return `(x: ${value.x}, y: ${value.y}, z: ${value.z}, w: ${value.w})`;
}

interface IWrapped<T> {
    __cc_wrapper__: T;
}

export function setWrap<Wrapper> (object: any, wrapper: Wrapper) {
    (object as IWrapped<Wrapper>).__cc_wrapper__ = wrapper;
}

export function getWrap<Wrapper> (object: any) {
    return (object as IWrapped<Wrapper>).__cc_wrapper__;
}

const LocalDirtyFlag = cc.Node._LocalDirtyFlag;
const PHYSICS_TRS = LocalDirtyFlag.PHYSICS_TRS;
const ALL_TRS = LocalDirtyFlag.ALL_TRS;
const SKEW = LocalDirtyFlag.SKEW;
const FLAG_TRANSFORM = cc.RenderFlow.FLAG_TRANSFORM;

const Mat3 = cc.Mat3;
const Mat4 = cc.Mat4;
const Vec3 = cc.Vec3;
const Quat = cc.Quat;
const Trs = cc.Trs;

const _nodeArray: Array<cc.Node> = [];
const _lpos = cc.v3();
const _lrot = cc.quat();
const _mat3 = new Mat3();
const _mat3m = _mat3.m;
const _quat = cc.quat();
const _mat4 = cc.mat4();

let _nodeTransformRecord = {};
export function clearNodeTransformDirtyFlag () {
    for (let key in _nodeTransformRecord) {
        let physicsNode = _nodeTransformRecord[key];
        physicsNode._localMatDirty &= ~ALL_TRS;
        if (!(physicsNode._localMatDirty & SKEW)) {
            physicsNode._worldMatDirty = false;
            !CC_NATIVERENDERER && (physicsNode._renderFlag &= ~FLAG_TRANSFORM);
        }
    }
    _nodeTransformRecord = {};
    _nodeArray.length = 0;
}

export function clearNodeTransformRecord () {
    _nodeTransformRecord = {};
    _nodeArray.length = 0;
}

/*
 * The method of node backtrace is used to optimize the calculation of global transformation. 
 * Node backtrace is continuous until the parent node is empty or the parent node has performed the calculation of global transformation.
 * The result of backtrace will store the node relational chain in the array. 
 * The process of traversing array is equivalent to the process of global transformation from the parent node to the physical node.
 * The calculated results are saved in the node, and the physical global transformation flag will be erased finally.
 */
export function updateWorldTransform (node: cc.Node, traverseAllNode: boolean = false) {
    let cur = node;
    let i = 0;
    let needUpdateTransform = false;
    let physicsDirtyFlag = 0;
    while (cur) {
        // If current node transform has been calculated
        if (traverseAllNode || !_nodeTransformRecord[cur._id]) {
            _nodeArray[i++] = cur;
        } else {
            // Current node's transform has beed calculated
            physicsDirtyFlag |= (cur._localMatDirty & PHYSICS_TRS);
            needUpdateTransform = needUpdateTransform || !!physicsDirtyFlag;
            break;
        }
        if (cur._localMatDirty & PHYSICS_TRS) {
            needUpdateTransform = true;
        }
        cur = cur._parent;
    }
    if (!needUpdateTransform) {
        return false;
    }

    let child;
    let childWorldMat, curWorldMat, childTrs, childLocalMat;
    let wpos, wrot, wscale;

    _nodeArray.length = i;
    while (i) {
        child = _nodeArray[--i];
        !traverseAllNode && (_nodeTransformRecord[child._id] = child);

        childWorldMat = child._worldMatrix;
        childLocalMat = child._matrix;
        childTrs = child._trs;

        wpos = child.__wpos = child.__wpos || cc.v3();
        wrot = child.__wrot = child.__wrot || cc.quat();
        wscale = child.__wscale = child.__wscale || cc.v3();

        if (child._localMatDirty & PHYSICS_TRS) {
            Trs.toMat4(childLocalMat, childTrs);
        }
        child._localMatDirty |= physicsDirtyFlag;
        physicsDirtyFlag |= (child._localMatDirty & PHYSICS_TRS);

        if (!(physicsDirtyFlag & PHYSICS_TRS)) {
            cur = child;
            continue;
        }

        if (cur) {
            curWorldMat = cur._worldMatrix;
            Trs.toPosition(_lpos, childTrs);
            Vec3.transformMat4(wpos, _lpos, curWorldMat);

            Mat4.multiply(childWorldMat, curWorldMat, childLocalMat);
            Trs.toRotation(_lrot, childTrs);
            Quat.multiply(wrot, cur.__wrot, _lrot);

            Mat3.fromQuat(_mat3, Quat.conjugate(_quat, wrot));
            Mat3.multiplyMat4(_mat3, _mat3, childWorldMat);
            wscale.x = _mat3m[0];
            wscale.y = _mat3m[4];
            wscale.z = _mat3m[8];
        } else {
            Trs.toPosition(wpos, childTrs);
            Trs.toRotation(wrot, childTrs);
            Trs.toScale(wscale, childTrs);
            Mat4.copy(childWorldMat, childLocalMat);
        }
        cur = child;
    }
    return true;
}

export function updateWorldRT (node: cc.Node, position: cc.Vec3, rotation: cc.Quat) {
    let parent = node.parent;
    if (parent) {
        updateWorldTransform(parent, true);
        Vec3.transformMat4(_lpos, position, Mat4.invert(_mat4, parent._worldMatrix));
        Quat.multiply(_quat, Quat.conjugate(_quat, parent.__wrot), rotation);
        node.setPosition(_lpos);
        node.setRotation(_quat);
    } else {
        node.setPosition(position);
        node.setRotation(rotation);
    }
}

export function worldDirty (node: cc.Node) {
    let cur = node;
    while (cur) {
        if (cur._worldMatDirty) return true;
        cur = cur._parent;
    }
    return false;
}
