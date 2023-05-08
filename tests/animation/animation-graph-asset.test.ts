import { Vec2 } from "../../cocos/core";
import { AnimationClip } from "../../cocos/animation/animation-clip";
import { Motion, ClipMotion, AnimationBlend1D, AnimationBlend2D } from "../../cocos/animation/marionette/motion";
import { AnimationGraph, AnimationTransition, EmptyState, EmptyStateTransition, StateMachine, SubStateMachine, Transition } from "../../cocos/animation/marionette/animation-graph";
import { BinaryCondition, Condition, TriggerCondition, UnaryCondition } from "../../cocos/animation/marionette/state-machine/condition";
import { MotionState } from "../../cocos/animation/marionette/state-machine/motion-state";
import { Bindable } from "../../cocos/animation/marionette/parametric";
import { assertIsTrue } from "../../cocos/core/data/utils/asserts";
import { TCBindingParams, createTCBinding } from "./new-gen-anim/utils/factory";
import { TCBinding, TCBindingValueType } from "../../cocos/animation/marionette/asset-creation";
import { TCVariableBinding } from "../../cocos/animation/marionette/state-machine/condition/binding/variable-binding";
import { TCAuxiliaryCurveBinding } from "../../cocos/animation/marionette/state-machine/condition/binding/auxiliary-curve-binding";
import { TCStateWeightBinding } from "../../cocos/animation/marionette/state-machine/condition/binding/state-weight-binding";

