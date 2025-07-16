/* eslint-disable quote-props */
/* eslint-disable camelcase */

module.exports = {
    animation_graph: {
        pose_graph_node_sub_categories: {
            pose_nodes: 'Pose Nodes',
            pose_nodes_blend: 'Blend',
            pose_nodes_ik: 'Inverse Kinematic',
            pose_nodes_choose: 'Choose',
        },
        pose_graph_node_sub_menus: {
            play_or_sample_clip_motion: 'Animation Clip',
            play_or_sample_animation_blend_1d: 'Animation Blend 1D',
            play_or_sample_animation_blend_2d: 'Animation Blend 2D',
        },
    },

    classes: {
        'cc': {
            'Animation': {
                'properties': {
                    'clips': {
                        displayName: 'Clips',
                        tooltip: 'All clips this component governs.',
                    },
                    'defaultClip': {
                        displayName: 'Default Clip',
                        tooltip: 'The default clip to play.',
                    },
                    'playOnLoad': {
                        displayName: 'Play On Load',
                        tooltip: 'Whether automatically play the default clip after component loaded.',
                    },
                },
            },
            'SkeletalAnimation': {
                'properties': {
                    __extends__: 'classes.cc.Animation.properties',
                    'sockets': {
                        displayName: 'Sockets',
                        tooltip: 'The joint sockets this animation component maintains. ' +
                            'Sockets have to be registered here before attaching custom nodes to animated joints.',
                    },
                    'useBakedAnimation': {
                        displayName: 'Use Baked Animation',
                        tooltip: `Whether to bake animations. Default to true, ` +
                            `which substantially increases performance while making all animations completely fixed.` +
                            `Dynamically changing this property will take effect when playing the next animation clip.`,
                    },
                },
            },
            'animation': {
                'AnimationController': {
                    properties: {
                        'graph': {
                            displayName: 'Graph',
                            tooltip: 'The animation graph or animation graph variant associated with this animation controller.',
                        },
                    },
                },
                'PoseGraphOutputNode': {
                    displayName: 'Output Pose',
                },
                'PoseNodeUseStashedPose': {
                    displayName: 'Use Stashed Pose',
                    title: 'Use Stash {stashName}',
                },
                'PoseNodeStateMachine': {
                    displayName: 'State Machine',
                    inputs: {
                        'emptyStatePose': {
                            displayName: 'Empty State Pose',
                        },
                    },
                },
                'ClipMotion': {
                    properties: {
                        'clip': {
                            displayName: 'Clip',
                            tooltip: 'The animation clip.',
                        },
                    },
                },
                'MotionSyncInfo': {
                    properties: {
                        'group': {
                            displayName: 'Group',
                        },
                    },
                },
                'PoseNodePlayMotion': {
                    displayName: 'Play Animation',
                    title: 'Play {motionName}',
                    properties: {
                        'motion': {
                            displayName: 'Motion',
                            tooltip: 'The motion to play.',
                        },
                        'syncInfo': {
                            displayName: 'Sync',
                        },
                    },
                    inputs: {
                        'startTime': {
                            displayName: 'Start Time',
                            tooltip: 'Specify where to begin playing the motion. ' +
                                'The time\'s unit is seconds and the value would be clamped into [0, motion\'s duration].',
                        },
                        'speedMultiplier': {
                            displayName: 'Speed Multiplier',
                        },
                    },
                    createPoseNodeOnAssetDragHandler: {
                        displayName: 'Play',
                    },
                },
                'PoseNodeSampleMotion': {
                    displayName: 'Sample Animation',
                    title: 'Sample {motionName}',
                    properties: {
                        'motion': {
                            displayName: 'Motion',
                            tooltip: 'The motion to sample.',
                        },
                        'useNormalizedTime': {
                            displayName: 'Use Normalized Time',
                            tooltip: 'Whether to use normalized time, ie. time in range [0, 1].',
                        },
                    },
                    inputs: {
                        'time': {
                            displayName: 'Time',
                        },
                    },
                    createPoseNodeOnAssetDragHandler: {
                        displayName: 'Sample',
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
                        'ratio': {
                            displayName: 'Ratio',
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
                        'intensityValue': {
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
