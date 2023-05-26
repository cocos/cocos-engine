import { Node } from "../../../cocos/scene-graph";
import { AnimationClip } from "../../../cocos/animation/animation-clip";
import { createAnimationGraph, StateParams } from '../new-gen-anim/utils/factory';
import { ClipMotion, Motion } from "../../../cocos/animation/marionette/motion";
import { AnimationGraphEvalMock } from "../new-gen-anim/utils/eval-mock";
import '../new-gen-anim/pose-graph/pose-nodes/utils/factories/all';
import '../../utils/matchers/value-type-asymmetric-matchers';
import { PoseNodeSampleMotion } from "../../../cocos/animation/marionette/pose-graph/pose-nodes/sample-motion";

describe('Evaluate embedded players in animation graph', () => {
    test(`In motion state`, () => {
        runTest(true, (motion) => {
            return {
                type: 'motion',
                motion,
            };
        });
    });

    test(`In PoseNodePlayMotion`, () => {
        runTest(true, (motion) => {
            return {
                type: 'procedural',
                graph: { rootNode: { type: 'motion', motion } },
            };
        });
    });

    test(`In PoseNodeSampleMotion`, () => {
        runTest(false, (motion) => {
            return {
                type: 'procedural',
                graph: { rootNode: (() => {
                    const sampleMotionNode = new PoseNodeSampleMotion();
                    sampleMotionNode.motion = motion;
                    return sampleMotionNode;
                })() },
            };
        });
    });

    function runTest(
        shouldEval: boolean,
        createState: (motion: Motion) => StateParams,
    ) {
        const fixture = {
            clip_duration: 0.8,
            clip_speed: 0.6,
        };

        const clip = new AnimationClip();
        clip.duration = fixture.clip_duration;
        clip.speed = fixture.clip_speed;
        clip.wrapMode = AnimationClip.WrapMode.Loop;

        const node = new Node();

        const embeddedPlayerEvaluation = new EmbeddedPlayerEvaluationMock();
        jest.spyOn(clip, 'createEmbeddedPlayerEvaluator').mockImplementation((targetNode: Node) => {
            expect(targetNode).toBe(node);
            return embeddedPlayerEvaluation as unknown as ReturnType<AnimationClip['createEmbeddedPlayerEvaluator']>;
        });
        jest.spyOn(clip, 'containsAnyEmbeddedPlayer').mockImplementation(() => {
            return true;
        });

        const motion = new ClipMotion();
        motion.clip = clip;

        const stateParams = createState(motion);
        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                'enter_the_state': { type: 'boolean' },
                'exit_the_state': { type: 'boolean' },
            },
            layers: [{
                stateMachine: {
                    states: {
                        'empty': { type: 'empty' },
                        'state': stateParams,
                    },
                    entryTransitions: [{ to: 'empty' }],
                    transitions: [{
                        from: 'empty', to: 'state',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 'enter_the_state', } }],
                    }, {
                        from: 'state', to: 'empty',
                        duration: 0.3,
                        exitTimeEnabled: stateParams.type === 'motion' ? false : undefined,
                        conditions: [{ type: 'unary', operator: 'to-be-false', operand: { type: 'variable', name: 'enter_the_state', } }],
                    }],
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(node, animationGraph);
        
        embeddedPlayerEvaluation.zeroCheck();

        // The state is not entered, nothing should happen.
        for (let i = 0; i < 2; ++i) {
            evalMock.step(0.2);
            embeddedPlayerEvaluation.zeroCheck();
        }

        // Enter the state, step to 10% of clip.
        const state_enter_time = evalMock.current;

        const checkEmbeddedPlayerEvalCall = () => {
            if (!shouldEval) {
                embeddedPlayerEvaluation.zeroCheck();
                return;
            }
            const elapsedTime = (evalMock.current - state_enter_time) * fixture.clip_speed;
            const normalized = elapsedTime / fixture.clip_duration;
            expect(embeddedPlayerEvaluation.evaluate).toBeCalledTimes(1);
            expect(embeddedPlayerEvaluation.evaluate.mock.calls[0]).toEqual([
                expect.toBeAround((normalized - Math.trunc(normalized)) * fixture.clip_duration, 5),
                Math.trunc(normalized),
            ]);
            embeddedPlayerEvaluation.evaluate.mockClear();
            embeddedPlayerEvaluation.zeroCheck();
        };

        evalMock.controller.setValue('enter_the_state', true);
        evalMock.step(fixture.clip_duration * 0.1);
        checkEmbeddedPlayerEvalCall();

        // Continue updates.
        for (let i = 0; i < 2; ++i) {
            evalMock.step(fixture.clip_duration * 0.2);
            checkEmbeddedPlayerEvalCall();
        }

        // Cross iterations
        evalMock.step(fixture.clip_duration * 0.8);
        checkEmbeddedPlayerEvalCall();

        // Start to exit the state.
        evalMock.controller.setValue('enter_the_state', false);
        evalMock.step(0.1);
        checkEmbeddedPlayerEvalCall();

        // Full exit the state.
        evalMock.step(0.3);
        embeddedPlayerEvaluation.zeroCheck();
    }
});

// @ts-expect-error
class EmbeddedPlayerEvaluationMock implements ReturnType<AnimationClip['createEmbeddedPlayerEvaluator']> {
    public notifyHostSpeedChanged: jest.Mock<void, [number]> = jest.fn();

    public notifyHostPlay: jest.Mock<void, [number]> = jest.fn();

    public notifyHostPause: jest.Mock<void, [number]> = jest.fn();

    public notifyHostStop: jest.Mock = jest.fn();

    public evaluate: jest.Mock<void, [number, number]> = jest.fn();

    public zeroCheck() {
        expect(this.notifyHostSpeedChanged).not.toBeCalled();
        expect(this.notifyHostPlay).not.toBeCalled();
        expect(this.notifyHostPause).not.toBeCalled();
        expect(this.notifyHostStop).not.toBeCalled();
        expect(this.evaluate).not.toBeCalled();
    }
}