describe('Animation graph asset', () => {
    test('Asset operation: clone or copy', () => {
        const animationGraph = new AnimationGraph();
        const mainLayer = animationGraph.addLayer();

        // Motion state
        {
            const motionState = mainLayer.stateMachine.addMotion();
            motionState.name = 'MotionStateName';
            motionState.speed = 0.1;
            motionState.speedMultiplier = 'MotionState.speedMultiplier';
            motionState.speedMultiplierEnabled = true;
            motionState.motion = null;
            const newMotionState = mainLayer.stateMachine.addMotion();
            motionState.copyTo(newMotionState);
            assertsEqualMotionState(newMotionState, motionState);
        }
        
        // Clip Motion
        {
            const clipMotion = new ClipMotion();
            clipMotion.clip = new AnimationClip();
            const newClipMotion = clipMotion.clone();
            assertsEqualClipMotion(newClipMotion, clipMotion);
        }

        // Animation Blend 1D
        {
            const animationBlend = new AnimationBlend1D();
            animationBlend.param.value = 0.6;
            animationBlend.param.variable = 'AnimationBlend1DParam';
            const animationBlendItems = [new AnimationBlend1D.Item(), new AnimationBlend1D.Item()];
            const animationBlendItem0Motion = animationBlendItems[0].motion = new ClipMotion();
            animationBlendItem0Motion.clip = new AnimationClip();
            animationBlendItems[0].threshold = 0.2;
            animationBlendItems[1].threshold = 0.3;
            animationBlend.items = animationBlendItems;
            const newAnimationBlend = animationBlend.clone();
            assertsEqualAnimationBlend1D(newAnimationBlend, animationBlend);
        }

        // Animation Blend 2D
        {
            const animationBlend = new AnimationBlend2D();
            animationBlend.paramX.value = 0.6;
            animationBlend.paramX.variable = 'AnimationBlend2DParamX';
            animationBlend.paramY.value = 0.7;
            animationBlend.paramY.variable = 'AnimationBlend2DParamY';
            const animationBlendItems = [new AnimationBlend2D.Item(), new AnimationBlend2D.Item()];
            const animationBlendItem0Motion = animationBlendItems[0].motion = new ClipMotion();
            animationBlendItem0Motion.clip = new AnimationClip();
            animationBlendItems[0].threshold = new Vec2(0.2, 0.3);
            animationBlendItems[1].threshold = new Vec2(0.4, 0.8);
            animationBlend.items = animationBlendItems;
            const newAnimationBlend = animationBlend.clone();
            assertsEqualAnimationBlend2D(newAnimationBlend, animationBlend);
        }

        // Empty state
        {
            const emptyState = mainLayer.stateMachine.addEmpty();
            emptyState.name = 'EmptyStateX';
            const newEmptyState = mainLayer.stateMachine.addEmpty();
            emptyState.copyTo(newEmptyState);
            assertsEqualEmptyState(newEmptyState, emptyState);
        }

        // Sub state machine
        {
            const subStateMachine = mainLayer.stateMachine.addSubStateMachine();
            const m = subStateMachine.stateMachine.addMotion();
            const clipMotion = m.motion = new ClipMotion();
            clipMotion.clip = new AnimationClip();
            subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, m);
            subStateMachine.stateMachine.connect(m, subStateMachine.stateMachine.exitState);
            const newSubStateMachine = mainLayer.stateMachine.addSubStateMachine();
            subStateMachine.copyTo(newSubStateMachine);
            assertsEqualSubStateMachine(newSubStateMachine, subStateMachine);
        }

        // Animation transition
        {
            const m1 = mainLayer.stateMachine.addMotion();
            const m2 = mainLayer.stateMachine.addMotion();
            const t1 = mainLayer.stateMachine.connect(m1, m2);
            const [cond] = t1.conditions = [new BinaryCondition()];
            cond.operator = BinaryCondition.Operator.GREATER_THAN_OR_EQUAL_TO;
            cond.lhsBinding = createTCBinding({ type: 'variable', variableName: 'Lhs' });
            cond.rhs = 0.618;
            t1.duration = 0.1;
            t1.relativeDuration = true;
            t1.exitConditionEnabled = true;
            t1.exitCondition = 0.2;
            t1.destinationStart = 0.3;
            t1.relativeDestinationStart = true;
            const t2 = mainLayer.stateMachine.connect(m1, m2);
            // @ts-expect-error Type mismatch
            t1.copyTo(t2);
            assertsEqualAnimationTransition(t1, t2);
        }

        // Empty state transition
        {
            const m1 = mainLayer.stateMachine.addEmpty();
            const m2 = mainLayer.stateMachine.addMotion();
            const t1 = mainLayer.stateMachine.connect(m1, m2);
            const [cond] = t1.conditions = [new BinaryCondition()];
            cond.operator = BinaryCondition.Operator.GREATER_THAN_OR_EQUAL_TO;
            cond.lhsBinding = createTCBinding({ type: 'variable', variableName: 'Lhs' });
            cond.rhs = 0.618;
            t1.duration = 0.1;
            t1.destinationStart = 0.3;
            t1.relativeDestinationStart = true;
            const t2 = mainLayer.stateMachine.connect(m1, m2);
            t1.copyTo(t2);
            assertsEqualEmptyStateTransition(t1, t2);
        }

        // Plain transition
        {
            const m2 = mainLayer.stateMachine.addMotion();
            const t1 = mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, m2);
            const [cond] = t1.conditions = [new BinaryCondition()];
            cond.operator = BinaryCondition.Operator.GREATER_THAN_OR_EQUAL_TO;
            cond.lhsBinding = createTCBinding({ type: 'variable', variableName: 'Lhs' });
            cond.rhs = 0.618;
            const t2 = mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, m2);
            t1.copyTo(t2);
            assertsEqualBaseTransition(t1, t2);
        }

        // Unary condition
        {
            const unaryCondition = new UnaryCondition();
            unaryCondition.operator = UnaryCondition.Operator.TRUTHY;
            unaryCondition.operand.value = true;
            unaryCondition.operand.variable = 'UnaryConditionOperand';
            const newUnaryCondition = unaryCondition.clone();
            assertsEqualUnaryCondition(newUnaryCondition, unaryCondition);
        }

        // Binary condition
        {
            for (const tcBindingParams of [
                { type: 'variable', variableName: 'BinaryConditionLhs' },
                { type: 'auxiliary-curve', variableName: 'AuxiliaryCurve1' },
                { type: 'state-weight' },
            ] as TCBindingParams[]) {
                const binaryCondition = new BinaryCondition();
                binaryCondition.operator = BinaryCondition.Operator.GREATER_THAN_OR_EQUAL_TO;
                binaryCondition.lhs = 0.618;
                binaryCondition.lhsBinding = createTCBinding(tcBindingParams);
                binaryCondition.rhs = 6666;
                const newBinaryCondition = binaryCondition.clone();
                assertsEqualBinaryCondition(newBinaryCondition, binaryCondition);
            }
        }

        // Trigger condition
        {
            const triggerCondition = new TriggerCondition();
            triggerCondition.trigger = 'Trigger';
            const newTriggerCondition = triggerCondition.clone();
            assertsEqualTriggerCondition(newTriggerCondition, triggerCondition);
        }

        function assertsEqualMotionState(lhs: MotionState, rhs: MotionState) {
            expect(lhs.name).toBe(rhs.name);
            expect(lhs.speed).toBe(rhs.speed);
            expect(lhs.speedMultiplier).toBe(rhs.speedMultiplier);
            expect(lhs.speedMultiplierEnabled).toBe(rhs.speedMultiplierEnabled);
            assertsEqualOptionalMotion(lhs.motion, rhs.motion);
        }

        function assertsEqualEmptyState(lhs: EmptyState, rhs: EmptyState) {
            expect(lhs.name).toBe(rhs.name);
        }

        function assertsEqualSubStateMachine(lhs: SubStateMachine, rhs: SubStateMachine) {
            expect(lhs.name).toBe(rhs.name);
            assertsEqualStateMachine(lhs.stateMachine, rhs.stateMachine);
        }

        function assertsEqualStateMachine(lhs: StateMachine, rhs: StateMachine) {
            // Simplified check...
            const lhsStates = [...lhs.states()];
            const rhsStates = [...rhs.states()];
            expect(lhsStates.length).toBe(rhsStates.length);
            const lhsTransitions = [...lhs.transitions()];
            const rhsTransitions = [...rhs.transitions()];
            expect(lhsTransitions.length).toBe(rhsTransitions.length);
        }

        function assertsEqualBaseTransition(lhs: Transition, rhs: Transition) {
            expect(lhs.conditions).toHaveLength(rhs.conditions.length);
            for (let i = 0; i < lhs.conditions.length; ++i) {
                assertsEqualCondition(lhs.conditions[i], rhs.conditions[i]);
            }
        }

        function assertsEqualAnimationTransition(lhs: AnimationTransition, rhs: AnimationTransition) {
            assertsEqualBaseTransition(lhs, rhs);
            expect(lhs.duration).toBe(rhs.duration);
            expect(lhs.relativeDuration).toBe(rhs.relativeDuration);
            expect(lhs.exitConditionEnabled).toBe(rhs.exitConditionEnabled);
            expect(lhs.exitCondition).toBe(rhs.exitCondition);
            expect(lhs.destinationStart).toBe(rhs.destinationStart);
            expect(lhs.relativeDestinationStart).toBe(rhs.relativeDestinationStart);
        }

        function assertsEqualEmptyStateTransition(lhs: EmptyStateTransition, rhs: EmptyStateTransition) {
            assertsEqualBaseTransition(lhs, rhs);
            expect(lhs.duration).toBe(rhs.duration);
            expect(lhs.destinationStart).toBe(rhs.destinationStart);
            expect(lhs.relativeDestinationStart).toBe(rhs.relativeDestinationStart);
        }

        function assertsEqualCondition(lhs: Condition, rhs: Condition) {
            if (lhs instanceof UnaryCondition) {
                expect(rhs).toBeInstanceOf(UnaryCondition);
                assertsEqualUnaryCondition(lhs, rhs as UnaryCondition);
            } else if (lhs instanceof BinaryCondition) {
                expect(rhs).toBeInstanceOf(BinaryCondition);
                assertsEqualBinaryCondition(lhs, rhs as BinaryCondition);
            } else if (lhs instanceof TriggerCondition) {
                expect(rhs).toBeInstanceOf(TriggerCondition);
                assertsEqualTriggerCondition(lhs, rhs as TriggerCondition);
            } else {
                assertIsTrue(false);
            }
        }

        function assertsEqualUnaryCondition(lhs: UnaryCondition, rhs: UnaryCondition) {
            expect(lhs.operator).toBe(rhs.operator);
            assertsEqualBindable(lhs.operand, rhs.operand);
        }

        function assertsEqualTCBinding<TValueType extends TCBindingValueType>(lhs: TCBinding<TValueType>, rhs: TCBinding<TValueType>) {
            if (lhs instanceof TCVariableBinding) {
                expect(rhs).toBeInstanceOf(TCVariableBinding);
                expect(lhs.variableName).toStrictEqual((rhs as TCVariableBinding<TValueType>).variableName);
                expect(lhs.type).toStrictEqual((rhs as TCVariableBinding<TValueType>).type);
            } else if (lhs instanceof TCAuxiliaryCurveBinding) {
                expect(rhs).toBeInstanceOf(TCAuxiliaryCurveBinding);
                expect(lhs.curveName).toStrictEqual((rhs as unknown as TCAuxiliaryCurveBinding).curveName);
            } else if (lhs instanceof TCStateWeightBinding) {
                expect(rhs).toBeInstanceOf(TCStateWeightBinding);
            }
        }

        function assertsEqualBinaryCondition(lhs: BinaryCondition, rhs: BinaryCondition) {
            expect(lhs.operator).toBe(rhs.operator);
            expect(lhs.lhs).toStrictEqual(rhs.lhs);
            assertsEqualTCBinding(lhs.lhsBinding, rhs.lhsBinding);
            expect(lhs.rhs).toStrictEqual(rhs.rhs);
        }

        function assertsEqualTriggerCondition(lhs: TriggerCondition, rhs: TriggerCondition) {
            expect(lhs.trigger).toBe(rhs.trigger);
        }

        function assertsEqualMotion(lhs: Motion, rhs: Motion) {
            if (lhs instanceof ClipMotion) {
                expect(rhs).toBeInstanceOf(ClipMotion);
                assertsEqualClipMotion(lhs, rhs as ClipMotion);
            } else if (lhs instanceof AnimationBlend1D) {
                expect(rhs).toBeInstanceOf(AnimationBlend1D);
                assertsEqualAnimationBlend1D(lhs, rhs as AnimationBlend1D);
            } else if (lhs instanceof AnimationBlend2D) {
                expect(rhs).toBeInstanceOf(AnimationBlend2D);
                assertsEqualAnimationBlend2D(lhs, rhs as AnimationBlend2D);
            } else {
                assertIsTrue(false);
            }
        }

        function assertsEqualBindable<T>(lhs: Bindable<T>, rhs: Bindable<T>) {
            expect(lhs.value).toBe(rhs.value);
            expect(lhs.variable).toBe(rhs.variable);
        }

        function assertsEqualOptionalMotion(lhs: Motion | null, rhs: Motion | null) {
            if (lhs) {
                expect(rhs).not.toBeNull();
                assertsEqualMotion(lhs, rhs!);
            } else {
                expect(rhs).toBeNull();
            }
        }

        function assertsEqualClipMotion(lhs: ClipMotion, rhs: ClipMotion) {
            expect(lhs.clip).toBe(rhs.clip);
        }

        function assertsEqualAnimationBlend1D(lhs: AnimationBlend1D, rhs: AnimationBlend1D) {
            expect(lhs.name).toBe(rhs.name);
            assertsEqualBindable(lhs.param, rhs.param);
            const lhsItems = [...lhs.items];
            const rhsItems = [...rhs.items];
            expect(lhsItems).toHaveLength(rhsItems.length);
            for (let i = 0; i < lhsItems.length; ++i) {
                assertsEqualAnimationBlend1DItem(lhsItems[i], rhsItems[i]);
            }
        }

        function assertsEqualAnimationBlend1DItem(lhs: AnimationBlend1D.Item, rhs: AnimationBlend1D.Item) {
            expect(lhs.threshold).toBe(rhs.threshold);
            assertsEqualOptionalMotion(lhs.motion, rhs.motion);
        }

        function assertsEqualAnimationBlend2D(lhs: AnimationBlend2D, rhs: AnimationBlend2D) {
            expect(lhs.name).toBe(rhs.name);
            assertsEqualBindable(lhs.paramX, rhs.paramX);
            assertsEqualBindable(lhs.paramY, rhs.paramY);
            const lhsItems = [...lhs.items];
            const rhsItems = [...rhs.items];
            expect(lhsItems).toHaveLength(rhsItems.length);
            for (let i = 0; i < lhsItems.length; ++i) {
                assertsEqualAnimationBlend2DItem(lhsItems[i], rhsItems[i]);
            }
        }

        function assertsEqualAnimationBlend2DItem(lhs: AnimationBlend2D.Item, rhs: AnimationBlend2D.Item) {
            expect(lhs.threshold.x).toBe(rhs.threshold.x);
            expect(lhs.threshold.y).toBe(rhs.threshold.y);
            assertsEqualOptionalMotion(lhs.motion, rhs.motion);
        }
    });
});