import type { TupleValues } from './utils';

export const knownPlatforms = [
    'HTML5',
    'WECHAT',
    'ALIPAY',
    'BAIDU',
    'XIAOMI',
    'BYTEDANCE',
    'OPPO',
    'VIVO',
    'HUAWEI',
    'NATIVE',
    'COCOSPLAY',
] as const;

export type KnownPlatform = TupleValues<typeof knownPlatforms>;
