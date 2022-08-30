import { deprecateModuleExportedName } from '../../core/utils/x-deprecated';

deprecateModuleExportedName({
    Renderable2D: {
        newName: 'UIRenderer',
        since: '3.6.0',
        removed: true,
    },
});