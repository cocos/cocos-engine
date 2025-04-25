import Element from "./Element";
import { noop } from "./utils/noop";
import { innerWidth, innerHeight } from "./WindowProperties";

export default class HTMLElement extends Element {
    constructor(tagName = "") {
        super()

        this.className = '';
        this.childern = [];

        this.style = {
            width: innerWidth + 'px',
            height: innerHeight + 'px'
        };

        this.focus = noop;
        this.blur = noop;

        this.innerHTML = '';

        this.tagName = tagName.toUpperCase();
    }

}