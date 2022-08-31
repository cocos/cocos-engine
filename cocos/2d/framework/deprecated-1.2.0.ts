import { deprecateModuleExportedName } from '../../core/utils/x-deprecated';

deprecateModuleExportedName({
    RenderComponent: {
        newName: 'UIRenderer',
        since: '1.2.0',
        removed: true,
    },
    UITransformComponent: {
        newName: 'UITransform',
        since: '1.2.0',
        removed: false,
    },
    CanvasComponent: {
        newName: 'Canvas',
        since: '1.2.0',
        removed: false,
    },
});
