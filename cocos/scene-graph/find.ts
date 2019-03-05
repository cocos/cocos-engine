/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
import { Node } from './node';

/**
 * Finds a node by hierarchy path, the path is case-sensitive.
 * It will traverse the hierarchy by splitting the path using '/' character.
 * This function will still returns the node even if it is inactive.
 * It is recommended to not use this function every frame instead cache the result at startup.
 */
export function find (path: string, referenceNode?: Node): Node | null {
    if (path == null) {
        cc.errorID(5600);
        return null;
    }
    if (!referenceNode) {
        const scene = cc.director.getScene();
        if (!scene) {
            if (CC_DEV) {
                cc.warnID(5601);
            }
            return null;
        }
        else if (CC_DEV && !scene.isValid) {
            cc.warnID(5602);
            return null;
        }
        referenceNode = scene;
    } else if (CC_DEV && !referenceNode.isValid) {
        cc.warnID(5603);
        return null;
    }

    let match = referenceNode!;
    const startIndex = (path[0] !== '/') ? 0 : 1; // skip first '/'
    const nameList = path.split('/');

    // parse path
    for (let n = startIndex; n < nameList.length; n++) {
        const name = nameList[n];
        const children = match.children;
        let found = false;
        for (let t = 0, len = children.length; t < len; ++t) {
            const subChild = children[t];
            if (subChild.name === name) {
                match = subChild;
                found = true;
                break;
            }
        }
        if (!found) {
            return null;
        }
    }

    return match;
}

cc.find = find;
