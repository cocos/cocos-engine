import CANNON from 'cannon';
import { PhysicsMaterial } from '../../assets/physics/material';

export class ContactMaterial {
    private _cannonContactMaterial: CANNON.ContactMaterial;

    constructor(lhs: PhysicsMaterial, rhs: PhysicsMaterial) {
        const opts: CANNON.IContactMaterialOptions = {
            friction: 0.3,
            restitution: 0.3,
            contactEquationStiffness: 1e7,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e7,
            frictionEquationRelaxation: 3,
        };
        this._cannonContactMaterial = new CANNON.ContactMaterial(lhs._getImpl(), rhs._getImpl(), opts);
    }

    /**
     * Friction coefficient. Default value 0.3.
     */
    get friction() {
        return this._cannonContactMaterial.friction;   
    }

    set friction(value) {
        this._cannonContactMaterial.friction = value;
    }

    /**
     * Restitution coefficient. Default value 0.3.
     */
    get restitution() {
        return this._cannonContactMaterial.restitution;   
    }

    set restitution(value) {
        this._cannonContactMaterial.restitution = value;
    }

    /**
     *  Stiffness of the produced contact equations. Default value 1e7.
     */
    get contactEquationStiffness() {
        return this._cannonContactMaterial.contactEquationStiffness;   
    }

    set contactEquationStiffness(value) {
        this._cannonContactMaterial.contactEquationStiffness = value;
    }

    /**
     * Relaxation time of the produced contact equations. Default value 0.3.
     */
    get contactEquationRelaxation() {
        return this._cannonContactMaterial.contactEquationRelaxation;   
    }

    set contactEquationRelaxation(value) {
        this._cannonContactMaterial.contactEquationRelaxation = value;
    }

    /**
     * Stiffness of the produced friction equations. Default value 1e7.
     */
    get frictionEquationStiffness() {
        return this._cannonContactMaterial.frictionEquationStiffness;   
    }

    set frictionEquationStiffness(value) {
        this._cannonContactMaterial.frictionEquationStiffness = value;
    }

    /**
     * Relaxation time of the produced friction equations. Default value 3.
     */
    get frictionEquationRelaxation() {
        return this._cannonContactMaterial.frictionEquationRelaxation;
    }

    set frictionEquationRelaxation(value) {
        this._cannonContactMaterial.frictionEquationRelaxation = value;
    }

    public _getImpl() {
        return this._cannonContactMaterial;
    }
}