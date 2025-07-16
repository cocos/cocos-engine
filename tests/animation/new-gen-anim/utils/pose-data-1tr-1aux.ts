import { AnimationController } from "../../../../cocos/animation/animation";
import { Transform } from "../../../../cocos/animation/core/transform";
import { lerp, Node, Quat, Vec3 } from "../../../../exports/base";
import { BlendTwoOperator } from "./abstract-operators";
import { PoseRecord } from "./pose-record";

/** Pose data with 1 transform and 1 aux curve. */
export class PoseData_1tr_1aux {
    constructor(
        public transform: Transform,
        public auxCurve: number,
    ) {
    }

    public toPoseRecord(): PoseRecord {
        return {
            transforms: { 'tr': this.transform },
            auxiliaryCurves: { 'aux': this.auxCurve },
        };
    }

    static generate(g: () => number): PoseData_1tr_1aux {
        const transform = new Transform();
        transform.position = new Vec3(lerp(-1, 1, g()), lerp(-1, 1, g()), lerp(-1, 1, g()));
        transform.rotation = Quat.fromEuler(new Quat(), lerp(0, 360, g()), lerp(0, 360, g()), lerp(0, 360, g()));
        const s = lerp(0.1, 2, g());
        transform.scale = new Vec3(s, s, s);
        return new PoseData_1tr_1aux(transform, lerp(-1, 1, g()));
    }

    static createHierarchy() {
        const node = new Node();
        node.addChild(new Node('tr'));
        return node;
    }

    static getResult(root: Node, controller: AnimationController): PoseData_1tr_1aux {
        const trNode = root.getChildByName('tr');
        expect(trNode).not.toBeNull();
        const transform = new Transform();
        transform.position = Vec3.clone(trNode!.position);
        transform.rotation = Quat.clone(trNode!.rotation);
        transform.scale = Vec3.clone(trNode!.scale);
        return new PoseData_1tr_1aux(transform, controller.getAuxiliaryCurveValue_experimental('aux'));
    }

    static applyBlendTwoOperator(
        lhs: PoseData_1tr_1aux, rhs: PoseData_1tr_1aux, ratio: number,
        op: BlendTwoOperator,
    ): PoseData_1tr_1aux {
        return new PoseData_1tr_1aux(
            op.blendTransform(lhs.transform, rhs.transform, ratio),
            op.blendAuxiliaryCurve(lhs.auxCurve, rhs.auxCurve, ratio),
        );
    }

    static checkEqual(actual: PoseData_1tr_1aux, expected: PoseData_1tr_1aux) {
        expect(Transform.equals(actual.transform, expected.transform)).toBe(true);
        expect(actual.auxCurve).toBeCloseTo(expected.auxCurve, 6);
    }
}
