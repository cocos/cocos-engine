import Node from "./Node";
import { noop } from "./utils/noop";

export default class Element extends Node {
    constructor() {
        super();

        this.className = '';
        this.children = [];

        this.remove = noop;
    }
    
    setAttribute(name, value) {
        this[name] = value
    }

    getAttribute(name) {
        return this[name]
    }

    setAttributeNS(name, value) {
        this[name] = value
    }

    getAttributeNS(name) {
        return this[name]
    }
}