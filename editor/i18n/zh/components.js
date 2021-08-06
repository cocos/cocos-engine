module.exports = {
    components: {
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
    },
};
