
// tslint:disable:interface-name

export interface ModuleDivision {
    /**
     * Items.
     */
    items: Item[];
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
}

interface SimpleItem extends BaseItem {
    /**
     * Entry to the module.
     */
    entry: string;

    /**
     * If true, this field indicates the item is bundled by default.
     */
    default?: boolean;
}

interface GroupItem extends BaseItem {
    /**
     * Options.
     */
    options: Array<{
        /**
         * Name of the option.
         */
        name: string;

        /**
         * Entry of the option.
         */
        entry: string;

        /**
         * Option description.
         */
        description?: string;
    }>;

    /**
     * If present and non-negtive, this field indicates the specified n-th option is selected by default.
     */
    default?: number;
}

type Item = SimpleItem | GroupItem;
