import { deprecateModuleExportedName } from '../../core/utils/x-deprecated';

deprecateModuleExportedName({
    UIRenderable: {
        newName: 'UIRenderer',
        since: '3.0.0',
        removed: true,
    },
});
