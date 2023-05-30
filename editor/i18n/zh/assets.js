module.exports = {
    dialog: {
        confirm: '确认',
        cancel: '取消',
        warn: '警告',
    },

    inspector: {
        cloneToEdit: '克隆出新资源，使用并编辑',
        cloneToDirectoryIllegal: '保存路径请限制在当前项目 /assets 路径内',
    },

    assets: {
        reset: '重置',
        save: '保存',
        locate_asset: '资源面板上定位该资源',
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
            filterMode: '过滤模式',
            minFilter: 'Min Filter',
            magFilter: 'Mag Filter',
            generateMipmaps: '生成 Mipmaps',
            mipFilter: 'Mip Filter',
            wrapMode: '拼接模式',
            wrapModeS: 'Wrap Mode S',
            wrapModeT: 'Wrap Mode T',
            anisotropyTip: '应用各向异性过滤算法的最大阈值',
            filterModeTip: '选择贴图在应用三维图形变换时的过滤模式',
            minFilterTip: '缩小贴图时采用的过滤算法',
            magFilterTip: '放大贴图时采用的过滤算法',
            generateMipmapsTip:
                '勾选此选项以自动生成 Mipmaps。Mipmaps 是一系列缩小到不同尺寸的原贴图，在物体占屏幕空间小的时候使用以提升性能和减少闪烁',
            mipFilterTip: '采用多级纹理时的过滤算法',
            wrapModeTip: '选择在贴图小于填充空间时的填充方式，默认模式为循环',
            wrapModeSTip: '像素对纹理在 S（U）方向上的映射模式',
            wrapModeTTip: '像素对纹理在 T（V）方向上的映射模式',
            bakeReflectionConvolution: 'Bake Reflection Convolution',
            faceSize: {
                name: 'Face Size',
                title: '每个面的尺寸。如果未指定或指定为0，将使用默认尺寸——最接近贴图宽度 / 4 的2次幂。',
            },
        },
        javascript: {
            plugin: '导入为插件',
            dependencies: '依赖其它',
            executionScope: '执行作用域',
            global: '顶层',
            enclosed: '独立',
            loadPluginInWeb: '允许 Web 平台加载',
            loadPluginInEditor: '允许编辑器加载',
            loadPluginInNative: '允许 Native 平台加载',
            simulateGlobals: '模拟全局变量',
            executionScopeTip: '不对该插件脚本做任何编译或包装。',
            executionScopeEnclosed: '模拟全局变量',
            pluginTip: 'Import As Plugin',
            dependenciesTip: 'Dependencies',
            globalTip: 'Global',
            enclosedTip: 'Enclosed',
            loadPluginInWebTip: 'Load In Web',
            loadPluginInEditorTip: 'Load In Editor',
            loadPluginInNativeTip: 'Load In Native',
            simulateGlobalsTip: 'Simulate Global Variables',
        },
        scene: {
            asyncLoadAssets: '异步加载',
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
                USE_DITHERED_ALPHA_TEST: '使用抖动透贴的方式来实现半透明效果，最好同时开启 TAA',
                USE_TWOSIDE: '双面材质，通常用于单面物体，正面和背面的法线相反。还需将 Cull Mode 设为 None',
                IS_ANISOTROPY: '各向异性材质，通常用于头发、光碟、拉丝金属等',
                USE_VERTEX_COLOR: '使用顶点色，如果模型本身没有顶点色可能会发黑',
                FIX_ANISOTROPIC_ROTATION_MAP: '修复各向异性旋转图黑白相接处的异常接缝，遇到此问题再开启',
                // uniforms
                tilingOffset: '贴图平铺和偏移，在 Surface 函数中可以用作纹理动画偏移速度',
                alphaThreshold: '透贴阈值，用于 Mask 材质，该值越大被裁掉的像素就越多',
                occlusion: '环境遮蔽强度，该值越大则环境遮蔽贴图的影响就越大',
                roughness: '粗糙度，用于控制高光弥散的程度',
                metallic: '金属性，用于控制漫反射和高光比例',
                specularIntensity: '高光强度，该值相当于基准反射率 F0 的倍增，仅对非金属有效',
                pbrMap: 'r: 环境遮蔽(AO) g: 粗糙度 b: 金属性 a: 高光强度',
                normalMap: '法线贴图，g 通道需适配 GL 坐标系，尽量开启三线性过滤，否则光照会有噪点',
                normalStrength: '法线贴图强度，过高的值可能造成光照有噪点',
                anisotropyIntensity: '各向异性强度，用于控制各向异性高光的形状',
                anisotropyRotation: '用于控制条状高光的朝向',
                anisotropyMap: 'r: Anisotropy Intensity;  g: Anisotropy Rotation.',
                anisotropyMapNearestFilter: '将 Anisotropy Map 贴图复制出来并选择 Nearest 过滤',
                anisotropyMapResolutionHeight: 'Anisotropy Map 的分辨率高度',
                ior: '相对折射率，该值可以影响折射角度和菲涅耳效果。水是1.33',
                transmitThicknessWithShadowMap: '物体厚度（世界空间单位），注意！该值过小可能导致穿透光消失',
                transmitExtinctionWithShadowMap: '穿透光的散射消光系数（可影响耳朵、鼻子等的背面透光强度）。该值越大则穿透光越弱、亮区范围也会更小、厚薄感变强， 反之穿透光越强越均匀、亮区更大但厚薄感变弱。有一点需要特别注意！由于是按照世界空间单位计算散射，则模型越大，该值必须相对更小才能维持同样的光照效果，或根据模型大小给一个距离缩放值在TransmitDiffuseParam中',
                transmitExtinction: '薄片穿透光的散射消光系数（可影响叶片等的背面透光强度）。该值越大则穿透光越弱、亮区范围也会更小、厚薄感变强， 反之穿透光越强越均匀、亮区更大但厚薄感变弱。同时还需要指定薄片厚度',
            },
        },
        image: {
            type: '类型',
            typeTip: '类型',
            // bakeOfflineMipmaps: 'Bake Offline Mipmaps',
            // bakeOfflineMipmapsTip: 'Bake Offline Mipmaps',
            flipVertical: '垂直翻转',
            flipVerticalTip: '垂直翻转',
            fixAlphaTransparencyArtifacts: '消除透明伪影',
            fixAlphaTransparencyArtifactsTip:
                '为全透明像素填充相邻像素的颜色，防止纹理过滤引起的黑边问题。当使用 Alpha 透明通道时，请启用此功能。',
            isRGBE: '作为 RGBE 格式',
            isRGBETip: '作为 RGBE 格式',
            flipGreenChannel: '翻转绿色通道',
        },
        spriteFrame: {
            packable: 'Packable',
            packableTip: '是否参与动态合图或者自动图集的构建处理',
            rotated: 'Rotated',
            rotatedTip: 'TexturePacker 中的子资源是否被旋转',
            offsetX: 'Offset X',
            offsetXTip: 'TexturePacker 图片矩形的 X 轴偏移量',
            offsetY: 'Offset Y',
            offsetYTip: 'TexturePacker 图片矩形的 Y 轴偏移量',
            trimType: 'Trim Type',
            trimTypeTip: '裁剪类型',
            trimThreshold: 'Trim Threshold',
            trimThresholdTip: '裁剪的透明度阈值',
            trimX: 'Trim X',
            trimXTip: '裁剪矩形左上角的 X 坐标',
            trimY: 'Trim Y',
            trimYTip: '裁剪矩形左上角的 Y 坐标',
            width: 'Trim Width',
            widthTip: '裁剪矩形宽度',
            height: 'Trim Height',
            heightTip: '裁剪矩形高度',
            borderTop: 'Border Top',
            borderTopTip: '九宫格上边距',
            borderBottom: 'Border Bottom',
            borderBottomTip: '九宫格下边距',
            borderLeft: 'Border Left',
            borderLeftTip: '九宫格左边距',
            borderRight: 'Border Right',
            borderRightTip: '九宫格右边距',
            edit: 'Edit',
            editTip: '编辑',
            meshType: 'Mesh Type',
            meshTypeTip: 'Sprite Frame 生成的网格类型',
            pixelsToUnit: 'Pixels To Unit',
            pixelsToUnitTip: 'Sprite Frame 像素对应世界空间内单位长度的比例尺',
            pivotX: 'Pivot X',
            pivotXTip: 'Sprite Frame 本地坐标系原点的 X 轴位置',
            pivotY: 'Pivot Y',
            pivotYTip: 'Sprite Frame 本地坐标系原点的 Y 轴位置',
        },
        texture: {
            anisotropy: 'Anisotropy',
            anisotropyTip: '应用各向异性过滤算法的最大阈值',
            filterMode: '过滤模式',
            filterModeTip: '选择贴图在应用三维图形变换时的过滤模式',
            minfilter: 'Min Filter',
            minfilterTip: '缩小贴图时采用的过滤算法',
            magfilter: 'Mag Filter',
            magfilterTip: '放大贴图时采用的过滤算法',
            generateMipmaps: '生成 Mipmaps',
            generateMipmapsTip:
                '勾选此选项以自动生成 Mipmaps。Mipmaps 是一系列缩小到不同尺寸的原贴图，在物体占屏幕空间小的时候使用以提升性能和减少闪烁',
            mipfilter: 'Mip Filter',
            mipfilterTip: '采用多级纹理时的过滤算法',
            wrapMode: '拼接模式',
            wrapModeTip: '选择在贴图小于填充空间时的填充方式，默认模式为循环',
            wrapModeS: 'Wrap Mode S',
            wrapModeSTip: '像素对纹理在 S（U）方向上的映射模式',
            wrapModeT: 'Wrap Mode T',
            wrapModeTTip: '像素对纹理在 T（V）方向上的映射模式',
            modeWarn:
                '警告：WebGL 1.0 平台不支持非 2 次幂贴图的 Repeat 过滤模式，运行时会自动改为 Clamp 模式，这会使材质的 tilingOffset 等属性完全失效。',
            filterDiffenent: 'Filter 设置与 {atlasFile} 中的配置不符，可能无法生效。',
        },
        fbx: {
            browse: '更换贴图',
            model: '模型',
            animation: '动画',
            modelPreview: '模型预览',
            material: '材质',
            fbx: 'FBX',
            no_model_tips: '没有模型可供预览',
            drag_model_tips: '可将模型拖到这里进行预览',
            GlTFUserData: {
                normals: {
                    name: '法线',
                    title: '法线导入设置。',
                    optional: {
                        name: '可选',
                        title: '仅当模型文件中包含法线时导入法线。',
                    },
                    exclude: {
                        name: '排除',
                        title: '不导入法线。',
                    },
                    require: {
                        name: '仅在必要时重新计算',
                        title: '导入法线。优先使用模型文件中的法线，若模型文件中不包含法线则计算法线。',
                    },
                    recalculate: {
                        name: '重新计算',
                        title: '不管模型文件中是否包含法线都直接重新计算并导入。',
                    },
                },
                tangents: {
                    name: '切线',
                    title: '切线导入设置。',
                    optional: {
                        name: '可选',
                        title: '仅当模型文件中包含切线时导入切线。',
                    },
                    exclude: {
                        name: '排除',
                        title: '不导入切线。',
                    },
                    require: {
                        name: '仅在必要时重新计算',
                        title: '导入切线。优先使用模型文件中的切线，若模型文件中不包含切线且纹理坐标存在则计算切线。',
                    },
                    recalculate: {
                        name: '重新计算',
                        title: '不管模型文件中是否包含切线都直接重新计算并导入。',
                    },
                },
                morphNormals: {
                    name: '形变法线',
                    title: '形变法线导入设置。',
                    optional: {
                        name: '可选',
                        title: '仅当模型文件中包含形变法线时导入形变法线。',
                    },
                    exclude: {
                        name: '排除',
                        title: '不导入形变法线。',
                    },
                    require: {
                        name: '仅在必要时重新计算',
                        title: '导入形变法线。优先使用模型文件中的形变法线，若模型文件中不包含形变法线则计算形变法线。',
                    },
                    recalculate: {
                        name: '重新计算',
                        title: '不管模型文件中是否包含形变法线都直接重新计算并导入。',
                    },
                },
                dumpMaterials: {
                    name: '提取材质',
                    title: '开启后，模型文件中的材质将被提取成为可编辑的材质文件，而非作为模型文件资源的只读子资源。',
                },
                materialDumpDir: {
                    name: '材质提取目录',
                    title: '指定材质提取的目标目录。若未指定，材质将提取至 `Materials_${模型文件名（不含后缀）}`。',
                },
                useVertexColors: {
                    name: '使用顶点色',
                    title: '是否使用顶点色。',
                },
                depthWriteInAlphaModeBlend: {
                    name: '混合模式下的深度写入',
                    title: '当 Alpha 模式为 "BLEND" 时开启深度写入。',
                },
                skipValidation: {
                    name: '跳过验证',
                    title: '跳过对模型文件的验证。',
                },
                mountAllAnimationsOnPrefab: {
                    name: '挂载全部动画到预制体',
                },
            },
            addEvent: {
                shouldSave: '新建的 Clip 需要先提交修改后，才能添加/编辑事件',
                ok: '知道了',
            },
            ImageRemap: {
                remapAs: '映射为',
                original: '原始',
            },
            limitMaterialDumpDir: '提取的路径需要限定在项目路径范围内',
            legacyOptions: '旧版本遗留',
            legacyFbxImporter: {
                name: '与 1.* 版本兼容',
                title: '此导入器是否应该与其在 Cocos Creator 1.* 之前版本的导入方式兼容。',
                warn: '警告：改变此属性可能会影响那些导入后已投入使用或者被引用了的资源。',
            },
            disableMeshSplit: {
                name: '是否禁用 Mesh 拆分',
                title:
                    '为了解决实时骨骼动画系统下 Uniform Vector 数量限制问题，<br> ' +
                    '目前在资源导入期会根据骨骼数量做拆分，这会对其他系统也产生影响。<br>' +
                    '如果确定不会使用实时计算模式 (对应 SkeletalAnimation 组件的 <br> ' +
                    'UseBakedAnimation 选项未勾选时)，可以勾选此项以提升性能。<br>' +
                    '但注意改变此选项会影响生成的 prefab 内容，需要对应更新场景中的引用。<br>' +
                    '后续重构会移除此流程。',
            },
            allowMeshDataAccess: {
                name: '允许数据访问',
                title:
                    '标识此模型中的所有网格的数据是否可被读写，此接口只对静态网格资源生效，<br> ' +
                    '若不勾选，网格数据被提交到 GPU 后会被自动释放。<br>',
            },
            addVertexColor: {
                name: '填充顶点色',
                title: '如果模型没有顶点颜色属性，添加颜色属性，填充为白色。',
            },
            meshOptimizer: {
                name: 'Mesh 优化',
                title: 'Mesh 优化可以被用来简化导入的模型，可以在需要模型减面时使用。<br>在一些少数情况下减面后的模型可能会出现显示异常，如发生这种情况请尝试调整参数并重试。',
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
                    name: '减面算法',
                    simplify: 'simplify',
                    gltfpack: 'gltfpack (已废弃)',
                },
                simplify: {
                    targetRatio: {
                        name: 'LOD 压缩比例',
                        title: '减面之后的目标面数比例，0 代表减面至最少，1 代表没有减面的原模型。',
                    },
                    preserveSurfaceCurvature: {
                        name: '保留表面曲率',
                        title: 'Preserve Surface Curvature',
                    },
                    preserveBorderEdges: {
                        name: '保留边界边',
                        title: 'Preserve Border Edges',
                    },
                    preserveUVSeamEdges: {
                        name: '保留 UV 缝合边',
                        title: 'Preserve UV Seam Edges',
                    },
                    preserveUVFoldoverEdges: {
                        name: '保留 UV 折叠边',
                        title: 'Preserve UV Foldover Edges',
                    },
                    agressiveness: {
                        name: '误差距离',
                        title: '模型减面算法的激进程度。<br>当设置数值越高时，算法的减面策略会越激进，但是过于激进的策略更有可能导致结果错误。',
                    },
                    maxIterationCount: {
                        name: '计算迭代次数',
                        title: '最大重复计数代表减面算法运行的重复次数。<br>高数值可以使算法运行结果更接近目标，但也会增加运行时间和结果错误的概率。',
                    },
                },
                gltfpack: {
                    warn: '当前资源使用的减面算法 gltfpack 已被废弃，请选用新的 simplify 减面算法。',
                },
                warn: '警告：优化后，网格资源的数量和名称会发生改变，这将会造成组件引用的资源丢失，请及时手动更新；（另外，对于模型资源中预生成的预制体，资源同步机制会自动更新）',
            },
            animationBakeRate: {
                name: '动画烘焙速率',
                title: '指定动画烘焙速率，单位为帧每秒（FPS）',
                auto: '自动',
            },
            promoteSingleRootNode: {
                name: '提升单一根节点',
                title: '若开启并且模型场景顶部仅有一个根节点，那么该节点就作为预制体的根节点。<br>否则，场景的所有根节点作为预制体的子节点。',
            },
            generateLightmapUVNode: {
                name: '生成灯光贴图 UV　通道',
                title: '若开启会为模型生成灯光贴图的 UV 通道， 若模型有第二套 UV , 该 UV 会被生成的 UV 覆盖。< br > 否则，使用原始 UV 信息。',
            },
            preferLocalTimeSpan: {
                name: '优先使用文件时间范围',
                title: '在导出 FBX 动画时，是否优先使用 FBX 文件中记录的动画时间范围。<br>若不使用该时间范围或此范围不可能用，则会粗略地计算动画时间范围。有些 FBX 生产工具中可能并未导出该信息。',
            },
            smartMaterialEnabled: {
                name: '材质智能转换',
                title: '将 DCC 材质转化为引擎材质, 并匹对 DCC 材质的光照模型',
                warn: '项目设置里的模型配置 "材质智能转换" 已关闭，请启用此项功能来修改模型级别设置。',
            },
            animationSetting: {
                additive: {
                    header: '叠加动画导入设置',
                    enabled: {
                        label: '导入为叠加动画',
                        tooltip: '勾选后，该动画将被导入为叠加动画。',
                    },
                    refClip: {
                        label: '参考剪辑',
                        tooltip: '若设置，将参考该动画第 0 帧的姿态计算叠加动画；否则，则将参考第动画本身第 0 帧的姿态进行计算。',
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
                '警告：WebGL 1.0 平台不支持非 2 次幂贴图的 Repeat 过滤模式，运行时会自动改为 Clamp-To-Edge 模式，这会使材质的 Tiling Offset 等属性完全失效。',
        },
        material: {
            'fail-to-load-custom-inspector': 'Material: 自定义 Effect {effect} 的 Inspector 加载失败',
            'illegal-inspector-url': 'Inspector 的路径不合法',
        },
        animationGraph: {
            edit: '编辑',
        },
        animationMask: {
            importSkeleton: '导入骨骼',
            clearAllNodes: '清空',
            clearAllNodesWarn: '确定清空所有遮罩数据吗？',
            illegalFbx: '导入骨骼失败：此 FBX 文件不含有 Prefab 子资源。',
            nodeEnableTip: '是否启用该节点及其子孙节点<br>按住 Alt + 点击，只切换自身的状态。',
        },
        multipleWarning: '不支持此类型资源的多选编辑',
        check_is_saved: {
            message: '修改的数据尚未保存，是否保存修改？',
            assetMessage: '${assetName} 修改的数据尚未保存，是否保存修改？',
            save: '保存',
            abort: '丢弃',
        },
    },

    menu: {
        node: '节点菜单',
        component: '组件菜单',

        remove_component: '删除组件',
        reset_component: '重置组件',
        move_up_component: '向上移动',
        move_down_component: '向下移动',

        reset_node: '重置节点',
        reset_node_position: '重置节点坐标位置',
        reset_node_rotation: '重置节点旋转角度',
        reset_node_scale: '重置节点缩放比例',
        reset_node_mobility: '重置节点可移动性',

        copy_node_value: '复制节点的值',
        paste_node_value: '粘贴节点的值',
        copy_node_world_transform: '复制节点 Transform',
        paste_node_world_transform: '粘贴节点 Transform',

        copy_component: '复制组件',
        paste_component: '粘贴成为新组件',
        paste_component_values: '粘贴组件的值',

        help_url: '帮助文档',
        custom_script: '自定义脚本',
    },

    prefab: {
        edit: '编辑资源',
        local: '定位资源',
        reset: '从资源还原',
        save: '更新到资源',
        link: '关联到另一个预制件资源',
        unlink: '取消关联当前的预制件资源',
        lost: '对应的预制件资源已不存在',
        exist: 'Prefab 资源',
    },
};
