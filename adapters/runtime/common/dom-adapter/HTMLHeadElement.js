import HTMLElement from "./HTMLElement.js";

export default class HTMLHeadElement extends HTMLElement {
    parentNode = null;

    constructor(parentNode) {
        super("HEAD");
        this.parentNode = parentNode;
    }
}