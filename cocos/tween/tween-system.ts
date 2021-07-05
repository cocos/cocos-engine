/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module tween
 */

import { EDITOR } from 'internal:constants';
import { System, Director, director } from '../core';
import { ActionManager } from './actions/action-manager';
import { legacyCC } from '../core/global-exports';
import { ccclass } from '../core/data/decorators';

/**
 * @en
 * Tween system.
 * @zh
 * 缓动系统。
 */
@ccclass('cc.TweenSystem')
export class TweenSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'TWEEN';

    /**
     * @en
     * Gets the instance of the tween system.
     * @zh
     * 获取缓动系统的实例。
     */
    static readonly instance: TweenSystem;

    /**
     * @en
     * Gets the action manager.
     * @zh
     * 获取动作管理器。
     */
    get ActionManager () {
        return this.actionMgr;
    }

    private readonly actionMgr = new ActionManager();

    /**
     * @en
     * The update will auto execute after all compnents update.
     * @zh
     * 此方法会在组件 update 之后自动执行。
     * @param dt 间隔时间
     */
    update (dt: number) {
        if (!EDITOR || legacyCC.GAME_VIEW || this._executeInEditMode) {
            this.actionMgr.update(dt);
        }
    }
}

director.on(Director.EVENT_INIT, () => {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
});
