export interface Config {
    /**
     * Files to be excluded from transforming.
     */
    transformExcludes?: RegExp[];

    /**
     * Module overrides.
     */
    moduleOverrides?: Record<string, string>;
}

export interface ConfigContext {
    /**
     * Is performing minified-building.
     */
    minified?: boolean;

    /**
     * The build mode id.
     */
    mode?: string;

    /**
     * The platform id.
     */
    platform?: string;

    /**
     * Is build target support WebAssembly.
     */
    wasm?: boolean | 'fallback';

    /**
     * Entries.
     */
    entries?: string[];
}

export type ConfigFunction = (context: ConfigContext) => Promise<Config> | Config;

export default (context: ConfigContext): Config => {
    const config = {
        transformExcludes: getTransformExcludes(context),
        moduleOverrides: getModuleOverrides(context),
    };

    return config;
};

function getTransformExcludes (_context: ConfigContext): NonNullable<Config['transformExcludes']> {
    return [
        /node_modules[/\\]@cocos[/\\]ammo/,
        /node_modules[/\\]@cocos[/\\]cannon/,
    ];
}

function getModuleOverrides (context: ConfigContext): NonNullable<Config['moduleOverrides']> {
    const overrides: NonNullable<Config['moduleOverrides']> = {};

    switch (context.platform) {
    default: break;
    case 'NATIVE':
        Object.assign(overrides, {
            'cocos/core/pipeline/index.ts': 'cocos/core/pipeline/index.jsb.ts',
            'cocos/core/renderer/core/native-pools.ts': 'cocos/core/renderer/core/native-pools.jsb.ts',
            'cocos/core/gfx/index.ts': 'cocos/core/gfx/index.jsb.ts',
        });
        break;
    }

    return overrides;
}
