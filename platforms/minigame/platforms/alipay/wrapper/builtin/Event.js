import { noop } from "./utils/noop";

class Event {
    constructor(type) {

        this.cancelBubble = false;
        this.cacelable = false;
        this.target = null;
        this.timestampe = Date.now();
        this.preventDefault = noop;
        this.stopPropagation = noop;

        this.type = type;
    }
}

export default Event;