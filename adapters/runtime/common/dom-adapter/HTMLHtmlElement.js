import HTMLElement from "./HTMLElement"

/**
 * HTML文档的根节点
 */
export default class HTMLHtmlElement extends HTMLElement {
    constructor() {
        super("HTML");
    }
    /**
     * 它返回有关文档的文档类型定义（DTD）的版本信息。 尽管此属性能够被Mozilla识别， 但此属性的返回值始终是空字符串。
     * @returns {string}
     */
    get version() {
        return "";
    }
}