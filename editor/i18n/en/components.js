module.exports = {
    components: {
        add_component: 'Add Component',
        safe_area: {
            brief_help:
                'This component is used to adjust the layout of current node to respect the safe area of a notched mobile device such as the iPhone X.' +
                'It is typically used for the top node of the UI interaction area. (It will take effect automatically on mobile device and has no effect in the editor.)',
        },

        particle_system_2d: {
            sync: 'Sync',
            sync_tips: 'Synchronize the parameters in the File to Custom.',
            export: 'Export',
            export_error: 'This resource does not support exports outside of the project.',
            export_tips: 'Export custom particle data to plist file.',
        },
        prefab_link: {
            brief_help:
                'Since the new Prefab system is not yet complete, the prefab that has a large difference with prefab asset cannot be automatically migrated. ' +
                'This component is used to save the relationship between the node with the referenced prefab asset in the old Prefab system. ' +
                'When the new Prefab system is complete, it will be automatically migrated to the new Prefab system.',
        },
        label: {
            font_style_tooltip: "The style of the text, corresponding to the engine's Bold, Italic, Underline",
        },
        layer: {
            confirm_message: 'Do you want to set layer for all child objects as well?',
            change_children: 'Yes, change children',
            change_self: 'No, this object only',
        },
        lightProbeGroup:{
            generateTip: 'Regenerate probes in the scene',
            generateWarnTip: 'Continuing to automatically generate a new probe will overwrite the existing probe, and all the data of the existing probe on this node will be lost. Do you want to continue?',
            editTip: 'Toggle the probe editing mode in the scene',
        },

        missScriptTip: 'Script compilation fails, please check the error message and correct it, the component will be automatically restored after correction.',

        lod: {
            applyCameraSizeTip: 'Apply current node’s screen size on this LOD level. If it is less than the next level, it will apply the next level’s screen size percentage instead, as it is the minimum value for this level.If it is greater than the previous level, it will apply the previous level’s screen size percentage instead, as it is the maximum value for this level.',
            applyCameraSizeLessThanMinimum: 'Current Camera size is less than its limit, applying current minimum instead. Please reduce lower LOD levels screen size and try again later.',
            applyCameraSizeGreaterThanMaximum: 'Current Camera size is greater than its limit, applying current maximum instead. Please Increase higher LOD levels screen size and try again later.',
        },
    },
};
