
// tslint:disable:interface-name

import { IEngineModule } from "../modules-entry/types";

export interface ModuleRenderConfig {
    $schema?: string;

    /**
     * The modules info
     */
    modules: IModules;
}

export type IModules = Record<IEngineModule, Item>;

export interface IBaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;
}

export interface Item extends IBaseItem {
    /**
     * Whether if child item this item is mutex each other.
     */
    mutex?: boolean;

    options?: Record<string, IBaseItem>;
}
