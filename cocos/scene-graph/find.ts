/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { DEV } from 'internal:constants';
import { warnID } from '../core/platform/debug';
import { Node } from './node';
import { legacyCC } from '../core/global-exports';

/**
 * @en Finds a node by hierarchy path, the path is case-sensitive.
 * It will traverse the hierarchy by splitting the path using '/' character.
 * This function will still returns the node even if it is inactive.
 * It is recommended to not use this function every frame instead cache the result at startup.
 * @zh 通过路径从节点树中查找节点的方法，路径是大小写敏感的，并且通过 `/` 来分隔节点层级。
 * 即使节点的状态是未启用的也可以找到，建议将结果缓存，而不是每次需要都去查找。
 * @param path The path of the target node
 * @param referenceNode If given, the search will be limited in the sub node tree of the reference node
 */
export function find (path: string, referenceNode?: Node): Node | null {
    if (!referenceNode) {
        const scene = legacyCC.director.getScene();
        if (!scene) {
            if (DEV) {
                warnID(5601);
            }
            return null;
        } else if (DEV && !scene.isValid) {
            warnID(5602);
            return null;
        }
        referenceNode = scene;
    } else if (DEV && !referenceNode.isValid) {
        warnID(5603);
        return null;
    }
    return referenceNode!.getChildByPath(path);
}

legacyCC.find = find;
