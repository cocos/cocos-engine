/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Mat4 } from '../core';
import { Node } from '../scene-graph/node';

const stack: IJointTransform[] = [];
const pool: Map<string, IJointTransform> = new Map();

export interface IJointTransform {
    node: Node;
    local: Mat4;
    world: Mat4;
    stamp: number;
    parent: IJointTransform | null;
}

export function getWorldMatrix (transform: IJointTransform | null, stamp: number): Readonly<Mat4> {
    let i = 0;
    let res = Mat4.IDENTITY;
    while (transform) {
        if (transform.stamp === stamp || transform.stamp + 1 === stamp && !transform.node.hasChangedFlags) {
            res = transform.world;
            transform.stamp = stamp;
            break;
        }
        transform.stamp = stamp;
        stack[i++] = transform;
        transform = transform.parent;
    }
    while (i > 0) {
        transform = stack[--i];
        stack[i] = null!;
        const node = transform.node;
        Mat4.fromRTS(transform.local, node.rotation, node.position, node.scale);
        res = Mat4.multiply(transform.world, res, transform.local);
    }
    return res;
}

export function getTransform (node: Node, root: Node): IJointTransform | null {
    let joint: IJointTransform | null = null;
    let i = 0;
    while (node !== root) {
        const id = node.uuid;
        if (pool.has(id)) {
            joint = pool.get(id)!;
            break;
        } else { // TODO: object reuse
            joint = { node, local: new Mat4(), world: new Mat4(), stamp: -1, parent: null };
            pool.set(id, joint);
        }
        stack[i++] = joint;
        node = node.parent!;
        joint = null;
    }
    let child: IJointTransform;
    while (i > 0) {
        child = stack[--i];
        stack[i] = null!;
        child.parent = joint;
        joint = child;
    }
    return joint;
}

export function deleteTransform (node: Node): void {
    let transform = pool.get(node.uuid) || null;
    while (transform) {
        pool.delete(transform.node.uuid);
        transform = transform.parent;
    }
}
