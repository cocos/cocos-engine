import debugInfos from '../../../DebugInfos';

interface IMessageDialogOptions {
    title?: string;
    detail?: string;
    default?: number;
    cancel?: number;
    buttons?: string[];
}

export function dialogInfo (message: string, options?: IMessageDialogOptions) {
    EditorExtends.Dialog.info(message, options);
}

export function dialogWarn (message: string, options?: IMessageDialogOptions) {
    EditorExtends.Dialog.warn(message, options);
}

export function dialogError (message: string, options?: IMessageDialogOptions) {
    EditorExtends.Dialog.error(message, options);
}

export function dialogInfoID (id: number, options?: IMessageDialogOptions) {
    EditorExtends.Dialog.info((debugInfos[id] || 'unknown id'), options);
}

export function dialogWarnID (id: number, options?: IMessageDialogOptions) {
    EditorExtends.Dialog.warn((debugInfos[id] || 'unknown id'), options);
}

export function dialogErrorID (id: number, options?: IMessageDialogOptions) {
    EditorExtends.Dialog.error((debugInfos[id] || 'unknown id'), options);
}
