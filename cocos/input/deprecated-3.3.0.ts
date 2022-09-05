import { deprecateModuleExportedName } from '../core/utils/x-deprecated';

deprecateModuleExportedName({
    SystemEventType: {
        newName: 'Input.EventType',
        since: '3.3.0',
        removed: false,
    },
});
