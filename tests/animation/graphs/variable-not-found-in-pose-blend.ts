export default {
    layers: [{
        graph: {
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
        }
    }],
} as import('../../../cocos/core/animation/newgen-anim/__tmp__/graph-description').GraphDescription;