
// @ts-check

import CANNON from 'cannon';
import { Asset } from '../../../assets/asset';
import { ccclass, property } from '../../../core/data/class-decorator';

@ccclass('cc.PhysicalMaterial')
export class PhysicsMaterial extends Asset {
    @property
    public _friction = -1;

    @property
    public _restitution = -1;

    private _cannonMaterial: CANNON.Material;

    /**
     * Friction for this material.
     * If non-negative, it will be used instead of the friction given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
     */
    get friction() {
        return this._friction;
    }

    set friction(value) {
        this._friction = value;
        this._cannonMaterial.friction = value;
    }

    /**
     * Restitution for this material.
     * If non-negative, it will be used instead of the restitution given by ContactMaterials.
     * If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used
     */
    get restitution() {
        return this._restitution;
    }

    set restitution(value) {
        this._restitution = value;
        this._cannonMaterial.restitution = value;
    }

    constructor() {
        super();
        this._cannonMaterial = new CANNON.Material('');
    }

    public _getImpl() {
        return this._cannonMaterial;
    }
}
cc.PhysicsMaterial = PhysicsMaterial;
