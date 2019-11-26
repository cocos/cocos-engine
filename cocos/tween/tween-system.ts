/**
 * @category tween
 */

import { System, Director, director } from "../core";
import { ActionManager } from "./actions/action-manager";

export class TweenSystem extends System {
    static readonly ID = 'tween';

    static readonly instance: TweenSystem;

    get ActionManager () {
        return this.actionMgr;
    }

    private readonly actionMgr = new ActionManager();

    postUpdate (dt: number) {
        if (!CC_EDITOR || this._executeInEditMode) {
            this.actionMgr.update(dt);
        }
    }
}

cc.TweenSystem = TweenSystem;

director.on(Director.EVENT_INIT, function () {
    let sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, 100);
});