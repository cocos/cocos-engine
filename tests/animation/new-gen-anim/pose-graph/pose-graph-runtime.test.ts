import { AuxiliaryCurveHandle } from "../../../../cocos/animation/core/animation-handle";
import { Pose } from "../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from "../../../../cocos/animation/marionette/animation-graph-context";
import { AnimationGraph, PoseGraph } from "../../../../cocos/animation/marionette/asset-creation";
import { assertIsTrue, lerp, quat, v3 } from "../../../../cocos/core";
import { Node } from "../../../../cocos/scene-graph";
import { captureErrors, captureWarns } from '../../../utils/log-capture';
import { input } from "../../../../cocos/animation/marionette/pose-graph/decorator/input";
import { createAnimationGraph } from "../utils/factory";
import { AnimationGraphEvalMock } from "../utils/eval-mock";
import 'jest-extended';
import { poseGraphOp } from "../../../../cocos/animation/marionette/pose-graph/op";
import { PoseGraphType } from "../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { getTheOnlyInputKey, getTheOnlyOutputKey, UnimplementedPoseNode } from "./utils/misc";
import { PoseNode } from "../../../../cocos/animation/marionette/pose-graph/pose-node";
import { PureValueNode } from "../../../../cocos/animation/marionette/pose-graph/pure-value-node";

describe(`Pose node instantiation`, () => {
    test(`Should be instantiated at animation graph initialization stage`, () => {
        class PoseNodeMock extends PoseNode {
            public settle(context: AnimationGraphSettleContext): void { }
            public reenter(): void { }
            protected doUpdate(context: AnimationGraphUpdateContext): void { }

            public static counter = 0;

            public static constructorMock: jest.Mock<void, [PoseNodeMock]> = jest.fn();
            
            constructor() {
                super();
                this._yieldingValue = PoseNodeMock.#valueGenerator++;
                PoseNodeMock.constructorMock(this);
            }

            get expectedYieldingValue() {
                return this._yieldingValue;
            }

            public bind(context: AnimationGraphBindingContext): void {
                this._handle = context.bindAuxiliaryCurve('x');
            }

            protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
                const pose = context.pushDefaultedPose();
                expect(this._handle).not.toBeNull();
                pose.auxiliaryCurves[this._handle!.index] = this._yieldingValue;
                return pose;
            }

            static #valueGenerator = 0;
            private _yieldingValue: number;
            private _handle: AuxiliaryCurveHandle | null = null;
        }

        const animationGraph = new AnimationGraph();
        const layer = animationGraph.addLayer();
        const pPoseState = layer.stateMachine.addProceduralPoseState();
        const poseNodeMock = pPoseState.graph.addNode(new PoseNodeMock());
        poseGraphOp.connectNode(pPoseState.graph, pPoseState.graph.outputNode, getTheOnlyInputKey(pPoseState.graph.outputNode), poseNodeMock);
        layer.stateMachine.connect(layer.stateMachine.entryState, pPoseState);

        expect(PoseNodeMock.constructorMock).toBeCalledTimes(1);
        PoseNodeMock.constructorMock.mockClear();

        const instances = Array.from({ length: 2 }, () => {
            const node1 = new Node();
            const evalMock = new AnimationGraphEvalMock(node1, animationGraph);
            expect(PoseNodeMock.constructorMock).toBeCalledTimes(1);
            const node = PoseNodeMock.constructorMock.mock.calls[0][0];
            PoseNodeMock.constructorMock.mockClear();
            return {
                node,
                evalMock,
            };
        });
        
        for (const { node: node, evalMock } of instances) {
            evalMock.step(0.2);
            expect(evalMock.controller.getAuxiliaryCurveValue_experimental('x')).toBe(node.expectedYieldingValue);
        }
    });
});

