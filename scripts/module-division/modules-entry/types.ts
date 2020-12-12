
export type IEngineModule =
    | 'gfx-webgl'
    | 'gfx-webgl2'
    | 'base'
    | 'graphcis'
    | 'ui'
    | 'particle'
    | 'physics'
    | 'physics-cannon'
    | 'physics-ammo'
    | 'physics-builtin'
    | 'particle-2d'
    | 'webview'
    | 'tween'
    | 'physics-2d'
    | 'physics-2d-box2d'
    | 'physics-2d-builtin'
    | 'intersection-2d'
    | 'audio'
    | 'video'
    | 'terrain'
    | 'tiled-map'
    | 'spine'
    | 'dragonbones';

interface IModuleEntryConfig {
    required?: boolean;
    native?: string;
    wechatPlugin?: boolean;
    default: boolean;
    entries: string[];
    mutex?: string;
}

// interface IEntryConfig extends IConfigBase {
//     entries: string[];
//     mutex?: string;
// }

// interface IModuleConfig extends IConfigBase {
//     module: string[];
// }

// type IModuleEntryConfig = IEntryConfig | IModuleConfig;

export type IModuleConfigs = Record<IEngineModule, IModuleEntryConfig>;

export interface ModuleEntryConfig {
    $schema?: string;

    /**
     * The modules info
     */
    modules: IModuleConfigs;
}
