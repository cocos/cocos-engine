
import { Joint2D } from './joint-2d';
import { ccclass, property, menu, type } from '../../../../core/data/class-decorator';
import { IDistanceJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec3 } from '../../../../core';

@ccclass('cc.DistanceJoint2D')
@menu('Physics2D/Joints/DistanceJoint2D')
export class DistanceJoint2D extends Joint2D {
    TYPE = EJoint2DType.DISTANCE;

    /**
     * @en
     * The max length.
     * @zh
     * 最大长度。
     */
    @property
    get maxLength () {
        if (this._autoCalcDistance && this.connectedBody) {
            return Vec3.distance(this.node.worldPosition, this.connectedBody.node.worldPosition);
        }
        return this._maxLength;
    }
    set maxLength (v) {
        this._maxLength = v;
        if (this._joint) {
            (this._joint as IDistanceJoint).setMaxLength(v);
        }
    }

    /**
     * @en
     * Auto calculate the distance between the connected two rigid bodies.
     * @zh
     * 自动计算关节连接的两个刚体间的距离
     */
    @property
    get autoCalcDistance () {
        return this._autoCalcDistance;
    }
    set autoCalcDistance (v) {
        this._autoCalcDistance = v;
    }

    /// private properties

    @property
    private _maxLength = 5;
    @property
    private _autoCalcDistance = true;
}
