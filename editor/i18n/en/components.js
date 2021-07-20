module.exports = {
    components: {
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
            font_style_tooltip: "The style of the text, corresponding to the engine's isBold,isItalic,isUnderline",
        },
    },
};
