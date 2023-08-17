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

import { ccclass, serializable } from 'cc.decorator';
import { Node } from '../scene-graph/node';
import { warnID } from '../core';
import type { Component } from '../scene-graph';

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export type PropertyPath = string | number;

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export interface ICustomTargetPath {
    /**
     * @en
     * Gets next target from current target.
     * If errors are encountered, `null` should be returned.
     * @zh
     * 从当前目标中获取下一个目标。
     * 若错误发生，应返回 `null`。
     * @param target
     */
    get(target: any): any;
}

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export type TargetPath = PropertyPath | ICustomTargetPath;

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export function isPropertyPath (path: TargetPath): path is PropertyPath {
    return typeof path === 'string' || typeof path === 'number';
}

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export function isCustomPath<T extends ICustomTargetPath> (path: TargetPath, constructor: Constructor<T>): path is T {
    return path instanceof constructor;
}

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
@ccclass('cc.animation.HierarchyPath')
export class HierarchyPath implements ICustomTargetPath {
    @serializable
    public path = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    public get (target: Node): Node | null {
        if (!(target instanceof Node)) {
            warnID(3925);
            return null;
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            warnID(3926, target.name, this.path);
            return null;
        }
        return result;
    }
}

/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
@ccclass('cc.animation.ComponentPath')
export class ComponentPath implements ICustomTargetPath {
    @serializable
    public component = '';

    constructor (component?: string) {
        this.component = component || '';
    }

    public get (target: Node): Component | null {
        if (!(target instanceof Node)) {
            warnID(3927);
            return null;
        }
        const result = target.getComponent(this.component);
        if (!result) {
            warnID(3928, target.name, this.component);
            return null;
        }
        return result;
    }
}
