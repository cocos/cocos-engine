import Event from '../Event'
import document from '../document'
import { isIDE } from '../utils/util';

export default class TouchEvent extends Event {

    constructor(type) {
        super(type)

        this.touches = []
        this.targetTouches = []
        this.changedTouches = []

        this.target = window.canvas
        this.currentTarget = window.canvas
    }
}

function eventHandlerFactory(type) {
    return (rawEvent) => {
        if(isIDE) return;
        const event = new TouchEvent(type);
        
        event.changedTouches = rawEvent.touches;
        event.touches = rawEvent.touches;
        event.targetTouches = Array.prototype.slice.call(rawEvent.touches);
        // event.timeStamp = rawEvent.timeStamp   
        document.dispatchEvent(event)
    }
}

my.onTouchStart(eventHandlerFactory('touchstart'))
my.onTouchMove(eventHandlerFactory('touchmove'))
my.onTouchEnd(eventHandlerFactory('touchend'))
my.onTouchCancel(eventHandlerFactory('touchcancel'))
