import HTMLElement from "./HTMLElement.js";


export default class HTMLBodyElement extends HTMLElement {
    parentNode = null;

    constructor(parentNode) {
        super("BODY");
        this.parentNode = parentNode;
    }
}