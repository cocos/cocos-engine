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

// @ts-check

/**
 * @packageDocumentation
 * @module physics
 */

import { ccclass, editable, serializable } from 'cc.decorator';
import { Asset } from '../../../core/assets/asset';
import { math } from '../../../core';

/**
 * @en
 * Physics materials.
 * @zh
 * 物理材质。
 */
@ccclass('cc.PhysicsMaterial')
export class PhysicsMaterial extends Asset {
    /**
     * @en
     * Gets all physics material instances.
     * @zh
     * 获取所有的物理材质实例。
     */
    static allMaterials: PhysicsMaterial[] = [];

    /**
     * @en
     * The event which will be triggered when the entity of physics material update.
     * @zh
     * 物理材质实例更新时触发的事件。
     * @event PhysicsMaterial.EVENT_UPDATE
     */
    static readonly EVENT_UPDATE = 'event_update';

    /**
     * @en
     * Friction for this material.
     * @zh
     * 此材质的摩擦系数。
     */
    @editable
    get friction () {
        return this._friction;
    }

    set friction (value) {
        if (!math.equals(this._friction, value)) {
            this._friction = value;
            this.emit(PhysicsMaterial.EVENT_UPDATE);
        }
    }

    /**
     * @en
     * Rolling friction for this material.
     * @zh
     * 此材质的滚动摩擦系数。
     */
    @editable
    get rollingFriction () {
        return this._rollingFriction;
    }

    set rollingFriction (value) {
        if (!math.equals(this._rollingFriction, value)) {
            this._rollingFriction = value;
            this.emit(PhysicsMaterial.EVENT_UPDATE);
        }
    }

    /**
     * @en
     * Spinning friction for this material.
     * @zh
     * 此材质的自旋摩擦系数。
     */
    @editable
    get spinningFriction () {
        return this._spinningFriction;
    }

    set spinningFriction (value) {
        if (!math.equals(this._spinningFriction, value)) {
            this._spinningFriction = value;
            this.emit(PhysicsMaterial.EVENT_UPDATE);
        }
    }

    /**
     * @en
     * Restitution for this material.
     * @zh
     * 此材质的回弹系数。
     */
    @editable
    get restitution () {
        return this._restitution;
    }

    set restitution (value) {
        if (!math.equals(this._restitution, value)) {
            this._restitution = value;
            this.emit(PhysicsMaterial.EVENT_UPDATE);
        }
    }

    readonly id: number;
    private static _idCounter = 0;

    @serializable
    private _friction = 0.6;

    @serializable
    private _rollingFriction = 0.0;

    @serializable
    private _spinningFriction = 0.0;

    @serializable
    private _restitution = 0.0;

    constructor () {
        super();
        PhysicsMaterial.allMaterials.push(this);
        this.id = PhysicsMaterial._idCounter++;
        if (!this._uuid) this._uuid = `pm_${this.id}`;
    }

    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    public clone () {
        const c = new PhysicsMaterial();
        c._friction = this._friction;
        c._restitution = this._restitution;
        c._rollingFriction = this._rollingFriction;
        c._spinningFriction = this._spinningFriction;
        return c;
    }

    /**
     * @en
     * destroy.
     * @zh
     * 销毁。
     * @return 是否成功
     */
    public destroy (): boolean {
        if (super.destroy()) {
            const idx = PhysicsMaterial.allMaterials.indexOf(this);
            if (idx >= 0) {
                PhysicsMaterial.allMaterials.splice(idx, 1);
            }
            return true;
        }
        return false;
    }

    /**
     * @en
     * Sets the coefficients values.
     * @zh
     * 设置材质相关的系数。
     * @param friction
     * @param rollingFriction
     * @param spinningFriction
     * @param restitution
     */
    public setValues (friction: number, rollingFriction: number, spinningFriction: number, restitution: number) {
        const emitUpdate = this._friction !== friction || this._rollingFriction !== rollingFriction
            || this._spinningFriction !== spinningFriction || this._restitution !== restitution;
        this._friction = friction;
        this._rollingFriction = rollingFriction;
        this._spinningFriction = spinningFriction;
        this._restitution = restitution;
        if (emitUpdate) this.emit(PhysicsMaterial.EVENT_UPDATE);
    }
}
