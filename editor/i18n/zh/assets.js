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
        particle:{
            spriteFrame:'Sprite Frame',
            spriteFrameTip:'Sprite Frame',
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
                    '每个面的尺寸。如果未指定或指定为0，将使用默认尺寸——最接近贴图宽度 / 4 的2次幂。',
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
            simulateGlobalsTip: 'Simulate global variables',
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
            packableTip: '是否参与动态合图',
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
        },
        texture: {
            anisotropy: 'Anisotropy',
            anisotropyTip: '应用各向异性过滤算法的最大阈值',
            minfilter: 'Min Filter',
            minfilterTip: '缩小贴图时采用的过滤算法',
            magfilter: 'Mag Filter',
            magfilterTip: '放大贴图时采用的过滤算法',
            mipfilter: 'Mip Filter',
            mipfilterTip: '采用多级纹理时的过滤算法',
            wrapModeS: 'Wrap Mode S',
            wrapModeSTip: '像素对纹理在 S（U）方向上的映射模式',
            wrapModeT: 'Wrap Mode T',
            wrapModeTTip: '像素对纹理在 T（V）方向上的映射模式',
            modeWarn:
                '警告：WebGL 1.0 平台不支持非 2 次幂贴图的 repeat 过滤模式，运行时会自动改为 clamp-to-edge 模式，这会使材质的 tilingOffset 等属性完全失效。',
        },
        fbx: {
            browse: '更换贴图',
            model: '模型',
            animation: '动画',
            modelPreview: '模型预览',
            material: '材质',
            fbx: 'FBX',
            no_model_tips:'没有模型可供预览',
            drag_model_tips:'可将模型拖到这里进行预览',
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
                    title: '当 alpha 模式为 "BLEND" 时开启深度写入。',
                },
                skipValidation: {
                    name: '跳过验证',
                    title: '跳过对模型文件的验证。',
                },
            },
            addEvent: {
                shouldSave: '新建的 clip 需要先提交修改后，才能添加/编辑事件',
                ok: '知道了',
            },
            ImageRemap: {
                remapAs: '映射为',
                original: '原始',
            },
            limitMaterialDumpDir: '提取的路径需要限定在项目路径范围内',
            legacyFbxImporter: {
                name: '与 1.* 版本兼容',
                title: '此导入器是否应该与其在 Cocos Creator 1.* 之前版本的导入方式兼容。',
                warn: '警告：改变此属性可能会影响那些导入后已投入使用或者被引用了的资源。',
            },
            disableMeshSplit: {
                name: '是否禁用 Mesh 拆分',
                title:
                    '为了解决实时骨骼动画系统下 uniform vector 数量限制问题，<br> ' +
                    '目前在资源导入期会根据骨骼数量做拆分，这会对其他系统也产生影响。<br>' +
                    '如果确定不会使用实时计算模式 (对应 SkeletalAnimation 组件的 <br> ' +
                    'useBakedAnimation 选项未勾选时)，可以勾选此项以提升性能。<br>' +
                    '但注意改变此选项会影响生成的 prefab 内容，需要对应更新场景中的引用。<br>' +
                    '后续重构会移除此流程。',
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
                name: '动画烘焙速率',
                title: '指定动画烘焙速率，单位为帧每秒（FPS）',
                auto: '自动',
            },
            promoteSingleRootNode: {
                name: '提升单一根结点',
                title: '若开启并且 FBX 场景仅有一个根节点，那么当转换该 FBX 场景为 Cocos Creator 预制体时，<br>以该根节点作为预制体的根节点，否则以该 FBX 场景的根节点作为预制体的根节点。',
            },
            preferLocalTimeSpan: {
                name: '优先使用文件时间范围',
                title: '在导出 FBX 动画时，是否优先使用 FBX 文件中记录的动画时间范围。若不使用该时间范围或此范围不可能用，则会粗略地计算动画时间范围。有些 FBX 生产工具中可能并未导出该信息。',
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
            '警告：WebGL 1.0 平台不支持非 2 次幂贴图的 repeat 过滤模式，运行时会自动改为 clamp-to-edge 模式，这会使材质的 tilingOffset 等属性完全失效。',
        },
        material: {
            'fail-to-load-custom-inspector': 'material: 自定义 effect {effect} 的 inspector 加载失败',
            'illegal-inspector-url': "Inspector的路径不合法",
        },
        animationGraph: {
            edit: '打开动画图面板进行编辑',
        },
        multipleWarning: '不支持此类型资源的多选编辑',
    },
};
