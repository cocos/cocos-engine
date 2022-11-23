const sMetadataTag = Symbol('cc:SerializationMetadata');

/**
 * @internal DO NOT USE IT IN YOUR CODES.
 * @param constructor
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getSerializationMetadata (constructor: Function): SerializationMetadata | undefined {
    return (constructor as MayBeInjected)[sMetadataTag];
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getOrCreateSerializationMetadata (constructor: Function): SerializationMetadata {
    return (constructor as MayBeInjected)[sMetadataTag] ??= {};
}

/**
 * @internal For internal usage only. DO NOT USE IT IN YOUR CODES.
 */
export interface SerializationMetadata {
    uniquelyReferenced?: boolean;
}

interface MayBeInjected {
    [sMetadataTag]?: SerializationMetadata;
}
