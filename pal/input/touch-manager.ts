import { macro } from '../../cocos/core/platform/macro';
import { Touch } from '../../cocos/input/types';
import { Vec2 } from '../../cocos/core/math/vec2';

const tempVec2 = new Vec2();

class TouchManager {
    /**
     * A map from touch.
     */
    private _touchMap: Map<number, Touch>;
    private readonly _maxTouches = 8;

    constructor () {
        this._touchMap = new Map();
    }

    /**
     * The original touch object can't be modified, so we need to return the cloned touch object.
     * @param touch
     * @returns
     */
    private _cloneTouch (touch: Touch): Touch {
        const touchID = touch.getID();
        touch.getStartLocation(tempVec2);
        const clonedTouch = new Touch(tempVec2.x, tempVec2.y, touchID);
        touch.getLocation(tempVec2);
        clonedTouch.setPoint(tempVec2.x, tempVec2.y);
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
    private _createTouch (touchID: number, x: number, y: number): Touch | undefined {
        if (this._touchMap.has(touchID)) {
            console.log('Cannot create the same touch object.');
            return undefined;
        }
        const checkResult = this._checkTouchMapSizeMoreThanMax(touchID);
        if (checkResult) {
            console.log('The touches is more than MAX_TOUCHES.');  // TODO: logID 2300
            return undefined;
        }
        const touch = new Touch(x, y, touchID);
        this._touchMap.set(touchID, touch);
        this._updateTouch(touch, x, y);
        return this._cloneTouch(touch);
    }

    /**
     * Release the touch object at the touch end or touch cancel event callback.
     * @param touchID
     * @returns
     */
    public releaseTouch (touchID: number) {
        if (!this._touchMap.has(touchID)) {
            return;
        }
        this._touchMap.delete(touchID);
    }

    /**
     * Get touch object by touch ID.
     * @param touchID
     * @returns
     */
    public getTouch (touchID: number, x: number, y: number): Touch | undefined {
        let touch = this._touchMap.get(touchID);
        if (!touch) {
            touch = this._createTouch(touchID, x, y);
        } else {
            this._updateTouch(touch, x, y);
        }
        return touch ? this._cloneTouch(touch) : undefined;
    }

    /**
     * Get all the current touches objects.
     * @returns
     */
    public getAllTouches (): Touch[] {
        const touches: Touch[] = [];
        this._touchMap.forEach((touch) => {
            if (touch) {
                const clonedTouch = this._cloneTouch(touch);
                touches.push(clonedTouch);
            }
        });
        return touches;
    }

    /**
     * Update the location and previous location of current touch ID.
     * @param touchID
     * @param x The current location X
     * @param y The current location Y
     */
    private _updateTouch (touch: Touch, x: number, y: number) {
        touch.getLocation(tempVec2);
        touch.setPrevPoint(tempVec2);
        touch.setPoint(x, y);
    }

    /**
     *
     *
     * @param touchID
     * @memberof TouchManager
     */
    private _checkTouchMapSizeMoreThanMax (touchID: number) {
        if (this._touchMap.has(touchID)) {
            return false;
        }
        const maxSize = macro.ENABLE_MULTI_TOUCH ? this._maxTouches : 1;
        if (this._touchMap.size < maxSize) {
            return false;
        }
        // Handle when exceed the max number of touches
        const now = performance.now();
        this._touchMap.forEach((touch) => {
            if (now - touch.lastModified > macro.TOUCH_TIMEOUT) {
                console.log(`The touches is more than MAX_TOUCHES, release touch id ${touch.getID()}.`);
                // TODO: need to handle touch cancel event when exceed the max number of touches ?
                this.releaseTouch(touch.getID());
            }
        });
        return maxSize >= this._touchMap.size;
    }
}

export const touchManager = new TouchManager();
