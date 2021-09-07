import { macro } from '../../cocos/core/platform/macro';
import { Touch } from '../../cocos/input/types';
import { Vec2 } from '../../cocos/core/math/vec2';

interface TouchMap {
    [touchID: number]: number;
}

const tempVec2 = new Vec2();

class TouchManager {
    /**
     * A map from touch ID to available touch index in _touches array.
     */
    private _touchMap: TouchMap = {};
    private _touches: (Touch|undefined)[];
    private readonly _maxTouches = 8;

    constructor () {
        this._touches = new Array(this._maxTouches);
    }

    // The original touch object can't be modified, so we need to return the cloned touch object.
    private _cloneTouch (touch: Touch): Touch {
        const touchID = touch.getID();
        touch.getLocation(tempVec2);
        const clonedTouch = new Touch(tempVec2.x, tempVec2.y, touchID);
        touch.getPreviousLocation(tempVec2);
        clonedTouch.setPrevPoint(tempVec2);
        return clonedTouch;
    }

    /**
     * Create the touch object at the touch start event callback.
     * we have some policy to create the touch object:
     * - If the number of touches doesn't exceed the max count, we create a touch object.
     * - If the number of touches exceeds the max count, we discard the timeout touch to create a new one.
     * - If the number of touches exceeds the max count and there is no timeout touch, we can't create any touch object.
     * @param touchID
     * @param x
     * @param y
     * @returns
     */
    public createTouch (touchID: number, x: number, y: number): Touch | undefined {
        if (touchID in this._touchMap) {
            console.log('Cannot create the same touch object.');
            return undefined;
        }
        const availableTouchIndex = this._getAvailableTouchIndex(touchID);
        if (availableTouchIndex === -1) {
            console.log('The touches is more than MAX_TOUCHES.');  // TODO: logID 2300
            return undefined;
        }
        const touch = new Touch(x, y, touchID);
        this._touches[availableTouchIndex] = touch;
        this._touchMap[touchID] = availableTouchIndex;
        this.updateTouch(touchID, x, y);
        return this._cloneTouch(touch);
    }

    /**
     * Release the touch object at the touch end or touch cancel event callback.
     * @param touchID
     * @returns
     */
    public releaseTouch (touchID: number) {
        if (!(touchID in this._touchMap)) {
            return;
        }
        const availableTouchIndex = this._touchMap[touchID];
        this._touches[availableTouchIndex] = undefined;
        delete this._touchMap[touchID];
    }

    /**
     * Update the location and previous location of current touch ID.
     * @param touchID
     * @param x The current location X
     * @param y The current location Y
     */
    public updateTouch (touchID: number, x: number, y: number) {
        const availableTouchIndex = this._touchMap[touchID];
        const touch = this._touches[availableTouchIndex];
        if (!touch) {
            return;
        }
        touch.getLocation(tempVec2);
        touch.setPrevPoint(tempVec2);
        touch.setPoint(x, y);
    }

    /**
     * Get touch object by touch ID.
     * @param touchID
     * @returns
     */
    public getTouch (touchID: number): Touch | undefined {
        const availableTouchIndex = this._touchMap[touchID];
        const touch = this._touches[availableTouchIndex];
        if (!touch) {
            return undefined;
        }
        return this._cloneTouch(touch);
    }

    /**
     * Get all the current touches objects.
     * @returns
     */
    public getAllTouches (): Touch[] {
        const touches: Touch[] = [];
        this._touches.forEach((touch) => {
            if (touch) {
                const clonedTouch = this._cloneTouch(touch);
                touches.push(clonedTouch);
            }
        });
        return touches;
    }

    private _getAvailableTouchIndex (touchID: number) {
        const availableTouchIndex = this._touchMap[touchID];
        if (typeof availableTouchIndex !== 'undefined') {
            return availableTouchIndex;
        }
        for (let i = 0; i < this._maxTouches; i++) {
            if (!this._touches[i]) {
                return i;
            }
        }

        // Handle when exceed the max number of touches
        const now = performance.now();
        const TOUCH_TIMEOUT = macro.TOUCH_TIMEOUT;
        for (let i = 0; i < this._maxTouches; i++) {
            const touch = this._touches[i]!;
            if (now - touch.lastModified > TOUCH_TIMEOUT) {
                console.log(`The touches is more than MAX_TOUCHES, release touch id ${touch.getID()}.`);
                // TODO: need to handle touch cancel event when exceed the max number of touches ?
                this.releaseTouch(touch.getID());
                return i;
            }
        }
        return -1;
    }
}

export const touchManager = new TouchManager();
