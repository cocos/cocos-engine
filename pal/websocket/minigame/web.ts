export enum DOMErrorCode {
    InvalidStateError,
    InvalidAccessError,
    SyntaxError,
}

export class DOMError extends Error {
    constructor (code: DOMErrorCode, message: string) {
        super(message);
        this.code = code;
    }
}

export function defineReadonlyAttributeGetter (object: object, name: string, get: () => void): void {
    Object.defineProperty(object, name, {
        get,
        enumerable: true,
        configurable: true,
    });
}

export {};
