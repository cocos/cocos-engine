
// @ts-check

import CANNON from 'cannon';
import Asset from '../../../assets/CCAsset';
import { ccclass, property } from '../../../core/data/class-decorator';

@ccclass('cc.PhysicalMaterial')
export class PhysicsMaterial extends Asset {
    @property
    public friction = -1;

    @property
    public restitution = -1;

    private _cannonMaterial: CANNON.Material;

    constructor() {
        super();
        this._cannonMaterial = new CANNON.Material('');
    }

    public _getImpl() {
        return this._cannonMaterial;
    }
}
