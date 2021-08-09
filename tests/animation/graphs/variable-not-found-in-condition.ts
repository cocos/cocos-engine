export default {
    layers: [{
        graph: {
            nodes: [{
                name: 'Node1',
            }],
            entryTransitions: [{
                to: 0,
                condition: {
                    operator: 'BE_TRUE',
                    lhs: { name: 'asd' },
                },
            }],
        }
    }],
} as import('../../../cocos/core/animation/newgen-anim/__tmp__/graph-description').GraphDescription;