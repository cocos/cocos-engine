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
} from '../../../cocos/animation/marionette/asset-creation';

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

    function* visitStateMachine(stateMachine: StateMachine): Generator<VariableBindingView> {
        for (const transition of stateMachine.transitions()) {
            for (const condition of transition.conditions) {
                if (condition instanceof UnaryCondition) {
                    yield createVariableBindingView(condition.operand, 'variable', VariableType.BOOLEAN);
                } else if (condition instanceof BinaryCondition) {
                    yield createVariableBindingView(condition.lhs, 'variable', [VariableType.FLOAT, VariableType.INTEGER]);
                    yield createVariableBindingView(condition.rhs, 'variable', [VariableType.FLOAT, VariableType.INTEGER]);
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
            }
        }
    }
}
