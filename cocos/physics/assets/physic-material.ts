
// @ts-check

/**
 * @category physics
 */

import { Asset } from '../../core/assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { math } from '../../core';

@ccclass('cc.PhysicMaterial')
export class PhysicMaterial extends Asset {

    public static allMaterials: PhysicMaterial[] = [];

    private static _idCounter: number = 0;

    @property
    private _friction = 0.1;

    @property
    private _restitution = 0.1;

    @property({
        override: true,
        visible: false
    })
    public _native: string | undefined;

    @property({
        override: true,
        visible: false
    })
    public _objFlags!: number;

    @property({
        override: true,
        visible: false,
    })
    public _nativeAsset!: string;

    @property({
        override: true,
        visible: false,
    })
    public nativeUrl!: string;

    /**
     * Friction for this material.
     * If non-negative, it will be used instead of the friction given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
     */
    get friction () {
        return this._friction;
    }

    set friction (value) {
        if (!math.equals(this._friction, value)) {
            this._friction = value;
            this.emit('physics_material_update');
        }
    }

    /**
     * Restitution for this material.
     * If non-negative, it will be used instead of the restitution given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used
     */
    get restitution () {
        return this._restitution;
    }

    set restitution (value) {
        if (!math.equals(this._restitution, value)) {
            this._restitution = value;
            this.emit('physics_material_update');
        }
    }

    constructor () {
        super();
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