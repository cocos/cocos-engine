import { GraphDescription } from './graph-description';
import { AnimationGraph } from '../animation-graph';
import { createGraphFromDescription } from './graph-from-description';

export function __getDemoGraphs () {
    return Object.entries(graphDescMap).reduce((result, [name, graphDesc]) => {
        result[name] = createGraphFromDescription(graphDesc);
        return result;
    }, {} as Record<string, AnimationGraph>);
}

const graphDescMap: Record<string, GraphDescription> = {
    'any-transition': {
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    name: 'Node1',
                    type: 'animation',
                }],
                anyTransitions: [{
                    to: 0,
                }],
            },
        }],
    },

    vars: {
        vars: [
            { name: 'foo', value: 1.0 },
            { name: 'bar', value: false },
        ],
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    name: 'Node1',
                    type: 'animation',
                }, {
                    name: 'Node2',
                    type: 'animation',
                }],
                anyTransitions: [{
                    to: 0,
                }],
                transitions: [{
                    from: 0,
                    to: 1,
                    conditions: [{
                        type: 'binary',
                        lhs: 'foo',
                        operator: 'EQUAL',
                        rhs: 2.0,
                    }],
                }],
            },
        }],
    },

    'pose-blend-requires-numbers': {
        vars: [{
            name: 'v',
            value: false,
        }],
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    name: 'Node1',
                    type: 'animation',
                    motion: {
                        type: 'blend',
                        children: [{ type: 'clip' }, { type: 'clip' }],
                        blender: {
                            type: '1d',
                            thresholds: [0.0, 1.0],
                            value: {
                                name: 'v',
                                value: 0,
                            },
                        },
                    },
                }],
            },
        }],
    },

    'successive-satisfaction': {
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    name: 'Node1',
                    type: 'animation',
                }, {
                    name: 'Node2',
                    type: 'animation',
                }],
                entryTransitions: [{
                    to: 0,
                }],
                transitions: [{
                    from: 0,
                    to: 1,
                }],
            },
        }],
    },

    'unspecified-condition': {
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    name: 'asd',
                    type: 'animation',
                }],
                entryTransitions: [{
                    to: 0,
                }],
            },
        }],
    },

    'variable-not-found-in-condition': {
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    type: 'animation',
                    name: 'Node1',
                }],
                entryTransitions: [{
                    to: 0,
                    conditions: [{
                        type: 'unary',
                        operator: 'TRUTHY',
                        operand: { name: 'asd', value: 0.0 },
                    }],
                }],
            },
        }],
    },

    'variable-not-found-in-pose-blend': {
        layers: [{
            graph: {
                type: 'state-machine',
                nodes: [{
                    name: 'Node1',
                    type: 'animation',
                    motion: {
                        type: 'blend',
                        children: [{ type: 'clip' }, { type: 'clip' }],
                        blender: {
                            type: '1d',
                            thresholds: [0.0, 1.0],
                            value: {
                                name: 'asd',
                                value: 0,
                            },
                        },
                    },
                }],
            },
        }],
    },
};
