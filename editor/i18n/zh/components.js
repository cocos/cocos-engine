module.exports = {
    components: {
        add_component: '添加组件',

        animation: {
            use_baked_animation_tips: '使用预烘焙动画，骨骼在运行时不会实时移动，如需将某些外部节点挂到指定的骨骼关节上，请使用 <ui-link value="https://docs.cocos.com/creator/manual/zh/animation/skeletal-animation.html#socket-system">Sockets 挂点系统</ui-link>。',
        },

        safe_area: {
            brief_help:
                '该组件会将所在节点的布局适配到 iPhone X 等异形屏手机的安全区域内，通常用于 UI 交互区域的顶层节点。该组件将在真机上将自动生效，在编辑器下没有效果。',
        },
        particle_system_2d: {
            sync: '同步',
            sync_tips: '同步 File 中的参数到 Custom',
            export: '导出',
            export_tips: '将自定义的粒子数据导出成 plist 文件',
        },
        prefab_link: {
            brief_help:
                '由于新的 Prefab 系统还不完善，所以旧的 Prefab 系统中和 Prefab 资源差异过大的 Prefab 无法实现自动迁移。' +
                '此组件用于保存在旧 Prefab 系统中这个节点关联的 Prefab 资源，等新的 Prefab 系统完善，会自动迁移到新的 Prefab 系统上。',
        },
        label: {
            font_style_tooltip: "文本的样式，分别对应引擎的 isBold,isItalic,isUnderline",
        },
        layer: {
            confirm_message: '是否连同修改子节点的 Layer？',
            change_children: '连同修改子节点',
            change_self: '只修改节点自身',
        },
        lightProbeGroup:{
            generateTip: '重新生成场景里的探针数据',
            generateWarnTip: '继续自动生成新探针会覆盖已有探针，该节点的已有探针数据会全部丢失，请问是否仍要继续？',
            editTip: '切换场景中的探针编辑模式',
        },

        missScriptTip: "脚本编译失败，请检查报错信息并进行修正，该组件将在修正后自动还原。",

        lod: {
            applyCameraSizeTip: '应用当前场景中此节点的屏幕比例于此 LOD 层级，如果当前屏占比小于下一层 LOD 比例，将应用为可以应用的最小值（下一层级比例），<br/>如果当前屏占比大于上一层 LOD 比例，将应用为可以应用的最大值（上一层级比例）',
            applyCameraSizeLessThanMinimum: '当前屏占比小于目前层级能使用的最小值，无法设置，设置为目前层级能使用的最小值。请更新更低 LOD 层级的屏幕尺寸之后再次尝试。',
            applyCameraSizeGreaterThanMaximum: '当前屏占比大于目前层级能使用的最大值，无法设置，设置为目前层级能使用的最大值。请更新更高 LOD 层级的屏幕尺寸之后再次尝试。',
        },

        blockInputEventsTip: '该组件将拦截所有输入事件，防止输入穿透到屏幕下方的其它节点，一般用于屏幕上层 UI 的背景。',
    },
};
