import { EDITOR } from 'internal:constants';
import { errorID } from '../platform/debug';

export function reportMissingClass (id: string) {
    if (EDITOR && EditorExtends.UuidUtils.isUuid(id)) {
        id = EditorExtends.UuidUtils.decompressUuid(id);
        errorID(5301, id);
    } else {
        errorID(5302, id);
    }
}
