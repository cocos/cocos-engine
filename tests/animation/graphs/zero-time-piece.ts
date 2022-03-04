export default {
    layers: [{
        graph: {
            nodes: [{
                name: 'Node1',
                type: 'animation',
            }, {
                name: 'Node2',
                type: 'subgraph',
                nodes: [{
                    type: 'animation',
                    name: 'SubStateMachineNode1',
                }],
                entryTransitions: [{
                    to: 0,
                }],
                exitTransitions: [{
                    from: 0,
                    exitCondition: 0.0,
                }],
            }],
            entryTransitions: [{
                to: 0,
            }],
            exitTransitions: [{
                from: 1,
            }],
            transitions: [{
                from: 0,
                to: 1,
            }],
        }
    }],
} as import('../../../cocos/core/animation/marionette/__tmp__/graph-description').GraphDescription;