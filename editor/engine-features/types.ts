
// tslint:disable:interface-name

export type EngineModule =
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
export interface ModuleRenderConfig {
    $schema?: string;

    /**
     * The modules info
     */
    modules: IModules;
}

export type IModules = Record<EngineModule, Item>;

export interface BaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    required?: boolean;

    native?: string;

    wechatPlugin?: boolean;

    default?: string[];
}

export interface Item extends BaseItem {
    /**
     * Whether if child item this item is mutex each other.
     */
    mutex?: boolean;

    options?: Record<EngineModule, BaseItem>;
}
