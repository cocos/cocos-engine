/* eslint-disable quote-props */

module.exports = {
    classes: {
        'cc': {
            'ModelBakeSettings': {
                groups: {
                    LightMap: {
                        displayName: '光照贴图设置',
                    },
                    LightProbe: {
                        displayName: '光照探针设置',
                    },
                    ReflectionProbe: {
                        displayName: '反射探针设置',
                    },
                },
                properties: {
                    'bakeable': {
                        displayName: '可烘焙',
                    },
                    'castShadow': {
                        displayName: '投射阴影',
                    },
                    'receiveShadow': {
                        displayName: '接收阴影',
                    },
                    'lightmapSize': {
                        displayName: '光照贴图尺寸',
                    },
                    'useLightProbe': {
                        displayName: '使用光照探针',
                    },
                    'bakeToLightProbe': {
                        displayName: '烘焙至光照探针',
                    },
                    'reflectionProbe': {
                        displayName: '反射探针',
                    },
                    'bakeToReflectionProbe': {
                        displayName: '烘焙至反射探针',
                    },
                },
            },
            'MeshRenderer': {
                groups: {
                    DynamicShadow: {
                        displayName: '动态阴影设置',
                    },
                },
                properties: {
                    'mesh': {
                        displayName: '网格',
                        tooltip: '网格资源。',
                    },
                    'sharedMaterials': {
                        displayName: '材质',
                        tooltip: '材质资源数组。每一项依次指定了子网格的材质。',
                    },
                    'shadowCastingModeForInspector': {
                        displayName: '投射阴影',
                        tooltip: '此网格是否投射阴影。',
                    },
                    'receiveShadowForInspector': {
                        displayName: '接收阴影',
                        tooltip: '此网格是否接收阴影。',
                    },
                    'shadowBias': {
                        displayName: '阴影偏移',
                        tooltip: '模型额外增加深度偏移值（世界空间单位）可以有效消除阴影摩尔纹，但是过大的值可能造成漏光现象。',
                    },
                    'shadowNormalBias': {
                        displayName: '阴影法线偏移',
                        tooltip: '模型额外增加法线深度偏移值（世界空间单位），可以消除物体表面朝向平行于阳光方向的阴影摩尔纹，<br>防止曲面出现锯齿状；但是过大的值可能会造成阴影位置偏差。',
                    },
                    'bakeSettings': {
                        displayName: '烘焙设置',
                        tooltip: '全局光照相关的烘焙设置。',
                    },
                    'isGlobalStandardSkinObject': {
                        displayName: '全局标准蒙皮模型',
                        tooltip: '模型额外设定全局唯一的标准皮肤模型',
                    },
                },
            },
            'SkinnedMeshRenderer': {
                properties: {
                    __extends__: 'classes.cc.MeshRenderer.properties',
                    'skeleton': {
                        displayName: '骨骼',
                        tooltip: '骨骼资源。',
                    },
                    'skinningRoot': {
                        displayName: '蒙皮根',
                        tooltip: '骨骼根节点的引用，对应控制此模型的动画组件所在节点。',
                    },
                },
            },
        },
    },
};