describe(`Pose node binding and settlement`, () => {
    test(`Should be called at animation graph bind stage`, () => {
        const poseNode1BindMethodMock = jest.fn();
        const poseNode1SettleMethodMock = jest.fn();
        const poseNode2BindMethodMock = jest.fn();
        const poseNode2SettleMethodMock = jest.fn();

        class PoseNode1 extends UnimplementedPoseNode {
            public bind(context: AnimationGraphBindingContext) {
                poseNode1BindMethodMock();
            }

            public settle(context: AnimationGraphSettleContext) {
                poseNode1SettleMethodMock();
            }
        }

        class PoseNode2 extends UnimplementedPoseNode {
            public bind(context: AnimationGraphBindingContext) {
                poseNode2BindMethodMock();
            }

            public settle(context: AnimationGraphSettleContext) {
                poseNode2SettleMethodMock();
            }
        }

        const animationGraph = createAnimationGraph({
            layers: [{
                stateMachine: {
                    states: {
                        'empty': { type: 'empty' },
                        'pose1': {
                            type: 'procedural',
                            graph: { rootNode: new PoseNode1() },
                        },
                        'pose2': {
                            type: 'procedural',
                            graph: { rootNode: new PoseNode2() },
                        },
                    },
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);

        const bindMocks = [poseNode1BindMethodMock, poseNode2BindMethodMock];
        const settleMocks = [poseNode1SettleMethodMock, poseNode2SettleMethodMock];

        // Both nodes' bind() should be called.
        for (const bindMock of bindMocks) {
            expect(bindMock).toBeCalledTimes(1);
        }
        // Both nodes' settle() should be called.
        for (const settleMock of settleMocks) {
            expect(settleMock).toBeCalledTimes(1);
        }
        // All settle() happen after all bind().
        for (const bindMock of bindMocks) {
            for (const settleMock of settleMocks) {
                expect(bindMock.mock.invocationCallOrder[0]).toBeLessThan(settleMock.mock.invocationCallOrder[0]);
            }
        }
        for (const mock of [...bindMocks, ...settleMocks]) {
            mock.mockClear();
        }

        // No further bind/settle calls.
        evalMock.step(0.3);
        for (const mock of [...bindMocks, ...settleMocks]) {
            expect(mock).not.toBeCalled();
        }
    });
});

describe(`Pose node reentering`, () => {
    test(`Enter a pose node state should trigger the root pose node's reenter() method`, () => {
        class PoseNodeMock extends UnimplementedPoseNode {
            public reenterRecorder = jest.fn();

            public reenter(...args: Parameters<PoseNode['reenter']>) {
                this.reenterRecorder(...args);
            }

            public bind(context: AnimationGraphBindingContext): void { }

            protected doEvaluate(context: AnimationGraphEvaluationContext): Pose { return context.pushDefaultedPose(); }
        }

        const poseNodeMock = new PoseNodeMock();

        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                'IncomingTransitionActivated': { type: 'boolean', value: false },
                'OutgoingTransitionActivated': { type: 'boolean', value: false },
            },
            layers: [{
                stateMachine: {
                    states: {
                        'empty': { type: 'empty' },
                        'procedural': {
                            type: 'procedural',
                            graph: {
                                rootNode: poseNodeMock,
                            },
                        },
                    },
                    entryTransitions: [{ to: 'procedural' }],
                    transitions: [{
                        from: 'procedural',
                        to: 'empty',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 'OutgoingTransitionActivated' } }],
                    }, {
                        from: 'empty',
                        to: 'procedural',
                        duration: 0.3,
                        conditions: [{ type: 'unary', operand: { type: 'variable', name: 'IncomingTransitionActivated' } }],
                    }],
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);

        evalMock.step(0.1);
        expect(poseNodeMock.reenterRecorder).toBeCalledTimes(1);
        poseNodeMock.reenterRecorder.mockClear();

        evalMock.step(0.1);
        expect(poseNodeMock.reenterRecorder).toBeCalledTimes(0);

        evalMock.controller.setValue('OutgoingTransitionActivated', true);
        evalMock.step(0.4);
        expect(poseNodeMock.reenterRecorder).toBeCalledTimes(0);

        evalMock.controller.setValue('OutgoingTransitionActivated', false);
        evalMock.controller.setValue('IncomingTransitionActivated', true);
        evalMock.step(0.1);
        expect(poseNodeMock.reenterRecorder).toBeCalledTimes(1);
        poseNodeMock.reenterRecorder.mockClear();

        evalMock.step(0.1);
        expect(poseNodeMock.reenterRecorder).toBeCalledTimes(0);
    });
});

describe(`Pose node ticking`, () => {
    test(`PureValueNode dependencies should be evaluated before pose node updating`, () => {
        let pvNodeOutputValue = 0.0;
    
        const poseNodeUpdateMethodMock = jest.fn();
        const pvNodeEvaluateMethodMock = jest.fn(() => pvNodeOutputValue);
    
        class ObservedPVNode extends PureValueNode {
            constructor() {
                super([PoseGraphType.FLOAT]);
            }
    
            public selfEvaluate(outputs: unknown[]): void {
                outputs[0] = pvNodeEvaluateMethodMock();
            }
        }
    
        class ObservedPoseNode extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.FLOAT })
            public value = 0.0;
    
            public bind() { }
            
            protected doUpdate() {
                poseNodeUpdateMethodMock(this.value);
            }
    
            protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
                return context.pushDefaultedPose();
            }
        }
    
        const animationGraph = new AnimationGraph();
        const layer = animationGraph.addLayer();
        const pPoseState = layer.stateMachine.addProceduralPoseState();
        const poseNode = pPoseState.graph.addNode(new ObservedPoseNode());
        const pvNode = pPoseState.graph.addNode(new ObservedPVNode());
        const keys = poseGraphOp.getInputKeys(poseNode);
        expect(keys).toHaveLength(1);
        poseGraphOp.connectNode(pPoseState.graph, poseNode, keys[0], pvNode, getTheOnlyOutputKey(pvNode));
        poseGraphOp.connectNode(pPoseState.graph, pPoseState.graph.outputNode, getTheOnlyInputKey(pPoseState.graph.outputNode), poseNode);
        layer.stateMachine.connect(layer.stateMachine.entryState, pPoseState);
    
        const node = new Node();
        for (let i = 0; i < 2; ++i) {
            // Change the pv-node's evaluation result.
            pvNodeOutputValue = 0.1 + 0.1 * i;
    
            const evalMock = new AnimationGraphEvalMock(node, animationGraph);
            evalMock.step(0.2);
    
            // Pose node's doUpdate() should have been called.
            expect(poseNodeUpdateMethodMock).toHaveBeenCalledTimes(1);
    
            // PV-node's evaluate() should have been called.
            expect(pvNodeEvaluateMethodMock).toHaveBeenCalledTimes(1);
    
            // PV-node's evaluate() should happen before Pose node's doUpdate().
            expect(pvNodeEvaluateMethodMock.mock.invocationCallOrder[0]).toBeLessThan(
                poseNodeUpdateMethodMock.mock.invocationCallOrder[0],
            );
    
            // Pose nodes's doUpdate() should have received the pv-node's return.
            expect(poseNodeUpdateMethodMock.mock.calls[0][0]).toBe(pvNodeEvaluateMethodMock.mock.results[0].value);
    
            poseNodeUpdateMethodMock.mockClear();
            pvNodeEvaluateMethodMock.mockClear();
        }
    });
});
