import type { TupleValues } from './utils';

export const knownBuildMode = [
    'EDITOR',
    'PREVIEW',
    'BUILD',
    'TEST',
] as const;

export type KnownBuildMode = TupleValues<typeof knownBuildMode>;
