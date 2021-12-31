import { IExposedAttributes } from './utils/attribute-defines';

/**
 * Class slash stores information collected from decorators.
 * Once class decorator entered, class definition begins. It process the stash and remove it.
 */
export interface ClassStash {
    /**
     * When extract default values under TypeScript environment,
     * we have to construct an object of current class and get its member values.
     * This field stores the create-once object.
     */
    default?: unknown;

    /**
     * Just a kind of organization.
     */
    proto?: {
        /**
         * The property stashes.
         */
        properties?: Record<PropertyKey, PropertyStash>;
    };

    /**
     * The error properties.
     * We record them here to ensure only once error report is given to each property.
     */
    errorProps?: Record<PropertyKey, true>;
}

export interface PropertyStash extends IExposedAttributes {
    /**
     * The property's default value.
     */
    default?: unknown;

    /**
     * The property's getter, if it's an accessor.
     */
    get?: () => unknown;

    /**
     * The property's setter, if it's an accessor.
     */
    set?: (value: unknown) => void;

    /**
     * Reserved for deprecated usage.
     */
    _short?: unknown;

    /**
     * Some decorators may write this internal slot. See `PropertyStashInternalFlag`.
     */
    __internalFlags: number;
}

export enum PropertyStashInternalFlag {
    /**
     * Indicates this property is reflected using "standalone property decorators" such as
     * `@editable`, `@visible`, `serializable`.
     * All standalone property decorators would set this flag;
     * non standalone property decorators won't set this flag.
     */
    STANDALONE = 1 << 0,

    /**
     * Indicates this property is visible, if no other explicit visibility decorators(`@visible`s) attached.
     */
    IMPLICIT_VISIBLE = 1 << 1,

    /**
     * Indicates this property is serializable, if no other explicit visibility decorators(`@serializable`s) attached.
     */
    IMPLICIT_SERIALIZABLE = 1 << 2,
}
