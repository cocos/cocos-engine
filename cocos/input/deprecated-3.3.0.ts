import { deprecateModuleExportedName } from '../core/utils/x-deprecated';

deprecateModuleExportedName({
    SystemEventType: {
        newName: 'SystemEvent.EventType',
        since: '3.3.0',
        removed: false,
    },
});
