import { deprecateModuleExportedName } from '../core/utils/x-deprecated';

deprecateModuleExportedName({
    SystemEvent: {
        newName: 'Input',
        since: '3.4.0',
        removed: false,
    },
    systemEvent: {
        newName: 'input',
        since: '3.4.0',
        removed: false,
    },
});
