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

const {ccclass, property} = cc._decorator;
const fastRemove = cc.js.array.fastRemove;
const equals = cc.math.equals;

/**
 * !#en
 * Physics material.
 * !#zh
 * 物理材质。
 * @class PhysicsMaterial
 * @extends Asset
 */
@ccclass('cc.PhysicsMaterial')
export class PhysicsMaterial extends cc.Asset {

    public static allMaterials: PhysicsMaterial[] = [];

    private static _idCounter: number = 0;

    @property
    private _friction = 0.1;

    @property
    private _restitution = 0.1;

    /**
     * !#en
     * Friction for this material.
     * !#zh
     * 物理材质的摩擦力。
     * @property {number} friction
     */
    @property
    get friction () {
        return this._friction;
    }

    set friction (value) {
        if (!equals(this._friction, value)) {
            this._friction = value;
            this.emit('physics_material_update');
        }
    }

    /**
     * !#en
     * Restitution for this material.
     * !#zh
     * 物理材质的弹力。
     * @property {number} restitution
     */
    @property
    get restitution () {
        return this._restitution;
    }

    set restitution (value) {
        if (!equals(this._restitution, value)) {
            this._restitution = value;
            this.emit('physics_material_update');
        }
    }

    constructor () {
        super();
        cc.EventTarget.call(this);
        PhysicsMaterial.allMaterials.push(this);
        if (this._uuid == '') {
            this._uuid = 'pm_' + PhysicsMaterial._idCounter++;
        }
    }

    public clone () {
        let c = new PhysicsMaterial();
        c._friction = this._friction;
        c._restitution = this._restitution;
        return c;
    }

    public destroy (): boolean {
        if (super.destroy()) {
            fastRemove(PhysicsMaterial.allMaterials, this);
            return true;
        } else {
            return false;
        }
    }

}

cc.js.mixin(PhysicsMaterial.prototype, cc.EventTarget.prototype);
cc.PhysicsMaterial = PhysicsMaterial;
