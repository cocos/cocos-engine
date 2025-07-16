/* eslint-disable quote-props */

module.exports = {
    classes: {
        'cc': {
            'ModelBakeSettings': {
                groups: {
                    LightMap: {
                        displayName: 'Light Map Settings',
                        tooltip: '',
                    },
                    LightProbe: {
                        displayName: 'Light Probe Settings',
                        tooltip: '',
                    },
                    ReflectionProbe: {
                        displayName: 'Reflection Probe Settings',
                        tooltip: '',
                    },
                },
                properties: {
                    'bakeable': {
                        displayName: 'Bakeable',
                        tooltip: 'Whether the model is static and bake-able with light map. <br>' +
                            'Notice: the model\'s vertex data must have the second UV attribute to enable light map baking.',
                    },
                    'castShadow': {
                        displayName: 'Cast Shadows',
                        tooltip: 'Whether to cast shadow in light map baking.',
                    },
                    'receiveShadow': {
                        displayName: 'Receive Shadows',
                        tooltip: 'Whether to receive shadow in light map baking.',
                    },
                    'lightmapSize': {
                        displayName: 'Light Map Size',
                        tooltip: 'The lightmap size.',
                    },
                    'useLightProbe': {
                        displayName: 'Use Light Probe',
                        tooltip: 'Whether to use light probe which provides indirect light to dynamic objects.',
                    },
                    'bakeToLightProbe': {
                        displayName: 'Bake To Light Probe',
                        tooltip: 'Whether the model is used to calculate light probe.',
                    },
                    'reflectionProbe': {
                        displayName: 'Reflection Probe',
                        tooltip: 'Used to set whether to use the reflection probe or set probe\'s type.',
                    },
                    'bakeToReflectionProbe': {
                        displayName: 'Bake To Reflection Probe',
                        tooltip: 'Whether the model can be render by the reflection probe.',
                    },
                },
            },
            'MeshRenderer': {
                groups: {
                    DynamicShadow: {
                        displayName: 'Dynamic Shadow Settings',
                        tooltip: '',
                    },
                },
                properties: {
                    'mesh': {
                        displayName: 'Mesh',
                        tooltip: 'The mesh asset.',
                    },
                    'sharedMaterials': {
                        displayName: 'Materials',
                        tooltip: 'Material array. Each item in turn specifies material of sub mesh.',
                    },
                    'shadowCastingModeForInspector': {
                        displayName: 'Cast Shadows',
                        tooltip: 'Whether if this mesh casts shadows.',
                    },
                    'receiveShadowForInspector': {
                        displayName: 'Receive Shadows',
                        tooltip: 'Whether if this mesh receives shadows.',
                    },
                    'shadowBias': {
                        displayName: 'Shadow Bias',
                        tooltip: 'Bias value (world space unit) that can avoid moire artifacts with shadows for model. <br>The more the value, the more the light leakage.',
                    },
                    'shadowNormalBias': {
                        displayName: 'Shadow Normal Bias',
                        tooltip: 'Bias value (world space unit) that can avoid moire artifacts with surfaces that parallel to the directional light.',
                    },
                    'bakeSettings': {
                        displayName: 'Bake Settings',
                        tooltip: 'Bake settings related to global lighting.',
                    },
                    'isGlobalStandardSkinObject': {
                        displayName: 'Global Standard Skin Object',
                        tooltip: 'The engine needs to know the scale of the model corresponding to the skin material in order to calculate the skin scattered light correctly. If no model is checked, the model with the skin material will be automatically selected for calculation.',
                    },
                },
            },
            'SkinnedMeshRenderer': {
                properties: {
                    __extends__: 'classes.cc.MeshRenderer.properties',
                    'skeleton': {
                        displayName: 'Skeleton',
                        tooltip: 'Skeleton asset.',
                    },
                    'skinningRoot': {
                        displayName: 'Skinning Root',
                        tooltip: 'Reference to the root bone. In general, it\'s the node where animation component is located.',
                    },
                },
            },
        },
    },
};
