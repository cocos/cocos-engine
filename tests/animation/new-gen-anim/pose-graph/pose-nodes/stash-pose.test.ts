import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { PoseNode, PoseTransformSpaceRequirement } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { Node } from "../../../../../cocos/scene-graph";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { createAnimationGraph, LayerStashParams, StateParams } from "../../utils/factory";
import { LinearRealValueAnimationFixture } from "../../utils/fixtures";
import { SingleRealValueObserver } from "../../utils/single-real-value-observer";
import '../../../../utils/matchers/value-type-asymmetric-matchers';

import './utils/factories/all';
import { ApplyAnimationFixturePoseNode } from "../../utils/apply-animation-fixture-pose-node";
import { Pose } from "../../../../../cocos/animation/core/pose";
import { input } from "../../../../../cocos/animation/marionette/pose-graph/decorator/input";
import { PoseGraphType } from "../../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { poseGraphOp } from "../../../../../cocos/animation/marionette/asset-creation";
import { composeInputKeyInternally, createVariableGettingNode, getTheOnlyOutputKey2 } from "../utils/misc";
import { PoseNodeUseStashedPose } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/use-stashed-pose";

test(`Stash pose`, () => {
    const fixture = {
        stashed_animation: new LinearRealValueAnimationFixture(0, 666, 666),
    };

    const observer = new SingleRealValueObserver();

    const animationGraph = createAnimationGraph({
        layers: [{
            stashes: {
                'stashed': {
                    graph: {
                        rootNode: new ApplyAnimationFixturePoseNode(fixture.stashed_animation, observer),
                    },
                },
            },
            stateMachine: {
                states: [0, 1].reduce((result, index) => {
                    result[`${index}`] = {
                        type: 'procedural',
                        graph: {
                            rootNode: { type: 'use-stash', stashId: 'stashed' },
                        },
                    };
                    return result;
                }, {} as Record<string, StateParams>),
                entryTransitions: [{ to: '0' }],
                transitions: [{
                    from: '0',
                    to: '1',
                    duration: 0.3,
                    conditions: [{ type: 'unary', operand: { type: 'constant', value: true } }],
                }],
            },
        }],
    });

    const evalMock = new AnimationGraphEvalMock(observer.root, animationGraph);

    evalMock.step(0.1);
    expect(observer.value).toBeCloseTo(fixture.stashed_animation.getExpected(evalMock.current), 5);
});

describe(`Exit and reentering`, () => {
    test(`reenter() shall be called only at first tick of successive not-being-exited ticks`, () => {
        const poseNodeMock = new PoseNodeMock();
    
        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                't': { type: 'boolean', value: false },
            },
            layers: [{
                stashes: {
                    'stash': { graph: { rootNode: poseNodeMock } },
                },
                stateMachine: {
                    states: {
                        'use-stash-1': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'stash' } } },
                        'use-stash-2': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'stash' } } },
                    },
                    entryTransitions: [{ to: 'use-stash-1' }],
                    transitions: [{
                        from: 'use-stash-1',
                        to: 'use-stash-2',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 't' } }],
                    }],
                },
            }],
        });
    
        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);
    
        // Enter use-stash-1.
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(1);
        poseNodeMock.reenter_.mockClear();
    
        // Reside a while.
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);
    
        // Transition to use-stash-2.
        evalMock.controller.setValue('t', true);
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);
    
        // Reside a while.
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);
    
        // Finish the transition.
        evalMock.step(0.4);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);
    });

    test(`Caused by state entering & leaving`, () => {
        const poseNodeMock = new PoseNodeMock();
    
        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                'EnterStashState': { type: 'boolean', value: false },
                'LeaveStashState': { type: 'boolean', value: false },
            },
            layers: [{
                stashes: {
                    'Stash': { graph: { rootNode: poseNodeMock } },
                },
                stateMachine: {
                    states: {
                        'UseStash': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'Stash' } } },
                        'Empty': { type: 'empty' },
                    },
                    entryTransitions: [{ to: 'UseStash' }],
                    transitions: [{
                        from: 'UseStash',
                        to: 'Empty',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 'LeaveStashState' } }],
                    }, {
                        from: 'Empty',
                        to: 'UseStash',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 'EnterStashState' } }],
                    }],
                },
            }],
        });
    
        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);
    
        // Enter <UseStash> state from state machine entry does cause the stash reentering.
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(1);
        poseNodeMock.reenter_.mockClear();
    
        // Reside a while. Now we have been leaved the <UseStash> state.
        evalMock.controller.setValue('LeaveStashState', true);
        evalMock.step(0.3);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);
    
        // Again transition to the <UseStash>, stash's reenter() should be called.
        evalMock.controller.setValue('EnterStashState', true);
        evalMock.controller.setValue('LeaveStashState', false);
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(1);
        poseNodeMock.reenter_.mockClear();
    
        // Finish the transition.
        evalMock.step(0.4);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);
    
        // Again leave the <UseStash>.
        evalMock.controller.setValue('EnterStashState', false);
        evalMock.controller.setValue('LeaveStashState', true);
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);

        // Finish the transition.
        evalMock.step(0.4);
        expect(poseNodeMock.reenter_).toBeCalledTimes(0);

        // Again transition to the <UseStash>, stash's reenter() should be called.
        evalMock.controller.setValue('LeaveStashState', false);
        evalMock.controller.setValue('EnterStashState', true);
        evalMock.step(0.1);
        expect(poseNodeMock.reenter_).toBeCalledTimes(1);
        poseNodeMock.reenter_.mockClear();
    
    });
});

