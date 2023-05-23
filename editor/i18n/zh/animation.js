/* eslint-disable quote-props */
/* eslint-disable camelcase */

module.exports = {
    animation_graph: {
        pose_graph_node_sub_categories: {
            pose_nodes: '姿势结点',
            pose_nodes_blend: '混合',
        },
    },

    classes: {
        'cc': {
            'animation': {
                'PoseNodeBlendInProportion': {
                    displayName: '按占比混合',
                    inputs: {
                        'poses': {
                            displayName: '姿势 {elementIndex}',
                        },
                        'proportions': {
                            displayName: '姿势 {elementIndex} 占比',
                        },
                    },
                },
                'PoseNodeBlendTwoPoseBase': {
                    inputs: {
                        'pose0': {
                            displayName: '姿势 1',
                        },
                        'pose1': {
                            displayName: '姿势 2',
                        },
                        'ratio': {
                            displayName: '比例',
                        },
                    },
                },
                'PoseNodeBlendTwoPose': {
                    displayName: '混合双姿势',
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeBlendTwoPoseBase.inputs',
                    },
                },
                'PoseNodeFilteringBlend': {
                    displayName: '过滤混合',
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeBlendTwoPoseBase.inputs',
                    },
                },
                'PoseNodeAdditivelyBlend': {
                    displayName: '加性混合',
                    inputs: {
                        'basePose': {
                            displayName: '基础姿势',
                        },
                        'additivePose': {
                            displayName: '累加姿势',
                        },
                    },
                },
                'PoseNodeChoosePoseByBoolean': {
                    displayName: '按布尔选择',
                    inputs: {
                        'truePose': {
                            displayName: '真姿势',
                        },
                        'falsePose': {
                            displayName: '假姿势',
                        },
                        'trueFadeInDuration': {
                            displayName: '真姿势淡入时长',
                        },
                        'falseFadeInDuration': {
                            displayName: '假姿势淡入时长',
                        },
                        'choice': {
                            displayName: '选择',
                        },
                    },
                },
                'PoseNodeChoosePoseByIndex': {
                    displayName: '按索引选择',
                    inputs: {
                        poses: {
                            displayName: '姿势 {elementIndex}',
                        },
                        fadeInDurations: {
                            displayName: '姿势 {elementIndex} 淡入时长',
                        },
                        'choice': {
                            displayName: '选择',
                        },
                    },
                },
            },
        },
    },
};
