import CANNON from 'cannon';
import { Vec3 } from '../../../../core/value-types';
import { vec3 } from '../../../../core/vmath';
import { BoxShapeBase, ShapeBase } from '../../api';
import { getWrap, setWrap, stringfyVec3 } from '../../util';
import { CannonRigidBody } from '../cannon-body';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';

export class CannonBoxShape extends CannonShape implements BoxShapeBase {
    private _box: CANNON.Box;
    private _halfExtent: CANNON.Vec3 = new CANNON.Vec3();

    constructor (size: Vec3) {
        super();
        vec3.scale(this._halfExtent, size, 0.5);
        // attention : here should use clone
        this._box = new CANNON.Box(this._halfExtent.clone());
        setWrap<ShapeBase>(this._box, this);
        setWrap<ShapeBase>(this._box.convexPolyhedronRepresentation, this);
        this._shape = this._box;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcExtents();

        // Another implementation method
        // see https://github.com/schteppe/cannon.js/issues/270
        // if (this._body) {
        //     const body = this._body;
        //     const shape = this._cannonBox;
        //     const iShape = body.shapes.indexOf(shape);
        //     if (iShape >= 0) {
        //         body.shapes.splice(iShape, 1);
        //         body.shapeOffsets.splice(iShape, 1);
        //         body.shapeOrientations.splice(iShape, 1);
        //         body.updateMassProperties();
        //         body.updateBoundingRadius();
        //         body.aabbNeedsUpdate = true;
        //         (shape as any).body = null;
        //     }
        // }
        // vec3.multiply(this._cannonBox.halfExtents, this._cannonBox.halfExtents, scale);
        // if (this._body) { this._body.addShape(this._cannonBox); }
    }

    public setSize (size: Vec3) {
        vec3.scale(this._halfExtent, size, 0.5);
        this._recalcExtents();
    }

    public _stringfyThis () {
        return `${this._body ? getWrap<CannonRigidBody>(this._body)._stringfyThis() : '<No-body>'}(Box)`;
    }

    public _devStrinfy () {
        return `Box(${super._devStrinfy()}, halfExtents: ${stringfyVec3(this._box.halfExtents)})`;
    }

    private _recalcExtents () {
        vec3.multiply(this._box.halfExtents, this._halfExtent, this._scale);
        // console.log(`[[CANNON]] Set ${this._stringfyThis()} half extents to ${stringfyVec3(this._cannonBox.halfExtents)}.`);
        this._box.updateConvexPolyhedronRepresentation();
        setWrap<ShapeBase>(this._box.convexPolyhedronRepresentation, this);

        if (this._body != null) {
            commitShapeUpdates(this._body);
        }
    }
}
