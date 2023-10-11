/* eslint-disable quote-props */

module.exports = {
    classes: {
        'cc': {
            'UIRenderer': {
                properties: {
                    customMaterial: {
                        displayName: 'Custom Material',
                        tooltip: 'Use custom material.',
                    },
                    color: {
                        displayName: 'Color',
                        tooltip: 'Rendering color.',
                    },
                },
            },
            'Label': {
                properties: {
                    __extends__: 'classes.cc.UIRenderer.properties',
                    'string': {
                        displayName: 'string',
                        tooltip: 'The label text.',
                    },
                    'horizontalAlign': {
                        displayName: 'Horizontal Alignment',
                        tooltip: 'Horizontal alignment mode.',
                    },
                    'verticalAlign': {
                        displayName: 'Vertical Alignment',
                        tooltip: 'Vertical alignment mode.',
                    },
                    'fontSize': {
                        displayName: 'Font Size',
                        tooltip: 'Font size, in points.',
                    },
                    'lineHeight': {
                        displayName: 'Line Height',
                        tooltip: 'Line height, in points.',
                    },
                    'spacingX': {
                        displayName: 'Horizontal Spacing',
                        tooltip: 'The spacing between text characters, only available if bitmap font was used.',
                    },
                    'overflow': {
                        displayName: 'Overflow Processing',
                        tooltip: 'Text layout modes: <br> ' +
                            '1. CLAMP: Text nodes outside the bounding box will be truncated. <br> ' +
                            '2. SHRINK: Automatically shrink text box according to the constraint node. <br> ' +
                            '3. RESIZE: Automatically updates the Node based on height of the text.',
                    },
                    'enableWrapText': {
                        displayName: 'Auto Newline',
                        tooltip: 'Automatic newline.',
                    },
                    'useSystemFont': {
                        displayName: 'System Fonts',
                        tooltip: 'Whether to use system default fonts. The referenced font asset would be dereferenced once this option was checked.',
                    },
                    'fontFamily': {
                        displayName: 'Font Family',
                        tooltip: 'Font names.',
                    },
                    'font': {
                        displayName: 'Font',
                        tooltip: 'The font asset to use.',
                    },
                    'cacheMode': {
                        displayName: 'Cache Mode',
                        tooltip: 'Text cache modes：<br> ' +
                            '1. NONE: No cache，draw once. <br> ' +
                            '2. BITMAP: Text is added as a static image to the dynamic atlas for batch merging, but its content cannot be dynamically modified frequently. <br> ' +
                            '3. CHAR: Split the text into characters and cache the character texture into a character atlas for reuse, ' +
                                'which is suitable for text content with repeated character content and frequently updated.',
                    },
                    'isBold': {
                        displayName: 'Bold',
                        tooltip: 'Make words bold.',
                    },
                    'isItalic': {
                        displayName: 'Italic',
                        tooltip: 'Make words italic.',
                    },
                    'isUnderline': {
                        displayName: 'Underline',
                        tooltip: 'Underscore the words.',
                    },
                    'underlineHeight': {
                        displayName: 'Underline Height',
                        tooltip: 'The underline\'s height.',
                    },
                    'enableOutline': {
                        displayName: 'Enable Outline',
                        tooltip: 'Whether outline is enabled.',
                    },
                    'outlineColor': {
                        displayName: 'Outline Color',
                        tooltip: 'The color of outline.',
                    },
                    'outlineWidth': {
                        displayName: 'Outline Width',
                        tooltip: 'The width of outline',
                    },
                    'enableShadow': {
                        displayName: 'Enable Shadow',
                        tooltip: 'Whether shadow is enabled.',
                    },
                    'shadowColor': {
                        displayName: 'Enable Outline',
                        tooltip: 'The color of shadow.',
                    },
                    'shadowOffset': {
                        displayName: 'Shadow Offset',
                        tooltip: 'Offset between font and shadow.',
                    },
                    'shadowBlur': {
                        displayName: 'Shadow Blur',
                        tooltip: 'A non-negative float specifying the level of shadow blur.',
                    },
                },
            },
        },
    },
};
