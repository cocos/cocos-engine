
export interface IExposedAttributes {
    /**
     * 指定属性的类型。
     */
    type?: any;

    /**
     * ???
     */
    url?: string;

    /**
     * 控制是否在编辑器中显示该属性。
     */
    visible?: boolean | (() => boolean);

    /**
     * 该属性在编辑器中的显示名称。
     */
    displayName?: string;

    /**
     * ???
     */
    displayOrder?: number;

    /**
     * 该属性在编辑器中的工具提示内容。
     */
    tooltip?: string;

    /**
     * ???
     */
    multiline?: boolean;

    /**
     * 指定该属性是否为可读的。
     */
    readonly?: boolean;

    /**
     * 当该属性为数值类型时，指定了该属性允许的最小值。
     */
    min?: number;

    /**
     * 当该属性为数值类型时，指定了该属性允许的最大值。
     */
    max?: number;

    /**
     * 当该属性为数值类型时并在编辑器中提供了滑动条时，指定了滑动条的步长。
     */
    step?: number;

    /**
     * 当该属性为数值类型时，指定了该属性允许的范围。
     */
    range?: number[];

    /**
     * 当该属性为数值类型时，是否在编辑器中提供滑动条来调节值。
     */
    slide?: boolean;

    /**
     * 该属性是否参与序列化和反序列化。
     */
    serializable?: boolean;

    /**
     * 该属性的曾用名。
     */
    formerlySerializedAs?: string;

    /**
     * 该属性是否仅仅在编辑器环境中生效。
     */
    editorOnly?: boolean;

    /**
     * 是否覆盖基类中的同名属性。
     */
    override?: boolean;

    /**
     * ???
     */
    animatable?: boolean;

    /**
     * ???
     */
    unit?: string;
}

export interface IAcceptableAttributes extends IExposedAttributes {
    _short?: boolean;
}
