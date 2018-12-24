import CANNON from 'cannon';
import { PhysicsMaterial } from '../../assets/physics/material';
import { toCannonOptions } from './util';

export interface IContactMaterialOptions {
    friction?: number;
    restitution?: number;
    contactEquationStiffness?: number;
    contactEquationRelaxation?: number;
    frictionEquationStiffness?: number;
    frictionEquationRelaxation?: number;
}

export class ContactMaterial {
    private _cannonContactMaterial: CANNON.ContactMaterial;

    constructor(lhs: PhysicsMaterial, rhs: PhysicsMaterial, options?: IContactMaterialOptions) {
        let opts: CANNON.IContactMaterialOptions | undefined = undefined;
        if (options) {
            opts = toCannonOptions<CANNON.IContactMaterialOptions>(options);
        }
        this._cannonContactMaterial = new CANNON.ContactMaterial(lhs._getImpl(), rhs._getImpl(), opts);
    }

    public _getImpl() {
        return this._cannonContactMaterial;
    }
}