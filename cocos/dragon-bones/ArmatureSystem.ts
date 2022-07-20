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

import { director } from '../core/director';
import { System } from '../core/components';
import { ArmatureDisplay } from './ArmatureDisplay';
import { legacyCC } from '../core/global-exports';

export class ArmatureSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'ARMATURE';

    private static _instance: ArmatureSystem;

    private constructor () {
        super();
    }

    /**
     * @en
     * Gets the instance of the ArmatureSystem system.
     * @zh
     * 获取 Dragonbones Armature系统的单例。
     */
    public static getInstance () {
        if (!ArmatureSystem._instance) {
            ArmatureSystem._instance = new ArmatureSystem();
            director.registerSystem(ArmatureSystem.ID, ArmatureSystem._instance, System.Priority.HIGH);
        }
        return ArmatureSystem._instance;
    }

    private _armatures = new Set<ArmatureDisplay>();

    public add (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (!this._armatures.has(armature)) {
            this._armatures.add(armature);
        }
    }

    public remove (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (this._armatures.has(armature)) {
            this._armatures.delete(armature);
        }
    }

    postUpdate (dt: number) {
        if (!this._armatures) {
            return;
        }
        this._armatures.forEach((armature) => {
            armature.updateAnimation(dt);
        });
    }

    public prepareRenderData () {
        if (!this._armatures) {
            return;
        }
        this._armatures.forEach((armature) => {
            armature.markForUpdateRenderData();
        });
    }
}

legacyCC.internal.ArmatureSystem = ArmatureSystem;
