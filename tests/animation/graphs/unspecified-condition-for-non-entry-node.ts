export default {
    layers: [{
        graph: {
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
                duration: 0.3,
                exitCondition: 0.0,
            }],
        }
    }],
} as import('../../../cocos/core/animation/marionette/__tmp__/graph-description').GraphDescription;