describe(`Stash update`, () => {
    test(`Multiple threading stash update`, () => {
    
        const poseNodeMock = new PoseNodeMock();
    
        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                't': { type: 'boolean', value: true },
            },
            layers: [{
                stashes: {
                    'stash': { graph: { rootNode: poseNodeMock } },
                },
                stateMachine: {
                    states: {
                        'Motion': { type: 'motion', motion: { type: 'clip-motion', clip: { duration: 1.0 } } },
                        'UseStash1': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'stash' } } },
                        'UseStash2': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'stash' } } },
                    },
                    entryTransitions: [{ to: 'Motion' }],
                    transitions: [{
                        from: 'Motion',
                        to: 'UseStash1',
                        duration: 0.1,
                        exitTimeEnabled: true,
                        exitTime: 0.9,
                    }, {
                        from: 'UseStash1',
                        to: 'UseStash2',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 't' } }],
                    }],
                },
            }],
        });

        // [0s, 0.9s): Motion
        // [0.9s-1.0s): Motion --> UseStash1
        // [1.0s-1.2s): UseStash1 --> UseStash2
        // [3s-∞): UseStash2

        for (const timePoint of [1.15, 1.2]) {
            const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);
            evalMock.goto(0.91); // Past the exit condition
            const stash1_start_time = evalMock.current;
            evalMock.goto(timePoint);
            expect(poseNodeMock.update_).toBeCalledTimes(1);
            expect(poseNodeMock.update_).toHaveBeenNthCalledWith(1, expect.objectContaining({
                deltaTime: expect.toBeAround(evalMock.current - stash1_start_time),
            }));
            poseNodeMock.update_.mockClear();
            expect(poseNodeMock.doEvaluate_).toBeCalledTimes(1);
            poseNodeMock.doEvaluate_.mockClear();
        }
    });
});

describe(`Dependent stashes`, () => {
    describe(`Stash creation order should not affect dependency relationship`, () => {
        test.each([
            [`A is created before B; B depends on A`, true],
            [`A is created before B; A depends on B`, false],
        ])('%s', (_, isADependsOnB) => {
            const poseNodeMock = new PoseNodeMock();

            const stashes: Record<string, LayerStashParams> = isADependsOnB
                ? {
                    'StashA': { graph: { rootNode: { type: 'use-stash', stashId: 'StashB' } } },
                    'StashB': { graph: { rootNode: poseNodeMock } },
                } : {
                    'StashA': { graph: { rootNode: poseNodeMock } },
                    'StashB': { graph: { rootNode: { type: 'use-stash', stashId: 'StashA' } } },
                };

            const dependingState = isADependsOnB ? 'UseStashA' : 'UseStashB';

            const dependedState = isADependsOnB ? 'UseStashB' : 'UseStashA';
    
            const animationGraph = createAnimationGraph({
                variableDeclarations: { 'T': { type: 'boolean' } },
                layers: [{
                    stashes,
                    stateMachine: {
                        states: {
                            'UseStashA': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'StashA' } } },
                            'UseStashB': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'StashB' } } },
                        },
                        entryTransitions: [{ to: dependingState }],
                        transitions: [{
                            from: dependingState,
                            to: dependedState,
                            duration: 0.3,
                            conditions: [{ type: 'unary', operand: { type: 'variable', name: 'T' } }],
                        }],
                    },
                }],
            });
        
            const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);
    
            // Enter the depending state.
            evalMock.step(0.1);
            expect(poseNodeMock.reenter_).toBeCalledTimes(1);
            poseNodeMock.reenter_.mockClear();
            expect(poseNodeMock.update_).toBeCalledTimes(1);
            expect(poseNodeMock.update_).toBeCalledWith(expect.objectContaining({
                deltaTime: 0.1,
            }));
            poseNodeMock.update_.mockClear();
            expect(poseNodeMock.doEvaluate_).toBeCalledTimes(1);
        });
    });
    
    test(`Circular dependent stash`, () => {
        // The evaluation result of a stash is undefined if there's circular dependency between stashes.
        const animationGraph = createAnimationGraph({
            variableDeclarations: { 'T': { type: 'boolean' } },
            layers: [{
                stashes: {
                    'stash': { graph: { rootNode: { type: 'use-stash', stashId: 'stash' } } },
                },
                stateMachine: {
                    states: {
                        'UseStash': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'stash' } } },
                    },
                    entryTransitions: [{ to: 'UseStash' }],
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);

        evalMock.step(0.1);
    });
});

