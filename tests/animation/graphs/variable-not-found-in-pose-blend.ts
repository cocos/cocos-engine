export default {
    layers: [{
        graph: {
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
        }
    }],
} as import('../../../cocos/core/animation/marionette/__tmp__/graph-description').GraphDescription;