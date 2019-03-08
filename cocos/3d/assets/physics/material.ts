
// @ts-check

import { Asset } from '../../../assets/asset';
import { ccclass, property } from '../../../core/data/class-decorator';

@ccclass('cc.PhysicsMaterial')
export class PhysicsMaterial extends Asset {
    @property
    public _friction = -1;

    @property
    public _restitution = -1;

    /**
     * Friction for this material.
     * If non-negative, it will be used instead of the friction given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
     */
    get friction () {
        return this._friction;
    }

    set friction (value) {
        this._friction = value;
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
        this._restitution = value;
    }

    constructor () {
        super();
    }
}
cc.PhysicsMaterial = PhysicsMaterial;
