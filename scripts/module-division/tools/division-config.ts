
// tslint:disable:interface-name

export interface ModuleDivision {
    $schema?: string;

    /**
     * Items.
     */
    items: Array<Item | ItemGroup>;
}

interface BaseItem {
    /**
     * Item name.
     */
    name: string;

    /**
     * Item description.
     */
    description?: string;

    /**
     * Whether if this item is required to provide.
     */
    required?: boolean;

    /**
     * If true, this field indicates the item is marked as bundled by default.
     */
    default?: boolean;
}

export interface Simple extends BaseItem {
    /**
     * Entry(s) to the module.
     */
    entry: string | string[];
}

export interface SingleSelection extends BaseItem {
    /**
     * Options.
     */
    options: Array<{
        /**
         * Name of the option.
         */
        name: string;

        /**
         * Entry(s) of the option.
         */
        entry: string | string[];

        /**
         * Option description.
         */
        description?: string;
    }>;

    /**
     * Indicates the n-th option is selected by default if the item is marked as bundled.
     * Defaults to 0.
     */
    defaultOption?: number;
}

export interface ItemGroup {
    description: string;

    /**
     * Whether if at least one item shall be selected.
     */
    required?: boolean;

    
    items: Item[];
}

export type Item = Simple | SingleSelection;
