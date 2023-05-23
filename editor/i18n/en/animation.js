/* eslint-disable quote-props */
/* eslint-disable camelcase */

module.exports = {
    animation_graph: {
        pose_graph_node_sub_categories: {
            pose_nodes: 'Pose Nodes',
            pose_nodes_blend: 'Blend',
        },
    },

    classes: {
        'cc': {
            'animation': {
                'PoseNodeBlendInProportion': {
                    displayName: 'Blend In Proportion',
                    inputs: {
                        'poses': {
                            displayName: 'Pose {elementIndex}',
                        },
                        'proportions': {
                            displayName: 'Pose {elementIndex} Proportion',
                        },
                    },
                },
                'PoseNodeBlendTwoPoseBase': {
                    inputs: {
                        'pose0': {
                            displayName: 'Pose 1',
                        },
                        'pose1': {
                            displayName: 'Pose 2',
                        },
                        'ratio': {
                            displayName: 'Ratio',
                        },
                    },
                },
                'PoseNodeBlendTwoPose': {
                    displayName: 'Blend Two Pose',
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeBlendTwoPoseBase.inputs',
                    },
                },
                'PoseNodeFilteringBlend': {
                    displayName: 'Filtering Blend',
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeBlendTwoPoseBase.inputs',
                    },
                },
                'PoseNodeAdditivelyBlend': {
                    displayName: 'Additively Blend',
                    inputs: {
                        'basePose': {
                            displayName: 'Base Pose',
                        },
                        'additivePose': {
                            displayName: 'Additive Pose',
                        },
                    },
                },
                'PoseNodeChoosePoseByBoolean': {
                    displayName: 'Choose Pose By Boolean',
                    inputs: {
                        'truePose': {
                            displayName: 'True Pose',
                        },
                        'falsePose': {
                            displayName: 'False Pose',
                        },
                        'trueFadeInDuration': {
                            displayName: 'True Pose Fade In Duration',
                        },
                        'falseFadeInDuration': {
                            displayName: 'False Pose Fade In Duration',
                        },
                        'choice': {
                            displayName: 'Choice',
                        },
                    },
                },
                'PoseNodeChoosePoseByIndex': {
                    displayName: 'Choose Pose By Index',
                    inputs: {
                        poses: {
                            displayName: 'Pose {elementIndex}',
                        },
                        fadeInDurations: {
                            displayName: 'Pose {elementIndex} Fade In Duration',
                        },
                        'choice': {
                            displayName: 'Choice',
                        },
                    },
                },
            },
        },
    },
};
