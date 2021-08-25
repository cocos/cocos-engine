
import { AnimationClip, Node, Vec2 } from '../../cocos/core';
import { PoseBlend1D, PoseBlend2D, Condition, InvalidTransitionError, VariableNotDefinedError, __getDemoGraphs } from '../../cocos/core/animation/animation';
import { PoseGraph } from '../../cocos/core/animation/newgen-anim/pose-graph';
import { createEval } from '../../cocos/core/animation/newgen-anim/create-eval';
import { VariableTypeMismatchedError } from '../../cocos/core/animation/newgen-anim/errors';
import { PoseGraphEval } from '../../cocos/core/animation/newgen-anim/graph-eval';
import { createGraphFromDescription } from '../../cocos/core/animation/newgen-anim/__tmp__/graph-from-description';
import gAnyTransition from './graphs/any-transition';
import gUnspecifiedCondition from './graphs/unspecified-condition';
import gSuccessiveSatisfaction from './graphs/successive-satisfaction';
import gVariableNotFoundInCondition from './graphs/variable-not-found-in-condition';
import gVariableNotFoundInPoseBlend from './graphs/variable-not-found-in-pose-blend';
import gPoseBlendRequiresNumbers from './graphs/pose-blend-requires-numbers';
import { getPropertyBindingPoints } from '../../cocos/core/animation/newgen-anim/parametric';
import { blend1D } from '../../cocos/core/animation/newgen-anim/blend-1d';

