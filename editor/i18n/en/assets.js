module.exports = {
    assets: {
        'label-atlas': {
            SpriteFrameTip: 'SpriteFrame',
            ItemWidthTip: 'Item Width',
            ItemHeightTip: 'Item Height',
            StartCharTip: 'Start Char',
            FontSizeTip: 'Font Size',
            SpriteFrame: 'SpriteFrame',
            ItemWidth: 'Item Width',
            ItemHeight: 'Item Height',
            StartChar: 'Start Char',
            FontSize: 'Font Size',
        },
        particle: {
            spriteFrame: 'Sprite Frame',
            spriteFrameTip: 'Sprite Frame',
        },
        erpTextureCube: {
            anisotropy: 'Anisotropy',
            minFilter: 'Min Filter',
            magFilter: 'Mag Filter',
            mipFilter: 'Mip Filter',
            wrapModeS: 'Wrap Mode S',
            wrapModeT: 'Wrap Mode T',
            anisotropyTip: 'Anisotropy',
            minFilterTip: 'Min Filter',
            magFilterTip: 'Mag Filter',
            mipFilterTip: 'Mip Filter',
            wrapModeSTip: 'Wrap Mode S',
            wrapModeTTip: 'Wrap Mode T',
            faceSize: {
                name: 'Face Size',
                title:
                    'Size of each cube face. If not specified, or specified as 0, the default size, which is the nearest power of two to (image.width)/4, is used.',
            },
        },
        javascript: {
            plugin: 'Import As Plugin',
            dependencies: 'Dependencies',
            executionScope: 'Execution Scope',
            global: 'Global',
            enclosed: 'Enclosed',
            loadPluginInWeb: 'Load In Web',
            loadPluginInEditor: 'Load In Editor',
            loadPluginInNative: 'Load In Native',
            simulateGlobals: 'Simulate global variables',
            executionScopeTip: 'Do not transpile or wrap this plugin script.',
            executionScopeEnclosed: 'Simulate global variables',
            pluginTip: 'Import As Plugin',
            dependenciesTip: 'Dependencies',
            globalTip: 'Global',
            enclosedTip: 'Enclosed',
            loadPluginInWebTip: 'Load In Web',
            loadPluginInEditorTip: 'Load In Editor',
            loadPluginInNativeTip: 'Load In Native',
            simulateGlobalsTip: 'Simulate global variables',
        },
        scene: {
            asyncLoadAssets: 'Async Load Assets',
        },
        effect: {
            shader: 'Shaders',
            shaderTip: 'Shaders',
            combinations: 'Precompile Combinations',
            combinationsTip: 'Precompile Combinations',
            choose: 'Choose all possible branches.',
            glsl3: 'GLSL 300 ES Output',
            glsl1: 'GLSL 100 Output',
            vert: 'Vertex Shader',
            frag: 'Fragment Shader',
        },
        image: {
            type: 'Type',
            typeTip: 'Type',
            flipVertical: 'Flip Vertical',
            flipVerticalTip: 'Flip Vertical',
            isRGBE: 'Is RGBE',
            isRGBETip: 'Is RGBE',
        },
        spriteFrame: {
            packable: 'Packable',
            packableTip: 'Packable',
            rotated: 'Rotated',
            rotatedTip: 'Rotated',
            offsetX: 'Offset X',
            offsetXTip: 'Offset X',
            offsetY: 'Offset Y',
            offsetYTip: 'Offset Y',
            trimType: 'Trim Type',
            trimTypeTip: 'Trim Type',
            trimThreshold: 'Trim Threshold',
            trimThresholdTip: 'Trim Threshold',
            trimX: 'Trim X',
            trimXTip: 'Trim X',
            trimY: 'Trim Y',
            trimYTip: 'Trim Y',
            width: 'Trim Width',
            widthTip: 'Trim Width',
            height: 'Trim Height',
            heightTip: 'Trim Height',
            borderTop: 'Border Top',
            borderTopTip: 'Border Top',
            borderBottom: 'Border Bottom',
            borderBottomTip: 'Border Bottom',
            borderLeft: 'Border Left',
            borderLeftTip: 'Border Left',
            borderRight: 'Border Right',
            borderRightTip: 'Border Right',
            edit: 'Edit',
        },
        texture: {
            anisotropy: 'Anisotropy',
            anisotropyTip: 'Anisotropy',
            minfilter: 'Min Filter',
            minfilterTip: 'Min Filter',
            magfilter: 'Mag Filter',
            magfilterTip: 'Mag Filter',
            mipfilter: 'Mip Filter',
            mipfilterTip: 'Mip Filter',
            wrapModeS: 'Wrap Mode S',
            wrapModeSTip: 'Wrap Mode S',
            wrapModeT: 'Wrap Mode T',
            wrapModeTTip: 'Wrap Mode T',
            modeWarn:
                "Warning: WebGL 1.0 platform doesn't support 'repeat' filter for non-power-of-two textures(runtime fallback to 'clamp-to-edge'), effectively disabling features like the 'tilingOffset' property in many materials.",
        },
        fbx: {
            browse: 'Change Target',
            model: 'Model',
            animation: 'Animation',
            modelPreview: 'Model preview',
            material: 'Material',
            no_model_tips:'No model is available for preview.',
            drag_model_tips:'Please drag a model into this Preview Area.',
            fbx: 'FBX',
            GlTFUserData: {
                normals: {
                    name: 'Normals',
                    title: 'Normals import setting.',
                    optional: {
                        name: 'Optional',
                        title: 'Import normals only if the model file contains normals.',
                    },
                    exclude: {
                        name: 'Exclude',
                        title: 'Do not import normals.',
                    },
                    require: {
                        name: 'Required',
                        title: 'Import normals that are contained in the model file, or calculated if not contained.',
                    },
                    recalculate: {
                        name: 'Recalculate',
                        title: 'Recalculate normals and import, ingoring whether if the model file contain normals.',
                    },
                },
                tangents: {
                    name: 'Tangents',
                    title: 'Tangents import setting.',
                    optional: {
                        name: 'Optional',
                        title: 'Import tangents only if the model file contains tangents.',
                    },
                    exclude: {
                        name: 'Exclude',
                        title: 'Do not import tangents.',
                    },
                    require: {
                        name: 'Required',
                        title:
                            'Import tangents that are contained in the model file, or calculated if not contained and texture coordinates exist.',
                    },
                    recalculate: {
                        name: 'Recalculate',
                        title: 'Recalculate tangents and import, ingoring whether if the model file contain tangents.',
                    },
                },
                morphNormals: {
                    name: 'Morph normals',
                    title: 'Morph normals import setting.',
                    optional: {
                        name: 'Optional',
                        title: 'Import morph normals only if the model file contains morph normals.',
                    },
                    exclude: {
                        name: 'Exclude',
                        title: 'Do not import morph normals.',
                    },
                    require: {
                        name: 'Required',
                        title: 'Import morph normals that are contained in the model file, or calculated if not contained.',
                    },
                    recalculate: {
                        name: 'Recalculate',
                        title: 'Recalculate morph normals and import, ingoring whether if the model file contain morph normals.',
                    },
                },
                dumpMaterials: {
                    name: 'Dump materials',
                    title: 'Whether to extract material assets out of embedded (sub)assets, so that the assets become editable.',
                },
                materialDumpDir: {
                    name: 'Material dump directory',
                    title:
                        'The directory to dump the materials.\nDefault to a direct sub-folder named `Materials_${model-file-base-name}` under current path.',
                },
                useVertexColors: {
                    name: 'Use vertex colors',
                    title: 'Whether to use vertex colors. ',
                },
                depthWriteInAlphaModeBlend: {
                    name: 'Depth-write if blending',
                    title: 'Enable depth-write if the alpha mode is set to "BLEND". ',
                },
                skipValidation: {
                    name: 'Skip Validation',
                    title: 'Skip validation of the model file.',
                },
            },
            addEvent: {
                shouldSave: 'The newly created clip needs to be submitted for modification before adding/editing events',
                ok: 'OK',
            },
            ImageRemap: {
                remapAs: 'Remap as',
                original: 'Original',
            },
            limitMaterialDumpDir: 'The extracted path needs to be scoped to the project path.',
            legacyFbxImporter: {
                name: 'Compatible with v1.*',
                title: 'Whether this importer should be compatible with its behaviour prior to Cocos Creator version 1.* .',
                warn: 'Warning: Changing this property may break imported assets that have been using or referencing. ',
            },
            disableMeshSplit: {
                name: 'Disable mesh split',
                title:
                    'Currently there is a joint-counting-based mesh splitting process during the <br>' +
                    'import pipeline to workaround the max uniform vector limit problem for real-time <br>' +
                    'calculated skeletal animation system on many platforms. This process has a performance <br>' +
                    'impact on other runtime systems too. So if it can be pre-determined that the real-time <br>' +
                    'calculated skeletal animations (when useBakedAnimations is unchecked on SkeletalAnimation <br>' +
                    'component) will not be used, this option can be checked to improve performance. But note that <br> ' +
                    'toggling this would update the corresponding prefab, so all the references in the scene should be <br>' +
                    'updated as well to accompany that. To be removed in further refactors.',
            },
            meshOptimizer: {
                name: 'Mesh Optimizer',
                title: 'Mesh Optimizer',
                simplification: {
                    name: 'Simplification',
                    title: 'Simplification',
                    si: {
                        name: 'Achieve the ratio R',
                        title: 'Achieve the ratio R',
                    },
                    sa: {
                        name: 'Aggressively simplify',
                        title: 'Aggressively simplify',
                    },
                },
                scene: {
                    name: 'Scene',
                    title: 'Scene',
                    kn: {
                        name: 'Keep nodes transform',
                        title: 'Keep nodes transform',
                    },
                    ke: {
                        name: 'Keep extras data',
                        title: 'Keep extras data',
                    },
                },
                miscellaneous: {
                    name: 'Miscellaneous',
                    title: 'Miscellaneous',
                    noq: {
                        name: 'Disable quantization',
                        title: 'Disable quantization',
                    },
                    v: {
                        name: 'Verbose output',
                        title: 'Verbose output',
                    },
                },
            },
            animationBakeRate: {
                name: 'Animation Bake Rate',
                title: 'Specify the animation bake rate in frames per second (fps).',
            },
            promoteSingleRootNode: {
                name: 'Promote single root node',
                title:
                    'If enabled and there is only one single root node in a FBX scene, <br>' +
                    'the single root node is used as the root of prefab when converting the FBX scene to Cocos Creator prefab. <br>' +
                    "Otherwise, the FBX scene become prefab's root.",
            },
        },
        textureCube: {
            anisotropy: 'Anisotropy',
            anisotropyTip: 'Anisotropy',
            minFilter: 'Min Filter',
            minFilterTip: 'Min Filter',
            magFilter: 'Mag Filter',
            magFilterTip: 'Mag Filter',
            mipFilter: 'Mip Filter',
            mipFilterTip: 'Mip Filter',
            wrapModeS: 'Wrap Mode S',
            wrapModeSTip: 'Wrap Mode S',
            wrapModeT: 'Wrap Mode T',
            wrapModeTTip: 'Wrap Mode T',
            modeWarn:
                "Warning: WebGL 1.0 platform doesn't support 'repeat' filter for non-power-of-two textures(runtime fallback to 'clamp-to-edge'), effectively disabling features like the 'tilingOffset' property in many materials.",
        },
        material: {
            'fail-to-load-custom-inspector': 'material: fail to load custom inspector of {effect}',
            'illegal-inspector-url': "Inspector's URL is not valid",
        },
        multipleWarning: 'Multi-select editing of this type of asset is not supported',
    },
};
