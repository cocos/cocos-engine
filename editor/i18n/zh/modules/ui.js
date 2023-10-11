/* eslint-disable quote-props */

module.exports = {
    classes: {
        'cc': {
            'UIRenderer': {
                properties: {
                    customMaterial: {
                        displayName: '自定义材质',
                        tooltip: '使用自定义材质。',
                    },
                    color: {
                        displayName: '颜色',
                        tooltip: '渲染颜色。',
                    },
                },
            },
            'Label': {
                properties: {
                    __extends__: 'classes.cc.UIRenderer.properties',
                    'string': {
                        displayName: '字符串',
                        tooltip: '显示的文本内容字符串。',
                    },
                    'horizontalAlign': {
                        displayName: '水平对齐',
                        tooltip: '文字水平对齐模式。',
                    },
                    'verticalAlign': {
                        displayName: '竖直对齐',
                        tooltip: '文字竖直对齐模式。',
                    },
                    'fontSize': {
                        displayName: '字体大小',
                        tooltip: '文字尺寸，以点为单位。',
                    },
                    'lineHeight': {
                        displayName: '行高',
                        tooltip: '文字行高，以点为单位。',
                    },
                    'spacingX': {
                        displayName: '水平间距',
                        tooltip: '文本字符之间的间距。仅在使用位图字体时生效',
                    },
                    'overflow': {
                        displayName: '溢出处理',
                        tooltip: '文字排版模式，包括以下三种：<br> ' +
                            '1. CLAMP: 节点约束框之外的文字会被截断 <br> ' +
                            '2. SHRINK: 自动根据节点约束框缩小文字<br> ' +
                            '3. RESIZE: 根据文本内容自动更新节点的 height 属性.',
                    },
                    'enableWrapText': {
                        displayName: '自动换行',
                        tooltip: '自动换行。',
                    },
                    'useSystemFont': {
                        displayName: '系统字体',
                        tooltip: '是否使用系统默认字体，选中此项会将引用的字体资产置空。',
                    },
                    'fontFamily': {
                        displayName: '字体族',
                        tooltip: '文字字体名字。',
                    },
                    'font': {
                        displayName: '字体',
                        tooltip: '使用的字体资源。',
                    },
                    'cacheMode': {
                        displayName: '缓存模式',
                        tooltip: '文本缓存模式，包括以下三种：<br> ' +
                            '1. NONE: 不做任何缓存，文本内容进行一次绘制 <br> ' +
                            '2. BITMAP: 将文本作为静态图像加入动态图集进行批次合并，但是不能频繁动态修改文本内容 <br> ' +
                            '3. CHAR: 将文本拆分为字符并且把字符纹理缓存到一张字符图集中进行复用，适用于字符内容重复并且频繁更新的文本内容',
                    },
                    'isBold': {
                        displayName: '粗体',
                        tooltip: '使字体加粗。',
                    },
                    'isItalic': {
                        displayName: '斜体',
                        tooltip: '使字体倾斜。',
                    },
                    'isUnderline': {
                        displayName: '下划线',
                        tooltip: '为字体加下划线。',
                    },
                    'underlineHeight': {
                        displayName: '下划线高度',
                        tooltip: '下划线高度。',
                    },
                    'enableOutline': {
                        displayName: '启用描边',
                        tooltip: '是否启用描边。',
                    },
                    'outlineColor': {
                        displayName: '描边颜色',
                        tooltip: '描边颜色。',
                    },
                    'outlineWidth': {
                        displayName: '描边宽度',
                        tooltip: '描边宽度。',
                    },
                    'enableShadow': {
                        displayName: '启用阴影',
                        tooltip: '是否启用阴影。',
                    },
                    'shadowColor': {
                        displayName: '阴影颜色',
                        tooltip: '阴影颜色。',
                    },
                    'shadowOffset': {
                        displayName: '阴影偏移',
                        tooltip: '阴影偏移量。',
                    },
                    'shadowBlur': {
                        displayName: '阴影模糊',
                        tooltip: '阴影模糊程度。',
                    },
                },
            },
        },
    },
};
