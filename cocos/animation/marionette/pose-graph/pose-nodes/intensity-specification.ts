import { ccenum } from '../../../../core';
import { ccclass, editable, range, serializable, type, visible } from '../../../../core/data/decorators';
import { AuxiliaryCurveHandle } from '../../../core/animation-handle';
import { Pose } from '../../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { AnimationGraphBindingContext } from '../../animation-graph-context';

enum IntensityType {
    VALUE,

    AUXILIARY_CURVE,
}
ccenum(IntensityType);

@ccclass(`${CLASS_NAME_PREFIX_ANIM}IntensitySpecification`)
export class IntensitySpecification {
    @type(IntensityType)
    @serializable
    @editable
    public type = IntensityType.VALUE;

    @serializable
    @editable
    @visible(function visible (this: IntensitySpecification): boolean { return this.type === IntensityType.VALUE; })
    @range([0.0, 1.0, 0.01])
    public value = 1.0;

    @serializable
    @editable
    @visible(function visible (this: IntensitySpecification): boolean { return this.type === IntensityType.AUXILIARY_CURVE; })
    public auxiliaryCurveName = '';

    public bind (context: AnimationGraphBindingContext): void {
        if (this.type === IntensityType.AUXILIARY_CURVE && this.auxiliaryCurveName) {
            const handle = context.bindAuxiliaryCurve(this.auxiliaryCurveName);
            this._handle = handle;
        }
    }

    public evaluate (pose: Readonly<Pose>): number {
        if (this.type === IntensityType.AUXILIARY_CURVE && this._handle) {
            const value = pose.auxiliaryCurves[this._handle.index];
            return value;
        }
        return this.value;
    }

    private _handle: AuxiliaryCurveHandle | undefined = undefined;
}