describe('NewGen Anim', () => {
    const demoGraphs = __getDemoGraphs();

    describe('Connecting', () => {
        test('Connecting', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const n1 = layerGraph.add();
            const n2 = layerGraph.add();
            layerGraph.connect(n1, n2);
            expect([...layerGraph.getOutgoings(n1)].map((t) => t.to)).toContain(n2);
            expect([...layerGraph.getIncomings(n2)].map((t) => t.from)).toContain(n1);
        });

        test('Reconnecting', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const n1 = layerGraph.add();
            const n2 = layerGraph.add();
            const trans1 = layerGraph.connect(n1, n2);
            const trans2 = layerGraph.connect(n1, n2);
            expect(trans1).not.toBe(trans2);
            expect(layerGraph.getTransition(n1, n2)).toBe(trans2);
        });

        test('Self connecting', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const n1 = layerGraph.add();
            layerGraph.connect(n1, n1);
            // TODO: what's the expectation?
        });
    });

    describe('Transitions', () => {
        test('Could not transition to entry node', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            expect(() => layerGraph.connect(layerGraph.add(), layerGraph.entryNode)).toThrowError(InvalidTransitionError);
        });

        test('Could not transition to any node', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            expect(() => layerGraph.connect(layerGraph.add(), layerGraph.anyNode)).toThrowError(InvalidTransitionError);
        });

        test('Could not transition from exit node', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            expect(() => layerGraph.connect(layerGraph.existNode, layerGraph.add())).toThrowError(InvalidTransitionError);
        });

        test('Condition not specified', () => {
            const graphEval = new PoseGraphEval(createGraphFromDescription(gUnspecifiedCondition), new Node());
            graphEval.update(0.0);
            expect(graphEval.getCurrentNodeInfo(0).name).toBe('asd');
        });

        test('One transition most per update', () => {
            const graphEval = new PoseGraphEval(createGraphFromDescription(gSuccessiveSatisfaction), new Node());
            graphEval.update(0.0);
            expect(graphEval.getCurrentNodeInfo(0).name).toBe('Node1');
            graphEval.update(0.0);
            expect(graphEval.getCurrentNodeInfo(0).name).toBe('Node2'); 
        });

        test('Any transition', () => {
            const graphEval = new PoseGraphEval(createGraphFromDescription(gAnyTransition), new Node());
            graphEval.update(0.0);
            expect(graphEval.getCurrentNodeInfo(0).name).toBe('Node1');
        });
    });

    describe('Removing nodes', () => {
        test('Could not remove special nodes', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            layerGraph.remove(layerGraph.entryNode);
            layerGraph.remove(layerGraph.existNode);
            layerGraph.remove(layerGraph.anyNode);
            expect([...layerGraph.nodes()]).toEqual(expect.arrayContaining([
                layerGraph.entryNode,
                layerGraph.existNode,
                layerGraph.anyNode,
            ]));
        });

        test('Also erase referred transitions', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const node1 = layerGraph.add();
            const node2 = layerGraph.add();
            const node3 = layerGraph.add();
            layerGraph.connect(node1, node2);
            layerGraph.connect(node3, node1);

            layerGraph.remove(node2);
            expect([...layerGraph.getOutgoings(node1)]).toHaveLength(0);
            layerGraph.remove(node3);
            expect([...layerGraph.getIncomings(node1)]).toHaveLength(0);
        });
    });

    describe('Exotic nodes', () => {
        test('Removed nodes are dangling', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const node = layerGraph.add();
            layerGraph.remove(node);
            expect(() => layerGraph.remove(node)).toThrow();
            expect(() => layerGraph.getIncomings(node)).toThrow();
            expect(() => layerGraph.connect(layerGraph.entryNode, node)).toThrow();
        });

        test('Nodes in different layers are isolated', () => {
            const graph = new PoseGraph();
            const layer1 = graph.addLayer();
            const layerGraph1 = layer1.graph;
            const layer2 = graph.addLayer();
            const layerGraph2 = layer2.graph;
            const node1 = layerGraph1.add();
            const node2 = layerGraph2.add();
            expect(() => layerGraph2.connect(node2, node1)).toThrow();
        });
    });

    describe('Condition', () => {
        const emptyContext: Parameters<Condition[typeof createEval]>[0] = { getParam() {} };
        test('Unary', () => {
            const condition = new Condition();
            condition.operator = Condition.Operator.BE_TRUE;
            condition.lhs = false;
            const conditionEval = condition[createEval](emptyContext);
            expect(conditionEval.eval()).toBe(false);
            conditionEval.setLhs(true);
            expect(conditionEval.eval()).toBe(true);
        });

        test('Binary', () => {
            const condition = new Condition();
            condition.operator = Condition.Operator.GREATER_THAN;
            condition.lhs = 1;
            condition.rhs = 0.5;
            const conditionEval = condition[createEval](emptyContext);
            expect(conditionEval.eval()).toBe(true);
            conditionEval.setRhs(2.0);
            expect(conditionEval.eval()).toBe(false);
        });
    });

    describe('Blender 1D', () => {
        test('Thresholds should have been sorted', () => {
            const blender1D = new PoseBlend1D();
            blender1D.children = [[null, 0.3], [null, 0.2]];
            expect([...blender1D.children].map(([, threshold]) => threshold)).toStrictEqual([0.2, 0.3]);

            blender1D.children = [[null, 0.9], [null, -0.2]];
            expect([...blender1D.children].map(([, threshold]) => threshold)).toStrictEqual([-0.2, 0.9]);
        });

        test('1D Blending', () => {
            const thresholds = [0.1, 0.3] as const;
            const weights = new Array<number>(thresholds.length).fill(0);

            blend1D(weights, thresholds, 0.4);
            expect(weights).toBeCloseToArray([0.0, 1.0]);

            blend1D(weights, thresholds, 0.1);
            expect(weights).toBeCloseToArray([1.0, 0.0]);

            blend1D(weights, thresholds, 0.3);
            expect(weights).toBeCloseToArray([0.0, 1.0]);

            blend1D(weights, thresholds, 0.2);
            expect(weights).toBeCloseToArray([0.5, 0.5]);
        });
    });

    describe('Variable not found error', () => {
        test('Missed in conditions', () => {
            expect(() => new PoseGraphEval(createGraphFromDescription(gVariableNotFoundInCondition), new Node())).toThrowError(VariableNotDefinedError);
        });

        test('Missed in pose blend', () => {
            expect(() => new PoseGraphEval(createGraphFromDescription(gVariableNotFoundInPoseBlend), new Node())).toThrowError(VariableNotDefinedError);
        });
    });

    describe('Variable type mismatch error', () => {
        test('pose blend requires numbers', () => {
            expect(() => new PoseGraphEval(createGraphFromDescription(gPoseBlendRequiresNumbers), new Node())).toThrowError(VariableTypeMismatchedError);
        });
    });

    describe('Property binding', () => {
        test('Bind property', () => {
            const poseBlend2D = new PoseBlend2D();
            const bindingPoints = getPropertyBindingPoints(poseBlend2D);
            expect(Object.keys(bindingPoints)).toEqual(expect.arrayContaining([
                'paramX',
                'paramY',
            ]));
            poseBlend2D.bindProperty('paramX', 'x');
            expect(poseBlend2D.getPropertyBinding('paramX')).toBe('x');
        });

        test('Serialization', () => {
            const poseBlend2D = new PoseBlend2D();
            poseBlend2D.bindProperty('paramX', 'x');
            expect(poseBlend2D.getPropertyBinding('paramX')).toBe('x');
        });
    });
});
