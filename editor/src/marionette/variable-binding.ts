import {
    AnimationBlend1D,
    AnimationBlend2D,
    AnimationBlendDirect,
    AnimationGraph,
    StateMachine,
    UnaryCondition,
    BinaryCondition,
    TriggerCondition,
    MotionState,
    SubStateMachine,
    VariableType,
    ProceduralPoseState,
} from '../../../cocos/animation/marionette/asset-creation';
import { PoseNodeStateMachine } from '../../../cocos/animation/marionette/pose-graph/pose-nodes/state-machine';
import { TCBindingValueType } from '../../../cocos/animation/marionette/state-machine/condition/binding/binding';
import { TCVariableBinding } from '../../../cocos/animation/marionette/state-machine/condition/binding/variable-binding';
import { PVNodeGetVariableBase } from '../../../cocos/animation/marionette/pose-graph/pure-value-nodes/get-variable';
import { PoseGraphType } from '../../../cocos/animation/marionette/pose-graph/foundation/type-system';
import { assertIsTrue } from '../../../exports/base';

export interface VariableBindingView {
    /**
     * The current bounded variable name.
     */
    readonly name: string;

    /**
     * The acceptable types of this binding.
     */
    readonly acceptableTypes: VariableType[];

    /**
     * Rebinds this binding to new variable.
     * @param _newVariableName 
     */
    rebind(_newVariableName: string): void;

    /**
     * Unbinds the variable.
     */
    unbind(): void;
}

interface VariableTypeToTCBindingValueTypeMapping {
    [VariableType.FLOAT]: TCBindingValueType.FLOAT;
    [VariableType.INTEGER]: TCBindingValueType.INTEGER;
}

export function* viewVariableBindings(animationGraph: AnimationGraph): Generator<VariableBindingView> {
    for (const layer of animationGraph.layers) {
        yield* visitStateMachine(layer.stateMachine);
    }

    function createVariableBindingView<T extends string>(
        object: { [_x in T]: string; }, key: T, acceptableTypes: VariableType | VariableType[],
    ): VariableBindingView {
        return {
            get name() {
                return object[key];
            },

            get acceptableTypes() {
                return Array.isArray(acceptableTypes) ? acceptableTypes : [acceptableTypes];
            },

            rebind(newName: string) {
                object[key] = newName;
            },

            unbind() {
                object[key] = '';
            },
        };
    }

    function createTCVariableBindingView<TAcceptableType extends VariableType.FLOAT | VariableType.INTEGER>(
        binding: TCVariableBinding<VariableTypeToTCBindingValueTypeMapping[TAcceptableType]>,
        acceptableTypes: TAcceptableType[],
    ) {
        return {
            get name() { return binding.variableName; },
            get acceptableTypes() { return acceptableTypes; },
            rebind(newVariableName: string) { binding.variableName = newVariableName; },
            unbind() { binding.variableName = ''; },
        };
    }

    function* visitStateMachine(stateMachine: StateMachine): Generator<VariableBindingView> {
        for (const transition of stateMachine.transitions()) {
            for (const condition of transition.conditions) {
                if (condition instanceof UnaryCondition) {
                    yield createVariableBindingView(condition.operand, 'variable', VariableType.BOOLEAN);
                } else if (condition instanceof BinaryCondition) {
                    if (condition.lhsBinding instanceof TCVariableBinding) {
                        yield createTCVariableBindingView<VariableType.FLOAT | VariableType.INTEGER>(
                            condition.lhsBinding,
                            [VariableType.FLOAT, VariableType.INTEGER],
                        );
                    }
                } else if (condition instanceof TriggerCondition) {
                    yield createVariableBindingView(condition, 'trigger', VariableType.TRIGGER);
                }
            }
        }
        for (const state of stateMachine.states()) {
            if (state instanceof MotionState) {
                const motion = state.motion;
                if (motion instanceof AnimationBlend1D) {
                    yield createVariableBindingView(motion.param, 'variable', [VariableType.FLOAT]);
                } else if (motion instanceof AnimationBlend2D) {
                    yield createVariableBindingView(motion.paramX, 'variable', [VariableType.FLOAT]);
                    yield createVariableBindingView(motion.paramY, 'variable', [VariableType.FLOAT]);
                } else if (motion instanceof AnimationBlendDirect) {
                    // TODO?
                }
            } else if (state instanceof SubStateMachine) {
                yield* visitStateMachine(state.stateMachine);
            } else if (state instanceof ProceduralPoseState) {
                for (const node of state.graph.nodes()) {
                    if (node instanceof PoseNodeStateMachine) {
                        yield* visitStateMachine(node.stateMachine);
                    } else if (node instanceof PVNodeGetVariableBase) {
                        const outputType = node.getOutputType(0);
                        assertIsTrue(outputType !== PoseGraphType.POSE);
                        yield createVariableBindingView(
                            node,
                            'variableName',
                            poseGraphTypeToAcceptableVariableType(outputType),
                        );
                    }
                }
            }
        }
    }
}

function poseGraphTypeToAcceptableVariableType(poseGraphType: Exclude<PoseGraphType, PoseGraphType.POSE>) {
    switch (poseGraphType) {
        default: throw new Error(`Unhandled pose graph type ${PoseGraphType[poseGraphType]}`);
        case PoseGraphType.FLOAT: return VariableType.FLOAT;
        case PoseGraphType.INTEGER: return VariableType.INTEGER;
        case PoseGraphType.BOOLEAN: return VariableType.BOOLEAN;
        case PoseGraphType.VEC3: return VariableType.VEC3_experimental;
        case PoseGraphType.QUAT: return VariableType.QUAT_experimental;
    }
}
