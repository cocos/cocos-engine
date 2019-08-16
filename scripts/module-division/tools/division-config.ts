
// tslint:disable:interface-name

export interface ModuleDivision {
    $schema?: string;

    /**
     * The group or items.
     */
    groupOrItems: Array<Item | ItemGroup>;
}

interface Displayable {
    /**
     * Display text.
     */
    text: string;

    /**
     * Description.
     */
    description?: string;
}

interface BaseItem extends Displayable {
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

export interface SelectionOption extends Displayable {
    /**
     * Entry(s) of the option.
     */
    entry: string | string[];
}

export interface SingleSelection extends BaseItem {
    /**
     * Options.
     */
    options: SelectionOption[];

    /**
     * Indicates the n-th option is selected by default if the item is marked as bundled.
     * Defaults to 0.
     */
    defaultOption?: number;
}

export interface ItemGroup extends Displayable {
    /**
     * Items in this group.
     */
    items: Item[];

    /**
     * Whether if at least one item shall be selected.
     */
    required?: boolean;
}

export type Item = Simple | SingleSelection;
