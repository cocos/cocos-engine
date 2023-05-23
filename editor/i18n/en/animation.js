/* eslint-disable quote-props */
/* eslint-disable camelcase */

module.exports = {
    animation_graph: {
        pose_graph_node_sub_categories: {
            pose_nodes: 'Pose Nodes',
            pose_nodes_blend: 'Blend',
            pose_nodes_ik: 'Inverse Kinematic',
        },
    },

    classes: {
        'cc': {
            'animation': {
                'PoseNodeStateMachine': {
                    displayName: 'State Machine',
                    inputs: {
                        'emptyStatePose': {
                            displayName: 'Empty State Pose',
                        },
                    },
                },
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
                'PoseNodeModifyPoseBase': {
                    inputs: {
                        'pose': {
                            displayName: 'Pose',
                        },
                    },
                },
                'PoseNodeApplyTransform': {
                    displayName: 'Apply Transform',
                    title: 'Transform {nodeName}',
                    properties: {
                        'positionOperation': {
                            displayName: 'Position Operation',
                            tooltip: 'Specify how to process position.',
                        },
                        'rotationOperation': {
                            displayName: 'Rotation Operation',
                            tooltip: 'Specify how to process rotation.',
                        },
                        'transformSpace': {
                            displayName: 'Transform Space',
                            tooltip: 'Specify the space of the position and rotation.',
                        },
                    },
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeModifyPoseBase.inputs',
                        'position': {
                            displayName: 'Position',
                        },
                        'rotation': {
                            displayName: 'Rotation',
                        },
                        'intensity': {
                            displayName: 'Intensity',
                        },
                    },
                },
                'PoseNodeCopyTransform': {
                    displayName: 'Copy Transform',
                    title: 'Copy {sourceNodeName}\'s transform to {targetNodeName}',
                    properties: {
                        'sourceNodeName': {
                            displayName: 'Source Node',
                            tooltip: 'Name of the source node.',
                        },
                        'targetNodeName': {
                            displayName: 'Target Node',
                            tooltip: 'Name of the target node.',
                        },
                        'space': {
                            displayName: 'Space',
                            tooltip: 'Specify the transform space in which the transform would be copied.',
                        },
                    },
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeModifyPoseBase.inputs',
                    },
                },
                'PoseNodeSetAuxiliaryCurve': {
                    displayName: 'Set Auxiliary Curve',
                    title: 'Set Auxiliary Curve {curveName}',
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeModifyPoseBase.inputs',
                        'curveValue': {
                            displayName: 'Value',
                        },
                    },
                },
                'PoseNodeTwoBoneIKSolver': {
                    displayName: 'Two Bone IK Solver',
                    title: 'Solve Two Bone IK: {endEffectorBoneName}',
                    properties: {
                        'endEffectorBoneName': {
                            displayName: 'End Effector Bone',
                            tooltip: 'Name of the end effector bone.',
                        },
                        'endEffectorTarget': {
                            displayName: 'End Effector Target',
                            tooltip: 'Specify the end effector\'s target.',
                        },
                        'poleTarget': {
                            displayName: 'Pole Target',
                            tooltip: 'Specify the pole target, ie. the middle bone\'s trending location..',
                        },
                    },
                    inputs: {
                        __extends__: 'classes.cc.animation.PoseNodeModifyPoseBase.inputs',
                        'endEffectorTargetPosition': {
                            displayName: 'End Effector Target',
                        },
                        'poleTargetPosition': {
                            displayName: 'Pole Target',
                        },
                        'intensityValue': {
                            displayName: 'Intensity',
                        },
                    },
                    'TargetSpecification': {
                        properties: {
                            'type': {
                                displayName: 'Type',
                                tooltip: 'Target type.',
                            },
                            'targetPosition': {
                                displayName: 'Target Position',
                                tooltip: 'Target position.',
                            },
                            'targetPositionSpace': {
                                displayName: 'Target Position Space',
                                tooltip: 'Space of the target position.',
                            },
                            'targetBone': {
                                displayName: 'Target Bone',
                                tooltip: 'Name of target bone.',
                            },
                        },
                    },
                },

                'PVNodeGetVariableBase': {
                    displayName: 'Get Variable',
                    title: 'Variable {variableName}',
                },
            },
        },
    },
};