test(`reenter() the stash but updated in later`, () => {
    class ConditionalUpdater extends PoseNode {
        @input({ type: PoseGraphType.POSE })
        pose: PoseNode | null = null;

        @input({ type: PoseGraphType.BOOLEAN })
        shouldUpdate = false;

        public bind(context: AnimationGraphBindingContext): void {
            expect(this.pose).not.toBeNull();
            this.pose?.bind(context);
        }

        public settle(context: AnimationGraphSettleContext): void {
            expect(this.pose).not.toBeNull();
            this.pose?.settle(context);
        }

        public reenter(): void {
            expect(this.pose).not.toBeNull();
            this.pose?.reenter();
        }

        protected doUpdate(context: AnimationGraphUpdateContext): void {
            if (this.shouldUpdate) {
                this.pose?.update(context);
            }
        }

        protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
            return PoseNode.evaluateDefaultPose(context, PoseTransformSpaceRequirement.LOCAL);
        }
    }

    const poseNodeMock = new PoseNodeMock();

    const animationGraph = createAnimationGraph({
        variableDeclarations: {
            'ShouldUpdate': { type: 'boolean' },
        },
        layers: [{
            stashes: { 'stash': { graph: { rootNode: poseNodeMock } } },
            stateMachine: {
                entryTransitions: [{ to: 'p' }],
                states: {
                    'p': {
                        type: 'procedural',
                        graph: (poseGraph) => {
                            const updater = poseGraph.addNode(new ConditionalUpdater());
                            const useStash = new PoseNodeUseStashedPose();
                            useStash.stashName = 'stash';
                            const updateTarget = poseGraph.addNode(useStash);
                            poseGraphOp.connectNode(poseGraph, updater, composeInputKeyInternally('pose'), updateTarget);
                            poseGraphOp.connectNode(
                                poseGraph,
                                updater, composeInputKeyInternally('shouldUpdate'),
                                ...getTheOnlyOutputKey2(poseGraph.addNode(createVariableGettingNode(PoseGraphType.BOOLEAN, 'ShouldUpdate'))),
                            );
                            poseGraphOp.connectOutputNode(poseGraph, updater);
                        },
                    }
                },
            },
        }],
    });

    const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);

    const zeroCheckAndResetMocks = () => {
        expect(poseNodeMock.reenter_).not.toBeCalled();
        expect(poseNodeMock.update_).not.toBeCalled();
        expect(poseNodeMock.doEvaluate_).not.toBeCalled();
    };

    evalMock.step(0.2);
    expect(poseNodeMock.reenter_).toBeCalled();
    poseNodeMock.reenter_.mockClear();
    zeroCheckAndResetMocks();

    for (let i = 0; i < 2; ++i) {
        evalMock.step(0.2);
        zeroCheckAndResetMocks();
    }

    evalMock.controller.setValue('ShouldUpdate', true);
    evalMock.step(0.1);
    expect(poseNodeMock.update_).toBeCalled();
    poseNodeMock.update_.mockClear();
    zeroCheckAndResetMocks();
});

class PoseNodeMock extends PoseNode {
    public reenter_ = jest.fn();

    public update_ = jest.fn();

    public doEvaluate_ = jest.fn();

    public bind() { }

    public settle(context: AnimationGraphSettleContext): void {
        
    }

    public reenter(...args: Parameters<PoseNode['reenter']>) {
        this.reenter_(...args);
    }

    public doUpdate(...args: Parameters<PoseNode['update']>) {
        const [context] = args;
        this.update_({
            deltaTime: context.deltaTime,
            indicativeWeight: context.indicativeWeight,
        });
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext) {
        this.doEvaluate_(context);
        return context.pushDefaultedPose();
    }
}