import { AuxiliaryCurveHandle, TransformHandle } from "../../../../../../cocos/animation/core/animation-handle";
import { Transform } from "../../../../../../cocos/animation/core/transform";
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from "../../../../../../cocos/animation/marionette/animation-graph-context";
import { PoseNode } from "../../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { PoseRecord } from "../../../utils/pose-record";

export abstract class PoseNode_MapPoseRecord extends PoseNode {
    constructor(
        private _record: PoseRecord,
    ) {
        super();
    }

    public bind(context: AnimationGraphBindingContext): void {
        this.transformHandleMap = new Map(Object.entries(this._record.transforms).map(([nodeName, transformRecord]) => {
            const handle = context.bindTransformByName(nodeName);
            expect(handle).not.toBeNull();
            return [handle!, transformRecord];
        }));

        this.auxiliaryCurveHandleMap = new Map();
        if (this._record.auxiliaryCurves) {
            this.auxiliaryCurveHandleMap = new Map(Object.entries(this._record.auxiliaryCurves).map(([curveName, curveValue]) => {
                const handle = context.bindAuxiliaryCurve(curveName);
                expect(handle).not.toBeNull();
                return [handle!, curveValue];
            }));
        }
    }

    public settle(context: AnimationGraphSettleContext): void { }

    public reenter(): void { }

    protected doUpdate(context: AnimationGraphUpdateContext): void { }

    protected transformHandleMap: Map<TransformHandle, Transform> | undefined = undefined;

    protected auxiliaryCurveHandleMap: Map<AuxiliaryCurveHandle, number> | undefined = undefined;
}