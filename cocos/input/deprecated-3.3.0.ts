import { deprecateModuleExportedName } from '../core/utils/x-deprecated';

deprecateModuleExportedName({
    SystemEventType: {
        newTypeName: 'SystemEvent.EventType',
        since: '3.3.0',
        removed: false,
    },
});
