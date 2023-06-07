module.exports = {
    dialog: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        warn: 'Warn',
    },

    inspector: {
        cloneToEdit: 'Clone it. Use and go into edit.',
        cloneToDirectoryIllegal: 'Please limit the saved path to the current project assets path',
    },

    assets: {
        reset: 'Reset',
        save: 'Save',
        locate_asset: 'Locate in Assets Panel',
        'label-atlas': {
            SpriteFrameTip: 'Sprite Frame',
            ItemWidthTip: 'Item Width',
            ItemHeightTip: 'Item Height',
            StartCharTip: 'Start Char',
            FontSizeTip: 'Font Size',
            SpriteFrame: 'Sprite Frame',
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
            filterMode: 'Filter Mode',
            minFilter: 'Min Filter',
            magFilter: 'Mag Filter',
            generateMipmaps: 'Generate Mipmaps',
            mipFilter: 'Mip Filter',
            wrapMode: 'Wrap Mode',
            wrapModeS: 'Wrap Mode S',
            wrapModeT: 'Wrap Mode T',
            anisotropyTip: 'Maximum threshold for applying anisotropic filtering algorithms',
            filterModeTip: 'Choose how Texture is filtered when apply 3d transformation',
            minFilterTip: 'Minification filtering method',
            magFilterTip: 'Magnification filtering method',
            generateMipmapsTip:
                'Turn on this option to enable Mipmaps generation.Mipmaps are smaller versions of the original texture that are used to enhance performance and reduce rendering artifacts when objects are small in screen space',
            mipFilterTip: 'Mip map filtering method',
            wrapModeTip: 'Choose how Texture behaves when tiled. The default option is repeat',
            wrapModeSTip: 'Texture addressing mode in S(U) direction',
            wrapModeTTip: 'Texture addressing mode in T(V) direction',
            bakeReflectionConvolution: 'Bake Reflection Convolution',
            faceSize: {
                name: 'Face Size',
                title: 'Size of each cube face. If not specified, or specified as 0, the default size, which is the nearest power of two to (image.width)/4, is used.',
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
            simulateGlobals: 'Simulate Global Variables',
            executionScopeTip: 'Do not transpile or wrap this plugin script.',
            executionScopeEnclosed: 'Simulate Global Variables',
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
            propertyTips: {
                // macros
                USE_DITHERED_ALPHA_TEST: 'Make transparency using opaque dithered alpha clip with TAA.',
                USE_TWOSIDE: 'Two sided material for single-face objects, normal get inverse on back-face. Cull mode should set to None.',
                IS_ANISOTROPY: 'Anisotropic materials, such as hair, disc, metal with micro-wires.',
                USE_VERTEX_COLOR: 'Use vertex color, will become darker if mesh does not contain vertex color data.',
                FIX_ANISOTROPIC_ROTATION_MAP: 'Fix the anomalous seam at the black-white joint of the anisotropic rotation map, turn it on if you encounter this problem.',
                // uniforms
                tilingOffset: 'Tiling and offset for textures, which can be used as uv animation speed in Surface functions.',
                alphaThreshold: 'Alpha threshold for Mask materials, the larger the value the more pixels will be cropped.',
                occlusion: 'Ambient occlusion intensity, the higher the value, the greater the effect of ambient occlusion map.',
                roughness: 'Roughness, for controlling the area of highlight dispersion.',
                metallic: 'Metallic，for controlling the ratio of diffuse and specular.',
                specularIntensity: 'Multiplication of the base reflectance F0, valid only for non-metals.',
                pbrMap: 'r: Ambient Occlusion(AO) g: Roughness b: Metallic a: Specular Intensity.',
                normalMap: 'g channel should be adapted to GL coordinate system, try to turn on trilinear filtering, otherwise there will be noise with lighting.',
                normalStrength: 'Normal map intensity, high value may cause noise with lighting.',
                anisotropyIntensity: 'Anisotropic intensity, for controlling the shape of anisotropic highlights.',
                anisotropyRotation: 'for controlling the orientation of the strip highlights.',
                anisotropyMap: 'r: Anisotropy Intensity;  g: Anisotropy Rotation.',
                anisotropyMapNearestFilter: 'Duplicate the Anisotropy Map and select the Nearest filter.',
                anisotropyMapResolutionHeight: 'The height of Anisotropy Map texture resolution.',
                ior: 'Relative refractive index, which can affect the refraction angle and Fresnel effect. Water is 1.33',
                transmitThicknessWithShadowMap: 'Object thickness (world space unit), setting a too small value will cause the scattered light to disappear',
                transmitExtinctionWithShadowMap: 'Scatter extinction coefficient for back-transmitted light (such as ears and nose), larger value cause transmitted light to become weaker, and smaller value makes bright area bigger and average lighting. caution! the larger model size needs smaller extinction value to maintain the same lighting result, or give a distance scale to TransmitDiffuseParam from model size',
                transmitExtinction: 'Thin object scatter extinction coefficient for back-transmitted light (such as leaves), larger value cause transmitted light to become weaker, and smaller value makes bright area bigger and average lighting. Need specified thickness',
            },
        },
        image: {
            type: 'Type',
            typeTip: 'Type',
            // bakeOfflineMipmaps: 'Bake Offline Mipmaps',
            // bakeOfflineMipmapsTip: 'Bake Offline Mipmaps',
            flipVertical: 'Flip Vertical',
            flipVerticalTip: 'Flip Vertical',
            fixAlphaTransparencyArtifacts: 'Fix Alpha Transparency Artifacts',
            fixAlphaTransparencyArtifactsTip:
                'Fill transparent pixels with color of neareast solid pixel. These filled pixels would fix the dark halos at transparent borders of textures. Please turn on this option when you use the Alpha transparency channel in textures.',
            isRGBE: 'Is RGBE',
            isRGBETip: 'Is RGBE',
            flipGreenChannel: 'Flip Green Channel',
        },
        spriteFrame: {
            packable: 'Packable',
            packableTip: 'Whether to participate in dynamic atlas or automatic atlas in build processes.',
            rotated: 'Rotated',
            rotatedTip: 'Whether the sprite frame in TexturePacker is rotated',
            offsetX: 'Offset X',
            offsetXTip: 'The x-axis offset of the sprite frame in TexturePacker',
            offsetY: 'Offset Y',
            offsetYTip: 'The y-axis offset of the sprite frame in TexturePacker',
            trimType: 'Trim Type',
            trimTypeTip: 'The type of trimming',
            trimThreshold: 'Trim Threshold',
            trimThresholdTip: 'Transparency threshold for trimming',
            trimX: 'Trim X',
            trimXTip: 'The x coord of the top left corner of the trim rect',
            trimY: 'Trim Y',
            trimYTip: 'The y coord of the top left corner of the trim rect',
            width: 'Trim Width',
            widthTip: 'The width of the trim rect',
            height: 'Trim Height',
            heightTip: 'The height of the trim rect',
            borderTop: 'Border Top',
            borderTopTip: 'The top margin of the 9-slicing',
            borderBottom: 'Border Bottom',
            borderBottomTip: 'The bottom margin of 9-slicing',
            borderLeft: 'Border Left',
            borderLeftTip: 'The left margin of 9-slicing',
            borderRight: 'Border Right',
            borderRightTip: 'The right margin of 9-slicing',
            edit: 'Edit',
            editTip: 'Edit',
            meshType: 'Mesh Type',
            meshTypeTip: 'Type of the mesh generated for the sprite frame',
            pixelsToUnit: 'Pixels To Unit',
            pixelsToUnitTip: 'How many pixels in the sprite frame correspond to one unit in the world space',
            pivotX: 'Pivot X',
            pivotXTip: 'The origin`s X-axis position of sprite frame in the local coordinate system',
            pivotY: 'Pivot Y',
            pivotYTip: 'The origin`s Y-axis position of sprite frame in the local coordinate system',
        },
        texture: {
            anisotropy: 'Anisotropy',
            anisotropyTip: 'Maximum threshold for applying anisotropic filtering algorithms',
            filterMode: 'Filter Mode',
            filterModeTip: 'Choose how Texture is filtered when apply 3d transformation',
            minfilter: 'Min Filter',
            minfilterTip: 'Minification filtering method',
            magfilter: 'Mag Filter',
            magfilterTip: 'Magnification filtering method',
            generateMipmaps: 'Generate Mipmaps',
            generateMipmapsTip:
                'Turn on this option to enable Mipmaps generation.Mipmaps are smaller versions of the original texture that are used to enhance performance and reduce rendering artifacts when objects are small in screen space',
            mipfilter: 'Mip Filter',
            mipfilterTip: 'Mip map filtering method',
            wrapMode: 'Wrap Mode',
            wrapModeTip: 'Choose how Texture behaves when tiled. The default option is repeat',
            wrapModeS: 'Wrap Mode S',
            wrapModeSTip: 'Texture addressing mode in S(U) direction',
            wrapModeT: 'Wrap Mode T',
            wrapModeTTip: 'Texture addressing mode in T(V) direction',
            modeWarn:
                "Warning: WebGL 1.0 platform doesn't support 'Repeat' filter for non-power-of-two textures(runtime fallback to 'Clamp'), effectively disabling features like the 'tilingOffset' property in many materials.",
            filterDiffenent: 'Filter settings do not match the configuration in {atlasFile} and may not take effect.',
        },
        fbx: {
            browse: 'Change Target',
            model: 'Model',
            animation: 'Animation',
            modelPreview: 'Model preview',
            material: 'Material',
            no_model_tips: 'No model is available for preview',
            drag_model_tips: 'Drag a model here for preview',
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
                        title: 'Import tangents that are contained in the model file, or calculated if not contained and texture coordinates exist.',
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
                    name: 'Dump Materials',
                    title: 'Whether to extract material assets out of embedded (sub)assets, so that the assets become editable.',
                },
                materialDumpDir: {
                    name: 'Material Dump Directory',
                    title: 'The directory to dump the materials.<br>Default to a direct sub-folder named `Materials_${model-file-base-name}` under current path.',
                },
                useVertexColors: {
                    name: 'Use Vertex Colors',
                    title: 'Whether to use vertex colors. ',
                },
                depthWriteInAlphaModeBlend: {
                    name: 'Depth-Write If Blending',
                    title: 'Enable depth-write if the alpha mode is set to "BLEND". ',
                },
                skipValidation: {
                    name: 'Skip Validation',
                    title: 'Skip validation of the model file.',
                },
                mountAllAnimationsOnPrefab: {
                    name: 'Mount All Animations Onto Prefab',
                },
            },
            addEvent: {
                shouldSave: 'The newly created clip needs to be submitted for modification before adding/editing events',
                ok: 'OK',
            },
            ImageRemap: {
                remapAs: 'Remap As',
                original: 'Original',
            },
            limitMaterialDumpDir: 'The extracted path needs to be scoped to the project path.',
            legacyOptions: 'Legacy Options',
            legacyFbxImporter: {
                name: 'Compatible with v1.*',
                title: 'Whether this importer should be compatible with its behaviour prior to Cocos Creator version 1.* .',
                warn: 'Warning: Changing this property may break imported assets that have been using or referencing. ',
            },
            disableMeshSplit: {
                name: 'Disable Mesh Split',
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
            allowMeshDataAccess: {
                name: 'Allow Data Access',
                title:
                    'Indicate whether the mesh data in this model could be read or write.<br>' +
                    'If it is unchecked, the mesh data will be released after it is uploaded to GPU',
            },
            addVertexColor: {
                name: 'Add Vertex Color',
                title: 'Fill vertex color with white if the model file does not contain vertex color attribute.',
            },
            meshOptimizer: {
                name: 'Mesh Optimizer',
                title: 'Mesh Optimizer is used to simplify imported mesh.<br>Use it when you need to reduce model face count.<br>In some cases, face reduction could lead to various model defect. <br>Tweak properties and try again in those cases.',
                simplification: {
                    name: 'Simplification',
                    title: 'Simplification',
                    si: {
                        name: 'Achieve The Ratio R',
                        title: 'Achieve The Ratio R',
                    },
                    sa: {
                        name: 'Aggressively Simplify',
                        title: 'Aggressively Simplify',
                    },
                },
                scene: {
                    name: 'Scene',
                    title: 'Scene',
                    kn: {
                        name: 'Keep Nodes Transform',
                        title: 'Keep Nodes Transform',
                    },
                    ke: {
                        name: 'Keep Extras Data',
                        title: 'Keep Extras Data',
                    },
                },
                miscellaneous: {
                    name: 'Miscellaneous',
                    title: 'Miscellaneous',
                    noq: {
                        name: 'Disable Quantization',
                        title: 'Disable Quantization',
                    },
                    v: {
                        name: 'Verbose Output',
                        title: 'Verbose Output',
                    },
                },
                algorithm: {
                    name: 'Algorithm',
                    simplify: 'simplify',
                    gltfpack: 'gltfpack (deprecated)',
                },
                simplify:{
                    targetRatio: {
                        name: 'Ratio',
                        title: 'The target face count ratio after face reduction. <br>0 means reduce to minimum, and 1 means no face reduction at all. ',
                    },
                    preserveSurfaceCurvature: {
                        name: 'Surface Curvature',
                        title: 'Preserve Surface Curvature',
                    },
                    preserveBorderEdges: {
                        name: 'Border Edges',
                        title: 'Preserve Border Edges',
                    },
                    preserveUVSeamEdges: {
                        name: 'UV Seam Edges',
                        title: 'Preserve UV Seam Edges',
                    },
                    preserveUVFoldoverEdges: {
                        name: 'UV Foldover Edges',
                        title: 'Preserve UV Foldover Edges',
                    },
                    agressiveness: {
                        name: 'Agressiveness',
                        title: 'Face reduction algorithm aggressiveness. <br>The higher it sets, the more aggressive the face reduction algorithm tries to delete faces. <br>High aggressiveness setting is more likely to cause defects in result.',
                    },
                    maxIterationCount: {
                        name: 'Max Iteration Count',
                        title: 'The max iteration counts that the algorithm tries to further reduce faces of a model. <br>High iteration count is more likely to reach face reduction target, yet it is more likely to take more time and has higher chance to cause mistakes.',
                    },
                },
                gltfpack: {
                    warn: 'The current asset uses the gltfpack mesh optimization algorithm, which has been deprecated. Please use the new simplify face reduction algorithm.',
                },
                warn: 'Warning: After optimization, the number and names of mesh resources will change, which will cause the loss of resources referenced by the components, please update them manually in time. (In addition, for prefabs pre-generated in the model resources, the resource synchronization mechanism will update them automatically)',
            },
            animationBakeRate: {
                name: 'Animation Bake Rate',
                title: 'Specify the animation bake rate in frames per second (fps).',
                auto: 'Auto',
            },
            promoteSingleRootNode: {
                name: 'Promote Single Root Node',
                title:
                    'If enabled and there is only one root node in model scene, <br>' +
                    "the single node becomes prefab's root after importing.  <br>" +
                    "Otherwise, each root node of the scene becomes prefab's child node.",
            },
            generateLightmapUVNode: {
                name: 'Generate Lightmap UV',
                title:
                    'If enabled ,create a lightmap uv in the second UV channel, <br>' +
                    'If the second uv already exists , the set will be override .  <br>' +
                    "Otherwise, use default uvs.",
            },
            preferLocalTimeSpan: {
                name: 'Prefer Local Time Span',
                title:
                    'When exporting FBX animations, whether prefer to use the time range recorded in FBX file.<br>' +
                    'If one is not preferred, or one is invalid for use, the time range is robustly calculated.<br>' +
                    'Some FBX generators may not export this information.',
            },
            smartMaterialEnabled: {
                name: 'Smart Material Conversion',
                title: 'Convert DCC materials to engine builtin materials which match the internal lighting model.',
                warn: 'The model feature "Smart Material Conversion" in the project settings is turned off, please enable this feature to modify model level settings.',
            },
            animationSetting: {
                additive: {
                    header: 'Additive Animation Import Setting',
                    enabled: {
                        label: 'Import As Additive',
                        tooltip: 'if checked, import this animation as additive animation.',
                    },
                    refClip: {
                        label: 'Reference Clip',
                        tooltip: 'If set, computation of the additive animation with reference pose at first frame of specified clip. ' +
                            'Otherwise, reference the pose at first frame of original clip.',
                    },
                },
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
        animationGraph: {
            edit: 'Edit',
        },
        animationMask: {
            importSkeleton: 'Import Skeleton',
            clearAllNodes: 'Clear',
            clearAllNodesWarn: 'Are you sure to clear all data of this Animation Mask?',
            illegalFbx: 'Import Skeleton Failed: this fbx asset has not contained sub prefab asset.',
            nodeEnableTip: 'Whether to enable this joint and its descendants.;<br>Alt + Click only toggle the state of itself.',
        },
        multipleWarning: 'Multi-select editing of this type of asset is not supported.',
        check_is_saved: {
            message: 'The modified data has not been saved. Do you want to save it?',
            assetMessage: "${assetName} is modified, it's data has not been saved. Do you want to save it?",
            save: 'Save',
            abort: 'Discard',
        },
    },

    menu: {
        node: 'Node Menu',
        component: 'Component Menu',

        remove_component: 'Remove',
        reset_component: 'Reset',
        move_up_component: 'Move Up',
        move_down_component: 'Move Down',

        reset_node: 'Reset',
        reset_node_position: 'Reset Position',
        reset_node_rotation: 'Reset Rotation',
        reset_node_scale: 'Reset Scale',
        reset_node_mobility: 'Reset Mobility',

        copy_node_value: 'Copy Node Values',
        paste_node_value: 'Paste Node Values',
        copy_node_world_transform: 'Copy Node World Transform',
        paste_node_world_transform: 'Paste Node World Transform',

        copy_component: 'Copy Component',
        paste_component: 'Paste Component As New',
        paste_component_values: 'Paste Component Values',

        help_url: 'Help Document',
        custom_script: 'Custom Script',
    },

    prefab: {
        edit: 'Edit prefab asset',
        local: 'Location',
        reset: 'Reset from prefab',
        save: 'Update prefab asset',
        link: 'Connect it to another prefab',
        unlink: 'Disconnect node with current prefab asset',
        lost: 'Prefab asset is not exist.',
        exist: 'Prefab Asset',
    },
};
