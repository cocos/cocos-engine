import Event from './Event'

export default class TouchEvent extends Event {
    constructor(type) {
        super(type);
        this.touches = [];
        this.targetTouches = [];
        this.changedTouches = [];
    }
}
