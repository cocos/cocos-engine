export default {
    layers: [{
        graph: {
            nodes: [{
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
        }
    }],
} as import('../../../cocos/core/animation/marionette/__tmp__/graph-description').GraphDescription;