/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

import { Mat4 } from '../math';
import { Node } from '../scene-graph';

const m4_1 = new Mat4();

/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export function getPathFromRoot (target: Node | null, root: Node) {
    let node: Node | null = target;
    let path = '';
    while (node !== null && node !== root) {
        path = `${node.name}/${path}`;
        node = node.parent;
    }
    return path.slice(0, -1);
}

/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export function getWorldTransformUntilRoot (target: Node, root: Node, outMatrix: Mat4) {
    Mat4.identity(outMatrix);
    while (target !== root) {
        Mat4.fromRTS(m4_1, target.rotation, target.position, target.scale);
        Mat4.multiply(outMatrix, m4_1, outMatrix);
        target = target.parent!;
    }
    return outMatrix;
}
