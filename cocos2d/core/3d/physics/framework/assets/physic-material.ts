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

import { ccclass, property } from '../../../../platform/CCClassDecorator';
import { equals } from '../../../../value-types';

@ccclass('cc.PhysicMaterial')
export class PhysicMaterial extends cc.Asset {

    public static allMaterials: PhysicMaterial[] = [];

    private static _idCounter: number = 0;

    @property
    private _friction = 0.1;

    @property
    private _restitution = 0.1;

    /**
     * Friction for this material.
     * If non-negative, it will be used instead of the friction given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
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
     * Restitution for this material.
     * If non-negative, it will be used instead of the restitution given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used
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
        PhysicMaterial.allMaterials.push(this);
        if (this._uuid == '') {
            this._uuid = 'pm_' + PhysicMaterial._idCounter++;
        }
    }

    public clone () {
        let c = new PhysicMaterial();
        c._friction = this._friction;
        c._restitution = this._restitution;
        return c;
    }

    public destroy (): boolean {
        if (super.destroy()) {
            let idx = PhysicMaterial.allMaterials.indexOf(this);
            if (idx >= 0) {
                PhysicMaterial.allMaterials.splice(idx, 1);
            }
            return true;
        } else {
            return false;
        }
    }

}

cc.js.mixin(PhysicMaterial.prototype, cc.EventTarget.prototype);