import { IExposedAttributes } from './utils/attribute-defines';

/**
 * Class slash stores information collected from decorators.
 * Once upon class decorator entered, class definition begins. It process the stash and remove it.
 */
export interface ClassStash {
    default?: unknown;

    proto?: {
        properties?: Record<PropertyKey, PropertyStash>;
    };

    errorProps?: Record<PropertyKey, true>;
}

export interface PropertyStash extends IExposedAttributes {
    default?: unknown;

    get?: () => unknown;

    set?: (value: unknown) => void;

    _short?: unknown;

    __internalFlags: number;
}

export enum PropertyStashInternalFlag {
    STANDALONE = 1 << 0,

    IMPLICIT_VISIBLE = 1 << 1,

    IMPLICIT_SERIALIZABLE = 1 << 2,
}
