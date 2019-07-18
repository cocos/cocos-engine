
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
}

type Item = SimpleItem | GroupItem;
