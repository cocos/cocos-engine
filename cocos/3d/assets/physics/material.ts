
// @ts-check

import { ccclass, property } from '../../../core/data/class-decorator';
import Asset from "../../../assets/CCAsset";
import CANNON from 'cannon';

@ccclass('cc.PhysicalMaterial')
export class PhysicsMaterial extends Asset {
    @property
    friction = -1;

    @property
    restitution = -1;

    private _cannonMaterial: CANNON.Material | null = null;

    constructor() {
        super();
        this._cannonMaterial = new CANNON.Material('');
    }

    public _getImpl() {
        return this._cannonMaterial;
    }
}