import { GraphDescription } from './graph-description';
import { PoseGraph } from '../pose-graph';
import { createGraphFromDescription } from './graph-from-description';

export function __getDemoGraphs () {
    return Object.entries(graphDescMap).reduce((result, [name, graphDesc]) => {
        result[name] = createGraphFromDescription(graphDesc);
        return result;
    }, {} as Record<string, PoseGraph>);
}

const graphDescMap: Record<string, GraphDescription> = {
    'any-transition': {
        layers: [{
            graph: {
                type: 'subgraph',
                nodes: [{
                    name: 'Node1',
                    type: 'pose',
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
                type: 'subgraph',
                nodes: [{
                    name: 'Node1',
                    type: 'pose',
                }, {
                    name: 'Node2',
                    type: 'pose',
                }],
                anyTransitions: [{
                    to: 0,
                }],
                transitions: [{
                    from: 0,
                    to: 1,
                    condition: {
                        lhs: 'foo',
                        operator: 'EQUAL',
                        rhs: 2.0,
                    },
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
                type: 'subgraph',
                nodes: [{
                    name: 'Node1',
                    type: 'pose',
                    motion: {
                        type: 'pose-blend',
                        children: [{ type: 'pose' }, { type: 'pose' }],
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
                type: 'subgraph',
                nodes: [{
                    name: 'Node1',
                    type: 'pose',
                }, {
                    name: 'Node2',
                    type: 'pose',
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
                type: 'subgraph',
                nodes: [{
                    name: 'asd',
                    type: 'pose',
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
                type: 'subgraph',
                nodes: [{
                    type: 'pose',
                    name: 'Node1',
                }],
                entryTransitions: [{
                    to: 0,
                    condition: {
                        // @ts-expect-error
                        operator: 'BE_TRUE',
                        // @ts-expect-error
                        lhs: { name: 'asd' },
                    },
                }],
            },
        }],
    },

    'variable-not-found-in-pose-blend': {
        layers: [{
            graph: {
                type: 'subgraph',
                nodes: [{
                    name: 'Node1',
                    type: 'pose',
                    motion: {
                        type: 'pose-blend',
                        children: [{ type: 'pose' }, { type: 'pose' }],
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
