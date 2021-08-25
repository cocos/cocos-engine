export default {
    layers: [{
        graph: {
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
        }
    }],
} as import('../../../cocos/core/animation/newgen-anim/__tmp__/graph-description').GraphDescription;