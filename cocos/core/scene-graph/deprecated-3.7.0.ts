import { deprecateModuleExportedName } from '../utils/x-deprecated';

deprecateModuleExportedName({
    BaseNode: {
        newName: 'Node',
        since: '3.7.0',
        removed: false,
    },
});
