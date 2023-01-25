/*
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
 */

import { director } from '../game/director';
import { System } from '../core';
import { Skeleton } from './skeleton';
import { legacyCC } from '../core/global-exports';
/**
 * @en
 * System of spine，control skeleton animation updating.
 * @zh
 * spine 骨骼系统，控制骨骼动画更新。
 * @class SkeletonSystem
 */
export class SkeletonSystem extends System {
    /**
     * @en The ID flag of the system.
     * @zh 此系统的 ID 标记。
     */
    static readonly ID = 'SKELETON';

    private static _instance: SkeletonSystem;

    private constructor () {
        super();
    }

    /**
     * @en Gets the instance of the Spine Skeleton system.
     * @zh 获取 Spine 骨骼系统的单例。
     */
    public static getInstance () {
        if (!SkeletonSystem._instance) {
            SkeletonSystem._instance = new SkeletonSystem();
            director.registerSystem(SkeletonSystem.ID, SkeletonSystem._instance, System.Priority.HIGH);
        }
        return SkeletonSystem._instance;
    }

    private _skeletons = new Set<Skeleton>();

    /**
     * @en
     * Add a skeleton instance into Skeleton system. Only be added into skeleton
     * system, skeleton animation will be updated.
     * @zh
     * 添加一个spine骨骼实例到系统, 只有添加到系统中的骨骼组件才会被更新动画。
     */
    public add (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (!this._skeletons.has(skeleton)) {
            this._skeletons.add(skeleton);
        }
    }
    /**
     * @en Remove skeleton from skeleton system.
     * @zh 从skeleton系统中移除骨骼组件。
     */
    public remove (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (this._skeletons.has(skeleton)) {
            this._skeletons.delete(skeleton);
        }
    }

    /**
     * @en Trigger update for all skeleton animations.
     * @zh 触发更新所有骨骼动画。
     */
    postUpdate (dt: number) {
        if (!this._skeletons) {
            return;
        }
        this._skeletons.forEach((skeleton) => {
            skeleton.updateAnimation(dt);
        });
    }
    /**
     * @en Mark to update the rendering data for all skeletons.
     * @zh 标记更新所有骨骼动画的渲染数据。
     */
    public prepareRenderData () {
        if (!this._skeletons) {
            return;
        }
        this._skeletons.forEach((skeleton) => {
            skeleton.markForUpdateRenderData();
        });
    }
}
legacyCC.internal.SpineSkeletonSystem = SkeletonSystem;
