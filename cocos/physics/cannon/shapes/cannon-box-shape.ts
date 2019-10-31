import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { BoxShapeBase, ShapeBase } from '../../api';
import { getWrap, setWrap, stringfyVec3 } from '../../util';
import { CannonRigidBody } from '../cannon-body';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IBoxShape } from '../../spec/IPhysicsSpahe';
import { IVec3Like } from '../../../core/math/type-define';

export class CannonBoxShape extends CannonShape implements IBoxShape {

    private get _box (): CANNON.Box {
        return this._shape as CANNON.Box;
    };

    private _halfExt: CANNON.Vec3 = new CANNON.Vec3();

    constructor (size: Vec3) {
        super();
        Vec3.multiplyScalar(this._halfExt, size, 0.5);
        this._shape = new CANNON.Box(this._halfExt.clone());
    }

    set size (v: IVec3Like) {
        Vec3.multiplyScalar(this._halfExt, v, 0.5);
        Vec3.multiply(this._box.halfExtents, this._halfExt, this.collider.node.worldScale);
        this._box.updateConvexPolyhedronRepresentation();
        commitShapeUpdates(this._body);
    }

    // public setScale (scale: Vec3): void {
    //     super.setScale(scale);
    //     this._recalcExtents();

    //     // Another implementation method
    //     // see https://github.com/schteppe/cannon.js/issues/270
    //     // if (this._body) {
    //     //     const body = this._body;
    //     //     const shape = this._cannonBox;
    //     //     const iShape = body.shapes.indexOf(shape);
    //     //     if (iShape >= 0) {
    //     //         body.shapes.splice(iShape, 1);
    //     //         body.shapeOffsets.splice(iShape, 1);
    //     //         body.shapeOrientations.splice(iShape, 1);
    //     //         body.updateMassProperties();
    //     //         body.updateBoundingRadius();
    //     //         body.aabbNeedsUpdate = true;
    //     //         (shape as any).body = null;
    //     //     }
    //     // }
    //     // Vec3.multiply(this._cannonBox.halfExtents, this._cannonBox.halfExtents, scale);
    //     // if (this._body) { this._body.addShape(this._cannonBox); }
    // }

    // public setSize (size: Vec3) {
    //     Vec3.multiplyScalar(this._halfExtent, size, 0.5);
    //     this._recalcExtents();
    // }

    // private _recalcExtents () {
    //     Vec3.multiply(this._box.halfExtents, this._halfExt, this._scale);
    //     this._box.updateConvexPolyhedronRepresentation();

    //     if (this._body != null) {
    //         commitShapeUpdates(this._body);
    //     }
    // }
}
